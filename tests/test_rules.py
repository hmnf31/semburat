import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "reference"))

from semburat_rules import (  # noqa: E402
    build_credit,
    classify_risk,
    is_duplicate,
    publish_decision,
    quality_score,
    slugify,
    trend_action,
    trend_score,
    QUALITY_WEIGHTS,
    WEIGHTS,
)


class TestTrendScoring(unittest.TestCase):
    def test_weights_sum(self):
        self.assertAlmostEqual(sum(WEIGHTS.values()), 0.95)

    def test_max_without_normalize_is_95(self):
        s = {k: 100 for k in WEIGHTS}
        s["risk"] = 0
        self.assertAlmostEqual(trend_score(s), 95.0)

    def test_max_with_normalize_is_100(self):
        s = {k: 100 for k in WEIGHTS}
        s["risk"] = 0
        self.assertAlmostEqual(trend_score(s, normalize=True), 100.0)

    def test_risk_reduces_score(self):
        s = {k: 80 for k in WEIGHTS}
        low = trend_score({**s, "risk": 0})
        high = trend_score({**s, "risk": 100})
        self.assertLess(high, low)
        self.assertAlmostEqual(low - high, 15.0)

    def test_clamped_to_zero(self):
        self.assertEqual(trend_score({"risk": 100}), 0.0)

    def test_thresholds_boundaries(self):
        cases = {90: "priority", 89.99: "generate", 75: "generate", 74.99: "queue",
                 60: "queue", 59.99: "monitor", 40: "monitor", 39.99: "ignore", 0: "ignore"}
        for score, action in cases.items():
            self.assertEqual(trend_action(score), action, msg=str(score))

    def test_prd_example_signals(self):
        s = {"velocity": 82, "search_interest": 75, "source_count": 60, "relevance": 90,
             "freshness": 95, "monetization": 70, "risk": 20}
        score = trend_score(s)
        self.assertGreater(score, 60)
        self.assertLess(score, 90)


class TestRisk(unittest.TestCase):
    def test_fixture_topics_meet_expected_floor(self):
        order = {"low": 0, "medium": 1, "high": 2}
        data = json.loads((ROOT / "fixtures" / "topics-uji.json").read_text(encoding="utf-8"))
        for t in data["topics"]:
            got = classify_risk(t["topic"])
            self.assertGreaterEqual(order[got], order[t["expected_risk"]], msg=f"{t['id']} {t['topic']} -> {got}")

    def test_high_risk_keywords(self):
        for text in ["Pemilu 2029 memanas", "Tersangka ditangkap", "Saran investasi saham", "Gempa mengguncang kota"]:
            self.assertEqual(classify_risk(text), "high", msg=text)

    def test_safe_gadget_is_low(self):
        self.assertEqual(classify_risk("Spesifikasi ponsel baru dan harganya"), "low")

    def test_keyword_never_matches_substring(self):
        self.assertEqual(classify_risk("Aplikasi pemodelan 3D untuk desainer"), "low")


class TestPublishRules(unittest.TestCase):
    def test_reject_below_60(self):
        self.assertEqual(publish_decision(59.9, "low"), "reject")

    def test_regenerate_60_74(self):
        self.assertEqual(publish_decision(60, "low"), "regenerate")
        self.assertEqual(publish_decision(74.9, "low"), "regenerate")

    def test_review_75_89(self):
        self.assertEqual(publish_decision(80, "low", auto_publish_enabled=True), "editorial_review")

    def test_auto_only_when_enabled_and_low_risk(self):
        self.assertEqual(publish_decision(95, "low", auto_publish_enabled=True), "auto_publish")
        self.assertEqual(publish_decision(95, "low", auto_publish_enabled=False), "editorial_review")

    def test_sensitive_never_auto(self):
        self.assertEqual(publish_decision(99, "low", sensitive=True, auto_publish_enabled=True), "editorial_review")
        self.assertEqual(publish_decision(99, "high", auto_publish_enabled=True), "editorial_review")
        self.assertEqual(publish_decision(99, "medium", auto_publish_enabled=True), "editorial_review")

    def test_quality_weights_sum_to_one(self):
        self.assertAlmostEqual(sum(QUALITY_WEIGHTS.values()), 1.0)

    def test_quality_score_all_100(self):
        self.assertAlmostEqual(quality_score({k: 100 for k in QUALITY_WEIGHTS}), 100.0)


class TestSlugAndDuplicates(unittest.TestCase):
    def test_slug_basic(self):
        self.assertEqual(slugify("Patch Terbaru MLBB: Apa yang Berubah?"), "patch-terbaru-mlbb-apa-yang-berubah")

    def test_slug_accents_and_symbols(self):
        self.assertEqual(slugify("Café & Kopi — 100% Enak!"), "cafe-kopi-100-enak")

    def test_slug_max_length_word_boundary(self):
        slug = slugify("kata " * 40, max_len=30)
        self.assertLessEqual(len(slug), 30)
        self.assertFalse(slug.endswith("-"))

    def test_duplicate_detected(self):
        self.assertTrue(is_duplicate("Patch baru MLBB ubah peran tank", "Patch terbaru MLBB mengubah peran tank"))

    def test_non_duplicate(self):
        self.assertFalse(is_duplicate("Patch baru MLBB ubah peran tank", "Peluncuran ponsel baru di Indonesia"))


class TestCredit(unittest.TestCase):
    def test_ai_generated(self):
        self.assertIn("AI", build_credit({"license_type": "ai_generated"}))

    def test_original_no_credit(self):
        self.assertEqual(build_credit({"license_type": "original"}), "")

    def test_press_kit(self):
        self.assertEqual(build_credit({"license_type": "press_kit", "source_name": "Merek X"}),
                         "Gambar: Merek X (media kit resmi)")

    def test_licensed_with_license_name(self):
        c = build_credit({"license_type": "licensed", "creator": "Budi", "source_name": "Foto Stok",
                          "license_name": "CC BY 4.0"})
        self.assertEqual(c, "Gambar: Budi / Foto Stok, CC BY 4.0")


if __name__ == "__main__":
    unittest.main()
