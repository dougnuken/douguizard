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

ALGO_VERSION = "3"
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
SIDE_NAMES = ("arriba", "derecha", "abajo", "izquierda")
TRIM = 0.12            # fraccion de cada extremo del lado que se descarta (zona redondeada)
BORDER_EXCL = 3        # px del borde de la imagen cuyo contorno se ignora (pantallas recortadas)
TRIM_AT_BORDER = False  # si True, recorta tambien los extremos que terminan contra el borde (solo para pruebas de mutacion)
MIN_SIDE_POINTS = 40
MIN_EXTENT = 0.06      # extension visible minima de un lado, fraccion de max(W, H)
MAX_RESIDUAL = 1.5     # px
ANGLE_RANGE = (55.0, 125.0)
MAX_CORNER_DIST = 1.0  # esquina a mas de esto x max(W, H) del plate: rectas casi paralelas
SPILL_WARN, SPILL_FAIL = 12.0, 24.0


def contour_points(mask, cropped):
    H, W = mask.shape
    ys, xs = np.nonzero(mask & ~erode4(mask))
    if cropped and BORDER_EXCL > 0:
        keep = (xs >= BORDER_EXCL) & (xs < W - BORDER_EXCL) & (ys >= BORDER_EXCL) & (ys < H - BORDER_EXCL)
        xs, ys = xs[keep], ys[keep]
    P = np.stack([xs + 0.5, ys + 0.5], 1)
    if len(P) > 8000:
        P = P[:: int(np.ceil(len(P) / 8000))]
    return P


def corner_inside(p, W, H):
    return BORDER_EXCL <= p[0] <= W - BORDER_EXCL and BORDER_EXCL <= p[1] <= H - BORDER_EXCL


def corners_of(ls):
    t, r, b, l = ls
    return [intersect(t, l), intersect(t, r), intersect(b, r), intersect(b, l)]


def side_ends(c):
    TL, TR, BR, BL = c
    return [(TL, TR), (TR, BR), (BL, BR), (TL, BL)]


def select_side(P, n, c, A, B, W, H, cropped, win=4.0):
    """Puntos del contorno que pertenecen a un lado: cerca de la recta y fuera de los extremos redondeados.
    En pantallas recortadas el recorte solo va en los extremos que son esquina real (dentro de la imagen)."""
    v = B - A
    t = ((P - A) @ v) / float(v @ v)
    if cropped:
        lo = TRIM if (TRIM_AT_BORDER or corner_inside(A, W, H)) else -0.02
        hi = 1 - TRIM if (TRIM_AT_BORDER or corner_inside(B, W, H)) else 1.02
    else:
        lo, hi = TRIM, 1 - TRIM
    return (np.abs(P @ n - c) < win) & (t > lo) & (t < hi)


def extent_of(Q, n):
    d = np.array([-n[1], n[0]])
    u = Q @ d
    return float(u.max() - u.min())


def check_geometry(corners, W, H, lines=None):
    big = max(W, H)
    for x, y in corners:
        dx = max(-x, 0, x - W)
        dy = max(-y, 0, y - H)
        if np.hypot(dx, dy) > MAX_CORNER_DIST * big or not np.isfinite([x, y]).all():
            raise SceneError("rectas casi paralelas: una esquina cae lejisimos del plate; reencuadra el plate o declara 'quad'")
    if lines is not None:
        for i in range(4):
            n1, n2 = lines[i][0], lines[(i + 1) % 4][0]
            ang = float(np.degrees(np.arccos(np.clip(n1 @ n2, -1, 1))))  # entre normales exteriores
            if not ANGLE_RANGE[0] <= ang <= ANGLE_RANGE[1]:
                raise SceneError(
                    f"los lados {SIDE_NAMES[i]} y {SIDE_NAMES[(i + 1) % 4]} forman {ang:.0f} grados (se esperan 55-125): "
                    "rectas casi paralelas o lados mal detectados")


