# 03 — Checklist Kesiapan Rilis (Tahap C)

## Kriteria penerimaan MVP (PRD bagian 69)

- [ ] **Trend**: tren terkumpul, duplikat terdeteksi, skor dihitung.
- [ ] **Research**: URL sumber tersimpan, fakta terpetakan ke sumber, klaim tak pasti ditandai.
- [ ] **Artikel**: dibuat dari riset, ada quality score, bagian Sumber, metadata SEO.
- [ ] **Editorial**: manusia bisa approve/reject; konten sensitif tidak bisa melewati review.
- [ ] **Aset**: tiap artikel punya status aset; sumber dan lisensi tersimpan; kredit dibuat.
- [ ] **Website**: terbit, responsif, SEO valid, sitemap dan OG berfungsi.
- [ ] **Repurposing**: satu Article ID → varian platform.
- [ ] **Operasi**: Telegram menampilkan antrean/status; job gagal bisa di-retry; log tersedia.

## Delapan quality gate per artikel (PRD bagian 70)

Gunakan `templates/article-review-checklist.md` untuk setiap artikel.

1. Sumber · 2. Fakta · 3. Orisinalitas · 4. Risiko · 5. Editorial · 6. SEO · 7. Aset · 8. Publish

## Halaman dan teknis wajib

- [x] Halaman dari folder `pages/` sudah tayang: About, Editorial Policy, Correction Policy, Source Policy, AI Policy, Contact, Privacy, Terms. **Catatan:** teks yang bergantung pada data operator kini dibaca dari `apps/web/src/data/site-config.ts` dan masih berisi placeholder sampai diisi pemilik.
- [x] Pernyataan transparansi AI tampil (footer semua halaman + halaman AI Policy).
- [x] `sitemap.xml`, `robots.txt`, RSS berfungsi (`robots.txt` menunjuk sitemap, `PUBLIC_SITE_URL`).
- [x] Canonical, Open Graph, kartu X, breadcrumbs berfungsi.
- [x] Structured data sesuai isi yang terlihat: `WebSite`, `Organization`, `Article`, `BreadcrumbList`.
- [~] Label "Diperbarui" tampil bila `updated_at` berbeda ≥1 jam; catatan koreksi per artikel belum ada.
- [x] Tidak ada popup agresif.
- [ ] Label afiliasi dan "Konten Bersponsor" belum disiapkan.
- [x] Situs bisa diakses tanpa JavaScript untuk konten artikel (Astro statis).

## Sisa untuk operator (data pribadi/brand)

Semua data operator sekarang terpusat di **`apps/web/src/data/site-config.ts`** — isi file itu saja:

- nama pengelola/badan, alamat, peran, tanggal diperbarui, yurisdiksi, usia minimum
- 5 email redaksi/koreksi/hak cipta/kerja sama/privasi + hari kerja balasan
- penyedia analitik, newsletter, daftar penyedia layanan, catatan cookie/retensi/evaluasi ulasan

- Ganti email contoh di `contact.astro` tidak diperlukan lagi (sudah memakai `site-config`).
- Aktifkan R2 lalu deploy ulang worker production (binding `ASSETS` masih dikomentari).
- Set `PUBLIC_SITE_URL` saat build web (sudah dipakai untuk canonical/robots/sitemap).
