# SEMBURAT — Roadmap Tes, Deploy, Template Desain & Simulasi Pendapatan

**Berdasarkan:** SEMBURAT_PRD.md v1.0.0 (7 Oktober 2026)
**Status proyek saat ini:** Semua modul sudah dibuat di VSCode sesuai PRD. Belum deploy ke Cloudflare. Belum diuji menyeluruh. Template desain konten belum dibuat. Skill desain (`/skill-creator`) belum dibuat.
**Tujuan dokumen:** Panduan kerja dari "kode selesai" sampai "media berjalan, terindeks, dan mulai menghasilkan pendapatan" dengan modal 0 rupiah.

---

## Daftar Isi

1. Ringkasan Analisis
2. Risiko Utama & Mitigasi
3. Prinsip Kerja Fase Ini
4. Tahap A — Tes Lokal
5. Tahap B — Deploy Staging di Cloudflare
6. Tahap C — Checklist Kesiapan Rilis
7. Tahap D — Soft Launch
8. Tahap E — Template Desain Konten & Skill Desain
9. Simulasi Pendapatan Bertahap
10. Jalur Reinvestasi (Tetap Modal 0)
11. Rencana 14 Hari Pertama
12. Gerbang Go / No-Go
13. Metrik yang Dipantau
14. Lampiran: Template Log Tes & Daftar Topik Uji

---

## 1. Ringkasan Analisis

### Kekuatan PRD

- Arsitektur cocok untuk modal 0 rupiah: Astro + Tailwind, Cloudflare Pages/Workers/D1/R2, GitHub Actions, Python, OpenRouter, Telegram Bot.
- Prinsip yang benar: _source first_, _human-in-the-loop_, _reuse before regenerate_, _one story many assets_.
- Anti-pattern sudah dilarang tegas (content farm, scraper farm, clickbait farm).
- Engine modular (trend, research, editorial, asset, media, repurpose, analytics), sehingga mudah diganti sebagian.
- Ada quality gate, klasifikasi risiko, deteksi duplikat, kill switch, dan alur koreksi.

### Kelemahan / Hal yang Perlu Disederhanakan

- Cakupan sangat lebar: 8 kanal, 5 pilar konten, video, voice over. Untuk satu orang, ini terlalu banyak sekaligus.
- PRD bagian 79 sudah menyarankan loop terkecil lebih dulu: **Trend → Research → Artikel → Review → Publish**. Ikuti itu untuk peluncuran.
- Sebagian layanan tidak benar-benar gratis atau tidak stabil gratis (MiniMax, API sosial media, render video di CI, model gratis OpenRouter).
- Belum ada penentuan niche awal yang sempit. Lima pilar sekaligus melemahkan otoritas topik di mata mesin pencari.

### Rekomendasi Inti

1. **Kunci 2 niche dulu**, misalnya Gaming (MLBB/esports) + Teknologi. Pilar lain menyusul setelah ada data.
2. **Semua artikel manual-approve** selama 2–4 minggu pertama. Auto-publish dinyalakan bertahap, hanya untuk risiko rendah.
3. **Tunda** posting otomatis ke sosial media, voice over berbayar, dan video berat. Siapkan paket konten dan publish manual dulu.
4. **Naikkan porsi evergreen** (explainer, perbandingan, how-to) menjadi 30–40% dari awal, karena konten trending hanya memberi traffic naik-turun.

---

## 2. Risiko Utama & Mitigasi

