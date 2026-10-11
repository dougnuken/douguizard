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
from unittest import mock
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "scripts" / "mockups"))
import compose  # noqa: E402

COMPOSE = REPO / "scripts" / "mockups" / "compose.py"
TRUTH = json.loads((REPO / "mockups/fixtures/plate-fixture.truth.json").read_text())
TRUTH_DUO = json.loads((REPO / "mockups/fixtures/plate-fixture-duo.truth.json").read_text())
TRUTH_CROP = json.loads((REPO / "mockups/fixtures/plate-cropped.truth.json").read_text())


def make_root(tmp, with_plate=True, scene="_fixture"):
    """Raiz de repo temporal con fixtures SINTETICOS (ninguna captura real)."""
    root = Path(tmp)
    for d in ("mockups/scenes", "mockups/fixtures", "mockups/screens", "public/work/dc-medical", "src/data"):
        (root / d).mkdir(parents=True, exist_ok=True)
    if with_plate:
        for f in (REPO / "mockups/fixtures").glob("plate-*.webp"):
            shutil.copy(f, root / "mockups/fixtures/")
    for f in (REPO / "mockups/screens").glob("fixture-*.webp"):
        shutil.copy(f, root / "mockups/screens/")
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
            m["screen"] = {"source": "mockups/screens/fixture-landscape.webp"}
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
            Image.new("RGB", (900, 900), (1, 2, 3)).save(root / "mockups/screens/fixture-portrait.webp", "WEBP", lossless=True)
            self.assertNotEqual(h1, compose.content_hash(compose.load_manifest(p, root)))

    def test_small_capture_warns_on_stderr(self):
        with tempfile.TemporaryDirectory() as t:
            root, p = self.duo(t)
            Image.new("RGB", (60, 120), (200, 200, 200)).save(root / "mockups/screens/fixture-portrait.webp", "WEBP", lossless=True)
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


# ------------------------------------------------------------------ U2b-artista: el JSON generado trae los textos

class JsonOutputTests(unittest.TestCase):
    KEYS = {"case", "kind", "src", "width", "height", "alt", "caption"}

    def clone(self, root, new_id):
        m = json.loads((root / "mockups/scenes/_fixture.json").read_text())
        m["id"] = new_id
        (root / f"mockups/scenes/{new_id}.json").write_text(json.dumps(m))
        return m

    def test_entry_shape_and_order(self):
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t)
            m = self.clone(root, "scene-b")
            self.clone(root, "scene-a")
            r = run(root, "--all", "--include-fixtures")
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
            data = json.loads((root / "src/data/scenes.generated.json").read_text())
            self.assertEqual(list(data), sorted(data))
            self.assertEqual(set(data), {"_fixture", "scene-a", "scene-b"})
            for v in data.values():
                self.assertTrue(self.KEYS <= set(v), v)
                self.assertEqual(list(v)[:5], ["case", "kind", "src", "width", "height"])
            e = data["scene-b"]
            self.assertEqual((e["case"], e["kind"], e["alt"], e["caption"]), (m["case"], m["kind"], m["alt"], m["caption"]))
            self.assertRegex(e["src"], r"^/work/dc-medical/scenes/scene-b\.[0-9a-f]{8}\.webp$")
            self.assertEqual((e["width"], e["height"]), (1600, 1200))

    def test_underscore_ids_never_in_default_json(self):
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t)
            self.clone(root, "scene-a")
            (root / "src/data/scenes.generated.json").write_text('{"_old": {"src": "/x"}}\n')
            for args in (("--all",), ("--scene", "scene-a"), ("--scene", "_fixture")):
                r = run(root, *args)
                self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
                text = (root / "src/data/scenes.generated.json").read_text()
                self.assertNotIn('"_', text)
            self.assertIn('"scene-a"', text)

    def test_scene_keeps_other_entries(self):
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t)
            self.clone(root, "scene-a")
            self.clone(root, "scene-b")
            self.assertEqual(run(root, "--all").returncode, 0)
            before = json.loads((root / "src/data/scenes.generated.json").read_text())
            m = json.loads((root / "mockups/scenes/scene-b.json").read_text())
            m["caption"]["es"] = "Otro texto"
            (root / "mockups/scenes/scene-b.json").write_text(json.dumps(m))
            self.assertEqual(run(root, "--scene", "scene-b").returncode, 0)
            after = json.loads((root / "src/data/scenes.generated.json").read_text())
            self.assertEqual(after["scene-a"], before["scene-a"])
            self.assertEqual(after["scene-b"]["caption"]["es"], "Otro texto")
            self.assertEqual(after["scene-b"]["src"], before["scene-b"]["src"])  # solo cambia el texto, no la imagen