def detect_corners(mask, cropped=False, info=None):
    """mask: bool, componente de la pantalla. Devuelve [TL,TR,BR,BL] en coords continuas (borde de pixel).
    cropped=True admite que el encuadre corte la pantalla (esquinas fuera de la imagen). info (dict) recibe metricas."""
    H, W = mask.shape
    P = contour_points(mask, cropped)
    if len(P) < 100:
        raise SceneError("contorno de pantalla demasiado pequeno")
    yy, xx = np.nonzero(mask)
    centroid = np.array([xx.mean() + 0.5, yy.mean() + 0.5])
    rng = np.random.default_rng(12345)
    min_ext = MIN_EXTENT * max(W, H)

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
        Pin = P[remaining][inl]
        m = Pin.mean(0)
        if n @ (m - centroid) < 0:
            n, c = -n, -c
        dots = [float(n @ s) for s in SECTORS]
        k = int(np.argmax(dots))
        ok_ext = (not cropped) or extent_of(Pin, n) >= min_ext
        if dots[k] > 0.6 and ok_ext and (k not in best or cnt > best[k][2]):
            best[k] = (n, c, cnt)
        remaining &= ~(np.abs(P @ n - c) < 3.0)
    if len(best) < 4:
        if cropped:
            falta = ", ".join(SIDE_NAMES[k] for k in range(4) if k not in best)
            raise SceneError(
                f"pantalla recortada: solo se ven {len(best)} de 4 lados (faltan: {falta}); hace falta ver los cuatro, "
                "aunque alguna esquina quede fuera del encuadre; reencuadra el plate")
        raise SceneError("no se pudieron ajustar los 4 lados de la pantalla")
    lines = [(best[k][0], best[k][1]) for k in range(4)]

    def safe_corners(ls):
        try:
            return corners_of(ls)
        except np.linalg.LinAlgError:
            raise SceneError("rectas casi paralelas: no se pueden intersectar los lados de la pantalla")

    # 2) refinar: puntos cerca de cada recta, sin los extremos redondeados
    resid, extents, npts = [], [], []
    for _ in range(2):
        corners = safe_corners(lines)
        new, resid, extents, npts = [], [], [], []
        for (n, c), (A, B) in zip(lines, side_ends(corners)):
            sel = select_side(P, n, c, A, B, W, H, cropped)
            if sel.sum() < (MIN_SIDE_POINTS if cropped else 20):
                raise SceneError("pocos puntos para ajustar un lado de la pantalla")
            Q = P[sel]
            n2, c2 = fit_pca(Q)
            if n2 @ n < 0:
                n2, c2 = -n2, -c2
            keep = np.ones(len(Q), bool)
            for _ in range(4):
                k2 = np.abs(Q @ n2 - c2) < 1.5
                if k2.sum() < 15:
                    break
                keep = k2
                n2, c2 = fit_pca(Q[keep])
                if n2 @ n < 0:
                    n2, c2 = -n2, -c2
            Qk = Q[keep]
            new.append((n2, c2))
            resid.append(float(np.abs(Qk @ n2 - c2).mean()))
            extents.append(extent_of(Qk, n2))
            npts.append(int(len(Qk)))
        lines = new
    if cropped:
        for i in range(4):
            if npts[i] < MIN_SIDE_POINTS or extents[i] < min_ext:
                raise SceneError(
                    f"pantalla recortada: el lado {SIDE_NAMES[i]} se ve solo {extents[i]:.0f} px ({npts[i]} puntos); "
                    "hace falta ver los cuatro lados; reencuadra el plate")
    residual = float(np.mean(resid))
    # el borde de la mascara esta 0.5 px fuera del centro del pixel de contorno
    lines = [(n, c + 0.5) for n, c in lines]
    corners = [tuple(map(float, p)) for p in safe_corners(lines)]
    check_geometry(corners, W, H, lines if cropped else None)
    if residual > MAX_RESIDUAL:
        raise SceneError(f"residual {residual:.2f} px > {MAX_RESIDUAL}: el contorno no es un cuadrilatero limpio; revisa el plate o declara 'quad'")
    if info is not None:
        info.update({"residual": residual, "npts": npts, "extents": extents,
                     "outside": [not (0 <= x <= W and 0 <= y <= H) for x, y in corners],
                     "border_points": int(((P[:, 0] < 3) | (P[:, 0] > W - 3) | (P[:, 1] < 3) | (P[:, 1] > H - 3)).sum())})
    return corners