| #   | Risiko                                         | Dampak                            | Mitigasi                                                                                        |
| --- | ---------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | Konten dinilai massal/tipis oleh mesin pencari | Tidak terindeks, ditolak AdSense  | Review manual, sumber jelas, sudut pandang original, jumlah artikel dibatasi di awal            |
| 2   | Pelanggaran hak cipta (gambar/teks)            | Takedown, sengketa, akun diblokir | Asset registry wajib, kredit visual, tidak menyalin gambar tanpa izin, tidak menyalin teks utuh |
| 3   | Fakta salah / klaim tak terverifikasi          | Reputasi rusak                    | Status Confirmed/Reported/Unverified/Disputed, review wajib untuk topik risiko tinggi           |
| 4   | Kuota free tier habis                          | Pipeline berhenti                 | Monitor kuota, antrean, fallback provider, frekuensi job rendah di awal                         |
| 5   | API sosial butuh izin/review                   | Posting otomatis gagal            | Mode "Generate → Prepare → Queue → Human publish"                                               |
| 6   | Render video memakan menit CI                  | Workflow timeout/habis menit      | Tunda video, render lokal dulu, atau batasi 1–2 video per hari                                  |
| 7   | Secret bocor                                   | Akun/API diambil alih             | Hanya simpan di GitHub/Cloudflare secrets, cek log dan riwayat commit                           |
| 8   | Semua traffic bergantung pada satu platform    | Traffic anjlok mendadak           | Bangun newsletter dan audiens milik sendiri sejak awal                                          |
| 9   | Burnout operator tunggal                       | Proyek berhenti                   | Batasi volume harian, otomatisasi notifikasi, jadwal review tetap                               |

---

## 3. Prinsip Kerja Fase Ini

1. **Uji sebelum deploy, deploy sebelum publik, publik sebelum skala.**
2. **Satu perubahan besar pada satu waktu**, supaya penyebab masalah mudah dilacak.
3. **Catat semuanya**: hasil tes, kegagalan, biaya, kuota (lihat Lampiran 14).
4. **Kualitas di atas kuantitas.** Lebih baik 30 artikel yang baik daripada 300 artikel tipis.
5. **Jangan percaya angka free tier dari ingatan**. Cek halaman resmi tiap penyedia sebelum menentukan jadwal job.

---

## 4. Tahap A — Tes Lokal (Sebelum Deploy)

> Tujuan: memastikan logika inti benar sebelum menyentuh produksi.

### A1. Tes Unit

- [ ] **Trend scoring**: rumus (velocity, search interest, source count, relevance, freshness, monetization, risk) menghasilkan skor 0–100 yang benar. Uji nilai batas (0, 100, semua bobot sama).
- [ ] **Ambang aksi**: 90–100 Priority, 75–89 Generate, 60–74 Queue, 40–59 Monitor, <40 Ignore.
- [ ] **Deduplikasi tren**: topik sama dengan judul berbeda terdeteksi sebagai satu tren.
- [ ] **Klasifikasi risiko**: politik, kriminal, kesehatan, saran keuangan, tuduhan, anak di bawah umur, bencana otomatis High.
- [ ] **Aturan publish**: skor ≥ 90 dan risiko Low → boleh auto; 75–89 → review; 60–74 → regenerate; <60 → reject; topik sensitif selalu override skor.
- [ ] **Quality score**: bobot total 100% dan hasil sesuai perhitungan manual.
- [ ] **Validasi skema**: artikel, tren, riset, aset, content_variants, analytics menolak data tidak valid.
- [ ] **Slug**: unik, bersih, tanpa karakter aneh, aman untuk bahasa Indonesia.
- [ ] **Pembuat kredit visual** menghasilkan teks yang benar sesuai tipe lisensi.

### A2. Tes Integrasi

- [ ] Trend collector → tersimpan di tabel `trends` (D1 lokal/miniflare).
- [ ] Trend → Research engine → `research` berisi `facts_json`, `claims_json`, `conflicts_json`, `confidence_score`.
- [ ] Setiap fakta penting terhubung ke minimal satu sumber (URL tersimpan).
- [ ] Research → Editorial engine → artikel + judul + SEO + FAQ + ringkasan.
- [ ] Quality check → status artikel berubah sesuai aturan.
- [ ] Artikel disetujui → muncul di halaman web (build Astro).
- [ ] Satu `article_id` → varian untuk IG, Carousel, Story, FB, X, Threads, Telegram, Reel/Short tercatat di `content_variants`.
- [ ] Deteksi duplikat: artikel mirip → memperbarui artikel lama, bukan membuat baru.

### A3. Tes End-to-End (Dry-Run)

- [ ] Jalankan seluruh pipeline dengan flag **dry-run** (tanpa publish) pada 5 topik uji.
- [ ] Setiap job punya `job_id`, `started_at`, `completed_at`, `status`, `error`, `retry_count`.
- [ ] Log terbaca dan tidak memuat secret.
- [ ] Waktu dari deteksi tren sampai draf siap dicatat.
- [ ] Biaya token/API per artikel dicatat (target: tahu angkanya sebelum skala).

