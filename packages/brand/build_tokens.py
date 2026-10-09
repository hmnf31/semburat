#!/usr/bin/env python3
"""Bangun tokens.css dari tokens.json (sumber tunggal identitas brand).

Menulis ke packages/brand/tokens.css dan salinannya di skill semburat-design,
sehingga website (Astro/Tailwind) dan template desain memakai nilai yang sama.

Pemakaian:  python packages/brand/build_tokens.py
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
SKILL_ASSETS = ROOT / ".kilo" / "skills" / "semburat-design" / "assets"


def build_css(tokens: dict) -> str:
    lines = ["/* AUTO-GENERATED dari tokens.json. Jangan edit manual. */", ":root {"]
    for name, value in tokens["color"].items():
        lines.append(f"  --sb-{name}: {value};")
    for name, value in tokens["gradient"].items():
        lines.append(f"  --sb-grad-{name}: {value};")
    lines.append(f"  --sb-font-heading: {tokens['font']['heading']};")
    lines.append(f"  --sb-font-body: {tokens['font']['body']};")
    lines.append("}")
    return "\n".join(lines) + "\n"


def main() -> None:
    tokens = json.loads((HERE / "tokens.json").read_text(encoding="utf-8"))
    css = build_css(tokens)
    (HERE / "tokens.css").write_text(css, encoding="utf-8")
    SKILL_ASSETS.mkdir(parents=True, exist_ok=True)
    (SKILL_ASSETS / "tokens.css").write_text(css, encoding="utf-8")
    (SKILL_ASSETS / "tokens.json").write_bytes((HERE / "tokens.json").read_bytes())
    print("tokens.css dan salinan skill ditulis.")


if __name__ == "__main__":
    main()
