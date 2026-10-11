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

ALGO_VERSION = "2"
DEFAULT_ROOT = Path(__file__).resolve().parents[2]
KINDS = ("hero", "wide", "duo", "detail")
ID_RE = re.compile(r"[a-z0-9_-]+")


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



def components(mask):
    """Componentes conexos (8-vecinos) de la mascara, de mayor a menor. Etiquetado sobre version reducida."""
    h, w = mask.shape
    s = max(1, int(np.ceil(max(h, w) / 600)))
    H2, W2 = -(-h // s), -(-w // s)
    pad = np.zeros((H2 * s, W2 * s), bool)
    pad[:h, :w] = mask
    red = pad.reshape(H2, s, W2, s).any(axis=(1, 3))
    flat = bytearray(red.astype(np.uint8).ravel().tobytes())
    labels = [0] * (H2 * W2)
    sizes = {}
    cur = 0
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
        sizes[cur] = n
    lab = np.array(labels, np.int32).reshape(H2, W2)
    out = []
    for k in sorted(sizes, key=lambda k: -sizes[k]):
        up = np.repeat(np.repeat(lab == k, s, axis=0), s, axis=1)[:h, :w] & mask
        out.append(up)
    out.sort(key=lambda m: -int(m.sum()))
    return out


def largest_component(mask):
    c = components(mask)
    return c[0] if c else None


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




SIGNIFICANT = 0.20  # una region verde >= 20 % de la mayor cuenta como pantalla


def detect_screens(plate_arr, ci, tol, n_declared=1):
    """Devuelve [(esquinas, mascara)] ordenado por area (rank 1 = la mayor). Falla si el plate no coincide con lo declarado."""
    key = key_mask(plate_arr, ci, tol)
    comps = components(key)
    if not comps or comps[0].sum() < 0.002 * key.size:
        raise SceneError("no se detecto una pantalla en verde")
    big = int(comps[0].sum())
    sig = [c for c in comps if c.sum() >= SIGNIFICANT * big]
    if len(sig) > n_declared:
        raise SceneError(
            f"el plate tiene {len(sig)} regiones verdes significativas pero el manifiesto declara {n_declared}: "
            "declara cada pantalla en 'screens' (con 'rank' 1 = la de mayor area) o corrige el plate")
    if len(sig) < n_declared:
        raise SceneError(f"el manifiesto declara {n_declared} pantallas pero el plate solo tiene {len(sig)} regiones verdes")
    H, W = key.shape
    res = []
    for i, c in enumerate(sig, 1):
        ys, xs = np.nonzero(c)
        if ys.min() == 0 or xs.min() == 0 or ys.max() == H - 1 or xs.max() == W - 1:
            raise SceneError(f"la pantalla {i} toca el borde de la imagen: las esquinas serian falsas; reencuadra el plate")
        res.append((detect_corners(c), c))
    return res


def quad_size(c):
    TL, TR, BR, BL = [np.array(p) for p in c]
    w = (np.linalg.norm(TR - TL) + np.linalg.norm(BR - BL)) / 2
    h = (np.linalg.norm(BL - TL) + np.linalg.norm(BR - TR)) / 2
    return float(w), float(h)



# ---------------------------------------------------------------- manifiesto

PLATE_DIRS = ("mockups/plates", "mockups/fixtures")
SCREEN_DIRS = ("mockups/screens", "public/work")
MAX_PIXELS = 60_000_000
Image.MAX_IMAGE_PIXELS = MAX_PIXELS
WEBP_METHOD = 4


def resolve_under(root, rel, default_dir, allowed, ctx, label):
    rel = str(rel)
    if rel.startswith(("mockups/", "public/")):
        p = (root / rel).resolve()
    else:
        p = (root / default_dir / rel).resolve()
    for base in allowed:
        try:
            p.relative_to((root / base).resolve())
            return p
        except ValueError:
            pass
    raise SceneError(f"{ctx}: {label} fuera de {' / '.join(allowed)}: {rel!r}")


def open_image(path, ctx):
    import warnings
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            im = Image.open(path)
            im.load()
        return im
    except (Image.DecompressionBombError, Image.DecompressionBombWarning):
        raise SceneError(f"{ctx}: imagen demasiado grande (> {MAX_PIXELS // 1_000_000} Mpx): {path.name}")
    except OSError as e:
        raise SceneError(f"{ctx}: imagen ilegible {path.name} ({e})")


def need(d, key, typ, ctx):
    if key not in d or not isinstance(d[key], typ) or (typ is str and not d[key].strip()):
        raise SceneError(f"{ctx}: falta o es invalido '{key}'")
    return d[key]


def norm_screen(scr, idx, ctx):
    need(scr, "source", str, ctx)
    s = {
        "source": scr["source"],
        "fit": scr.get("fit", "cover"),
        "key": scr.get("key", "#00FF00"),
        "tolerance": scr.get("tolerance", 50),
        "glare": scr.get("glare", 0),
        "aspect": scr.get("aspect"),
        "bg": scr.get("bg", "#000000"),
        "rank": scr.get("rank", idx + 1),
    }
    if s["fit"] not in ("cover", "contain"):
        raise SceneError(f"{ctx}: fit debe ser cover|contain")
    parse_key(s["key"])
    if not isinstance(s["tolerance"], (int, float)) or isinstance(s["tolerance"], bool) or not 0 <= s["tolerance"] <= 200:
        raise SceneError(f"{ctx}: tolerance fuera de rango")
    if not isinstance(s["glare"], (int, float)) or isinstance(s["glare"], bool) or not 0 <= s["glare"] <= 1:
        raise SceneError(f"{ctx}: glare debe estar entre 0 y 1")
    if s["aspect"] is not None and (not isinstance(s["aspect"], (int, float)) or s["aspect"] <= 0):
        raise SceneError(f"{ctx}: aspect debe ser un numero > 0 (ancho/alto)")
    if not re.fullmatch(r"#[0-9a-fA-F]{6}", str(s["bg"])):
        raise SceneError(f"{ctx}: bg debe ser #RRGGBB")
    if not isinstance(s["rank"], int) or isinstance(s["rank"], bool) or s["rank"] < 1:
        raise SceneError(f"{ctx}: rank debe ser un entero >= 1")
    return s


def load_manifest(path, root):
    path = Path(path)
    try:
        m = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        raise SceneError(f"{path.name}: JSON ilegible ({e})")
    if not isinstance(m, dict):
        raise SceneError(f"{path.name}: el manifiesto debe ser un objeto")
    ctx = path.name
    sid = need(m, "id", str, ctx)
    if not ID_RE.fullmatch(sid) or sid != path.stem:
        raise SceneError(f"{ctx}: 'id' debe coincidir con el nombre del archivo y ser [a-z0-9_-]")
    need(m, "case", str, ctx)
    if m.get("kind") not in KINDS:
        raise SceneError(f"{ctx}: 'kind' debe ser uno de {KINDS}")
    need(m, "plate", str, ctx)
    if "screens" in m and "screen" in m:
        raise SceneError(f"{ctx}: usa 'screen' o 'screens', no ambos")
    if "screens" in m:
        raw = m["screens"]
        if not isinstance(raw, list) or not 1 <= len(raw) <= 3 or not all(isinstance(x, dict) for x in raw):
            raise SceneError(f"{ctx}: 'screens' debe ser una lista de 1 a 3 objetos")
    else:
        raw = [need(m, "screen", dict, ctx)]
    screens = [norm_screen(x, i, f"{ctx} screens[{i}]") for i, x in enumerate(raw)]
    if sorted(s["rank"] for s in screens) != list(range(1, len(screens) + 1)):
        raise SceneError(f"{ctx}: los rank deben ser 1..{len(screens)} sin repetir")
    if len({(s["key"].upper(), s["tolerance"]) for s in screens}) > 1:
        raise SceneError(f"{ctx}: key y tolerance deben ser iguales en todas las pantallas")
    screens.sort(key=lambda s: s["rank"])
    out = need(m, "output", dict, ctx)
    o = {
        "dir": need(out, "dir", str, ctx + " output"),
        "width": out.get("width", 2400),
        "quality": out.get("quality", 85),
        "lossless": bool(out.get("lossless", False)),
    }
    if not isinstance(o["width"], int) or isinstance(o["width"], bool) or o["width"] < 200:
        raise SceneError(f"{ctx}: output.width invalido")
    if not isinstance(o["quality"], int) or isinstance(o["quality"], bool) or not 1 <= o["quality"] <= 100:
        raise SceneError(f"{ctx}: output.quality debe ser 1-100")
    for k in ("alt", "caption"):
        blk = need(m, k, dict, ctx)
        for lang in ("es", "en"):
            need(blk, lang, str, f"{ctx} {k}")
    hf = need(m, "higgsfield", dict, ctx)
    if "job_id" not in hf:
        raise SceneError(f"{ctx}: higgsfield.job_id es obligatorio (vacio si el plate es sintetico)")
    out_dir = (root / o["dir"]).resolve()
    try:
        out_dir.relative_to((root / "public").resolve())
    except ValueError:
        raise SceneError(f"{ctx}: output.dir debe estar bajo public/")
    plate = resolve_under(root, m["plate"], "mockups/plates", PLATE_DIRS, ctx, "plate")
    for s in screens:
        s["source_path"] = resolve_under(
            root, s["source"], "mockups/screens", SCREEN_DIRS, ctx, "captura (privacidad: solo saneadas)")
    return {"id": sid, "raw": m, "screens": screens, "key": screens[0]["key"], "tolerance": screens[0]["tolerance"],
            "output": o, "plate_path": plate, "out_dir": out_dir}


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


def warp_screen(s, corners, W, H, sid):
    """Captura ajustada y deformada a la pantalla, a resolucion del plate (RGB float32)."""
    cap = open_image(s["source_path"], sid).convert("RGB")
    w_est, h_est = quad_size(corners)
    SS = 2
    tw = int(min(4000, max(64, round(w_est * SS))))
    th = int(min(4000, max(64, round(h_est * SS))))
    if s["aspect"]:
        th = int(round(tw / s["aspect"]))
    pick = max if s["fit"] == "cover" else min
    if pick(w_est / cap.width, th / SS / cap.height) > 1.0:
        print(f"AVISO  {sid}: la captura {cap.width}x{cap.height} es menor que la pantalla (~{w_est:.0f}x{h_est:.0f} px): "
              "se amplia y se vera blanda; usa una captura mayor", file=sys.stderr)
    tex = np.asarray(fit_texture(cap, tw, th, s["fit"], s["bg"]))
    pad = 8
    texp = np.pad(tex, ((pad, pad), (pad, pad), (0, 0)), mode="edge")
    Hp, Wp = texp.shape[:2]
    quad2 = [(x * SS, y * SS) for x, y in corners]
    fwd = persp_coeffs([(pad, pad), (pad + tw, pad), (pad + tw, pad + th), (pad, pad + th)], quad2)
    rect = [(0, 0), (Wp, 0), (Wp, Hp), (0, Hp)]
    back = persp_coeffs(apply_persp(fwd, rect), rect)
    warped = Image.fromarray(texp).transform((W * SS, H * SS), Image.PERSPECTIVE, tuple(back), Image.BICUBIC)
    return np.asarray(warped.resize((W, H), Image.LANCZOS)).astype(np.float32)


def compose_scene(sc):
    """Devuelve (PIL RGB sin redimensionar, info)."""
    ci = parse_key(sc["key"])
    plate = open_image(sc["plate_path"], sc["id"]).convert("RGB")
    arr = np.array(plate)
    H, W = arr.shape[:2]
    found = detect_screens(arr, ci, sc["tolerance"], len(sc["screens"]))

    p = arr.astype(np.float32)
    # despill: en una banda de 6 px alrededor de cada mascara, limita el canal clave
    band = dilate(np.any([c for _, c in found], axis=0), 6)
    others = [i for i in range(3) if i != ci]
    lim = np.maximum(p[..., others[0]], p[..., others[1]])
    ch = p[..., ci]
    p[..., ci] = np.where(band, np.minimum(ch, lim), ch)
    out = p
    infos = []
    for s, (corners, comp) in zip(sc["screens"], found):
        cap_down = warp_screen(s, corners, W, H, sc["id"])
        w_est, h_est = quad_size(corners)
        # alfa: mascara de la clave suavizada ~1 px (dedos y objetos que tapan se conservan)
        alpha = np.maximum(box_blur(dilate(comp, 1).astype(np.float32), 1), comp.astype(np.float32))
        out = out * (1 - alpha[..., None]) + cap_down * alpha[..., None]
        if s["glare"] > 0:
            Y = (0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]).astype(np.float32)
            m = comp.astype(np.float32)
            r = max(4, int(0.04 * max(w_est, h_est)))
            num, den = m * Y, m
            for _ in range(3):
                num, den = box_blur(num, r), box_blur(den, r)
            base = num / np.maximum(den, 1e-3)
            g = np.clip(Y - base, 0, None) * float(s["glare"]) * alpha
            out = out + g[..., None]
        infos.append({"rank": s["rank"], "corners": corners, "screen": (w_est, h_est)})
    img = Image.fromarray(np.clip(out + 0.5, 0, 255).astype(np.uint8), "RGB")
    return img, {"corners": infos[0]["corners"], "screens": infos, "size": (W, H)}