### A4. Tes Kualitas Konten (Evaluasi Prompt)

Siapkan **20 topik uji** (lihat Lampiran 14), lalu nilai manual:

- [ ] Akurasi fakta (cek ke sumber asli).
- [ ] Tidak ada kutipan palsu.
- [ ] Tidak ada klaim "diduga" yang berubah jadi "terjadi".
- [ ] Tidak sekadar parafrase satu sumber (cek apakah ada sintesis dan konteks).
- [ ] Bahasa Indonesia natural, tidak kaku, tidak clickbait.
- [ ] Bagian "Apa yang kita tahu" dan "Apa yang belum kita tahu" terisi bermakna.
- [ ] Judul tidak berlebihan.
- [ ] Simpan versi prompt (`prompt_version`), model, dan pengaturan untuk setiap hasil, supaya bisa dibandingkan.

### A5. Tes Kegagalan (Chaos Test)

- [ ] OpenRouter mati/timeout → retry dengan backoff, lalu fallback model, lalu masuk antrean gagal.
- [ ] Sumber kosong / URL 404 → status `NEEDS_RESEARCH`, bukan artikel kosong.
- [ ] Kuota habis → job berhenti rapi dan kirim alert Telegram.
- [ ] Database tidak bisa ditulis → tidak ada data setengah jadi.
- [ ] Dua job berjalan bersamaan → tidak ada artikel ganda.
- [ ] **Kill switch** menghentikan semua job terjadwal.
- [ ] Input berbahaya di teks sumber (prompt injection dalam halaman web) tidak mengubah perilaku AI.

### A6. Tes Keamanan

- [ ] Tidak ada API key di repo (cek juga riwayat git).
- [ ] `.env` masuk `.gitignore`.
- [ ] Endpoint Worker admin dilindungi autentikasi.
- [ ] Telegram bot hanya merespons ID pengguna yang diizinkan.
- [ ] Input pengguna (form kontak/newsletter) divalidasi dan diberi rate limit.

---

## 5. Tahap B — Deploy Staging di Cloudflare

> Tujuan: menjalankan sistem sungguhan di lingkungan terpisah dari publik.

### B1. Persiapan Akun & Sumber Daya

- [ ] Akun Cloudflare dan GitHub siap, 2FA aktif.
- [ ] Buat database **D1** (staging) dan jalankan migrasi dari `database/migrations`.
- [ ] Buat bucket **R2** (staging).
- [ ] Pasang secrets: `OPENROUTER_API_KEY`, `TELEGRAM_BOT_TOKEN`, `CLOUDFLARE_API_TOKEN`, dan lainnya. Tambahkan `MINIMAX_API_KEY` hanya jika dipakai.
- [ ] Simpan secret di GitHub Actions Secrets dan Cloudflare secrets saja.

### B2. Deploy

- [ ] Deploy **Cloudflare Pages** (pakai subdomain `*.pages.dev` dulu).
- [ ] Deploy **Worker** (API, webhook Telegram, endpoint admin).
- [ ] Cek health check: halaman utama, endpoint API, koneksi D1, akses R2.
- [ ] Pasang pipeline CI/CD: Push → Lint → Test → Build → Deploy → Health Check.

### B3. Workflow Terjadwal (Mulai Pelan)

Frekuensi awal yang disarankan (lebih rendah dari PRD, naikkan setelah stabil):

| Workflow                     | Frekuensi awal                    |
| ---------------------------- | --------------------------------- |
| trend-discovery              | tiap 1–2 jam                      |
| research                     | tiap 2–3 jam untuk tren prioritas |
| content-generation           | 2–3 kali sehari                   |
| distribution (siapkan paket) | harian                            |
| analytics                    | harian                            |

- [ ] Jalankan tiap workflow **manual dulu**, baru aktifkan jadwal.
- [ ] Pasang pemantauan kuota dan alert ke Telegram.

### B4. Telegram Bot

- [ ] `/start`, `/status`, `/trending`, `/articles`, `/review` berfungsi.
- [ ] `/approve`, `/reject`, `/regenerate`, `/publish`, `/schedule` mengubah status di D1.
- [ ] Notifikasi kegagalan job dan antrean review masuk.
- [ ] Hanya pemilik yang bisa memakai perintah sensitif.

