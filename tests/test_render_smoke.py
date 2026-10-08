"""Smoke test render PNG. Otomatis dilewati bila Playwright/Chromium tidak tersedia."""
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "skills" / "semburat-design"

try:
    import playwright  # noqa: F401
    from PIL import Image
    HAVE = True
except Exception:
    HAVE = False


@unittest.skipUnless(HAVE, "Playwright/Pillow tidak terpasang")
class TestRender(unittest.TestCase):
    def run_render(self, tpl, example, out):
        return subprocess.run(
            [sys.executable, str(SKILL / "scripts" / "render.py"), "--template", tpl,
             "--data", str(SKILL / "assets" / "examples" / example), "--out", out],
            capture_output=True, text=True,
        )

    def test_og_size(self):
        with tempfile.TemporaryDirectory() as d:
            r = self.run_render("og-hero", "artikel-og.json", d)
            self.assertEqual(r.returncode, 0, msg=r.stdout + r.stderr)
            png = next(Path(d).glob("*.png"))
            with Image.open(png) as im:
                self.assertEqual(im.size, (1200, 630))

    def test_carousel_count_and_size(self):
        with tempfile.TemporaryDirectory() as d:
            r = self.run_render("carousel", "carousel.json", d)
            self.assertEqual(r.returncode, 0, msg=r.stdout + r.stderr)
            pngs = sorted(Path(d).glob("*.png"))
            self.assertEqual(len(pngs), 7)
            for p in pngs:
                with Image.open(p) as im:
                    self.assertEqual(im.size, (1080, 1350))


if __name__ == "__main__":
    unittest.main()
