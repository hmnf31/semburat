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

- [ ] Halaman dari folder `pages/` sudah diisi (ganti semua `[...]`) dan tayang: About, Editorial Policy, Correction Policy, Source Policy, AI Policy, Contact, Privacy, Terms.
- [ ] Pernyataan transparansi AI tampil jelas.
- [ ] `sitemap`, `robots.txt`, RSS berfungsi.
- [ ] Canonical, Open Graph, kartu X, breadcrumbs berfungsi.
- [ ] Structured data sesuai isi yang terlihat (cek Rich Results Test).
- [ ] Label "Diperbarui" dan catatan koreksi berfungsi.
- [ ] Tidak ada popup agresif.
- [ ] Label afiliasi dan "Konten Bersponsor" siap dipakai.
- [ ] Situs bisa diakses tanpa JavaScript untuk konten artikel (Astro statis).