### B5. Tes di Staging

- [ ] Ulangi tes integrasi A2 dan A3 di lingkungan staging.
- [ ] Jalankan tes di HP (Android + iOS jika ada) dan beberapa browser.
- [ ] Ukur kecepatan (PageSpeed Insights) dan perbaiki yang merah.

---

## 6. Tahap C — Checklist Kesiapan Rilis

### C1. Kriteria Penerimaan MVP (dari PRD bagian 69)

**Trend**

- [ ] Sistem mengumpulkan tren, duplikat terdeteksi, skor dihitung.

**Research**

- [ ] URL sumber tersimpan, fakta terpetakan ke sumber, klaim tak pasti ditandai.

**Artikel**

- [ ] Artikel dibuat dari riset, quality score muncul, ada bagian Sumber, metadata SEO ada.

**Editorial**

- [ ] Manusia bisa approve/reject, konten sensitif tidak bisa melewati review.

**Aset**

- [ ] Setiap artikel punya status aset, sumber dan lisensi tersimpan, kredit dibuat.

**Website**

- [ ] Artikel terbit, responsif, SEO valid, sitemap berfungsi, OG metadata berfungsi.

**Repurposing**

- [ ] Satu Article ID menghasilkan varian platform.

**Operasi**

- [ ] Telegram menampilkan antrean dan status, job gagal bisa di-retry, log tersedia.

### C2. Delapan Quality Gate per Artikel (PRD bagian 70)

1. [ ] **Sumber**: cukup sumber terpercaya.
2. [ ] **Fakta**: klaim terpetakan ke sumber.
3. [ ] **Orisinalitas**: bukan parafrase sederhana.
4. [ ] **Risiko**: klasifikasi risiko terisi.
5. [ ] **Editorial**: sesuai gaya brand.
6. [ ] **SEO**: metadata lengkap.
7. [ ] **Aset**: visual legal dan ada kredit.
8. [ ] **Publish**: persetujuan akhir.

### C3. Halaman & Teknis Wajib

- [ ] About, Editorial Policy, Correction Policy, Source Policy, AI Policy, Contact, Privacy, Terms, Newsletter.
- [ ] Pernyataan transparansi AI (PRD bagian 33) tampil jelas.
- [ ] `sitemap.xml`, `robots.txt`, RSS berfungsi.
- [ ] Canonical, Open Graph, kartu X, breadcrumbs berfungsi.
- [ ] Structured data (Article/NewsArticle/WebSite/Organization/BreadcrumbList) sesuai isi yang terlihat. Cek dengan Rich Results Test.
- [ ] Label **"Diperbarui"** dan catatan koreksi berfungsi.
- [ ] Tidak ada popup agresif saat halaman pertama dimuat.
- [ ] Label afiliasi dan "Konten Bersponsor" siap dipakai (walaupun belum digunakan).

---

## 7. Tahap D — Soft Launch (Minggu 1–4)

### D1. Pengaturan Awal

- [ ] Auto-publish **dimatikan**. Semua artikel melalui review manual.
- [ ] Fokus 2 niche (usulan: Gaming + Teknologi).
- [ ] Target: **30–50 artikel berkualitas** dalam 4 minggu pertama.
- [ ] Campuran konten awal (disesuaikan dari PRD bagian 77):

| Jenis                                 | Porsi |
| ------------------------------------- | ----- |
| Trending / Viral (risiko rendah saja) | 20%   |
| Teknologi                             | 25%   |
| Gaming                                | 25%   |
| Explainer / Evergreen                 | 30%   |

### D2. Pendaftaran & Indeks

- [ ] Daftarkan situs ke **Google Search Console** dan **Bing Webmaster Tools**.
- [ ] Kirim sitemap.
- [ ] Pantau status indeks mingguan.
- [ ] Beri tautan internal antarartikel dan buat klaster topik (mis. AI, MLBB, smartphone).

### D3. Ritme Operasional

- [ ] Review harian di Telegram pada jam tetap (mis. 30–60 menit pagi dan malam).
- [ ] Ringkasan mingguan: artikel terbit, ditolak, alasan penolakan, biaya, kuota.
- [ ] Perbaiki prompt berdasarkan alasan penolakan (catat `prompt_version`).

