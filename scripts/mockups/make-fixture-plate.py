#!/usr/bin/env python3
"""Genera un plate SINTETICO de prueba (celular en perspectiva, pantalla #00FF00, dedo que tapa una esquina).

Salida: mockups/fixtures/plate-fixture.webp y plate-fixture.truth.json (esquinas exactas). Sin creditos.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
from compose import apply_persp, persp_coeffs  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
W, H, S = 1600, 1200, 2
Q = [(600, 140), (1010, 185), (985, 1090), (580, 1035)]  # TL TR BR BL (continuas, resolucion final)
SW, SH, M = 920, 2000, 160  # espacio unitario de la pantalla y margen


def unit_mask(margin, radius):
    im = Image.new("L", (SW + 2 * M, SH + 2 * M), 0)
    ImageDraw.Draw(im).rounded_rectangle(
        (M - margin, M - margin, M + SW + margin - 1, M + SH + margin - 1), radius=radius, fill=255)
    return im


def warp(mask_img):
    fwd = persp_coeffs([(M, M), (M + SW, M), (M + SW, M + SH), (M, M + SH)], [(x * S, y * S) for x, y in Q])
    Wi, Hi = mask_img.size
    rect = [(0, 0), (Wi, 0), (Wi, Hi), (0, Hi)]
    back = persp_coeffs(apply_persp(fwd, rect), rect)
    return mask_img.transform((W * S, H * S), Image.PERSPECTIVE, tuple(back), Image.BICUBIC)


def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def main():
    yy, xx = np.mgrid[0:H * S, 0:W * S].astype(np.float32)
    t = (xx / (W * S) * 0.45 + yy / (H * S) * 0.55)[..., None]
    c0, c1 = np.array([247, 238, 226], np.float32), np.array([210, 180, 152], np.float32)
    bg = c0 * (1 - t) + c1 * t
    glow = np.exp(-(((xx - 0.2 * W * S) ** 2 + (yy - 0.15 * H * S) ** 2) / (2 * (0.35 * W * S) ** 2)))[..., None]
    bg = np.clip(bg + glow * 14, 0, 255)

    body = warp(unit_mask(60, 190))
    bezel = warp(unit_mask(14, 150))
    screen = warp(unit_mask(0, 130))

    shadow = Image.new("L", body.size, 0)
    shadow.paste(body, (40 * S, 70 * S))
    shadow = np.asarray(shadow.filter(ImageFilter.GaussianBlur(45 * S)), np.float32)[..., None] / 255.0
    img = bg * (1 - 0.45 * shadow) + np.array([70, 40, 25], np.float32) * 0.45 * shadow

    def paste(img, mask, color):
        a = np.asarray(mask, np.float32)[..., None] / 255.0
        return img * (1 - a) + np.array(color, np.float32) * a

    img = paste(img, body, (36, 35, 38))
    img = paste(img, bezel, (8, 8, 10))
    img = paste(img, screen, (0, 255, 0))

    TL, TR, BR, BL = Q
    ra, ba = lerp(TR, BR, 0.80), lerp(BL, BR, 0.75)
    tip = (BR[0] - 95, BR[1] - 150)
    finger = [(ra[0] + 220, ra[1] - 40), ra, tip, ba, (ba[0] - 30, ba[1] + 240), (BR[0] + 320, BR[1] + 320)]
    layer = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB")
    d = ImageDraw.Draw(layer)
    skin = (226, 176, 146)
    d.polygon([(x * S, y * S) for x, y in finger], fill=skin)
    d.ellipse(((tip[0] - 8) * S, (tip[1] - 8) * S, (tip[0] + 48) * S, (tip[1] + 48) * S), fill=skin)
    out = layer.resize((W, H), Image.LANCZOS)

    fx = ROOT / "mockups" / "fixtures"
    fx.mkdir(parents=True, exist_ok=True)
    out.save(fx / "plate-fixture.webp", "WEBP", lossless=True)
    truth = {"size": [W, H], "corners": [list(p) for p in Q], "finger_polygon": [list(p) for p in finger],
             "finger_ellipse": [tip[0] - 8, tip[1] - 8, tip[0] + 48, tip[1] + 48], "skin": list(skin)}
    (fx / "plate-fixture.truth.json").write_text(json.dumps(truth, indent=2) + "\n", encoding="utf-8")
    print("ok  mockups/fixtures/plate-fixture.webp + .truth.json")


if __name__ == "__main__":
    main()
