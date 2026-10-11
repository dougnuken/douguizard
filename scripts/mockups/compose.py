#!/usr/bin/env python3
"""Compositor de mockups: pone una captura real dentro de la pantalla en verde cromatico de un plate.

Uso:  python3 scripts/mockups/compose.py --all | --scene <id> [--check]
Solo PIL + numpy. Ver mockups/README.md.
"""
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ALGO_VERSION = "1"
DEFAULT_ROOT = Path(__file__).resolve().parents[2]
KINDS = ("hero", "wide", "duo", "detail")
ID_RE = re.compile(r"^[a-z0-9_-]+$")


class SceneError(Exception):
    pass


# ---------------------------------------------------------------- geometria

def persp_coeffs(src_pts, dst_pts):
    """Coeficientes (a..h) que llevan src -> dst: X=(ax+by+c)/(gx+hy+1), Y=(dx+ey+f)/(gx+hy+1)."""
    A, B = [], []
    for (x, y), (X, Y) in zip(src_pts, dst_pts):
        A.append([x, y, 1, 0, 0, 0, -x * X, -y * X])
        B.append(X)
        A.append([0, 0, 0, x, y, 1, -x * Y, -y * Y])
        B.append(Y)
    return np.linalg.solve(np.array(A, float), np.array(B, float))


def apply_persp(c, pts):
    a, b, cc, d, e, f, g, h = c
    out = []
    for x, y in pts:
        w = g * x + h * y + 1.0
        out.append(((a * x + b * y + cc) / w, (d * x + e * y + f) / w))
    return out


# ---------------------------------------------------------------- mascaras

def dilate(m, r):
    if r <= 0:
        return m
    for axis in (0, 1):
        pad = [(r, r) if i == axis else (0, 0) for i in range(2)]
        p = np.pad(m, pad)
        n = m.shape[axis]
        out = np.zeros_like(m)
        for s in range(2 * r + 1):
            sl = [slice(None), slice(None)]
            sl[axis] = slice(s, s + n)
            out |= p[tuple(sl)]
        m = out
    return m


def erode4(m):
    p = np.pad(m, 1)
    return m & p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]


def box_blur(a, r):
    a = a.astype(np.float32)
    if r <= 0:
        return a
    for axis in (0, 1):
        pad = [(r + 1, r) if i == axis else (0, 0) for i in range(2)]
        c = np.cumsum(np.pad(a, pad, mode="edge"), axis=axis, dtype=np.float64)
        n = a.shape[axis]
        hi = np.take(c, np.arange(2 * r + 1, 2 * r + 1 + n), axis=axis)
        lo = np.take(c, np.arange(0, n), axis=axis)
        a = ((hi - lo) / (2 * r + 1)).astype(np.float32)
    return a


def parse_key(s):
    m = re.fullmatch(r"#?([0-9a-fA-F]{6})", str(s))
    if not m:
        raise SceneError(f"clave de color invalida: {s!r}")
    v = m.group(1)
    rgb = tuple(int(v[i:i + 2], 16) for i in (0, 2, 4))
    srt = sorted(rgb, reverse=True)
    if srt[0] - srt[1] < 100:
        raise SceneError("la clave debe tener un canal claramente dominante (p. ej. #00FF00)")
    return rgb.index(srt[0])


def key_mask(arr, ci, tol):
    a = arr.astype(np.int16)
    others = [i for i in range(3) if i != ci]
    dom = a[..., ci]
    return (dom > 120) & (dom - np.maximum(a[..., others[0]], a[..., others[1]]) > tol)