### D4. Kapan Menyalakan Auto-Publish

Nyalakan hanya untuk risiko **Low** jika semua syarat ini terpenuhi:

- [ ] Minimal 30 artikel berturut-turut lolos review tanpa koreksi fakta besar.
- [ ] Tidak ada insiden hak cipta/kesalahan serius dalam 2 minggu.
- [ ] Ambang skor awal dinaikkan ke ≥ 92, lalu turunkan perlahan jika aman.

---

## 8. Tahap E — Template Desain Konten & Skill Desain

### E1. Token Brand (Kerjakan Pertama)

Simpan di `packages/brand`:

- [ ] Logo (versi terang/gelap, ikon, wordmark).
- [ ] Palet warna (primer, sekunder, aksen, latar, teks, status).
- [ ] Font (judul, isi, angka). Pilih font dengan lisensi bebas.
- [ ] Watermark SEMBURAT (posisi, ukuran, opacity).
- [ ] Safe margin tiap format.
- [ ] Gaya judul (informatif-penasaran, tidak sensasional).

### E2. Katalog Template Prioritas

| #   | Template                | Ukuran                 | Dipakai untuk                                                                        |
| --- | ----------------------- | ---------------------- | ------------------------------------------------------------------------------------ |
| 1   | Hero / OG image         | 1200×630               | Website, Facebook, X, link preview                                                   |
| 2   | Carousel Instagram      | 1080×1350 (7 slide)    | Hook, apa yang terjadi, fakta kunci, konteks, kenapa penting, kesimpulan, CTA/sumber |
| 3   | Kartu fakta / kutipan   | 1080×1080              | Feed IG, Threads, X                                                                  |
| 4   | Story / Reel cover      | 1080×1920              | Story, Reel, TikTok, Shorts                                                          |
| 5   | Gambar post X           | 1600×900               | Post/thread X                                                                        |
| 6   | Video Breaking/Trending | 1080×1920, 30–45 detik | Reel, TikTok, Shorts (Remotion)                                                      |
| 7   | Video Explainer         | 1080×1920              | Konten edukasi                                                                       |
| 8   | Slide sumber & kredit   | semua format           | Wajib di akhir video dan carousel                                                    |

Template video lain (Top 5, Comparison, Timeline, Data Story) menyusul setelah template 1–7 stabil.

### E3. Aturan Wajib untuk Semua Template

- [ ] Selalu ada slot **kredit visual** dan **sumber**.
- [ ] Watermark SEMBURAT tidak menutup konten penting.
- [ ] Teks tidak keluar dari safe area platform.
- [ ] Kontras teks memenuhi keterbacaan di layar HP.
- [ ] Tidak membuat gambar AI yang bisa disangka foto produk/peristiwa nyata (PRD bagian 24).
- [ ] Hook muncul di 1–3 detik pertama untuk video.
- [ ] Teks maksimal sekitar 12–15 kata per slide agar terbaca cepat.

### E4. Langkah Membuat Skill Desain dengan `/skill-creator`

1. **Kumpulkan bahan**: token brand (E1), katalog template (E2), aturan (E3), dan 5–10 artikel contoh nyata dari hasil soft launch.
2. **Jalankan `/skill-creator`** dan minta dibuat skill bernama misalnya `semburat-design`, dengan tujuan: "Membuat aset visual sosial dan video dari satu artikel sesuai identitas SEMBURAT."
3. **Isi `SKILL.md`** berisi:
   - kapan skill dipakai (artikel baru butuh paket visual),
   - input yang dibutuhkan (judul, ringkasan, 3–5 fakta kunci, sumber, kredit visual, kategori),
   - alur kerja: pilih template → isi slot → render → cek aturan E3 → simpan ke R2 → catat di `assets` dan `content_variants`,
   - batasan (hak cipta, tidak membuat gambar palsu).
4. **Sertakan sumber daya skill**: file token brand, template HTML/React/Remotion, skrip render (mis. HTML ke PNG atau Remotion render).
5. **Buat uji (eval)**: 5–10 prompt contoh (gadget baru, patch game, viral, explainer, topik berisiko). Nilai hasil: teks terbaca, sesuai brand, kredit ada, tidak melanggar aturan.
6. **Iterasi** berdasarkan hasil uji sampai konsisten, lalu kunci versi (`design_skill_v1.0`).
7. **Hubungkan** ke pipeline: modul `repurpose-engine` memanggil template yang sama dengan skill, supaya hasil otomatis dan hasil manual konsisten.

