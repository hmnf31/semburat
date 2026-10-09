#!/usr/bin/env python3
"""Validasi aturan desain SEMBURAT sebelum render.

Mengembalikan (errors, warnings). Error = render dibatalkan.
Aturan berasal dari PRD (bagian 20, 24, 29) dan packages/brand/tokens.json.
"""
from __future__ import annotations

import json
from pathlib import Path

ASSETS = Path(__file__).resolve().parent.parent / "assets"
RULES = json.loads((ASSETS / "tokens.json").read_text(encoding="utf-8"))["rules"]

IMAGE_TYPES = {
    "none",
    "official",
    "press_kit",
    "licensed",
    "public_domain",
    "original",
    "ai_generated",
    "fan_art",
    "needs_permission",
}
# Jenis gambar yang butuh kredit tertulis di visual
CREDIT_REQUIRED_TYPES = {
    "official",
    "press_kit",
    "licensed",
    "public_domain",
    "fan_art",
    "needs_permission",
}


def words(text: str) -> int:
    return len((text or "").split())


def _check_item(label: str, item: dict, needs: list[str], errors: list[str], warnings: list[str]) -> None:
    for field in needs:
        value = item.get(field)
        if value in (None, "", []):
            errors.append(f"{label}: field wajib '{field}' kosong.")

    title = str(item.get("title", "") or "")
    if title:
        if len(title) < RULES["title_min_chars"]:
            errors.append(f"{label}: judul terlalu pendek (< {RULES['title_min_chars']} karakter).")
        if len(title) > RULES["title_max_chars"]:
            errors.append(f"{label}: judul terlalu panjang (> {RULES['title_max_chars']} karakter).")

    body = str(item.get("body", "") or "")
    if body:
        n = words(body)
        if n > RULES["slide_body_max_words"]:
            errors.append(f"{label}: teks isi {n} kata, batas {RULES['slide_body_max_words']}.")
        elif n > RULES["slide_body_warn_words"]:
            warnings.append(f"{label}: teks isi {n} kata, disarankan <= {RULES['slide_body_warn_words']}.")

    sources = item.get("sources")
    if sources is not None and len(sources) > RULES["max_sources_on_slide"]:
        errors.append(f"{label}: terlalu banyak sumber ({len(sources)}), maksimal {RULES['max_sources_on_slide']}.")


def validate(template: str, data: dict, registry: dict) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    image_type = data.get("image_type", "none")
    if image_type not in IMAGE_TYPES:
        errors.append(f"image_type '{image_type}' tidak dikenal. Pilihan: {sorted(IMAGE_TYPES)}")

    if data.get("image") and image_type == "none":
        errors.append("Ada gambar tetapi image_type 'none'. Isi image_type sesuai sumber/lisensi gambar.")

    if image_type in CREDIT_REQUIRED_TYPES and not str(data.get("credit", "") or "").strip():
        errors.append(f"Gambar bertipe '{image_type}' wajib punya 'credit' (kredit visual).")

    if image_type == "ai_generated" and data.get("depicts_real_product"):
        errors.append(
            "Gambar AI tidak boleh menampilkan produk/peristiwa nyata (risiko disangka asli). "
            "Gunakan aset resmi berlisensi atau grafik penjelas original."
        )

    if template == "carousel":
        slides = data.get("slides") or []
        if not slides:
            errors.append("carousel: 'slides' kosong.")
        types = registry["carousel"]["slide_types"]
        if slides and slides[0].get("type") != "cover":
            warnings.append("carousel: slide pertama sebaiknya bertipe 'cover' (hook).")
        if slides and slides[-1].get("type") != "sources":
            errors.append("carousel: slide terakhir wajib bertipe 'sources' (sumber & kredit).")
        for i, s in enumerate(slides, start=1):
            st = s.get("type")
            if st not in types:
                errors.append(f"carousel slide {i}: type '{st}' tidak dikenal.")
                continue
            _check_item(f"carousel slide {i}", s, types[st]["needs"], errors, warnings)
        if not (5 <= len(slides) <= 10):
            warnings.append(f"carousel: {len(slides)} slide; rekomendasi PRD 7 slide (maks. 10).")
    else:
        spec = registry[template]
        _check_item(template, data, spec["needs"], errors, warnings)

    return errors, warnings


if __name__ == "__main__":
    import sys

    reg = json.loads((ASSETS / "templates" / "templates.json").read_text(encoding="utf-8"))
    tpl, path = sys.argv[1], sys.argv[2]
    errs, warns = validate(tpl, json.loads(Path(path).read_text(encoding="utf-8")), reg)
    for w in warns:
        print("PERINGATAN:", w)
    for e in errs:
        print("ERROR:", e)
    sys.exit(1 if errs else 0)