def content_hash(sc):
    o = sc["output"]
    params = {
        "algo": ALGO_VERSION,
        "screens": [{k: s[k] for k in ("fit", "glare", "aspect", "bg", "rank")} | {"key": s["key"].upper(), "tolerance": s["tolerance"]}
                    for s in sc["screens"]],
        "output": {"width": o["width"], "quality": o["quality"], "lossless": o["lossless"]},
        "webp": {"method": WEBP_METHOD, "format": "WEBP"},
    }
    h = hashlib.sha256()
    h.update(sc["plate_path"].read_bytes())
    for s in sc["screens"]:
        h.update(b"\0")
        h.update(s["source_path"].read_bytes())
    h.update(b"\0")
    h.update(json.dumps(params, sort_keys=True).encode())
    return h.hexdigest()[:8]


def need_files(sc):
    if not sc["plate_path"].is_file():
        raise SceneError(f"{sc['id']}: no existe el plate: {sc['plate_path']}")
    for s in sc["screens"]:
        if not s["source_path"].is_file():
            raise SceneError(f"{sc['id']}: no existe la captura: {s['source_path']}")


def build_scene(sc, root, use_cache=True):
    need_files(sc)
    hsh = content_hash(sc)
    out_dir = sc["out_dir"]
    fname = f"{sc['id']}.{hsh}.webp"
    dest = out_dir / fname
    if not (use_cache and dest.is_file()):
        img, _ = compose_scene(sc)
        mw = sc["output"]["width"]
        if img.width > mw:
            img = img.resize((mw, round(img.height * mw / img.width)), Image.LANCZOS)
        out_dir.mkdir(parents=True, exist_ok=True)
        img.save(dest, "WEBP", quality=sc["output"]["quality"], lossless=sc["output"]["lossless"], method=WEBP_METHOD)
    old = re.compile(re.escape(sc["id"]) + r"\.[0-9a-f]{8}\.webp")
    for f in out_dir.iterdir():
        if f.name != fname and old.fullmatch(f.name):
            f.unlink()
    with Image.open(dest) as im:
        w, h = im.size
    rel = out_dir.relative_to((root / "public").resolve()).as_posix()
    return {"src": f"/{rel}/{fname}", "width": w, "height": h}