### E5. Cek Kualitas Template

- [ ] Uji dengan judul sangat panjang, sangat pendek, dan banyak angka.
- [ ] Uji dengan tanpa gambar (fallback ke desain tipografi).
- [ ] Uji tampilan di HP sebenarnya, bukan hanya di layar komputer.
- [ ] Ukuran file gambar tetap ringan (kompresi aman).

---

## 9. Simulasi Pendapatan Bertahap

> **Penting:** Ini simulasi dengan asumsi konservatif, bukan jaminan. Hasil nyata sangat bergantung pada kualitas konten, konsistensi, niche, dan perubahan algoritma.

### Asumsi

- RPM iklan display di Indonesia: sekitar **Rp 15.000–25.000 per 1.000 pageview** (bervariasi menurut niche dan jaringan iklan).
- Pendapatan afiliasi: sekitar **Rp 10.000–20.000 per 1.000 pageview** jika ada konten bernuansa beli (review, perbandingan, rekomendasi). Tanpa konten seperti itu, mendekati nol.
- Monetisasi sosial media (YouTube, TikTok, Instagram) dianggap **bonus**. Syaratnya berubah-ubah, jadi cek syarat terbaru sebelum mengandalkannya.
- Biaya awal: Rp 0 (domain opsional ±Rp 150–200 ribu/tahun).

### Peta Per Fase

| Fase              | Waktu       | Kondisi                                                                     | Output konten                     | Pendapatan/bulan (kisaran)                                 |
| ----------------- | ----------- | --------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------- |
| **0. Fondasi**    | Bulan 0–1   | Tes, deploy, soft launch                                                    | 10–30 artikel                     | **Rp 0**                                                   |
| **1. Indeksasi**  | Bulan 1–3   | Situs mulai terindeks, traffic puluhan–ratusan kunjungan/hari               | 30–100 artikel total              | **Rp 0–100 ribu**                                          |
| **2. Tumbuh**     | Bulan 3–6   | Mulai muncul di pencarian, 500–2.000 pageview/hari, AdSense/afiliasi aktif  | 150–300 artikel total             | **Rp 0,5–2 juta**                                          |
| **3. Stabil**     | Bulan 6–12  | Pembaca kembali, newsletter 500–2.000 pelanggan, 5.000–15.000 pageview/hari | 300–600 artikel total             | **Rp 5–15 juta** (+ sponsor kecil)                         |
| **4. Berkembang** | Bulan 12–24 | Brand dikenal, 30.000–100.000 pageview/hari                                 | 600+ artikel, sebagian diperbarui | **Rp 30–100 juta+** (iklan, afiliasi, sponsor, newsletter) |

### Hitungan Contoh

**Fase 2 (bulan ke-5):** 1.500 pageview/hari × 30 = 45.000 pageview/bulan.
RPM iklan Rp 20.000 + afiliasi Rp 10.000 = Rp 30.000 per 1.000 pageview → sekitar **Rp 1,35 juta/bulan**.

**Fase 3 (bulan ke-10):** 10.000 pageview/hari × 30 = 300.000 pageview/bulan.
Rp 30.000 × 300 = **Rp 9 juta/bulan**, ditambah satu–dua sponsor kecil (mis. Rp 1–3 juta).

**Fase 4 (bulan ke-18):** 60.000 pageview/hari × 30 = 1,8 juta pageview/bulan.
Rp 30.000 × 1.800 = **Rp 54 juta/bulan**, ditambah sponsor dan newsletter.

### Skenario

| Skenario  | Gambaran                                                                                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Buruk** | Traffic stagnan di bawah 500 pageview/hari setelah 6 bulan. Penyebab umum: konten tipis, tidak konsisten, terlalu banyak topik, tidak terindeks. Pendapatan mendekati nol. |
| **Dasar** | Mengikuti tabel di atas dengan keterlambatan 2–4 bulan.                                                                                                                    |
| **Baik**  | Satu niche menang (mis. panduan game atau perbandingan gadget), traffic 2–3× lebih cepat dari tabel.                                                                       |

