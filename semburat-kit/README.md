# SEMBURAT Kit — Paket Pendamping PRD

Paket file untuk membawa SEMBURAT dari "kode selesai" ke "tes, deploy, rilis, dan monetisasi bertahap", dengan modal 0 rupiah.
Dibuat dari `SEMBURAT_PRD.md` v1.0.0. **Kit ini pendamping, bukan pengganti repo Anda**: salin hanya file yang Anda perlukan dan jangan menimpa kode di `services/` atau `apps/`.

## Isi

```
semburat-kit/
├── README.md                       ← Anda di sini
├── docs/                           ← Panduan kerja (baca berurutan)
│   ├── 00-SEMBURAT_ROADMAP_TEST_REVENUE.md   ringkasan menyeluruh
│   ├── 01-checklist-tes-lokal.md             Tahap A
│   ├── 02-checklist-deploy-staging.md        Tahap B
│   ├── 03-checklist-rilis.md                 Tahap C
│   ├── 04-soft-launch-playbook.md            Tahap D
│   ├── 05-go-no-go.md                        gerbang keputusan
│   ├── 06-simulasi-pendapatan.md             simulasi 24 bulan (3 skenario)
│   ├── 07-rencana-14-hari.md                 jadwal 2 minggu pertama
│   ├── 08-temuan-analisis-prd.md             hal yang perlu diputuskan di PRD
│   └── templates/                            log tes, review artikel, harian, mingguan, insiden, koreksi
├── pages/                          ← Draf 8 halaman wajib (About, Editorial, Koreksi, Sumber, AI, Privasi, Syarat, Kontak)
├── packages/brand/                 ← Token brand (tokens.json → tokens.css) + brand.config.json
├── skills/semburat-design/         ← Skill desain (Tahap E): SKILL.md, template HTML, render.py, validator, evals
├── tests/                          ← Tes unittest + implementasi REFERENSI aturan PRD + 20 topik uji
├── tools/revenue_simulator.py      ← Simulator pendapatan (bisa Anda ubah asumsinya)
├── remotion/                       ← Contoh props video + catatan
├── config/model-routing.example.json
├── .github/workflows/              ← ci.yml, trend-discovery.yml (pola job aman), health-check.yml
├── .env.example
└── .gitignore
```

## Urutan pemakaian

1. Baca `docs/00` lalu `docs/08` (keputusan yang perlu Anda ambil terkait PRD).
2. **Tahap A:** `python -m unittest discover -s tests -v`, lalu lanjut `docs/01`.
3. **Tahap B:** ikuti `docs/02`. Salin pola `trend-discovery.yml` untuk workflow lain.
4. **Tahap C:** `docs/03` + isi dan tayangkan halaman di `pages/`.
5. **Tahap D:** `docs/04`, ritme harian dengan `docs/templates/`.
6. **Tahap E (desain):** lihat di bawah.
7. Gerbang keputusan: `docs/05`. Jadwal: `docs/07`.

## Tahap E — Template desain & skill

```bash
# 1) sesuaikan identitas
nano packages/brand/tokens.json
python packages/brand/build_tokens.py          # perbarui tokens.css + salinan di skill

# 2) siapkan renderer (sekali saja)
pip install playwright && playwright install chromium

# 3) uji render dengan contoh
python skills/semburat-design/scripts/render.py \
  --template og-hero --data skills/semburat-design/assets/examples/artikel-og.json --out out/
python skills/semburat-design/scripts/render.py \
  --template carousel --data skills/semburat-design/assets/examples/carousel.json --out out/

# 4) hanya cek aturan (tanpa render)
python skills/semburat-design/scripts/render.py --template og-hero --data data.json --check-only
```

Template: `og-hero` 1200×630 · `x-post` 1600×900 · `fact-card` 1080×1080 · `story-cover` 1080×1920 · `carousel` 1080×1350 (cover/content/sources).
Aturan yang ditegakkan validator: kredit wajib untuk gambar pihak lain, carousel wajib diakhiri slide Sumber, gambar AI tidak boleh menampilkan produk nyata, batas panjang judul dan teks.

**Memasang skill di Claude:** gunakan file `semburat-design.skill` (disertakan di paket ini) atau salin folder `skills/semburat-design/` ke lokasi skill Anda. Lalu uji dengan prompt di `skills/semburat-design/evals/evals.json`. Untuk menjalankan siklus uji/perbaikan resmi, minta `/skill-creator` untuk mengevaluasi skill ini.

Font: unduh Plus Jakarta Sans dan Inter (lisensi OFL) ke `skills/semburat-design/assets/fonts/` agar tampilan konsisten; tanpa itu render memakai font sistem sebagai cadangan.

## Yang sudah diuji dan yang belum

Sudah dijalankan saat paket ini dibuat:

- 40 tes unittest (aturan PRD + validasi desain + render PNG) — lolos.
- Render 3 template contoh (OG 1200×630, kartu fakta 1080×1080, carousel 7×1080×1350) — ukuran piksel sesuai.
- Validator menolak gambar AI untuk produk nyata, gambar tanpa kredit, carousel tanpa slide Sumber.
- YAML workflow valid secara sintaks; skill lolos `quick_validate`.

**Belum** diuji (butuh akun/jaringan Anda): deploy Cloudflare, jalannya workflow di GitHub, bot Telegram, panggilan OpenRouter, hasil nyata SEO/monetisasi. Kode referensi di `tests/reference/` adalah spesifikasi yang bisa dijalankan, bukan pengganti implementasi Anda. Angka free tier dan syarat monetisasi harus dicek ke sumber resmi.

## Catatan penting

- Jangan komit `.env` atau secret apa pun.
- Auto-publish dimatikan sampai Gerbang 3 (`docs/05`).
- Halaman di `pages/` adalah draf umum; Privacy dan Terms sebaiknya ditinjau ahli hukum.