def check_scene(sc):
    need_files(sc)
    ci = parse_key(sc["key"])
    arr = np.array(open_image(sc["plate_path"], sc["id"]).convert("RGB"))
    found = detect_screens(arr, ci, sc["tolerance"], len(sc["screens"]))
    parts = []
    for s, (corners, _) in zip(sc["screens"], found):
        w, h = quad_size(corners)
        cs = " ".join(f"({x:.0f},{y:.0f})" for x, y in corners)
        parts.append(f"#{s['rank']} ~{w:.0f}x{h:.0f} {cs}")
    return f"ok     {sc['id']}  plate {arr.shape[1]}x{arr.shape[0]}  pantallas: " + " | ".join(parts)


# ---------------------------------------------------------------- CLI

def main(argv=None):
    ap = argparse.ArgumentParser(description="Compone capturas reales en plates con pantalla verde.")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--all", action="store_true", help="todas las escenas salvo las de prueba (prefijo _)")
    g.add_argument("--scene", metavar="ID")
    ap.add_argument("--check", action="store_true", help="valida sin escribir nada")
    ap.add_argument("--include-fixtures", action="store_true", help="con --all, incluye las escenas _*")
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
    elif not a.include_fixtures:
        files = [f for f in files if not f.stem.startswith("_")]
    failed, results = 0, {}
    for f in files:
        try:
            sc = load_manifest(f, root)
            if a.check:
                print(check_scene(sc))
            else:
                results[sc["id"]] = r = build_scene(sc, root, not a.no_cache)
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
