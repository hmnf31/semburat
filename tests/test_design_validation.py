import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / ".kilo" / "skills" / "semburat-design"
sys.path.insert(0, str(SKILL / "scripts"))

from validate_content import validate  # noqa: E402

REGISTRY = json.loads((SKILL / "assets" / "templates" / "templates.json").read_text(encoding="utf-8"))
EXAMPLES = SKILL / "assets" / "examples"


def load(name):
    return json.loads((EXAMPLES / name).read_text(encoding="utf-8"))


class TestExamplesPass(unittest.TestCase):
    def test_examples_are_valid(self):
        for tpl, f in [("og-hero", "artikel-og.json"), ("fact-card", "fact-card.json"), ("carousel", "carousel.json")]:
            errs, _ = validate(tpl, load(f), REGISTRY)
            self.assertEqual(errs, [], msg=f"{tpl}: {errs}")


class TestRules(unittest.TestCase):
    base = {"kicker": "Gaming", "title": "Judul contoh yang cukup panjang", "image_type": "none"}

    def test_missing_title(self):
        errs, _ = validate("og-hero", {"kicker": "Gaming", "image_type": "none"}, REGISTRY)
        self.assertTrue(any("title" in e for e in errs))

    def test_title_too_long(self):
        errs, _ = validate("og-hero", {**self.base, "title": "x" * 111}, REGISTRY)
        self.assertTrue(any("terlalu panjang" in e for e in errs))

    def test_image_requires_type(self):
        errs, _ = validate("og-hero", {**self.base, "image": "a.png"}, REGISTRY)
        self.assertTrue(any("image_type" in e for e in errs))

    def test_licensed_image_requires_credit(self):
        errs, _ = validate("og-hero", {**self.base, "image": "a.png", "image_type": "licensed"}, REGISTRY)
        self.assertTrue(any("credit" in e for e in errs))

    def test_fan_art_is_recognized_and_requires_credit(self):
        errs, _ = validate("og-hero", {**self.base, "image": "a.png", "image_type": "fan_art"}, REGISTRY)
        self.assertTrue(any("credit" in e for e in errs))
        ok, _ = validate(
            "og-hero",
            {**self.base, "image": "a.png", "image_type": "fan_art", "credit": "Artis — izin"},
            REGISTRY,
        )
        self.assertEqual(ok, [])

    def test_ai_image_of_real_product_blocked(self):
        data = {**self.base, "image": "a.png", "image_type": "ai_generated", "depicts_real_product": True}
        errs, _ = validate("og-hero", data, REGISTRY)
        self.assertTrue(any("produk" in e for e in errs))

    def test_ai_concept_image_allowed(self):
        data = {**self.base, "image": "a.png", "image_type": "ai_generated"}
        errs, _ = validate("og-hero", data, REGISTRY)
        self.assertEqual(errs, [])

    def test_carousel_must_end_with_sources(self):
        data = load("carousel.json")
        data["slides"] = data["slides"][:-1]
        errs, _ = validate("carousel", data, REGISTRY)
        self.assertTrue(any("sources" in e for e in errs))

    def test_slide_body_too_long(self):
        data = load("carousel.json")
        data["slides"][1]["body"] = " ".join(["kata"] * 25)
        errs, _ = validate("carousel", data, REGISTRY)
        self.assertTrue(any("kata" in e for e in errs))

    def test_slide_body_warns_between_15_and_20(self):
        data = load("carousel.json")
        data["slides"][1]["body"] = " ".join(["kata"] * 17)
        errs, warns = validate("carousel", data, REGISTRY)
        self.assertEqual(errs, [])
        self.assertTrue(warns)

    def test_too_many_sources(self):
        data = load("carousel.json")
        data["slides"][-1]["sources"] = [f"s{i}" for i in range(7)]
        errs, _ = validate("carousel", data, REGISTRY)
        self.assertTrue(any("sumber" in e for e in errs))


if __name__ == "__main__":
    unittest.main()
