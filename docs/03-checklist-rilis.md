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

## Halaman dan teknis wajib

- [x] Halaman dari folder `pages/` sudah tayang: About, Editorial Policy, Correction Policy, Source Policy, AI Policy, Contact, Privacy, Terms. **Catatan:** masih ada placeholder data operator (`[NAMA/BADAN]`, `[EMAIL ...]`, `[TANGGAL]`, `[USIA]`, `[DAFTAR PENYEDIA]`, `[X] hari`) yang harus diisi pemilik sebelum rilis publik.
- [x] Pernyataan transparansi AI tampil (footer semua halaman + halaman AI Policy).
- [x] `sitemap.xml`, `robots.txt`, RSS berfungsi (`robots.txt` menunjuk sitemap, `PUBLIC_SITE_URL`).
- [x] Canonical, Open Graph, kartu X, breadcrumbs berfungsi.
- [x] Structured data sesuai isi yang terlihat: `WebSite`, `Organization`, `Article`, `BreadcrumbList`.
- [~] Label "Diperbarui" tampil bila `updated_at` berbeda ≥1 jam; catatan koreksi per artikel belum ada.
- [x] Tidak ada popup agresif.
- [ ] Label afiliasi dan "Konten Bersponsor" belum disiapkan.
- [x] Situs bisa diakses tanpa JavaScript untuk konten artikel (Astro statis).

## Sisa untuk operator (data pribadi/brand)

- Ganti placeholder `[...]` di `about`, `contact`, `privacy`, `terms`, `editorial-policy` (nama badan, alamat, email, tanggal, usia minimum, daftar penyedia).
- Ganti email contoh `editorial@semburat.example.id` di `contact.astro`.
- Aktifkan R2 lalu deploy ulang worker production (binding `ASSETS` masih dikomentari).
- Tambahkan `PUBLIC_SITE_URL` saat build web agar canonical/robots/sitemap memakai domain final.
