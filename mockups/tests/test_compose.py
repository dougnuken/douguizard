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
TRUTH_DUO = json.loads((REPO / "mockups/fixtures/plate-fixture-duo.truth.json").read_text())


def make_root(tmp, with_plate=True, scene="_fixture"):
    root = Path(tmp)
    for d in ("mockups/scenes", "mockups/fixtures", "public/work/dc-medical", "src/data"):
        (root / d).mkdir(parents=True, exist_ok=True)
    if with_plate:
        for f in (REPO / "mockups/fixtures").glob("plate-fixture*.webp"):
            shutil.copy(f, root / "mockups/fixtures/")
    for f in (REPO / "public/work/dc-medical").glob("*"):
        if f.suffix in (".jpg", ".webp"):
            shutil.copy(f, root / "public/work/dc-medical/")
    m = json.loads((REPO / f"mockups/scenes/{scene}.json").read_text())
    m["output"]["lossless"] = True
    (root / f"mockups/scenes/{scene}.json").write_text(json.dumps(m))
    return root


def run(root, *args):
    return subprocess.run([sys.executable, str(COMPOSE), "--root", str(root), *args], capture_output=True, text=True)


def write_plate(root, arr):
    Image.fromarray(arr).save(root / "mockups/fixtures/plate-fixture.webp", "WEBP", lossless=True)


def green_plate(rects):
    a = np.full((600, 900, 3), (230, 215, 200), np.uint8)
    for x0, y0, x1, y1 in rects:
        a[y0:y1, x0:x1] = (0, 255, 0)
    return a


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
        inner = ~compose.dilate(~(np.array(m) > 0), 4)
        near = compose.dilate(compose.key_mask(self.plate, 1, 50), 12)
        sel = inner & near
        self.assertGreater(int(sel.sum()), 2000)
        diff = np.abs(self.out.astype(int) - self.plate.astype(int))[sel]
        self.assertLessEqual(int(diff.max()), 2)

    def test_c_no_green_halo(self):
        # plate con un halo verde (exceso 45: bajo la tolerancia, no es clave) a 2-5 px de la pantalla
        comp = compose.largest_component(compose.key_mask(self.plate, 1, 50))
        halo = compose.dilate(comp, 5) & ~compose.dilate(comp, 1)
        dirty = self.plate.copy()
        dirty[halo] = (100, 145, 100)
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t)
            write_plate(root, dirty)
            sc = compose.load_manifest(root / "mockups/scenes/_fixture.json", root)
            out = np.array(compose.compose_scene(sc)[0]).astype(int)
        ring = compose.dilate(comp, 6) & ~comp
        excess = lambda a: a[..., 1] - np.maximum(a[..., 0], a[..., 2])
        self.assertGreater(int(((excess(dirty.astype(int)) > 40) & ring).sum()), 1000)  # el halo existe en el plate
        self.assertEqual(int(((excess(out) > 40) & ring).sum()), 0)

    def test_d_deterministic(self):
        with tempfile.TemporaryDirectory() as t2:
            root = make_root(t2)
            outs = []
            for _ in range(2):
                r = run(root, "--all", "--include-fixtures", "--no-cache")
                self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
                webp = sorted((root / "public/work/dc-medical/scenes").glob("_fixture.*.webp"))
                self.assertEqual(len(webp), 1)
                data = (root / "src/data/scenes.generated.json").read_bytes()
                outs.append((webp[0].name, hashlib.sha256(webp[0].read_bytes()).hexdigest(), data))
            self.assertEqual(outs[0], outs[1])
            self.assertRegex(outs[0][0], r"^_fixture\.[0-9a-f]{8}\.webp$")
            self.assertTrue(outs[0][2].endswith(b"}\n"))

    def test_d2_all_skips_fixtures_and_writes_empty_json(self):
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t)
            for _ in range(2):
                r = run(root, "--all")
                self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
                self.assertEqual((root / "src/data/scenes.generated.json").read_text(), "{}\n")
            self.assertFalse((root / "public/work/dc-medical/scenes").exists())

    def test_e_check_fails_without_plate(self):
        with tempfile.TemporaryDirectory() as t3:
            root = make_root(t3, with_plate=False)
            r = run(root, "--all", "--include-fixtures", "--check")
            self.assertNotEqual(r.returncode, 0)
            self.assertIn("FALLA", r.stdout)
            self.assertFalse((root / "src/data/scenes.generated.json").exists())

    def test_f_two_regions_without_screens_fails(self):
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t)
            write_plate(root, green_plate([(100, 100, 400, 500), (500, 100, 800, 500)]))
            r = run(root, "--scene", "_fixture", "--check")
            self.assertNotEqual(r.returncode, 0)
            self.assertIn("screens", r.stdout)

    def test_g_mask_touching_border_fails(self):
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t)
            write_plate(root, green_plate([(0, 100, 400, 500)]))
            r = run(root, "--scene", "_fixture", "--check")
            self.assertNotEqual(r.returncode, 0)
            self.assertIn("borde", r.stdout)

    def test_h_plate_path_escape_fails(self):
        for bad in ("../../../etc/hostname", "/etc/hostname", "../scenes/_fixture.json"):
            with tempfile.TemporaryDirectory() as t:
                root = make_root(t)
                p = root / "mockups/scenes/_fixture.json"
                m = json.loads(p.read_text())
                m["plate"] = bad
                p.write_text(json.dumps(m))
                r = run(root, "--scene", "_fixture", "--check")
                self.assertNotEqual(r.returncode, 0, bad)
                self.assertIn("plate fuera de", r.stdout)

    def test_i_id_with_trailing_newline_rejected(self):
        self.assertIsNone(compose.ID_RE.fullmatch("abc\n"))


class DuoTests(unittest.TestCase):
    def test_duo_corners_and_captures(self):
        colors = [(200, 40, 40), (40, 40, 200)]
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t, scene="_fixture-duo")
            for i, c in enumerate(colors):
                Image.new("RGB", (1200, 1200), c).save(root / f"public/work/dc-medical/solid{i}.jpg", quality=100)
            p = root / "mockups/scenes/_fixture-duo.json"
            m = json.loads(p.read_text())
            for i, s in enumerate(m["screens"]):
                s["source"] = f"public/work/dc-medical/solid{i}.jpg"
            p.write_text(json.dumps(m))
            sc = compose.load_manifest(p, root)
            img, info = compose.compose_scene(sc)
            out = np.array(img).astype(int)
            self.assertEqual(len(info["screens"]), 2)
            for got, want, color in zip(info["screens"], TRUTH_DUO["screens"], colors):
                for g, w in zip(got["corners"], want["corners"]):
                    self.assertLessEqual(float(np.hypot(g[0] - w[0], g[1] - w[1])), 2.0, (g, w))
                cx, cy = (int(v) for v in np.mean(want["corners"], axis=0))
                patch = out[cy - 10:cy + 10, cx - 10:cx + 10].reshape(-1, 3).mean(0)
                self.assertLessEqual(float(np.abs(patch - np.array(color)).max()), 6.0, (patch, color))

    def test_duo_declared_one_fails(self):
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t, scene="_fixture")
            shutil.copy(REPO / "mockups/fixtures/plate-fixture-duo.webp", root / "mockups/fixtures/plate-fixture.webp")
            r = run(root, "--scene", "_fixture", "--check")
            self.assertNotEqual(r.returncode, 0)
            self.assertIn("screens", r.stdout)


if __name__ == "__main__":
    unittest.main()
