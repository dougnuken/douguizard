#!/usr/bin/env python3
"""Genera plates SINTETICOS de prueba (pantalla #00FF00 plana), sin creditos.

- plate-fixture.webp: celular en perspectiva + dedo que tapa una esquina.
- plate-fixture-duo.webp: laptop + celular (dos pantallas, para el soporte de `screens`).
- plate-cropped.webp (`--cropped`): tableta que el encuadre corta por arriba y por la derecha, con la esquina TR fuera.
Cada uno con su .truth.json (esquinas exactas, continuas, resolucion final). Salida: mockups/fixtures/.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
from compose import apply_persp, persp_coeffs  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
W, H, S = 1600, 1200, 2
M = 160  # margen del espacio unitario


class Device:
    def __init__(self, quad, sw, sh, body=60, body_r=190, bezel=14, bezel_r=150, screen_r=130, color=(36, 35, 38)):
        self.Q, self.SW, self.SH = quad, sw, sh
        self.body, self.body_r, self.bezel, self.bezel_r, self.screen_r, self.color = body, body_r, bezel, bezel_r, screen_r, color

    def unit_mask(self, margin, radius):
        im = Image.new("L", (self.SW + 2 * M, self.SH + 2 * M), 0)
        ImageDraw.Draw(im).rounded_rectangle(
            (M - margin, M - margin, M + self.SW + margin - 1, M + self.SH + margin - 1), radius=radius, fill=255)
        return im

    def warp(self, mask_img):
        fwd = persp_coeffs([(M, M), (M + self.SW, M), (M + self.SW, M + self.SH), (M, M + self.SH)],
                           [(x * S, y * S) for x, y in self.Q])
        Wi, Hi = mask_img.size
        rect = [(0, 0), (Wi, 0), (Wi, Hi), (0, Hi)]
        back = persp_coeffs(apply_persp(fwd, rect), rect)
        return mask_img.transform((W * S, H * S), Image.PERSPECTIVE, tuple(back), Image.BICUBIC)


def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def background():
    yy, xx = np.mgrid[0:H * S, 0:W * S].astype(np.float32)
    t = (xx / (W * S) * 0.45 + yy / (H * S) * 0.55)[..., None]
    c0, c1 = np.array([247, 238, 226], np.float32), np.array([210, 180, 152], np.float32)
    bg = c0 * (1 - t) + c1 * t
    glow = np.exp(-(((xx - 0.2 * W * S) ** 2 + (yy - 0.15 * H * S) ** 2) / (2 * (0.35 * W * S) ** 2)))[..., None]
    return np.clip(bg + glow * 14, 0, 255)


def render(devices):
    img = background()

    def paste(img, mask, color):
        a = np.asarray(mask, np.float32)[..., None] / 255.0
        return img * (1 - a) + np.array(color, np.float32) * a

    for d in devices:
        body, bezel, screen = d.warp(d.unit_mask(d.body, d.body_r)), d.warp(d.unit_mask(d.bezel, d.bezel_r)), d.warp(d.unit_mask(0, d.screen_r))
        shadow = Image.new("L", body.size, 0)
        shadow.paste(body, (40 * S, 70 * S))
        sh = np.asarray(shadow.filter(ImageFilter.GaussianBlur(45 * S)), np.float32)[..., None] / 255.0
        img = img * (1 - 0.45 * sh) + np.array([70, 40, 25], np.float32) * 0.45 * sh
        img = paste(img, body, d.color)
        img = paste(img, bezel, (8, 8, 10))
        img = paste(img, screen, (0, 255, 0))
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB")


def save(name, img, truth):
    fx = ROOT / "mockups" / "fixtures"
    fx.mkdir(parents=True, exist_ok=True)
    img.resize((W, H), Image.LANCZOS).save(fx / f"{name}.webp", "WEBP", lossless=True)
    (fx / f"{name}.truth.json").write_text(json.dumps(truth, indent=2) + "\n", encoding="utf-8")
    print(f"ok  mockups/fixtures/{name}.webp + .truth.json")


def single():
    Q = [(600, 140), (1010, 185), (985, 1090), (580, 1035)]  # TL TR BR BL
    layer = render([Device(Q, 920, 2000)])
    TL, TR, BR, BL = Q
    ra, ba = lerp(TR, BR, 0.80), lerp(BL, BR, 0.75)
    tip = (BR[0] - 95, BR[1] - 150)
    finger = [(ra[0] + 220, ra[1] - 40), ra, tip, ba, (ba[0] - 30, ba[1] + 240), (BR[0] + 320, BR[1] + 320)]
    d = ImageDraw.Draw(layer)
    skin = (226, 176, 146)
    d.polygon([(x * S, y * S) for x, y in finger], fill=skin)
    d.ellipse(((tip[0] - 8) * S, (tip[1] - 8) * S, (tip[0] + 48) * S, (tip[1] + 48) * S), fill=skin)
    save("plate-fixture", layer, {
        "size": [W, H], "corners": [list(p) for p in Q], "finger_polygon": [list(p) for p in finger],
        "finger_ellipse": [tip[0] - 8, tip[1] - 8, tip[0] + 48, tip[1] + 48], "skin": list(skin)})


def duo():
    laptop = [(170, 250), (880, 215), (890, 690), (160, 715)]
    phone = [(1100, 330), (1330, 350), (1315, 850), (1085, 830)]
    devs = [Device(laptop, 1600, 1000, body=50, body_r=40, bezel=10, bezel_r=24, screen_r=10, color=(176, 172, 168)),
            Device(phone, 920, 2000)]
    img = render(devs)
    # rank 1 = la de mayor area (laptop)
    save("plate-fixture-duo", img, {"size": [W, H], "screens": [
        {"rank": 1, "corners": [list(p) for p in laptop]}, {"rank": 2, "corners": [list(p) for p in phone]}]})


def cropped():
    Q = [(520, 60), (1640, -60), (1560, 980), (500, 1040)]  # TL TR BR BL; TR queda fuera del plate
    img = render([Device(Q, 2200, 1850, body=70, body_r=130, bezel=16, bezel_r=100, screen_r=70, color=(120, 118, 124))])
    save("plate-cropped", img, {"size": [W, H], "corners": [list(p) for p in Q], "note": "TR fuera: cortado por arriba y por la derecha"})


def make_capture(name, w, h):
    """Captura SINTETICA (no real) para las pruebas: texto fino y bloques pastel, para ver nitidez y recortes."""
    img = Image.new("RGB", (w, h), (244, 241, 252))
    d = ImageDraw.Draw(img)
    f1, f2, f3 = (ImageFont.load_default(size=int(w * k)) for k in (0.07, 0.045, 0.032))
    d.rectangle((0, 0, w, int(h * 0.07)), fill=(222, 214, 246))
    d.text((int(w * 0.05), int(h * 0.018)), "Panel de prueba", font=f2, fill=(52, 36, 110))
    d.text((int(w * 0.05), int(h * 0.10)), "Resumen sintetico", font=f1, fill=(30, 24, 60))
    palette = [(214, 200, 250), (252, 214, 236), (200, 232, 250), (232, 224, 250)]
    y, i = int(h * 0.19), 0
    while y + int(h * 0.12) < h * 0.93:
        d.rounded_rectangle((int(w * 0.05), y, int(w * 0.95), y + int(h * 0.10)), radius=int(w * 0.03), fill=palette[i % 4])
        d.text((int(w * 0.09), y + int(h * 0.018)), f"Tarjeta {i + 1}: texto de ejemplo", font=f2, fill=(30, 24, 60))
        d.text((int(w * 0.09), y + int(h * 0.058)), "Linea fina 0123456789 abcdefg", font=f3, fill=(80, 70, 120))
        y += int(h * 0.12)
        i += 1
    d.rounded_rectangle((int(w * 0.05), int(h * 0.94), int(w * 0.95), int(h * 0.985)), radius=int(w * 0.02), fill=(92, 70, 200))
    d.text((int(w * 0.36), int(h * 0.949)), "Guardar", font=f2, fill=(255, 255, 255))
    out = ROOT / "mockups" / "screens"
    out.mkdir(parents=True, exist_ok=True)
    img.save(out / f"{name}.webp", "WEBP", lossless=True)
    print(f"ok  mockups/screens/{name}.webp")


if __name__ == "__main__":
    make_capture("fixture-portrait", 786, 1704)
    make_capture("fixture-landscape", 1440, 900)
    if "--cropped" in sys.argv[1:]:
        cropped()
    else:
        single()
        duo()
        cropped()