def largest_component(mask):
    h, w = mask.shape
    s = max(1, int(np.ceil(max(h, w) / 600)))
    H2, W2 = -(-h // s), -(-w // s)
    pad = np.zeros((H2 * s, W2 * s), bool)
    pad[:h, :w] = mask
    red = pad.reshape(H2, s, W2, s).any(axis=(1, 3))
    flat = bytearray(red.astype(np.uint8).ravel().tobytes())
    labels = [0] * (H2 * W2)
    best, bestn, cur = 0, 0, 0
    for start in np.flatnonzero(red.ravel()).tolist():
        if labels[start]:
            continue
        cur += 1
        labels[start] = cur
        stack, n = [start], 0
        while stack:
            i = stack.pop()
            n += 1
            y, x = divmod(i, W2)
            for dy in (-1, 0, 1):
                yy = y + dy
                if yy < 0 or yy >= H2:
                    continue
                for dx in (-1, 0, 1):
                    xx = x + dx
                    if xx < 0 or xx >= W2:
                        continue
                    j = yy * W2 + xx
                    if flat[j] and not labels[j]:
                        labels[j] = cur
                        stack.append(j)
        if n > bestn:
            best, bestn = cur, n
    if not best:
        return None
    comp = (np.array(labels, np.int32).reshape(H2, W2) == best)
    up = np.repeat(np.repeat(comp, s, axis=0), s, axis=1)[:h, :w]
    return up & mask


# ---------------------------------------------------------------- esquinas

def fit_pca(P):
    c = P.mean(0)
    _, _, vt = np.linalg.svd(P - c, full_matrices=False)
    d = vt[0]
    n = np.array([-d[1], d[0]])
    return n, float(n @ c)


def ransac_line(P, rng, tol=1.5, iters=400, min_dist=40.0):
    N = len(P)
    i = rng.integers(0, N, iters)
    j = rng.integers(0, N, iters)
    p, q = P[i], P[j]
    d = q - p
    L = np.hypot(d[:, 0], d[:, 1])
    ok = L > min_dist
    if not ok.any():
        return None
    n = np.stack([-d[:, 1], d[:, 0]], 1) / np.where(L > 0, L, 1)[:, None]
    c = (n * p).sum(1)
    res = np.abs(P @ n.T - c)
    counts = np.where(ok, (res < tol).sum(0), 0)
    b = int(np.argmax(counts))
    nb, cb = n[b], float(c[b])
    for _ in range(3):
        inl = np.abs(P @ nb - cb) < tol
        if inl.sum() < 5:
            break
        nb, cb = fit_pca(P[inl])
    inl = np.abs(P @ nb - cb) < tol
    return nb, cb, inl


def intersect(l1, l2):
    A = np.array([l1[0], l2[0]], float)
    b = np.array([l1[1], l2[1]], float)
    return np.linalg.solve(A, b)


SECTORS = [np.array(v, float) for v in ((0, -1), (1, 0), (0, 1), (-1, 0))]  # top right bottom left
TRIM = 0.12


def detect_corners(mask):
    """mask: bool, componente de la pantalla. Devuelve [TL,TR,BR,BL] en coords continuas (borde de pixel)."""
    edge = mask & ~erode4(mask)
    ys, xs = np.nonzero(edge)
    P = np.stack([xs + 0.5, ys + 0.5], 1)
    if len(P) > 8000:
        P = P[:: int(np.ceil(len(P) / 8000))]
    if len(P) < 100:
        raise SceneError("contorno de pantalla demasiado pequeno")
    yy, xx = np.nonzero(mask)
    centroid = np.array([xx.mean() + 0.5, yy.mean() + 0.5])
    rng = np.random.default_rng(12345)

    # 1) rectas largas por RANSAC secuencial; una por sector (arriba/derecha/abajo/izquierda)
    remaining = np.ones(len(P), bool)
    best = {}
    for _ in range(12):
        if remaining.sum() < 40:
            break
        r = ransac_line(P[remaining], rng)
        if r is None:
            break
        n, c, inl = r
        cnt = int(inl.sum())
        if cnt < 40:
            break
        m = P[remaining][inl].mean(0)
        if n @ (m - centroid) < 0:
            n, c = -n, -c
        dots = [float(n @ s) for s in SECTORS]
        k = int(np.argmax(dots))
        if dots[k] > 0.6 and (k not in best or cnt > best[k][2]):
            best[k] = (n, c, cnt)
        remaining &= ~(np.abs(P @ n - c) < 3.0)
    if len(best) < 4:
        raise SceneError("no se pudieron ajustar los 4 lados de la pantalla")
    lines = [(best[k][0], best[k][1]) for k in range(4)]

    def corners_of(ls):
        t, r, b, l = ls
        return [intersect(t, l), intersect(t, r), intersect(b, r), intersect(b, l)]

    # 2) refinar: puntos cerca de cada recta, sin el 12 % de cada extremo (zona redondeada)
    for _ in range(2):
        TL, TR, BR, BL = corners_of(lines)
        ends = [(TL, TR), (TR, BR), (BL, BR), (TL, BL)]
        new = []
        for (n, c), (A, B) in zip(lines, ends):
            v = B - A
            t = ((P - A) @ v) / float(v @ v)
            sel = (np.abs(P @ n - c) < 4.0) & (t > TRIM) & (t < 1 - TRIM)
            if sel.sum() < 20:
                raise SceneError("pocos puntos para ajustar un lado de la pantalla")
            Q = P[sel]
            n2, c2 = fit_pca(Q)
            if n2 @ n < 0:
                n2, c2 = -n2, -c2
            for _ in range(4):
                keep = np.abs(Q @ n2 - c2) < 1.5
                if keep.sum() < 15:
                    break
                n2, c2 = fit_pca(Q[keep])
                if n2 @ n < 0:
                    n2, c2 = -n2, -c2
            new.append((n2, c2))
        lines = new
    # el borde de la mascara esta 0.5 px fuera del centro del pixel de contorno
    lines = [(n, c + 0.5) for n, c in lines]
    return [tuple(map(float, p)) for p in corners_of(lines)]


def detect_screen(plate_arr, ci, tol):
    key = key_mask(plate_arr, ci, tol)
    comp = largest_component(key)
    if comp is None or comp.sum() < 0.002 * comp.size:
        raise SceneError("no se detecto una pantalla en verde")
    return detect_corners(comp), comp


def quad_size(c):
    TL, TR, BR, BL = [np.array(p) for p in c]
    w = (np.linalg.norm(TR - TL) + np.linalg.norm(BR - BL)) / 2
    h = (np.linalg.norm(BL - TL) + np.linalg.norm(BR - TR)) / 2
    return float(w), float(h)


# ---------------------------------------------------------------- manifiesto

def resolve(root, rel, default_dir):
    rel = str(rel)
    if rel.startswith(("mockups/", "public/")):
        return (root / rel).resolve()
    return (root / default_dir / rel).resolve()


def need(d, key, typ, ctx):
    if key not in d or not isinstance(d[key], typ) or (typ is str and not d[key].strip()):
        raise SceneError(f"{ctx}: falta o es invalido '{key}'")
    return d[key]


def load_manifest(path, root):
    path = Path(path)
    try:
        m = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        raise SceneError(f"{path.name}: JSON ilegible ({e})")
    ctx = path.name
    sid = need(m, "id", str, ctx)
    if not ID_RE.match(sid) or sid != path.stem:
        raise SceneError(f"{ctx}: 'id' debe coincidir con el nombre del archivo y ser [a-z0-9_-]")
    need(m, "case", str, ctx)
    if m.get("kind") not in KINDS:
        raise SceneError(f"{ctx}: 'kind' debe ser uno de {KINDS}")
    need(m, "plate", str, ctx)
    scr = need(m, "screen", dict, ctx)
    need(scr, "source", str, ctx + " screen")
    s = {
        "source": scr["source"],
        "fit": scr.get("fit", "cover"),
        "key": scr.get("key", "#00FF00"),
        "tolerance": scr.get("tolerance", 50),
        "glare": scr.get("glare", 0),
        "aspect": scr.get("aspect"),
        "bg": scr.get("bg", "#000000"),
    }
    if s["fit"] not in ("cover", "contain"):
        raise SceneError(f"{ctx}: screen.fit debe ser cover|contain")
    parse_key(s["key"])
    if not isinstance(s["tolerance"], (int, float)) or not 0 <= s["tolerance"] <= 200:
        raise SceneError(f"{ctx}: screen.tolerance fuera de rango")
    if not isinstance(s["glare"], (int, float)) or not 0 <= s["glare"] <= 1:
        raise SceneError(f"{ctx}: screen.glare debe estar entre 0 y 1")
    if s["aspect"] is not None and (not isinstance(s["aspect"], (int, float)) or s["aspect"] <= 0):
        raise SceneError(f"{ctx}: screen.aspect debe ser un numero > 0 (ancho/alto)")
    out = need(m, "output", dict, ctx)
    o = {
        "dir": need(out, "dir", str, ctx + " output"),
        "width": out.get("width", 2400),
        "quality": out.get("quality", 85),
        "lossless": bool(out.get("lossless", False)),
    }
    if not isinstance(o["width"], int) or o["width"] < 200:
        raise SceneError(f"{ctx}: output.width invalido")
    if not isinstance(o["quality"], int) or not 1 <= o["quality"] <= 100:
        raise SceneError(f"{ctx}: output.quality debe ser 1-100")
    for k in ("alt", "caption"):
        blk = need(m, k, dict, ctx)
        for lang in ("es", "en"):
            need(blk, lang, str, f"{ctx} {k}")
    hf = need(m, "higgsfield", dict, ctx)
    if "job_id" not in hf:
        raise SceneError(f"{ctx}: higgsfield.job_id es obligatorio (vacio si el plate es sintetico)")
    out_dir = (root / o["dir"]).resolve()
    pub = (root / "public").resolve()
    try:
        out_dir.relative_to(pub)
    except ValueError:
        raise SceneError(f"{ctx}: output.dir debe estar bajo public/")
    plate = resolve(root, m["plate"], "mockups/plates")
    src = resolve(root, s["source"], "mockups/screens")
    ok = False
    for base in ("mockups/screens", "public/work"):
        try:
            src.relative_to((root / base).resolve())
            ok = True
        except ValueError:
            pass
    if not ok:
        raise SceneError(f"{ctx}: la captura debe salir de mockups/screens/ o public/work/ (privacidad)")
    return {"id": sid, "raw": m, "screen": s, "output": o, "plate_path": plate, "source_path": src, "out_dir": out_dir}


# ---------------------------------------------------------------- composicion

def fit_texture(cap, tw, th, fit, bg):
    cw, ch = cap.size
    if fit == "cover":
        sc = max(tw / cw, th / ch)
        r = cap.resize((max(tw, round(cw * sc)), max(th, round(ch * sc))), Image.LANCZOS)
        l, t = (r.width - tw) // 2, (r.height - th) // 2
        return r.crop((l, t, l + tw, t + th))
    sc = min(tw / cw, th / ch)
    r = cap.resize((max(1, round(cw * sc)), max(1, round(ch * sc))), Image.LANCZOS)
    canvas = Image.new("RGB", (tw, th), tuple(int(bg.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4)))
    canvas.paste(r, ((tw - r.width) // 2, (th - r.height) // 2))
    return canvas


def compose_scene(sc):
    """Devuelve (PIL RGB sin redimensionar, info)."""
    s = sc["screen"]
    ci = parse_key(s["key"])
    plate = Image.open(sc["plate_path"]).convert("RGB")
    arr = np.array(plate)
    H, W = arr.shape[:2]
    corners, comp = detect_screen(arr, ci, s["tolerance"])
    cap = Image.open(sc["source_path"]).convert("RGB")

    w_est, h_est = quad_size(corners)
    SS = 2
    tw = int(min(4000, max(64, round(w_est * SS))))
    th = int(min(4000, max(64, round(h_est * SS))))
    if s["aspect"]:
        th = int(round(tw / s["aspect"]))
    tex = np.asarray(fit_texture(cap, tw, th, s["fit"], s["bg"]))
    pad = 8
    texp = np.pad(tex, ((pad, pad), (pad, pad), (0, 0)), mode="edge")
    Hp, Wp = texp.shape[:2]
    quad2 = [(x * SS, y * SS) for x, y in corners]
    fwd = persp_coeffs([(pad, pad), (pad + tw, pad), (pad + tw, pad + th), (pad, pad + th)], quad2)
    rect = [(0, 0), (Wp, 0), (Wp, Hp), (0, Hp)]
    back = persp_coeffs(apply_persp(fwd, rect), rect)
    warped = Image.fromarray(texp).transform((W * SS, H * SS), Image.PERSPECTIVE, tuple(back), Image.BICUBIC)
    cap_down = np.asarray(warped.resize((W, H), Image.LANCZOS)).astype(np.float32)

    p = arr.astype(np.float32)
    # despill: en una banda de 6 px alrededor de la mascara, limita el canal clave
    band = dilate(comp, 6)
    others = [i for i in range(3) if i != ci]
    lim = np.maximum(p[..., others[0]], p[..., others[1]])
    ch = p[..., ci]
    p[..., ci] = np.where(band, np.minimum(ch, lim), ch)
    # alfa: mascara de la clave suavizada ~1 px
    alpha = np.maximum(box_blur(dilate(comp, 1).astype(np.float32), 1), comp.astype(np.float32))
    out = p * (1 - alpha[..., None]) + cap_down * alpha[..., None]
    if s["glare"] > 0:
        Y = 0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]
        Y = Y.astype(np.float32)
        m = comp.astype(np.float32)
        r = max(4, int(0.04 * max(w_est, h_est)))
        base = box_blur(box_blur(box_blur(Y * m, r), r), r) / np.maximum(box_blur(box_blur(box_blur(m, r), r), r), 1e-3)
        g = np.clip(Y - base, 0, None) * float(s["glare"]) * alpha
        out = out + g[..., None]
    img = Image.fromarray(np.clip(out + 0.5, 0, 255).astype(np.uint8), "RGB")
    return img, {"corners": corners, "size": (W, H), "screen": (w_est, h_est)}


def content_hash(sc):
    s, o = sc["screen"], sc["output"]
    params = {
        "algo": ALGO_VERSION, "key": s["key"].upper(), "tolerance": s["tolerance"], "fit": s["fit"],
        "glare": s["glare"], "aspect": s["aspect"], "bg": s["bg"],
        "width": o["width"], "quality": o["quality"], "lossless": o["lossless"],
    }
    h = hashlib.sha256()
    h.update(sc["plate_path"].read_bytes())
    h.update(b"\0")
    h.update(sc["source_path"].read_bytes())
    h.update(b"\0")
    h.update(json.dumps(params, sort_keys=True).encode())
    return h.hexdigest()[:8]


def build_scene(sc, root, use_cache=True):
    for k, label in (("plate_path", "plate"), ("source_path", "captura")):
        if not sc[k].is_file():
            raise SceneError(f"{sc['id']}: no existe el {label}: {sc[k]}")
    hsh = content_hash(sc)
    out_dir = sc["out_dir"]
    out_dir.mkdir(parents=True, exist_ok=True)
    fname = f"{sc['id']}.{hsh}.webp"
    dest = out_dir / fname
    if not (use_cache and dest.is_file()):
        img, _ = compose_scene(sc)
        mw = sc["output"]["width"]
        if img.width > mw:
            img = img.resize((mw, round(img.height * mw / img.width)), Image.LANCZOS)
        img.save(dest, "WEBP", quality=sc["output"]["quality"], lossless=sc["output"]["lossless"], method=4)
    old = re.compile(re.escape(sc["id"]) + r"\.[0-9a-f]{8}\.webp")
    for f in out_dir.iterdir():
        if f.name != fname and old.fullmatch(f.name):
            f.unlink()
    with Image.open(dest) as im:
        w, h = im.size
    rel = out_dir.relative_to((root / "public").resolve()).as_posix()
    return {"src": f"/{rel}/{fname}", "width": w, "height": h}


def check_scene(sc):
    for k, label in (("plate_path", "plate"), ("source_path", "captura")):
        if not sc[k].is_file():
            raise SceneError(f"{sc['id']}: no existe el {label}: {sc[k]}")
    ci = parse_key(sc["screen"]["key"])
    arr = np.asarray(Image.open(sc["plate_path"]).convert("RGB"))
    corners, _ = detect_screen(arr, ci, sc["screen"]["tolerance"])
    w, h = quad_size(corners)
    cs = " ".join(f"({x:.0f},{y:.0f})" for x, y in corners)
    return f"ok     {sc['id']}  plate {arr.shape[1]}x{arr.shape[0]}  pantalla ~{w:.0f}x{h:.0f}  esquinas {cs}"


# ---------------------------------------------------------------- CLI

def main(argv=None):
    ap = argparse.ArgumentParser(description="Compone capturas reales en plates con pantalla verde.")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--all", action="store_true")
    g.add_argument("--scene", metavar="ID")
    ap.add_argument("--check", action="store_true", help="valida sin escribir nada")
    ap.add_argument("--root", default=str(DEFAULT_ROOT), help="raiz del repo (pruebas)")
    ap.add_argument("--no-cache", action="store_true", help="recompone aunque exista la salida versionada")
    a = ap.parse_args(argv)
    root = Path(a.root).resolve()
    sdir = root / "mockups" / "scenes"
    data_path = root / "src" / "data" / "scenes.generated.json"
    files = sorted(sdir.glob("*.json")) if sdir.is_dir() else []
    if a.scene:
        files = [f for f in files if f.stem == a.scene]
        if not files:
            print(f"FALLA  {a.scene}: no existe mockups/scenes/{a.scene}.json")
            return 1
    if not files:
        print("FALLA  no hay manifiestos en mockups/scenes/")
        return 1
    failed, results = 0, {}
    for f in files:
        try:
            sc = load_manifest(f, root)
            if a.check:
                print(check_scene(sc))
            else:
                results[sc["id"]] = build_scene(sc, root, not a.no_cache)
                r = results[sc["id"]]
                print(f"ok     {sc['id']}  {r['src']}  {r['width']}x{r['height']}")
        except (SceneError, OSError, ValueError) as e:
            failed += 1
            print(f"FALLA  {f.stem}: {e}")
    if a.check or failed:
        return 1 if failed else 0
    data = {}
    if a.scene and data_path.is_file():
        data = json.loads(data_path.read_text(encoding="utf-8"))
    data.update(results)
    text = json.dumps({k: data[k] for k in sorted(data)}, indent=2, ensure_ascii=False) + "\n"
    data_path.parent.mkdir(parents=True, exist_ok=True)
    if not data_path.is_file() or data_path.read_text(encoding="utf-8") != text:
        data_path.write_text(text, encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
