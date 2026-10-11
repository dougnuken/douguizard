import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "scripts" / "mockups"))
import compose  # noqa: E402

COMPOSE = REPO / "scripts" / "mockups" / "compose.py"
TRUTH = json.loads((REPO / "mockups/fixtures/plate-fixture.truth.json").read_text())


def make_root(tmp, with_plate=True):
    root = Path(tmp)
    for d in ("mockups/scenes", "mockups/fixtures", "public/work/dc-medical", "src/data"):
        (root / d).mkdir(parents=True, exist_ok=True)
    if with_plate:
        shutil.copy(REPO / "mockups/fixtures/plate-fixture.webp", root / "mockups/fixtures/")
    shutil.copy(REPO / "public/work/dc-medical/nota-de-voz-poster.jpg", root / "public/work/dc-medical/")
    m = json.loads((REPO / "mockups/scenes/_fixture.json").read_text())
    m["output"]["dir"] = "public/work/dc-medical/scenes"
    m["output"]["lossless"] = True
    (root / "mockups/scenes/_fixture.json").write_text(json.dumps(m))
    return root


def run(root, *args):
    return subprocess.run([sys.executable, str(COMPOSE), "--root", str(root), *args], capture_output=True, text=True)


class ComposeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.root = make_root(cls.tmp.name)
        cls.sc = compose.load_manifest(cls.root / "mockups/scenes/_fixture.json", cls.root)
        cls.plate = np.array(Image.open(cls.sc["plate_path"]).convert("RGB"))
        cls.img, cls.info = compose.compose_scene(cls.sc)
        cls.out = np.array(cls.img)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_a_corners_within_2px(self):
        for got, want in zip(self.info["corners"], TRUTH["corners"]):
            self.assertLessEqual(float(np.hypot(got[0] - want[0], got[1] - want[1])), 2.0, (got, want))

    def test_b_finger_pixels_untouched(self):
        W, H = TRUTH["size"]
        m = Image.new("L", (W, H), 0)
        d = ImageDraw.Draw(m)
        d.polygon([tuple(p) for p in TRUTH["finger_polygon"]], fill=255)
        d.ellipse(tuple(TRUTH["finger_ellipse"]), fill=255)
        inner = np.array(m) > 0
        inner = ~compose.dilate(~inner, 4)  # erosiona 4 px: lejos del borde antialias
        # solo la parte del dedo que cae sobre la pantalla (donde el compositor podria tocar)
        near = compose.dilate(compose.key_mask(self.plate, 1, 50), 12)
        sel = inner & near
        self.assertGreater(int(sel.sum()), 2000)
        diff = np.abs(self.out.astype(int) - self.plate.astype(int))[sel]
        self.assertLessEqual(int(diff.max()), 2)

    def test_c_no_green_halo(self):
        ci = 1
        comp = compose.largest_component(compose.key_mask(self.plate, ci, 50))
        ring = compose.dilate(comp, 6) & ~compose.dilate(comp, 2)
        o = self.out.astype(int)
        halo = (o[..., 1] - np.maximum(o[..., 0], o[..., 2]) > 40) & ring
        self.assertEqual(int(halo.sum()), 0)

    def test_d_deterministic(self):
        with tempfile.TemporaryDirectory() as t2:
            root = make_root(t2)
            outs = []
            for _ in range(2):
                r = run(root, "--all", "--no-cache")
                self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
                webp = sorted((root / "public/work/dc-medical/scenes").glob("_fixture.*.webp"))
                self.assertEqual(len(webp), 1)
                data = (root / "src/data/scenes.generated.json").read_bytes()
                outs.append((webp[0].name, hashlib.sha256(webp[0].read_bytes()).hexdigest(), data))
            self.assertEqual(outs[0], outs[1])
            self.assertRegex(outs[0][0], r"^_fixture\.[0-9a-f]{8}\.webp$")
            self.assertTrue(outs[0][2].endswith(b"}\n"))

    def test_e_check_fails_without_plate(self):
        with tempfile.TemporaryDirectory() as t3:
            root = make_root(t3, with_plate=False)
            r = run(root, "--all", "--check")
            self.assertNotEqual(r.returncode, 0)
            self.assertIn("FALLA", r.stdout)
            self.assertFalse((root / "src/data/scenes.generated.json").exists())


if __name__ == "__main__":
    unittest.main()
