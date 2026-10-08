# 02 — Checklist Deploy Staging di Cloudflare (Tahap B)

> Cek angka kuota free tier di halaman resmi Cloudflare, GitHub, dan OpenRouter sebelum menentukan jadwal. Angka sering berubah.

## B1. Sumber daya

- [ ] Akun Cloudflare + GitHub, 2FA aktif.
- [ ] Buat D1 (staging) → jalankan `database/migrations`.
- [ ] Buat bucket R2 (staging).
- [ ] Token Cloudflare dengan izin **minimal** (Pages, Workers, D1, R2 untuk akun ini).
- [ ] Secrets dipasang di GitHub Actions Secrets dan Cloudflare secrets (daftar di `.env.example`). Tidak ada yang dikomit.
- [ ] `TELEGRAM_CHAT_ID` ditambahkan sebagai secret untuk alert workflow.

## B2. Deploy

- [ ] Pages: build Astro, gunakan subdomain `*.pages.dev` dulu.
- [ ] Worker: API, webhook Telegram, endpoint admin (terautentikasi).
- [ ] Health check: halaman utama, API, koneksi D1, akses R2.
- [ ] Repository Variable `SITE_URL` diisi; jalankan workflow `health-check` manual.
      (Jalur yang dicek: `/`, `/sitemap-index.xml`, `/robots.txt`, `/rss.xml`. Sesuaikan jika nama file sitemap/RSS Anda berbeda.)

## B3. Workflow terjadwal (mulai pelan)

| Workflow                     | Frekuensi awal                |
| ---------------------------- | ----------------------------- |
| trend-discovery              | tiap 1–2 jam                  |
| research                     | tiap 2–3 jam (tren prioritas) |
| content-generation           | 2–3 kali sehari               |
| distribution (siapkan paket) | harian                        |
| analytics                    | harian                        |

- [ ] Jalankan tiap workflow **manual** dengan `dry_run=true`.
- [ ] Jalankan manual dengan `dry_run=false` pada 1 topik, cek hasil di D1.
- [ ] Baru aktifkan `schedule` (hapus komentar cron).
- [ ] Uji kill switch: setel Repository Variable `SEMBURAT_KILL_SWITCH=true`, job harus dilewati.
- [ ] Pantau menit GitHub Actions dan kuota API di minggu pertama.

## B4. Bot Telegram

- [ ] `/start /status /trending /articles /review` berfungsi.
- [ ] `/approve /reject /regenerate /publish /schedule` mengubah status di D1.
- [ ] Notifikasi gagal-job dan antrean review masuk.
- [ ] Hanya ID yang diizinkan bisa menjalankan perintah sensitif.

## B5. Tes di staging

- [ ] Ulangi A2 dan A3 di staging.
- [ ] Uji di HP nyata (Android/iOS) dan beberapa browser.
- [ ] PageSpeed Insights: perbaiki yang merah.
- [ ] Cadangan D1 dicoba dipulihkan sekali (latihan disaster recovery).
