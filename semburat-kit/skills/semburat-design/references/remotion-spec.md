# Spesifikasi Video Remotion (SEMBURAT)

Skrip `render.py` tidak membuat video. Dokumen ini adalah kontrak antara engine konten dan komposisi Remotion
di folder `remotion/`. Satu file props JSON menghasilkan satu video vertikal.

## Format

- 1080×1920, 30 fps, durasi 30–45 detik (900–1350 frame).
- Safe area: atas 250px, bawah 340px, samping 64px.
- Hook di 1–3 detik pertama. Teks layar maksimal 12 kata per adegan.

## Template komposisi (prioritas)

1. `BreakingTrending` — peristiwa/tren risiko rendah.
2. `Explainer` — penjelasan konsep.
   Menyusul: `Top5`, `Comparison`, `GamingUpdate`, `TechUpdate`, `QuoteCard`, `Timeline`, `DataStory`.

## Struktur adegan (default 40 detik)

| Adegan                   | Durasi  | Isi                                               |
| ------------------------ | ------- | ------------------------------------------------- |
| Hook                     | 0–3 s   | Satu kalimat penarik yang jujur                   |
| Apa yang terjadi         | 3–12 s  | Fakta inti                                        |
| Fakta kunci              | 12–24 s | 2–3 poin bersumber                                |
| Konteks / kenapa penting | 24–34 s | Penjelasan singkat                                |
| Sumber & kredit + CTA    | 34–40 s | Daftar sumber, kredit visual, ajakan baca artikel |

## Props JSON

Lihat `remotion/props.example.json`. Medan wajib: `slug`, `template`, `scenes[]`, `sources[]`, `credits[]`.
Setiap adegan: `{ "id", "start_s", "end_s", "headline", "body", "visual": { "type": "asset|typography", "asset_id": "..." } }`.

## Audio

- Voice over: catat `provider`, `model`, `voice`, `script`, `duration`, `license`, `created_at` (PRD bagian 27).
- Jangan menganggap audio hasil AI bebas hak komersial; simpan syarat lisensi penyedia.
- Musik latar: hanya yang berlisensi jelas. Normalisasi volume sebelum render.

## Aturan visual

Sama dengan SKILL.md: kredit wajib, tidak ada gambar AI yang menyerupai produk nyata, watermark SEMBURAT tidak menutup konten,
adegan terakhir selalu Sumber & Kredit.

## Catatan biaya

Render video memakan menit GitHub Actions. Mulai dengan 1–2 video per hari atau render lokal, lalu naikkan sesuai kuota.