### Pelajaran dari Simulasi

1. **Pendapatan awal hampir nol.** Fase 0–2 adalah investasi waktu, bukan penghasilan.
2. **Evergreen mengalahkan viral.** Konten viral memberi lonjakan sesaat dengan RPM rendah. Konten perbandingan/review/explainer membangun traffic stabil dan afiliasi.
3. **Newsletter adalah aset terbesar jangka panjang.** Audiens milik sendiri tidak bergantung pada algoritma.
4. **Review manusia menjadi pembeda.** Ketika banyak situs AI massal ditinggalkan mesin pencari, situs dengan standar editorial yang jelas bertahan.
5. **Biaya sebenarnya adalah waktu Anda.** Siapkan 1–2 jam per hari untuk review di fase awal.

---

## 10. Jalur Reinvestasi (Tetap Modal 0)

| Pendapatan bulanan | Investasi berikutnya                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| Rp 0               | Gunakan semua layanan gratis, fokus kualitas dan konsistensi                                              |
| Rp 150–200 ribu    | Domain `.com`/`.id` sendiri (ganti dari `pages.dev`), email domain                                        |
| Di atas Rp 1 juta  | Kredit LLM berbayar agar kualitas dan kuota stabil                                                        |
| Di atas Rp 5 juta  | Cloudflare Workers berbayar jika kuota mentok, alat newsletter, editor paruh waktu untuk review           |
| Di atas Rp 15 juta | Voice over dan video yang lebih matang, pitch sponsor/media kit, desainer lepas untuk template            |
| Di atas Rp 30 juta | Pertimbangkan sub-brand (Tech/Gaming) hanya jika traffic membenarkan, mulai uji produk data (Trend Radar) |

Aturan praktis: **maksimal 30–40% pendapatan diinvestasikan kembali** di awal, sisanya untuk Anda agar proyek tetap berkelanjutan.

---

## 11. Rencana 14 Hari Pertama

| Hari  | Fokus                                                                 | Hasil yang diharapkan                                |
| ----- | --------------------------------------------------------------------- | ---------------------------------------------------- |
| 1     | Tes unit (A1)                                                         | Semua logika skor, risiko, dan aturan publish lolos  |
| 2     | Tes integrasi (A2)                                                    | Trend → riset → artikel tersimpan di D1 lokal        |
| 3     | Dry-run end-to-end + evaluasi prompt (A3, A4)                         | 5–20 artikel uji dinilai manual                      |
| 4     | Tes kegagalan + keamanan (A5, A6)                                     | Kill switch, retry, dan perlindungan secret terbukti |
| 5     | Siapkan D1, R2, secrets, deploy Pages + Worker (B1, B2)               | Staging hidup                                        |
| 6     | Workflow GitHub Actions manual + bot Telegram (B3, B4)                | Pipeline berjalan di staging                         |
| 7     | Tes staging di HP + kecepatan (B5)                                    | Daftar perbaikan terisi dan dikerjakan               |
| 8     | Halaman kebijakan + teknis SEO (C3)                                   | Semua halaman wajib tayang                           |
| 9     | Checklist penerimaan MVP + quality gate (C1, C2)                      | Semua centang atau daftar celah jelas                |
| 10    | Token brand + 3 template pertama (E1, E2)                             | Hero/OG, carousel, kartu fakta siap                  |
| 11–12 | Terbitkan 10 artikel pertama (manual-approve) + daftar Search Console | Artikel terbit dan sitemap terkirim                  |
| 13    | Buat skill `semburat-design` di `/skill-creator` + evaluasi (E4)      | Skill versi 1 siap                                   |
| 14    | Evaluasi minggu 2: biaya, kuota, alasan penolakan, rencana minggu 3–4 | Keputusan go/no-go ke fase berikutnya                |

---

## 12. Gerbang Go / No-Go

### Gerbang 1 — Boleh Deploy Staging

- [ ] Semua tes Tahap A lolos.
- [ ] Tidak ada secret di repo.
- [ ] Kill switch terbukti bekerja.

### Gerbang 2 — Boleh Rilis Publik

- [ ] Tahap B dan C selesai.
- [ ] Minimal 10 artikel lolos review manual dengan kualitas konsisten.
- [ ] Halaman kebijakan lengkap.