# ------------------------------------------------------------------ U3a: pantallas recortadas, quad, sheen

def assert_corners_close(got, want, tol_visible=2.0, tol_out=6.0, size=(1600, 1200)):
    W, H = size
    for g, w in zip(got, want):
        out = not (0 <= w[0] <= W and 0 <= w[1] <= H)
        d = float(np.hypot(g[0] - w[0], g[1] - w[1]))
        if d > (tol_out if out else tol_visible):
            raise AssertionError(f"esquina {g} a {d:.1f} px de {w}")


def cropped_fixture_info(**mut):
    arr = np.array(Image.open(REPO / "mockups/fixtures/plate-cropped.webp").convert("RGB"))
    corners, comp, info = compose.detect_screens(arr, 1, 50, 1, [{"cropped": True}], True)[0]
    return corners, comp, info


def border_plate(poly, size=(1000, 800)):
    im = Image.new("RGB", size, (230, 215, 200))
    ImageDraw.Draw(im).polygon(poly, fill=(0, 255, 0))
    return np.array(im)


def sample_map_error(corners, comp, truth):
    """Mapea 25 puntos de la mascara visible con la homografia detectada y con la verdadera: error maximo en px."""
    unit = [(0, 0), (1, 0), (1, 1), (0, 1)]
    Ht = compose.persp_coeffs(unit, truth)
    Hd = compose.persp_coeffs(unit, corners)
    Hinv = compose.persp_coeffs(truth, unit)
    inner = ~compose.dilate(~comp, 8)
    ys, xs = np.nonzero(inner)
    idx = np.linspace(0, len(xs) - 1, 25).astype(int)
    pts = [(float(xs[i]) + 0.5, float(ys[i]) + 0.5) for i in idx]
    u = compose.apply_persp(Hinv, pts)
    back = compose.apply_persp(Hd, u)
    return max(float(np.hypot(a[0] - b[0], a[1] - b[1])) for a, b in zip(pts, back))


