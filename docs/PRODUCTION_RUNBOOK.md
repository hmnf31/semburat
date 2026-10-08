# SEMBURAT Production Runbook

Runbook operasional untuk lingkungan produksi SEMBURAT. Dokumen ini melengkapi
`docs/DEPLOYMENT_GUIDE.md`: gunakan panduan deployment untuk prosedur teknis
deployment, dan runbook ini untuk operasi harian, respons insiden, serta
pemulihan.

## Daftar Isi

1. [Informasi Lingkungan](#informasi-lingkungan)
2. [Operasi Harian](#1-operasi-harian)
3. [Respons Insiden](#2-respons-insiden)
4. [Backup dan Pemulihan](#3-backup-dan-pemulihan)
5. [Deployment](#4-deployment)
6. [Keamanan](#5-keamanan)
7. [Pemantauan](#6-pemantauan)
8. [Troubleshooting](#7-troubleshooting)

## Informasi Lingkungan

| Komponen        | Nilai                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| Worker          | `semburat-worker` (Hono di Cloudflare Workers)                         |
| Database        | D1 `semburat-db` (binding `DB`)                                        |
| Aset media      | R2 `semburat-assets` (binding `ASSETS`)                                |
| Bucket backup   | R2 `semburat-backups` (prefix `d1/`)                                   |
| Health check    | `GET /health` -> `{"status":"ok","version":"1.0.0","timestamp":"..."}` |
| CI/CD           | GitHub Actions (`.github/workflows/deploy.yml`)                        |
| Package manager | pnpm 9.12.0 (pinned), Node.js 20+                                      |

Script operasional utama:

- `scripts/backup-d1.sh` - ekspor D1 ke SQL, unggah ke R2
- `scripts/restore-d1.sh` - pulihkan D1 dari backup di R2
- `scripts/smoke-test.sh` - verifikasi kesehatan setelah deployment
- `scripts/check-secrets.sh` - pemindaian secret sebelum commit/push

Catatan platform: script shell di atas memerlukan bash (Gunakan Git Bash atau
WSL pada Windows).

Dokumentasi terkait:

- `docs/DEPLOYMENT_GUIDE.md` - panduan deployment lengkap
- `docs/templates/daily-operator-checklist.md`
- `docs/templates/incident-report.md`
- `docs/templates/correction-log.md`
- `docs/templates/article-review-checklist.md`

## 1. Operasi Harian

Waktu standar: 60-90 menit. Jika lebih lama, kurangi volume artikel - jangan
kurangi kualitas review editorial.

Checklist operator (detail di `docs/templates/daily-operator-checklist.md`):

- [ ] Periksa `/status` di Telegram: ada job gagal? kuota aman?
- [ ] Tinjau antrean artikel menggunakan `article-review-checklist.md`
- [ ] Setujui/edit/tolak artikel; catat alasan penolakan
- [ ] Siapkan dan jadwalkan paket sosial yang disetujui (publish manual di fase awal)
- [ ] Catat biaya dan kuota hari ini (OpenRouter, MiniMax, D1, R2)
- [ ] Perbaiki satu hal kecil (satu prompt atau satu template)
- [ ] Tangani laporan koreksi pembaca; jika ada, jalankan alur koreksi (`correction-log.md`)

Verifikasi kesehatan cepat:

```
curl -s https://<worker-url>/health
```

Harapnya mengembalikan JSON `status: ok`. Jalankan juga
`scripts/smoke-test.sh` bila ada kecurigaan gangguan.

Backup harian: jalankan `scripts/backup-d1.sh` (lihat bagian Backup dan
Pemulihan) dan pastikan job backup berhasil.

## 2. Respons Insiden

### Tingkat insiden

| Tingkat | Contoh                                                  | Target respons               |
| ------- | ------------------------------------------------------- | ---------------------------- |
| Rendah  | Typo kecil, job non-kritis terlambat                    | Perbaiki pada operasi harian |
| Sedang  | Job publish gagal berulang, latency tinggi, error R2    | Maksimal 1 jam               |
| Tinggi  | Fakta salah terbit, pelanggaran hak cipta, secret bocor | Segera (kill switch)         |

### Prosedur

1. **Deteksi dan klasifikasi** - dari monitoring, laporan pembaca, atau notifikasi Telegram.
2. **Containment** (wajib untuk tingkat Tinggi):
   - Unpublish artikel bermasalah
   - Hentikan job terkait (kill switch)
   - Cabut token/API key yang bocor dan ganti secret (`wrangler secret put`, perbarui GitHub Actions secrets)
3. **Dokumentasikan** insiden di `docs/templates/incident-report.md`: waktu, tingkat, dampak, tindakan segera, akar masalah.
4. **Perbaiki akar masalah** (kode, prompt, aturan), bukan hanya gejalanya.
5. **Koreksi publik** bila artikel salah sudah terbit - jalankan `correction-log.md` sesuai `docs/pages/correction-policy.md`.
6. **Komunikasi** - beri tahu tim via Telegram atau Slack; dokumentasikan di runbook ini.
7. **Post-mortem** dan langkah pencegahan agar tidak berulang.

Insiden secret bocor: anggap secret terkompromi. Rotasi segera; menghapus
dari repositori saja tidak cukup.

## 3. Backup dan Pemulihan

### Kebijakan

- Backup D1 dijalankan harian via `scripts/backup-d1.sh`.
- Backup disimpan di R2 `semburat-backups` dengan key `d1/semburat-db-<timestamp UTC>.sql`.
- Retensi dikelola oleh lifecycle rules pada bucket `semburat-backups`.
- Aset media di `semburat-assets` menggunakan key deterministik: `assets/{asset_id}/{variant}.{ext}`.

### Backup

```
export CLOUDFLARE_ACCOUNT_ID="<account-id>"
export CLOUDFLARE_API_TOKEN="<token-dengan-izin-D1-dan-R2>"
scripts/backup-d1.sh
```

Variabel opsional: `D1_DATABASE_NAME` (default `semburat-db`),
`R2_BACKUP_BUCKET` (default `semburat-backups`), `BACKUP_PREFIX` (default
`d1`).

Kode keluar:

- `0` - backup berhasil
- `1` - variabel lingkungan wajib tidak ditemukan
- `2` - ekspor atau unggah gagal (termasuk file hasil ekspor kosong)

Jadwalkan script ini sebagai cron job (misalnya GitHub Actions schedule) harian.

### Pemulihan

```
scripts/restore-d1.sh --latest
scripts/restore-d1.sh --file d1/semburat-db-20261007T020000Z.sql
KEEP_DATA=0 scripts/restore-d1.sh --latest
```

- `--latest` membutuhkan `jq`; alternatifnya tentukan key dengan `--file` atau `BACKUP_FILE`.
- `KEEP_DATA=1` (default): data yang ada dipertahankan, konflik dilewati.
- `KEEP_DATA=0`: data dibersihkan dulu (`--clean`) sebelum impor.

Kode keluar: `0` berhasil, `1` argumen/variabel lingkungan hilang, `2`
unduh/impor gagal.

### Aturan pemulihan

- Verifikasi integritas data setelah restore dengan query langsung ke database.
- Uji prosedur restore secara berkala di database non-produksi.
- Jangan pernah mengubah skema produksi secara manual; gunakan migrasi di `apps/worker/migrations/`.
- Rollback kode tidak otomatis berarti rollback database aman - migrasi harus kompatibel mundur.
- Untuk rollback migrasi: buat file migrasi balik, terapkan di maintenance window, verifikasi data.

## 4. Deployment

### CI/CD (push ke `main`)

Pipeline `.github/workflows/deploy.yml` menjalankan:

1. Checkout
2. Install dependensi (pnpm)
3. Lint (ESLint)
4. Format check (Prettier)
5. Typecheck (TypeScript)
6. Test (Vitest)
7. Build (Turborepo)
8. Secret scan (`scripts/check-secrets.sh`)
9. Deploy Worker ke produksi
10. Deploy Web ke Cloudflare Pages
11. Smoke test (`scripts/smoke-test.sh`)
12. Notifikasi sukses/gagal

Kegagalan di tahap mana pun menghentikan deployment.

### Deploy manual

```
cd apps/worker && pnpm deploy
cd apps/web && astro build && wrangler pages deploy dist --project-name semburat-web --branch main
```

### Verifikasi pasca-deploy

```
WORKER_URL=https://<worker-url> SITE_URL=https://<site-url> scripts/smoke-test.sh
```

Smoke test memeriksa 10 hal: endpoint kesehatan Worker, sitemap, RSS, homepage,
halaman artikel, kategori, about, contact, serta validitas XML sitemap dan RSS.

### Rollback

- **Kode**: `git revert <commit-gagal>` lalu `git push origin main`, atau redeploy tag sebelumnya: `git checkout v1.0.0 && pnpm deploy`.
- **Database**: migrasi balik di maintenance window; verifikasi integritas data.
- **Job**: cek tabel `publishing_jobs` untuk job gagal; retry setelah akar masalah diperbaiki. Job bersifat idempoten, retry aman.

### Checklist produksi (sebelum menyatakan deployment selesai)

- [ ] Domain dikonfigurasi dan DNS terverifikasi
- [ ] Worker deployed, `/health` mengembalikan 200
- [ ] D1 terhubung, migrasi diterapkan
- [ ] R2 terhubung dan dapat diakses
- [ ] Secret dikonfigurasi di lingkungan deployment
- [ ] Tidak ada kredensial debug yang di-commit
- [ ] Scheduled job aktif dan berjalan
- [ ] Monitoring dan peringatan dikonfigurasi
- [ ] Backup/pemulihan telah diuji
- [ ] Telegram webhook terdaftar
- [ ] Sitemap dan RSS dapat diakses
- [ ] Halaman artikel mengembalikan 200
- [ ] Smoke test lulus
- [ ] Dokumentasi diperbarui

## 5. Keamanan

- **Tidak ada secret di repositori**: jalankan `scripts/check-secrets.sh` sebelum push (juga dijalankan di CI). Pola yang dideteksi termasuk API key, token Telegram, kunci MiniMax, private key, dan kredensial Google service account.
- **Penyimpanan secret**: GitHub Actions secrets untuk CI; `wrangler secret put` untuk Worker; `.env` untuk lokal (jangan di-commit).
- **Token Cloudflare**: beri scope minimal (Workers, D1, R2, Pages: Read/Edit).
- **Telegram**: `TELEGRAM_WEBHOOK_SECRET` wajib dipasang dan cocok antara `setWebhook` dan Worker; verifikasi dengan `getWebhookInfo`.
- **Rate limiting**: middleware tersedia di `apps/worker/src/middleware/rate-limit.ts`.
- **Audit log**: catat tindakan editorial dan administratif penting; jangan log secret atau payload sensitif.
- **Konten AI diawasi**: setiap klaim hasil AI harus dapat ditelusuri ke sumber; topik berisiko tinggi (kriminal, kesehatan, politik, finansial) wajib review manusia lebih ketat.
- **Input eksternal**: validasi URL dan metadata aset; sanitasi HTML yang dikontrol pengguna.
- **Lisensi aset**: gambar resmi tidak otomatis gratis dipakai; lacak status lisensi dan kredit.

## 6. Pemantauan

### Endpoint kritis (harus HTTP 200)

- `https://<worker-url>/health`
- `https://<site-url>/sitemap.xml`
- `https://<site-url>/rss.xml`
- `https://<site-url>/`
- `https://<site-url>/articles/<slug>/`

### Log

- **Workers**: Cloudflare Dashboard > Workers > Logs. Filter `@request` untuk permintaan HTTP dan `@error` untuk error. Cari error 5xx, respons lambat (>1 detik), dan pengecualian tak tertangani.
- **Pages**: Cloudflare Dashboard > Pages > Deployments; periksa log build dan 404 di console browser.
- **Aplikasi**: `LOG_LEVEL=info` (atau `debug` saat troubleshooting). Log menyertakan correlation ID untuk penelusuran job.

### Ambang peringatan

- Error rate > 1%
- Latensi p95 > 2 detik
- Latensi query D1 > 500 ms
- Kegagalan baca/tulis R2

### Biaya

- Penggunaan compute Workers, unit baca/tulis D1, penyimpanan dan egress R2
- Penggunaan API OpenRouter dan MiniMax
- Aktifkan budget alerts di Cloudflare bila tersedia

## 7. Troubleshooting

### Masalah umum

| Gejala                               | Penyebab dan solusi                                                                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Worker gagal deploy                  | Validasi sintaks `wrangler.jsonc`, pastikan secret lengkap, jalankan `pnpm typecheck` dan `pnpm build` lokal, periksa binding D1/R2 |
| D1 tidak ditemukan                   | Verifikasi `D1_DATABASE_ID` sesuai UUID dari `wrangler d1 create`; cek `wrangler d1 list`                                           |
| R2 403/404                           | Cocokkan nama bucket dengan `R2_BUCKET` dan `wrangler.jsonc`; pastikan token punya izin R2; cek `wrangler r2 ls`                    |
| Web build gagal                      | Periksa integrasi Astro, `outDir` vs pengaturan Pages, log build di dashboard                                                       |
| Variabel lingkungan tidak ter-inject | Cek GitHub Actions secrets, bagian `vars` di `wrangler.jsonc`, atau pengaturan variabel Pages                                       |
| Telegram tidak respons               | Webhook URL harus publik; `TELEGRAM_WEBHOOK_SECRET` harus cocok; cek `getWebhookInfo`                                               |

### Kode error

| Kode | Arti                  | Solusi                                   |
| ---- | --------------------- | ---------------------------------------- |
| 401  | Unauthorized          | Periksa API token dan izin               |
| 403  | Forbidden             | Verifikasi scope token                   |
| 404  | Not Found             | Periksa path URL dan keberadaan resource |
| 429  | Rate Limited          | Terapkan exponential backoff             |
| 500  | Internal Server Error | Baca stack trace di Worker logs          |
| 502  | Bad Gateway           | Periksa ketersediaan layanan upstream    |
| 503  | Service Unavailable   | Periksa https://status.cloudflare.com    |

### Eskalasi

1. Ikuti panduan troubleshooting di atas.
2. Periksa status Cloudflare di https://status.cloudflare.com.
3. Tinjau log workflow GitHub Actions yang gagal.
4. Siapkan laporan: Cloudflare account ID, nama proyek Worker/Pages, pesan error dan timestamp, langkah reproduksi, lingkungan (staging/produksi).
5. Hubungi tim SEMBURAT via Telegram bot atau email.