### Gerbang 3 — Boleh Menyalakan Auto-Publish (Risiko Rendah)

- [ ] Syarat D4 terpenuhi.
- [ ] Tingkat koreksi fakta rendah dan stabil.

### Gerbang 4 — Boleh Menambah Niche / Kanal Baru

- [ ] Traffic organik tumbuh dua bulan berturut-turut.
- [ ] Beban review masih terkendali.
- [ ] Biaya per artikel diketahui dan masih sehat.

### Gerbang 5 — Boleh Mengaktifkan Video & Voice Over Rutin

- [ ] Loop artikel stabil.
- [ ] Ada pendapatan atau anggaran yang mendukung.
- [ ] Hak penggunaan audio/voice dari penyedia sudah dicatat.

---

## 13. Metrik yang Dipantau

**Metrik utama (North Star):** pendapatan per 1.000 pengunjung berkualitas.

**Mingguan (fase awal):**

| Kategori    | Metrik                                                    |
| ----------- | --------------------------------------------------------- |
| Produksi    | Artikel diterbitkan, ditolak, dan alasan penolakan        |
| Kualitas    | Rata-rata quality score, jumlah koreksi                   |
| Efisiensi   | Biaya per artikel, waktu dari tren ke publish             |
| Teknis      | Job sukses/gagal, kuota terpakai, durasi job              |
| Pertumbuhan | Halaman terindeks, impresi, klik, CTR pencarian           |
| Audiens     | Pengunjung kembali, pelanggan newsletter, pengikut sosial |
| Pendapatan  | Iklan, afiliasi, sponsor, pendapatan per artikel          |

**Keputusan berbasis data:** setelah ada data, tinjau tiap bulan artikel mana yang paling menghasilkan, lalu sesuaikan campuran konten.

---

## 14. Lampiran

### 14.1 Template Log Tes

```text
Tanggal:
Tahap / ID tes:
Skenario:
Hasil yang diharapkan:
Hasil aktual:
Status: LULUS / GAGAL
Catatan / perbaikan:
Versi kode / prompt_version / model:
```

### 14.2 Daftar 20 Topik Uji (Isi Sesuai Niche)

Gunakan campuran berikut untuk evaluasi prompt:

| Jenis                               | Jumlah | Contoh arah topik                                                            |
| ----------------------------------- | ------ | ---------------------------------------------------------------------------- |
| Gadget / aplikasi (risiko rendah)   | 4      | Peluncuran smartphone, pembaruan aplikasi                                    |
| Game / esports (risiko rendah)      | 4      | Patch game, turnamen, perubahan hero                                         |
| Explainer / evergreen               | 4      | "Bagaimana AI agent bekerja", "Apa itu ..."                                  |
| Perbandingan / review               | 3      | A vs B, rekomendasi produk                                                   |
| Viral / hiburan (risiko menengah)   | 3      | Tren internet, kontroversi kreator                                           |
| Topik sensitif (uji pagar pengaman) | 2      | Politik/kriminal: **harus** masuk review manual dan tidak boleh auto-publish |

### 14.3 Checklist Harian Operator (Fase Awal)

- [ ] Cek `/status` di Telegram (job gagal? kuota?).
- [ ] Review antrean artikel (sumber, fakta, aset, kredit).
- [ ] Setujui / edit / tolak, catat alasan penolakan.
- [ ] Siapkan dan jadwalkan paket sosial yang disetujui (publish manual).
- [ ] Catat biaya dan kuota harian.
- [ ] Satu perbaikan kecil pada prompt atau template.

### 14.4 Catatan Penting

- Angka free tier (Cloudflare, GitHub Actions, OpenRouter) dan syarat monetisasi platform **dapat berubah**. Verifikasi ke halaman resmi saat merencanakan jadwal dan anggaran.
- Hak cipta: gambar di situs resmi **tidak otomatis bebas pakai**. Selalu cek lisensi dan simpan provenance di asset registry.
- Label afiliasi dan konten bersponsor wajib jelas. Jangan menyamarkan konten berbayar sebagai editorial independen.

---

_Dokumen ini adalah panduan kerja pendamping SEMBURAT_PRD.md. Perbarui secara berkala sesuai hasil tes dan data nyata._