class CroppedTests(unittest.TestCase):
    def test_a_cropped_fixture_corners_and_mapping(self):
        corners, comp, info = cropped_fixture_info()
        assert_corners_close(corners, TRUTH_CROP["corners"])
        self.assertEqual(info["outside"], [False, True, False, False])
        self.assertLessEqual(info["residual"], 1.5)
        self.assertLessEqual(sample_map_error(corners, comp, TRUTH_CROP["corners"]), 1.5)

    def test_b_real_plate_check_and_no_green_left(self):
        r = subprocess.run([sys.executable, str(COMPOSE), "--scene", "_light-tablet-b", "--check"], capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("(fuera)", r.stdout)
        res = float(r.stdout.split("residual ")[1].split(" px")[0])
        self.assertLessEqual(res, 1.5)
        sc = compose.load_manifest(REPO / "mockups/scenes/_light-tablet-b.json", REPO)
        img, info = compose.compose_scene(sc)
        arr = np.array(Image.open(sc["plate_path"]).convert("RGB"))
        comp = compose.largest_component(compose.key_mask(arr, 1, 50))
        o = np.array(img).astype(int)
        residual_green = (o[..., 1] > 200) & (o[..., 0] < 60) & (o[..., 2] < 60) & compose.dilate(comp, 2)
        self.assertEqual(int(residual_green.sum()), 0)
        ring = compose.dilate(comp, 6) & ~comp
        self.assertEqual(int(((o[..., 1] - np.maximum(o[..., 0], o[..., 2]) > 40) & ring).sum()), 0)

    def test_c_not_cropped_still_fails_at_border(self):
        arr = np.array(Image.open(REPO / "mockups/fixtures/plate-cropped.webp").convert("RGB"))
        with self.assertRaisesRegex(compose.SceneError, "toca el borde"):
            compose.detect_screens(arr, 1, 50, 1, [{"cropped": False}], True)

    def test_d_three_visible_sides_fail(self):
        a = border_plate([(100, 100), (1100, 120), (1090, 700), (110, 720)])
        with self.assertRaisesRegex(compose.SceneError, r"solo se ven 3 de 4 lados \(faltan: derecha\)"):
            compose.detect_screens(a, 1, 50, 1, [{"cropped": True}], True)

    def test_e_mutation_border_exclusion(self):
        corners, comp, info = cropped_fixture_info()
        self.assertEqual(info["border_points"], 0)
        with mock.patch.object(compose, "BORDER_EXCL", 0):
            _, _, bad = cropped_fixture_info()
        self.assertGreater(bad["border_points"], 0)  # sin la exclusion el borde del encuadre entra al ajuste

    def test_e_mutation_trim_at_border_ends(self):
        a = border_plate([(100, -6), (900, 20), (890, 760), (110, 780)])
        def left_extent():
            return compose.detect_screens(a, 1, 50, 1, [{"cropped": True}], True)[0][2]["extents"][3]
        good = left_extent()
        self.assertGreater(good, 650)
        with mock.patch.object(compose, "TRIM_AT_BORDER", True):
            self.assertLess(left_extent(), 650)  # el lado izquierdo pierde el tramo junto al borde

    def test_e_mutation_shifted_corner_rejected(self):
        corners, _, _ = cropped_fixture_info()
        assert_corners_close(corners, TRUTH_CROP["corners"])
        shifted = [list(p) for p in TRUTH_CROP["corners"]]
        shifted[2][0] += 3
        with self.assertRaises(AssertionError):
            assert_corners_close(corners, shifted)

    def test_quad_manual_validated(self):
        arr = np.array(Image.open(REPO / "mockups/fixtures/plate-cropped.webp").convert("RGB"))
        good = compose.detect_screens(arr, 1, 50, 1, [{"quad": TRUTH_CROP["corners"]}], True)[0]
        self.assertTrue(good[2]["manual"])
        self.assertLessEqual(good[2]["residual"], 1.5)
        bad = [list(p) for p in TRUTH_CROP["corners"]]
        bad[2][0] += 8
        bad[3][0] += 8
        with self.assertRaisesRegex(compose.SceneError, "quad"):
            compose.detect_screens(arr, 1, 50, 1, [{"quad": bad}], True)
        # desplazado 3,5 px: sigue dentro de la ventana de puntos, pero el residual lo delata
        near = [[x + 3.5, y] for x, y in TRUTH_CROP["corners"]]
        with self.assertRaisesRegex(compose.SceneError, "residual"):
            compose.detect_screens(arr, 1, 50, 1, [{"quad": near}], True)

    def test_residual_limit_is_wired(self):
        arr = np.array(Image.open(REPO / "mockups/fixtures/plate-cropped.webp").convert("RGB"))
        compose.detect_screens(arr, 1, 50, 1, [{"cropped": True}], True)  # limpio: pasa
        with mock.patch.object(compose, "MAX_RESIDUAL", 0.01):
            with self.assertRaisesRegex(compose.SceneError, "residual"):
                compose.detect_screens(arr, 1, 50, 1, [{"cropped": True}], True)

    def test_spill_warn_and_fail(self):
        def plate(bg):
            a = np.full((600, 900, 3), bg, np.uint8)
            a[150:450, 250:650] = (0, 255, 0)
            return a
        info = compose.detect_screens(plate((120, 140, 120)), 1, 50, 1, None, True)[0][2]
        self.assertGreaterEqual(info["spill"], compose.SPILL_WARN)
        self.assertLess(info["spill"], compose.SPILL_FAIL)
        with self.assertRaisesRegex(compose.SceneError, "derrame"):
            compose.detect_screens(plate((100, 150, 100)), 1, 50, 1, None, True)

    def test_check_line_reports_residual_and_percent(self):
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t, scene="_fixture-cropped")
            r = run(root, "--scene", "_fixture-cropped", "--check")
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
            self.assertIn("(fuera)", r.stdout)
            self.assertRegex(r.stdout, r"residual 0\.\d\d px  \d+ % del plate")

    def test_cropped_manifest_privacy_and_types(self):
        for bad in ("../../../etc/hostname", "/etc/hostname"):
            with tempfile.TemporaryDirectory() as t:
                root = make_root(t, scene="_fixture-cropped")
                p = root / "mockups/scenes/_fixture-cropped.json"
                m = json.loads(p.read_text())
                m["screen"]["source"] = bad
                p.write_text(json.dumps(m))
                r = run(root, "--scene", "_fixture-cropped", "--check")
                self.assertNotEqual(r.returncode, 0)
                self.assertIn("captura", r.stdout)
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t, scene="_fixture-cropped")
            p = root / "mockups/scenes/_fixture-cropped.json"
            for key, val in (("cropped", "si"), ("quad", [[0, 0]]), ("sheen", {"amount": 2, "angle": 0}), ("sheen", {"amount": 0.5})):
                m = json.loads(p.read_text())
                m["screen"][key] = val
                p.write_text(json.dumps(m))
                with self.assertRaises(compose.SceneError, msg=(key, val)):
                    compose.load_manifest(p, root)


