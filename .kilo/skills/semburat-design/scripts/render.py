#!/usr/bin/env python3
"""Render template desain SEMBURAT (HTML) menjadi PNG.

Contoh:
  python render.py --template og-hero --data contoh/artikel.json --out out/
  python render.py --template carousel --data contoh/carousel.json --out out/
  python render.py --template og-hero --data data.json --check-only   # hanya validasi aturan

Aturan desain (kredit, batas kata, larangan gambar AI untuk produk nyata, dll.)
divalidasi dulu. Jika ada ERROR, render dibatalkan (kode keluar 1).
"""
from __future__ import annotations

import argparse
import base64
import html
import json
import mimetypes
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parent / "assets"
TEMPLATES = ASSETS / "templates"

sys.path.insert(0, str(HERE))
from validate_content import validate  # noqa: E402


def load_registry() -> dict:
    return json.loads((TEMPLATES / "templates.json").read_text(encoding="utf-8"))


def size_class(title: str) -> str:
    n = len(title)
    if n <= 45:
        return "sz-l"
    if n <= 80:
        return "sz-m"
    return "sz-s"


def image_data_uri(path: str, base_dir: Path) -> str:
    p = Path(path)
    if not p.is_absolute():
        p = (base_dir / p).resolve()
    mime = mimetypes.guess_type(p.name)[0] or "image/png"
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode("ascii")


def credit_html(item: dict) -> str:
    parts = []
    if item.get("image_type") == "ai_generated":
        parts.append('<span class="ai-badge">Ilustrasi AI</span>')
    credit = (item.get("credit") or "").strip()
    if credit:
        parts.append(html.escape(credit))
    return " &nbsp; ".join(parts)


def fill(template: str, values: dict) -> str:
    out = template
    for key, val in values.items():
        out = out.replace("{{" + key + "}}", val)
    return out


def build_values(item: dict, base_dir: Path, extra: dict | None = None) -> dict:
    tokens_css = (ASSETS / "tokens.css").read_text(encoding="utf-8")
    base_css = (TEMPLATES / "_base.css").read_text(encoding="utf-8")
    esc = lambda k: html.escape(str(item.get(k, "") or ""))  # noqa: E731
    values = {
        "tokens_css": tokens_css,
        "base_css": base_css,
        "kicker": esc("kicker"),
        "title": esc("title"),
        "body": esc("body"),
        "stat": esc("stat"),
        "cta": esc("cta"),
        "domain": esc("domain"),
        "size_class": size_class(str(item.get("title", ""))),
        "credit_html": credit_html(item),
        "image_class": "",
        "bg_style": "",
        "sources_html": "".join(f"<li>{html.escape(str(s))}</li>" for s in item.get("sources", [])),
    }
    if item.get("image"):
        uri = image_data_uri(item["image"], base_dir)
        values["image_class"] = "has-image"
        values["bg_style"] = f"style=\"background-image:url('{uri}')\""
    if extra:
        values.update(extra)
    return values


def screenshot(html_text: str, width: int, height: int, out_path: Path, scale: float) -> None:
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=scale)
        page.set_content(html_text, wait_until="load")
        page.wait_for_timeout(150)
        page.screenshot(path=str(out_path), clip={"x": 0, "y": 0, "width": width, "height": height})
        browser.close()


def render_template(
    template: str,
    data: dict,
    out_dir: Path,
    base_dir: Path,
    registry: dict,
    scale: float = 1.0,
) -> list[Path]:
    """Render satu template (termasuk carousel multi-slide) menjadi PNG.

    Mengembalikan daftar path PNG yang dihasilkan. Asumsikan data sudah lolos
    `validate_content.validate`; fungsi ini tidak memvalidasi ulang.
    """
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    spec = registry[template]
    slug = data.get("slug", "konten")
    outputs: list[Path] = []

    if template == "carousel":
        slides = data["slides"]
        total = len(slides)
        for i, slide in enumerate(slides, start=1):
            merged = {**{k: data.get(k) for k in ("credit", "image_type", "domain")}, **slide}
            tpl_file = spec["slide_types"][slide["type"]]["file"]
            extra = {"slide_no": str(i), "slide_total": str(total)}
            values = build_values(merged, base_dir, extra)
            text = fill((TEMPLATES / tpl_file).read_text(encoding="utf-8"), values)
            out_path = out_dir / f"{slug}-carousel-{i:02d}.png"
            screenshot(text, spec["width"], spec["height"], out_path, scale)
            outputs.append(out_path)
    else:
        values = build_values(data, base_dir)
        text = fill((TEMPLATES / spec["file"]).read_text(encoding="utf-8"), values)
        out_path = out_dir / f"{slug}-{template}.png"
        screenshot(text, spec["width"], spec["height"], out_path, scale)
        outputs.append(out_path)

    return outputs


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--template", required=True)
    ap.add_argument("--data", required=True, help="file JSON isi konten")
    ap.add_argument("--out", default="out")
    ap.add_argument("--scale", type=float, default=1.0, help="device scale factor (1 = ukuran piksel persis)")
    ap.add_argument("--check-only", action="store_true")
    args = ap.parse_args()

    registry = load_registry()
    if args.template not in registry:
        print(f"Template tidak dikenal: {args.template}. Pilihan: {', '.join(registry)}", file=sys.stderr)
        return 2

    data_path = Path(args.data).resolve()
    data = json.loads(data_path.read_text(encoding="utf-8"))
    base_dir = data_path.parent

    errors, warnings = validate(args.template, data, registry)
    for w in warnings:
        print(f"PERINGATAN: {w}")
    for e in errors:
        print(f"ERROR: {e}")
    if errors:
        print("Render dibatalkan karena ada pelanggaran aturan desain.", file=sys.stderr)
        return 1
    if args.check_only:
        print("Validasi lolos.")
        return 0

    for out_path in render_template(args.template, data, Path(args.out), base_dir, registry, args.scale):
        print(f"OK {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
