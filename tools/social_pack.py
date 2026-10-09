#!/usr/bin/env python3
"""Bangun "paket sosial" SEMBURAT dari satu atau banyak artikel.

Untuk setiap artikel, skrip ini:
  1. Menyusun konten untuk template desain (og-hero, x-post, fact-card,
     story-cover, carousel) dari judul, dek, ringkasan, poin penting, dan sumber.
  2. Memvalidasi konten dengan aturan desain SEMBURAT.
  3. Merender PNG (Playwright/Chromium) dan menulis teks siap unggah
     (X, Instagram, Telegram) ke folder keluaran per artikel.

Contoh:
  tsx tools/export_articles.ts --out social-out/articles.json
  python tools/social_pack.py --articles social-out/articles.json \\
      --out social-out/packs --assets-dir apps/web/src/assets/articles
  python tools/social_pack.py --articles social-out/articles.json --check-only
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SKILL_SCRIPTS = ROOT / ".kilo" / "skills" / "semburat-design" / "scripts"
sys.path.insert(0, str(SKILL_SCRIPTS))

from render import load_registry, render_template  # noqa: E402
from validate_content import validate  # noqa: E402

PACK_TEMPLATES = ["og-hero", "x-post", "fact-card", "story-cover", "carousel"]
REQUIRED_TEMPLATES = ["og-hero", "x-post", "story-cover", "carousel"]
IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".webp")
DEFAULT_DOMAIN = "semburat-web.pages.dev"

CONTENT_LABELS = ["Fakta kunci", "Konteks penting", "Kenapa penting", "Yang perlu dipantau"]


def trim_words(text: str, limit: int = 20) -> str:
    """Potong teks ke `limit` kata; tambahkan elipsis bila terpotong."""
    words = (text or "").split()
    if len(words) <= limit:
        return " ".join(words)
    return " ".join(words[:limit]).rstrip(",;:") + "…"


def headline(text: str, fallback: str, limit: int = 6) -> str:
    """Ambil frasa pembuka sebagai judul slide; pakai fallback bila terlalu pendek."""
    words = (text or "").split()
    candidate = " ".join(words[:limit]).strip(" .,;:")
    if len(candidate) < 10:
        return fallback
    if len(candidate) > 110:
        candidate = candidate[:110].rsplit(" ", 1)[0]
    return candidate


def fit_title(title: str) -> str:
    """Pastikan judul berada pada rentang panjang yang diterima validator."""
    title = (title or "").strip()
    if len(title) > 110:
        title = title[:110].rsplit(" ", 1)[0]
    return title


def _meaningful_number(token: str) -> bool:
    """Angka layak untuk kartu fakta: persen, desimal/ribuan, atau >= 3 digit."""
    digits = sum(c.isdigit() for c in token)
    return "%" in token or "." in token or "," in token or digits >= 3


def find_number(text: str) -> str | None:
    """Pilih angka paling bermakna dalam teks (persen/desimal/jumlah digit terbanyak)."""
    tokens = re.findall(r"\d[\d.,]*%?|\d[\d.,/%-]*\d|\d", text or "")
    cleaned = [tok.strip(".,/%-") for tok in tokens]
    cleaned = [tok for tok in cleaned if tok and _meaningful_number(tok)]
    if not cleaned:
        return None

    def score(token: str) -> int:
        return ("%" in token) * 3 + ("." in token or "," in token) + sum(c.isdigit() for c in token)

    return max(cleaned, key=score)


def first_stat(*texts: str) -> str | None:
    """Angka pertama yang ditemukan pada salah satu teks."""
    for text in texts:
        number = find_number(text)
        if number:
            return number
    return None


def fact_stat_and_body(key_points: list[str], summary: str) -> tuple[str | None, str | None]:
    """Pilih pasangan angka + teks dari sumber yang sama agar kartu fakta konsisten."""
    for point in key_points:
        number = find_number(point)
        if number:
            return number, point
    number = find_number(summary)
    if number:
        return number, summary
    return None, None


def image_type_for(asset: dict | None, has_image: bool) -> str:
    if not has_image:
        return "none"
    license_text = ((asset or {}).get("license") or "").lower()
    if "public domain" in license_text or "domain publik" in license_text:
        return "public_domain"
    if "cc by" in license_text or "creative commons" in license_text:
        return "licensed"
    if "asli semburat" in license_text or "original" in license_text:
        return "original"
    return "licensed"


def resolve_asset(article: dict, assets_dir: str | None) -> tuple[bool, Path | None, dict | None]:
    asset = next((a for a in article.get("assets", []) if a.get("type") == "image"), None)
    if not assets_dir:
        return False, None, asset
    base = Path(assets_dir)
    for ext in IMAGE_EXTS:
        candidate = base / f"{article['slug']}{ext}"
        if candidate.exists():
            return True, candidate.resolve(), asset
    return False, None, asset


def build_content(
    article: dict,
    *,
    domain: str,
    has_image: bool,
    image_path: Path | None,
    asset: dict | None,
) -> dict:
    slug = article["slug"]
    kicker = article.get("category") or "Artikel"
    title = fit_title(article.get("title", ""))
    credit = (asset or {}).get("credit") or "Ilustrasi oleh SEMBURAT"
    image_type = image_type_for(asset, has_image)

    base: dict = {
        "slug": slug,
        "domain": domain,
        "kicker": kicker,
        "title": title,
        "image_type": image_type,
        "credit": credit,
    }
    if has_image and image_path is not None:
        base["image"] = str(image_path)

    contents: dict[str, dict] = {
        "og-hero": dict(base),
        "x-post": dict(base),
    }

    dek = trim_words(article.get("dek") or article.get("summary", ""))
    contents["story-cover"] = {**base, "body": dek}

    key_points = [str(p) for p in article.get("keyPoints", []) if str(p).strip()]
    summary = article.get("summary", "")

    stat, fact_source = fact_stat_and_body(key_points, summary)
    if stat:
        contents["fact-card"] = {**base, "stat": stat, "body": trim_words(fact_source or summary)}

    slides: list[dict] = [{"type": "cover", "kicker": kicker, "title": title}]
    slides.append(
        {
            "type": "content",
            "kicker": "Apa yang terjadi",
            "title": headline(summary, "Apa yang terjadi"),
            "body": trim_words(summary),
        }
    )
    for index, point in enumerate(key_points[:4]):
        label = CONTENT_LABELS[index]
        slides.append(
            {
                "type": "content",
                "kicker": label,
                "title": headline(point, label),
                "body": trim_words(point),
            }
        )
    source_titles = [str(s.get("title", "")).strip() for s in article.get("sources", [])]
    source_titles = [s for s in source_titles if s][:6] or ["Artikel SEMBURAT"]
    slides.append(
        {
            "type": "sources",
            "title": "Sumber & kredit",
            "sources": source_titles,
            "cta": f"Baca selengkapnya di {domain}",
        }
    )
    contents["carousel"] = {
        "slug": slug,
        "domain": domain,
        "image_type": "none",
        "credit": credit,
        "slides": slides,
    }
    return contents


def build_captions(article: dict, domain: str) -> dict[str, str]:
    slug = article["slug"]
    title = article.get("title", "")
    dek = article.get("dek") or article.get("summary", "")
    key_points = [str(p) for p in article.get("keyPoints", [])][:3]
    category = (article.get("category") or "").replace(" ", "")
    url = f"https://{domain}/articles/{slug}/"
    tag = f"#{category}" if category else "#SEMBURAT"

    bullets = "\n".join(f"• {point}" for point in key_points)
    ig_caption = f"{title}\n\n{bullets}\n\n{dek}\n\nBaca selengkapnya: {url}\n\n#SEMBURAT {tag}"
    x_post = f"{title}\n\n{dek}\n\n{url}"
    threads = f"{title}\n\n{dek}\n\nSelengkapnya: {url}"
    telegram = f"<b>{title}</b>\n\n{dek}\n\n{url}"
    return {
        "x_post": x_post.strip(),
        "instagram": ig_caption.strip(),
        "threads": threads.strip(),
        "telegram": telegram.strip(),
        "url": url,
    }


def validate_pack(slug: str, contents: dict, registry: dict, formats: list[str]) -> list[str]:
    errors: list[str] = []
    for template in formats:
        if template not in contents:
            continue
        errs, _warns = validate(template, contents[template], registry)
        errors.extend(f"{slug}/{template}: {err}" for err in errs)
    return errors


def write_text_outputs(slug_dir: Path, captions: dict) -> None:
    (slug_dir / "x-post.txt").write_text(captions["x_post"] + "\n", encoding="utf-8")
    (slug_dir / "instagram.txt").write_text(captions["instagram"] + "\n", encoding="utf-8")
    (slug_dir / "telegram.txt").write_text(captions["telegram"] + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--articles", required=True, help="file JSON hasil tools/export_articles.ts")
    parser.add_argument("--out", default="social-out/packs", help="folder keluaran paket")
    parser.add_argument("--assets-dir", default=None, help="folder gambar artikel (opsional)")
    parser.add_argument("--domain", default=DEFAULT_DOMAIN, help="domain untuk tautan & CTA")
    parser.add_argument("--formats", default=",".join(PACK_TEMPLATES), help="template yang dirender")
    parser.add_argument("--only", default=None, help="hanya proses satu slug")
    parser.add_argument("--check-only", action="store_true", help="validasi tanpa render")
    parser.add_argument("--scale", type=float, default=1.0, help="device scale factor render")
    args = parser.parse_args()

    data = json.loads(Path(args.articles).read_text(encoding="utf-8"))
    articles = data.get("articles", []) if isinstance(data, dict) else data
    if not articles:
        print("Tidak ada artikel untuk diproses.", file=sys.stderr)
        return 2

    requested = [f.strip() for f in args.formats.split(",") if f.strip()]
    formats = [f for f in requested if f in PACK_TEMPLATES]
    unknown = [f for f in requested if f not in PACK_TEMPLATES]
    for name in unknown:
        print(f"PERINGATAN: format tidak dikenal diabaikan: {name}")

    registry = load_registry()
    out_root = Path(args.out)
    processed = 0

    for article in articles:
        if args.only and article.get("slug") != args.only:
            continue
        has_image, image_path, asset = resolve_asset(article, args.assets_dir)
        contents = build_content(
            article, domain=args.domain, has_image=has_image, image_path=image_path, asset=asset
        )
        captions = build_captions(article, args.domain)

        errors = validate_pack(article["slug"], contents, registry, formats)
        if errors:
            for error in errors:
                print(f"ERROR {error}", file=sys.stderr)
            return 1

        processed += 1
        if args.check_only:
            continue

        slug_dir = out_root / article["slug"]
        if slug_dir.exists():
            shutil.rmtree(slug_dir)
        slug_dir.mkdir(parents=True, exist_ok=True)
        (slug_dir / "pack.json").write_text(
            json.dumps({"contents": contents, "captions": captions}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        write_text_outputs(slug_dir, captions)

        for template in formats:
            if template not in contents:
                continue
            for png in render_template(template, contents[template], slug_dir, slug_dir, registry, args.scale):
                print(f"OK {png}")

    if args.check_only:
        print(f"Validasi lolos untuk {processed} artikel.")
    else:
        print(f"Selesai: {processed} paket di {out_root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