def validate_quad(mask, quad, info=None):
    """Respaldo manual: comprueba que el cuadrilatero declarado (TL,TR,BR,BL en px del plate) cuadra con el contorno visible."""
    H, W = mask.shape
    corners = [(float(x), float(y)) for x, y in quad]
    check_geometry(corners, W, H)
    P = contour_points(mask, True)
    # normales exteriores: desde el centro del cuadrilatero
    ctr = np.mean(np.array(corners), axis=0)
    resid = []
    for i, (A, B) in enumerate(side_ends([np.array(c) for c in corners])):
        d = B - A
        n = np.array([-d[1], d[0]]) / float(np.hypot(*d))
        if n @ ((A + B) / 2 - ctr) < 0:
            n = -n
        c = float(n @ A) - 0.5  # los centros de los pixeles de contorno estan 0.5 px dentro del borde
        sel = select_side(P, n, c, A, B, W, H, True)
        if sel.sum() < 20:
            raise SceneError(f"el 'quad' declarado no coincide con el contorno visible (lado {SIDE_NAMES[i]})")
        resid.append(float(np.abs(P[sel] @ n - c).mean()))
    residual = float(np.mean(resid))
    if residual > MAX_RESIDUAL:
        raise SceneError(f"el 'quad' declarado no cuadra con el contorno: residual {residual:.2f} px > {MAX_RESIDUAL}")
    if info is not None:
        info.update({"residual": residual, "outside": [not (0 <= x <= W and 0 <= y <= H) for x, y in corners], "manual": True})
    return corners


SIGNIFICANT = 0.20  # una region verde >= 20 % de la mayor cuenta como pantalla


def spill_excess(plate_arr, comp, ci, ring=24):
    """Exceso medio de la clave (canal clave - max(otros), solo positivo) en el anillo de `ring` px fuera de la mascara."""
    a = plate_arr.astype(np.int16)
    others = [i for i in range(3) if i != ci]
    ex = np.clip(a[..., ci] - np.maximum(a[..., others[0]], a[..., others[1]]), 0, None)
    band = dilate(comp, ring) & ~dilate(comp, 1)
    return float(ex[band].mean()) if band.any() else 0.0


def detect_screens(plate_arr, ci, tol, n_declared=1, opts=None, with_info=False):
    """Devuelve [(esquinas, mascara)] (o [(esquinas, mascara, info)]) ordenado por area (rank 1 = la mayor).
    opts: lista por rank con {'cropped': bool, 'quad': [[x,y]*4] | None}. Falla si el plate no coincide con lo declarado."""
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
        o = (opts[i - 1] if opts else None) or {}
        cropped, quad = bool(o.get("cropped")), o.get("quad")
        ys, xs = np.nonzero(c)
        touches = ys.min() == 0 or xs.min() == 0 or ys.max() == H - 1 or xs.max() == W - 1
        if touches and not (cropped or quad):
            raise SceneError(f"la pantalla {i} toca el borde de la imagen: las esquinas serian falsas; reencuadra el plate "
                             "o declara 'cropped': true si el encuadre corta la pantalla a proposito")
        info = {"mask_pct": 100.0 * float(c.sum()) / c.size, "touches_border": bool(touches)}
        try:
            corners = validate_quad(c, quad, info) if quad else detect_corners(c, cropped, info)
        except SceneError as e:
            raise SceneError(f"pantalla {i}: {e}")
        info["spill"] = spill_excess(plate_arr, c, ci)
        if info["spill"] >= SPILL_FAIL:
            raise SceneError(f"pantalla {i}: derrame verde {info['spill']:.1f} >= {SPILL_FAIL:.0f} en el anillo de 24 px; el plate tiene tinte verde")
        res.append((corners, c, info) if with_info else (corners, c))
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
        "cropped": scr.get("cropped", False),
        "quad": scr.get("quad"),
        "sheen": scr.get("sheen"),
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
    if not isinstance(s["cropped"], bool):
        raise SceneError(f"{ctx}: cropped debe ser true o false")
    q = s["quad"]
    if q is not None:
        ok = (isinstance(q, list) and len(q) == 4 and all(
            isinstance(pt, list) and len(pt) == 2 and all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in pt)
            for pt in q))
        if not ok:
            raise SceneError(f"{ctx}: quad debe ser [[x,y],[x,y],[x,y],[x,y]] (TL, TR, BR, BL en px del plate)")
        s["quad"] = [[float(x), float(y)] for x, y in q]
    sh = s["sheen"]
    if sh is not None:
        if (not isinstance(sh, dict) or set(sh) - {"amount", "angle"} or not all(
                isinstance(sh.get(k), (int, float)) and not isinstance(sh.get(k), bool) for k in ("amount", "angle"))
                or not 0 <= sh["amount"] <= 1 or not 0 <= sh["angle"] <= 360):
            raise SceneError(f"{ctx}: sheen debe ser {{ amount: 0-1, angle: 0-360 }}")
        s["sheen"] = {"amount": float(sh["amount"]), "angle": float(sh["angle"])} if sh["amount"] > 0 else None
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


