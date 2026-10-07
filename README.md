# SEMBURAT

> Yang sedang muncul, kami rangkai menjadi cerita.

SEMBURAT adalah platform media intelligence dan automated editorial untuk menemukan tren, melakukan riset, memverifikasi fakta, menghasilkan konten editorial, mengelola aset, melakukan repurposing, mendistribusikan konten, dan mengukur performa.

## Dokumen utama

- `SEMBURAT_PRD.md` — apa yang dibangun dan alasan produknya.
- `AGENTS.md` — aturan kerja untuk Kilo AI.
- `IMPLEMENTATION_PLAN.md` — urutan pembangunan.
- `TASKS.md` — backlog implementasi.
- `docs/` — spesifikasi teknis/domain.
- `.kilo/rules/` — aturan coding dan engineering.
- `.kilo/skills/` — skill khusus untuk pekerjaan berulang.

## Prinsip

SEMBURAT bukan:

- scraper lalu paraphrase
- AI content farm
- generator artikel tanpa sumber
- sistem yang menganggap semua gambar internet bebas digunakan

SEMBURAT adalah:

- trend intelligence
- source intelligence
- editorial automation
- provenance-aware content system
- multi-format publishing engine
- audience and revenue feedback loop

## Target awal

Bangun MVP yang stabil sebelum mengejar otomasi penuh.

Urutan utama:

1. foundation
2. database
3. website
4. trend discovery
5. research + source intelligence
6. editorial AI
7. asset intelligence
8. repurposing
9. Remotion
10. distribution
11. analytics
12. monetization

## Cara menggunakan Kilo

Mulai dengan Plan agent untuk memahami repository dan membuat rencana implementasi.

Contoh prompt:

> Baca `AGENTS.md`, `SEMBURAT_PRD.md`, `IMPLEMENTATION_PLAN.md`, dan `TASKS.md`. Audit repository saat ini dan buat rencana implementasi untuk fase berikutnya tanpa mengubah kode.

Setelah rencana disetujui, gunakan Code agent:

> Implementasikan TASK-001 sesuai PRD, rules, dan implementation plan. Jangan mengubah arsitektur yang sudah disetujui. Jalankan test/lint/typecheck/build yang relevan.

## Environment

Salin `.env.example` menjadi konfigurasi lokal yang sesuai. Jangan commit secret.

## Status

Dokumen ini adalah coding pack awal. Source code aplikasi dibangun bertahap mengikuti `IMPLEMENTATION_PLAN.md`.
