#!/usr/bin/env python3
"""Kirim paket sosial SEMBURAT ke sebuah chat Telegram untuk ditinjau.

Untuk setiap artikel di folder paket, skrip mengirim:
  1. pesan teks (judul + ringkasan + tautan),
  2. album gambar non-carousel (og-hero, x-post, story-cover, fact-card),
  3. album slide carousel.

Token dibaca dari (berurutan): argumen --token, variabel lingkungan
TELEGRAM_BOT_TOKEN, lalu `apps/worker/.dev.vars` (gitignored). Chat id dibaca
dari --chat-id, TELEGRAM_CHAT_ID, atau entri pertama TELEGRAM_ALLOWED_USER_IDS.

Contoh:
  python tools/telegram_send.py --packs social-out/packs --dry-run
  python tools/telegram_send.py --packs social-out/packs --only apa-itu-qris
  python tools/telegram_send.py --packs social-out/packs
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
DEFAULT_ENV_FILE = ROOT / "apps" / "worker" / ".dev.vars"
API_BASE = "https://api.telegram.org/bot{token}/{method}"
HEADER_ALBUM = ["og-hero", "x-post", "story-cover", "fact-card"]
CAPTION_LIMIT = 1024


def parse_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def load_config(args: argparse.Namespace) -> tuple[str, str]:
    file_env = parse_env_file(Path(args.env_file)) if args.env_file else {}

    token = args.token or os.environ.get("TELEGRAM_BOT_TOKEN") or file_env.get("TELEGRAM_BOT_TOKEN")
    chat_id = args.chat_id or os.environ.get("TELEGRAM_CHAT_ID") or file_env.get("TELEGRAM_CHAT_ID")
    if not chat_id:
        allowed = os.environ.get("TELEGRAM_ALLOWED_USER_IDS") or file_env.get("TELEGRAM_ALLOWED_USER_IDS", "")
        chat_id = allowed.split(",")[0].strip() if allowed else ""

    return token or "", chat_id


def api_call(token: str, method: str, *, data=None, files=None) -> dict:
    url = API_BASE.format(token=token, method=method)
    for attempt in range(4):
        response = requests.post(url, data=data, files=files, timeout=120)
        if response.status_code == 429:
            retry_after = 5
            try:
                retry_after = int(response.json().get("parameters", {}).get("retry_after", 5))
            except Exception:
                pass
            print(f"  rate limited, tunggu {retry_after}s ...")
            time.sleep(retry_after + 1)
            continue
        payload = response.json()
        if not payload.get("ok"):
            raise RuntimeError(f"Telegram {method} gagal: {payload.get('description')}")
        return payload
    raise RuntimeError(f"Telegram {method} gagal setelah beberapa percobaan (rate limit).")


def send_message(token: str, chat_id: str, text: str) -> None:
    api_call(
        token,
        "sendMessage",
        data={"chat_id": chat_id, "text": text[:4096], "parse_mode": "HTML", "disable_web_page_preview": False},
    )


def send_album(token: str, chat_id: str, items: list[tuple[Path, str]]) -> None:
    """items: daftar (path_png, caption). Minimal 2 item."""
    if len(items) < 2:
        return
    media = []
    files = {}
    for index, (path, caption) in enumerate(items):
        field = f"photo{index}"
        media.append(
            {
                "type": "photo",
                "media": f"attach://{field}",
                "caption": caption[:CAPTION_LIMIT],
                "parse_mode": "HTML",
            }
        )
        files[field] = (path.name, path.open("rb"), "image/png")
    try:
        api_call(token, "sendMediaGroup", data={"chat_id": chat_id, "media": json.dumps(media)}, files=files)
    finally:
        for handle in files.values():
            handle[1].close()


def send_pack(token: str, chat_id: str, pack_dir: Path, dry_run: bool = False) -> int:
    pack = json.loads((pack_dir / "pack.json").read_text(encoding="utf-8"))
    captions = pack["captions"]
    contents = pack["contents"]
    images = {name: pack_dir / f"{pack_dir.name}-{name}.png" for name in HEADER_ALBUM}
    carousel = sorted(pack_dir.glob(f"{pack_dir.name}-carousel-*.png"))

    title = contents["og-hero"]["title"]
    kicker = contents["og-hero"].get("kicker", "")
    sent = 0

    header = f"<b>{title}</b>\n{kicker}\n\n{captions['x_post'].split(chr(10) + chr(10))[-1]}"
    album_count = sum(
        1 for name in HEADER_ALBUM if name in contents and (pack_dir / f"{pack_dir.name}-{name}.png").exists()
    )
    if dry_run:
        print(f"[dry-run] {pack_dir.name}: header + {album_count} gambar + {len(carousel)} slide carousel")
        return 3

    send_message(token, chat_id, header)
    sent += 1

    album = []
    for name in HEADER_ALBUM:
        if name not in contents:
            continue
        path = images[name]
        if not path.exists():
            continue
        caption = captions["x_post"] if name == "og-hero" else f"<b>{name}</b>"
        if name == "fact-card":
            caption = f"<b>Fact card</b> — {contents['fact-card']['stat']}"
        album.append((path, caption))
    send_album(token, chat_id, album)
    sent += 1

    if carousel:
        slides = contents["carousel"]["slides"]
        items = []
        for index, path in enumerate(carousel):
            slide = slides[index] if index < len(slides) else {}
            label = slide.get("kicker") or slide.get("type", f"slide {index + 1}")
            caption = captions["instagram"] if index == 0 else f"<b>{label}</b>"
            items.append((path, caption))
        send_album(token, chat_id, items)
        sent += 1

    return sent


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--packs", default="social-out/packs", help="folder paket hasil social_pack.py")
    parser.add_argument("--only", default=None, help="kirim hanya satu slug")
    parser.add_argument("--token", default=None, help="bot token (default: env/.dev.vars)")
    parser.add_argument("--chat-id", default=None, help="chat tujuan (default: env/.dev.vars)")
    parser.add_argument("--env-file", default=str(DEFAULT_ENV_FILE), help="file env fallback")
    parser.add_argument("--delay", type=float, default=2.0, help="jeda detik antar artikel")
    parser.add_argument("--dry-run", action="store_true", help="tampilkan rencana tanpa mengirim")
    args = parser.parse_args()

    packs_root = Path(args.packs)
    pack_dirs = sorted(p for p in packs_root.glob("*") if (p / "pack.json").exists())
    if args.only:
        pack_dirs = [p for p in pack_dirs if p.name == args.only]
    if not pack_dirs:
        print(f"Tidak ada paket di {packs_root}.", file=sys.stderr)
        return 2

    token, chat_id = load_config(args)
    if not args.dry_run:
        if not token:
            print(
                "TELEGRAM_BOT_TOKEN tidak ditemukan. Setel env atau tambahkan baris "
                f"TELEGRAM_BOT_TOKEN=... di {args.env_file}.",
                file=sys.stderr,
            )
            return 2
        if not chat_id:
            print("TELEGRAM_CHAT_ID tidak ditemukan.", file=sys.stderr)
            return 2

    total = 0
    for pack_dir in pack_dirs:
        count = send_pack(token, chat_id, pack_dir, dry_run=args.dry_run)
        total += count
        print(f"{'[dry-run] ' if args.dry_run else ''}{pack_dir.name}: {count} pesan")
        if args.dry_run:
            continue
        time.sleep(args.delay)

    if args.dry_run:
        print(f"[dry-run] {len(pack_dirs)} artikel, {total} pesan.")
    else:
        print(f"Selesai: {total} pesan terkirim untuk {len(pack_dirs)} artikel.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