def sheen_gradient(tw, th, amount, angle):
    """Brillo de cristal en coordenadas de la captura (u, v en [0,1], v hacia abajo): g(t) = clip(1 - t/0.6, 0, 1) ** 1.6."""
    th_r = np.radians(angle)
    c, sn = np.cos(th_r), np.sin(th_r)
    u = (np.arange(tw, dtype=np.float32) + 0.5) / tw
    v = (np.arange(th, dtype=np.float32) + 0.5) / th
    uu, vv = np.meshgrid(u, v)
    t = ((uu - 0.5) * c + (vv - 0.5) * sn) / (abs(c) + abs(sn)) + 0.5
    return (np.clip(1 - t / 0.6, 0, 1) ** 1.6).astype(np.float32)


def warp_screen(s, corners, W, H, sid):
    """Captura (y brillo) ajustada y deformada a la pantalla, a resolucion del plate: (RGB float32, g float32 | None)."""
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
    cap_down = np.asarray(warped.resize((W, H), Image.LANCZOS)).astype(np.float32)
    g = None
    if s.get("sheen"):
        gp = np.pad(sheen_gradient(tw, th, s["sheen"]["amount"], s["sheen"]["angle"]), pad, mode="edge")
        gw = Image.fromarray(gp, "F").transform((W * SS, H * SS), Image.PERSPECTIVE, tuple(back), Image.BICUBIC)
        g = np.clip(np.asarray(gw.resize((W, H), Image.BILINEAR), dtype=np.float32), 0, 1)
    return cap_down, g


def soft_alpha(arr, comp, ci):
    a = arr.astype(np.float32)
    others = [i for i in range(3) if i != ci]
    ex = np.clip(a[..., ci] - np.maximum(a[..., others[0]], a[..., others[1]]), 0, None)
    inner = erode4(erode4(comp))
    ref = max(float(np.median(ex[inner])) if inner.any() else 255.0, 100.0)
    soft = np.clip(ex / ref, 0.0, 1.0)
    return np.where(inner, 1.0, np.where(dilate(comp, 1), soft, 0.0)).astype(np.float32)


def screen_opts(sc):
    return [{"cropped": s["cropped"], "quad": s["quad"]} for s in sc["screens"]]


