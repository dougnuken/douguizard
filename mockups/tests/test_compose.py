import contextlib
import hashlib
import io
import json
import os
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


class ManifestTests(unittest.TestCase):
    """Validacion del manifiesto (duo como base): privacidad, esquema y hash."""

    def duo(self, t, mutate=None):
        root = make_root(t, scene="_fixture-duo")
        p = root / "mockups/scenes/_fixture-duo.json"
        m = json.loads(p.read_text())
        if mutate:
            mutate(m)
        p.write_text(json.dumps(m))
        return root, p

    def load(self, mutate=None):
        with tempfile.TemporaryDirectory() as t:
            root, p = self.duo(t, mutate)
            return compose.load_manifest(p, root)

    def name_of(self, mutate=None):
        with tempfile.TemporaryDirectory() as t:
            root, p = self.duo(t, mutate)
            sc = compose.load_manifest(p, root)
            return compose.content_hash(sc)

    # M1: privacidad tambien en screens[], incluida la SEGUNDA entrada
    def test_privacy_screens_second_entry(self):
        for bad in ("../../../etc/hostname", "/etc/hostname", "mockups/screens/link.jpg", "public/work/../../etc/hostname"):
            with tempfile.TemporaryDirectory() as t:
                def mut(m, bad=bad):
                    m["screens"][1]["source"] = bad
                root, p = self.duo(t, mut)
                (root / "mockups/screens").mkdir(parents=True, exist_ok=True)
                os.symlink("/etc/hostname", root / "mockups/screens/link.jpg")
                r = run(root, "--scene", "_fixture-duo", "--check")
                self.assertNotEqual(r.returncode, 0, bad)
                self.assertIn("captura", r.stdout, bad)
                self.assertIn("FALLA", r.stdout, bad)

    def test_privacy_single_screen_symlink(self):
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t)
            (root / "mockups/screens").mkdir(parents=True, exist_ok=True)
            os.symlink("/etc/hostname", root / "mockups/screens/link.jpg")
            p = root / "mockups/scenes/_fixture.json"
            m = json.loads(p.read_text())
            m["screen"]["source"] = "link.jpg"
            p.write_text(json.dumps(m))
            r = run(root, "--scene", "_fixture", "--check")
            self.assertNotEqual(r.returncode, 0)
            self.assertIn("captura", r.stdout)

    # M3
    def test_screen_and_screens_together_fail(self):
        def mut(m):
            m["screen"] = {"source": "public/work/dc-medical/agenda-dia.webp"}
        with self.assertRaisesRegex(compose.SceneError, "'screen' o 'screens'"):
            self.load(mut)

    def test_rank_duplicate_fails(self):
        def mut(m):
            m["screens"][1]["rank"] = 1
        with self.assertRaisesRegex(compose.SceneError, "rank"):
            self.load(mut)

    def test_rank_out_of_range_fails(self):
        for r in (3, 0, -1):
            def mut(m, r=r):
                m["screens"][1]["rank"] = r
            with self.assertRaisesRegex(compose.SceneError, "rank"):
                self.load(mut)

    def test_more_than_three_screens_fail(self):
        def mut(m):
            m["screens"] = [dict(m["screens"][0], rank=i + 1) for i in range(4)]
        with self.assertRaisesRegex(compose.SceneError, "1 a 3"):
            self.load(mut)

    def test_key_or_tolerance_mismatch_fails(self):
        def mut_key(m):
            m["screens"][1]["key"] = "#FF0000"
        def mut_tol(m):
            m["screens"][1]["tolerance"] = 60
        for mut in (mut_key, mut_tol):
            with self.assertRaisesRegex(compose.SceneError, "key y tolerance"):
                self.load(mut)

    # M4: el nombre versionado depende de fit / glare / rank de cada pantalla
    def test_hash_depends_on_each_screen_param(self):
        base = self.name_of()
        self.assertEqual(base, self.name_of())  # sin cambios: mismo nombre

        def reorder(m):  # mismas claves en otro orden: no cambia nada
            m["screens"] = [dict(reversed(list(x.items()))) for x in m["screens"]]
        self.assertEqual(base, self.name_of(reorder))

        def fit(m):
            m["screens"][1]["fit"] = "contain"
        def glare(m):
            m["screens"][1]["glare"] = 0.3
        def fit0(m):
            m["screens"][0]["fit"] = "contain"
        def rank(m):  # intercambia rank con la MISMA captura en ambas: solo cambia la posicion
            m["screens"][1]["source"] = m["screens"][0]["source"]
            m["screens"][1]["fit"] = "contain"
        base2 = self.name_of(rank)
        def rank_swapped(m):
            rank(m)
            m["screens"][0]["rank"], m["screens"][1]["rank"] = 2, 1
        names = {base, base2, self.name_of(fit), self.name_of(glare), self.name_of(fit0), self.name_of(rank_swapped)}
        self.assertEqual(len(names), 6)

    def test_hash_changes_with_capture_bytes(self):
        with tempfile.TemporaryDirectory() as t:
            root, p = self.duo(t)
            h1 = compose.content_hash(compose.load_manifest(p, root))
            Image.new("RGB", (900, 900), (1, 2, 3)).save(root / "public/work/dc-medical/nota-de-voz-poster.jpg")
            self.assertNotEqual(h1, compose.content_hash(compose.load_manifest(p, root)))

    def test_small_capture_warns_on_stderr(self):
        with tempfile.TemporaryDirectory() as t:
            root, p = self.duo(t)
            Image.new("RGB", (60, 120), (200, 200, 200)).save(root / "public/work/dc-medical/nota-de-voz-poster.jpg")
            sc = compose.load_manifest(p, root)
            err = io.StringIO()
            with contextlib.redirect_stderr(err):
                compose.compose_scene(sc)
            self.assertIn("AVISO", err.getvalue())
            self.assertIn("menor que la pantalla", err.getvalue())

    def test_big_capture_does_not_warn(self):
        with tempfile.TemporaryDirectory() as t:
            root, p = self.duo(t)
            sc = compose.load_manifest(p, root)
            err = io.StringIO()
            with contextlib.redirect_stderr(err):
                compose.compose_scene(sc)
            self.assertNotIn("AVISO", err.getvalue())


if __name__ == "__main__":
    unittest.main()