class SheenTests(unittest.TestCase):
    def build(self, sheen):
        with tempfile.TemporaryDirectory() as t:
            root = make_root(t)
            p = root / "mockups/scenes/_fixture.json"
            m = json.loads(p.read_text())
            if sheen is not None:
                m["screen"]["sheen"] = sheen
            p.write_text(json.dumps(m))
            sc = compose.load_manifest(p, root)
            img, info = compose.compose_scene(sc)
            return np.array(img).astype(int), compose.content_hash(sc), info

    def test_amount_zero_is_identical_to_absent(self):
        a, ha, _ = self.build(None)
        b, hb, _ = self.build({"amount": 0, "angle": 90})
        self.assertTrue((a == b).all())
        self.assertEqual(ha, hb)

    def test_sheen_brightens_origin_and_spares_fingers(self):
        base, h0, _ = self.build(None)
        glow, h1, info = self.build({"amount": 0.5, "angle": 0})  # nace en el borde izquierdo
        self.assertNotEqual(h0, h1)
        (TL, TR, BR, BL) = [np.array(c) for c in info["corners"]]
        left = ((TL + BL) / 2 * 0.92 + (TR + BR) / 2 * 0.08).astype(int)  # cerca del borde izquierdo
        right = ((TL + BL) / 2 * 0.15 + (TR + BR) / 2 * 0.85).astype(int)
        def patch(a, c):
            return a[c[1] - 6:c[1] + 6, c[0] - 6:c[0] + 6].mean()
        self.assertGreater(patch(glow, left) - patch(base, left), 3.0)
        self.assertLess(abs(patch(glow, right) - patch(base, right)), 3.0)
        # dedos: identicos al plate aunque el brillo nazca justo donde esta el dedo (borde derecho, angulo 180)
        glow, _, _ = self.build({"amount": 1.0, "angle": 180})
        plate = np.array(Image.open(REPO / "mockups/fixtures/plate-fixture.webp").convert("RGB")).astype(int)
        W, H = TRUTH["size"]
        m = Image.new("L", (W, H), 0)
        d = ImageDraw.Draw(m)
        d.polygon([tuple(p) for p in TRUTH["finger_polygon"]], fill=255)
        d.ellipse(tuple(TRUTH["finger_ellipse"]), fill=255)
        inner = ~compose.dilate(~(np.array(m) > 0), 4) & compose.dilate(compose.key_mask(plate.astype(np.uint8), 1, 50), 12)
        self.assertGreater(int(inner.sum()), 2000)
        self.assertLessEqual(int(np.abs(glow - plate)[inner].max()), 2)

    def test_hash_depends_on_cropped_quad_sheen(self):
        names = set()
        for mod in (None, ("sheen", {"amount": 0.5, "angle": 10}), ("sheen", {"amount": 0.5, "angle": 20}),
                    ("sheen", {"amount": 0.7, "angle": 10}), ("cropped", True),
                    ("quad", [list(map(float, p)) for p in TRUTH["corners"]])):
            with tempfile.TemporaryDirectory() as t:
                root = make_root(t)
                p = root / "mockups/scenes/_fixture.json"
                m = json.loads(p.read_text())
                if mod:
                    m["screen"][mod[0]] = mod[1]
                p.write_text(json.dumps(m))
                names.add(compose.content_hash(compose.load_manifest(p, root)))
        self.assertEqual(len(names), 6)

    def test_algo_version_is_3(self):
        self.assertEqual(compose.ALGO_VERSION, "3")


if __name__ == "__main__":
    unittest.main()