def compose_scene(sc):
    """Devuelve (PIL RGB sin redimensionar, info)."""
    ci = parse_key(sc["key"])
    plate = open_image(sc["plate_path"], sc["id"]).convert("RGB")
    arr = np.array(plate)
    H, W = arr.shape[:2]
    found = detect_screens(arr, ci, sc["tolerance"], len(sc["screens"]), screen_opts(sc), True)

    p = arr.astype(np.float32)
    others = [i for i in range(3) if i != ci]
    alphas = [soft_alpha(arr, f[1], ci) for f in found]
    # despill: en una banda de 6 px alrededor de cada mascara, limita el canal clave a max(otros)
    band = dilate(np.any([f[1] for f in found], axis=0), 6)
    lim = np.maximum(p[..., others[0]], p[..., others[1]])
    ch = p[..., ci]
    ch = np.where(band, np.minimum(ch, lim), ch)
    # en los pixeles de borde (mezcla de verde y objeto) el limite es el promedio de los otros dos canales: sin tinte amarillento
    edge = np.any([(al > 0) & (al < 1) for al in alphas], axis=0)
    ch = np.where(edge, np.minimum(ch, 0.5 * (p[..., others[0]] + p[..., others[1]])), ch)
    p[..., ci] = ch
    # el interior de la pantalla no aporta nada del plate: lo pone la captura
    for f in found:
        p[erode4(erode4(f[1]))] = 0.0
    out = p
    infos = []
    for s, (corners, comp, dinfo), alpha in zip(sc["screens"], found, alphas):
        cap_down, g_sheen = warp_screen(s, corners, W, H, sc["id"])
        w_est, h_est = quad_size(corners)
        # compuesto exacto de borde: el plate despillado ya trae (1 - c) del objeto; se suma c de la captura.
        # alfa = cobertura de la clave (el exceso de verde crece con la fraccion de pixel verde): sin escalones ni
        # puntos grises, 1 en el interior y 0 fuera; los dedos y objetos que tapan la pantalla se conservan
        out = out + cap_down * alpha[..., None]
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
        if g_sheen is not None:  # brillo de cristal: solo donde hay alfa (no toca los dedos que cruzan la pantalla)
            k = (0.30 * s["sheen"]["amount"] * g_sheen * alpha)[..., None]
            out = out + (255.0 - out) * k
        infos.append({"rank": s["rank"], "corners": corners, "screen": (w_est, h_est), "detect": dinfo})
    img = Image.fromarray(np.clip(out + 0.5, 0, 255).astype(np.uint8), "RGB")
    return img, {"corners": infos[0]["corners"], "screens": infos, "size": (W, H)}


def content_hash(sc):
    o = sc["output"]
    params = {
        "algo": ALGO_VERSION,
        "screens": [{k: s[k] for k in ("fit", "glare", "aspect", "bg", "rank", "cropped", "quad", "sheen")} | {"key": s["key"].upper(), "tolerance": s["tolerance"]}
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
    raw = sc["raw"]
    return {
        "case": raw["case"], "kind": raw["kind"],
        "src": f"/{rel}/{fname}", "width": w, "height": h,
        "alt": {"es": raw["alt"]["es"], "en": raw["alt"]["en"]},
        "caption": {"es": raw["caption"]["es"], "en": raw["caption"]["en"]},
    }


def check_scene(sc):
    need_files(sc)
    ci = parse_key(sc["key"])
    arr = np.array(open_image(sc["plate_path"], sc["id"]).convert("RGB"))
    found = detect_screens(arr, ci, sc["tolerance"], len(sc["screens"]), screen_opts(sc), True)
    parts = []
    for s, (corners, _, info) in zip(sc["screens"], found):
        w, h = quad_size(corners)
        cs = " ".join(f"({x:.0f},{y:.0f}){' (fuera)' if out else ''}" for (x, y), out in zip(corners, info["outside"]))
        extra = f"residual {info['residual']:.2f} px  {info['mask_pct']:.0f} % del plate  derrame {info['spill']:.1f}"
        if info["spill"] >= SPILL_WARN:
            extra += f"  AVISO: derrame >= {SPILL_WARN:.0f}"
        if info.get("manual"):
            extra += "  (quad manual)"
        parts.append(f"#{s['rank']} ~{w:.0f}x{h:.0f} {cs} {extra}")
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
                if sc["id"].startswith("_") and not a.include_fixtures:
                    print(f"       ({sc['id']} es de prueba: no se escribe en scenes.generated.json; usa --include-fixtures)")
        except (SceneError, OSError, ValueError) as e:
            failed += 1
            print(f"FALLA  {f.stem}: {e}")
    if a.check or failed:
        return 1 if failed else 0
    data = {}
    if a.scene and data_path.is_file():
        data = json.loads(data_path.read_text(encoding="utf-8"))
    data.update(results)
    if not a.include_fixtures:  # las escenas de prueba (_*) nunca llegan al JSON que importa el frontend
        pass
    text = json.dumps({k: data[k] for k in sorted(data)}, indent=2, ensure_ascii=False) + "\n"
    data_path.parent.mkdir(parents=True, exist_ok=True)
    if not data_path.is_file() or data_path.read_text(encoding="utf-8") != text:
        data_path.write_text(text, encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
