"""Test pembangun paket sosial (tools/social_pack.py).

Menguji penyusunan konten, kepatuhan aturan desain, caption, dan (bila
Playwright/Pillow tersedia) render PNG ukuran benar.
"""
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT / ".kilo" / "skills" / "semburat-design" / "scripts"))

import social_pack as sp  # noqa: E402
from render import load_registry  # noqa: E402

FIXTURE = Path(__file__).resolve().parent / "fixtures" / "articles-social.json"


def load_articles() -> list[dict]:
    return json.loads(FIXTURE.read_text(encoding="utf-8"))["articles"]


def image_asset(article: dict) -> dict | None:
    return next((a for a in article.get("assets", []) if a.get("type") == "image"), None)


class TestBuildContent(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.registry = load_registry()
        cls.articles = load_articles()

    def build(self, article: dict, has_image: bool = False, image_path: Path | None = None) -> dict:
        return sp.build_content(
            article,
            domain="example.test",
            has_image=has_image,
            image_path=image_path,
            asset=image_asset(article),
        )

    def test_all_formats_pass_validation(self) -> None:
        for article in self.articles:
            contents = self.build(article)
            errors = sp.validate_pack(article["slug"], contents, self.registry, sp.PACK_TEMPLATES)
            self.assertEqual(errors, [], msg=f"{article['slug']}: {errors}")

    def test_required_templates_present(self) -> None:
        for article in self.articles:
            contents = self.build(article)
            for template in sp.REQUIRED_TEMPLATES:
                self.assertIn(template, contents, msg=f"{article['slug']} kurang {template}")

    def test_carousel_structure(self) -> None:
        for article in self.articles:
            slides = self.build(article)["carousel"]["slides"]
            self.assertEqual(slides[0]["type"], "cover")
            self.assertEqual(slides[-1]["type"], "sources")
            self.assertTrue(slides[-1]["sources"])
            self.assertTrue(5 <= len(slides) <= 10, msg=f"{article['slug']}: {len(slides)} slide")

    def test_body_within_word_limit(self) -> None:
        for article in self.articles:
            for slide in self.build(article)["carousel"]["slides"]:
                if slide.get("body"):
                    self.assertLessEqual(len(slide["body"].split()), 20, msg=slide["body"])

    def test_fact_card_only_when_stat_present(self) -> None:
        for article in self.articles:
            stat, _source = sp.fact_stat_and_body(article["keyPoints"], article["summary"])
            contents = self.build(article)
            self.assertEqual("fact-card" in contents, bool(stat), msg=article["slug"])

    def test_image_type_from_license(self) -> None:
        peta = next(a for a in self.articles if a["slug"] == "uji-peta")
        contents = self.build(peta, has_image=True, image_path=Path("peta.png"))
        self.assertEqual(contents["og-hero"]["image_type"], "public_domain")

        qris = next(a for a in self.articles if a["slug"] == "uji-qris")
        contents = self.build(qris, has_image=True, image_path=Path("qris.png"))
        self.assertEqual(contents["og-hero"]["image_type"], "licensed")

    def test_image_type_none_without_image(self) -> None:
        for article in self.articles:
            self.assertEqual(self.build(article)["og-hero"]["image_type"], "none")


class TestCaptions(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.articles = load_articles()

    def test_captions_include_title_and_url(self) -> None:
        for article in self.articles:
            captions = sp.build_captions(article, "example.test")
            self.assertIn(f"/articles/{article['slug']}/", captions["url"])
            self.assertIn(article["title"], captions["x_post"])
            self.assertIn(captions["url"], captions["threads"])
            self.assertIn(captions["url"], captions["instagram"])
            self.assertIn(captions["url"], captions["telegram"])


try:
    import playwright  # noqa: F401
    from PIL import Image  # noqa: F401

    HAVE_RENDER = True
except Exception:
    HAVE_RENDER = False


@unittest.skipUnless(HAVE_RENDER, "Playwright/Pillow tidak terpasang")
class TestRenderSmoke(unittest.TestCase):
    def test_og_hero_dimensions(self) -> None:
        article = load_articles()[0]
        contents = sp.build_content(
            article, domain="example.test", has_image=False, image_path=None, asset=None
        )
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            paths = sp.render_template("og-hero", contents["og-hero"], out, out, load_registry())
            self.assertEqual(len(paths), 1)
            with Image.open(paths[0]) as image:
                self.assertEqual(image.size, (1200, 630))


if __name__ == "__main__":
    unittest.main()
