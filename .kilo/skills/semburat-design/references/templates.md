# Menambah & Mengubah Template

## Daftar isi

1. Anatomi template
2. Placeholder yang tersedia
3. Menambah template baru
4. Menguji template
5. Daftar periksa kualitas

## 1. Anatomi template

Setiap template adalah satu file HTML di `assets/templates/` yang memuat dua penanda: `{{tokens_css}}` dan `{{base_css}}`.
`render.py` mengisinya dengan token brand dan CSS dasar, lalu mengganti placeholder `{{...}}` dengan nilai dari JSON konten (otomatis di-escape HTML).
Ukuran piksel ditentukan di CSS `.cv { width; height }` **dan** di `templates.json`. Keduanya harus sama.

## 2. Placeholder

`{{kicker}} {{title}} {{body}} {{stat}} {{cta}} {{domain}}` — teks dari JSON.
`{{size_class}}` — `sz-l` (≤45 karakter), `sz-m` (≤80), `sz-s` (lebih panjang). Dipakai CSS untuk mengecilkan judul panjang.
`{{image_class}}` dan `{{bg_style}}` — aktif bila ada `image` (latar gambar + gradien gelap agar teks terbaca).
`{{credit_html}}` — kredit dan lencana "Ilustrasi AI" (untuk `ai_generated`).
`{{sources_html}}` — daftar `<li>` untuk slide sumber.
`{{slide_no}} {{slide_total}}` — penomoran carousel.

## 3. Menambah template baru

1. Salin template terdekat, ubah nama dan ukuran.
2. Daftarkan di `templates.json` (`file`, `width`, `height`, `needs`).
3. Tambahkan ukuran dan safe area di `packages/brand/tokens.json` lalu jalankan `build_tokens.py`.
4. Buat contoh JSON di `assets/examples/`.
5. Tambahkan minimal satu prompt di `evals/evals.json`.

## 4. Menguji template

- `python scripts/render.py --template <nama> --data assets/examples/<file>.json --out /tmp/uji`
- Uji judul sangat pendek (10 karakter), sangat panjang (110), banyak angka, tanpa gambar, dan dengan gambar.
- Cek ukuran PNG sama dengan yang dijanjikan.

## 5. Daftar periksa kualitas

- [ ] Teks terbaca di layar HP (bukan hanya monitor).
- [ ] Teks tidak keluar dari safe area platform.
- [ ] Watermark dan kredit tidak bertumpuk.
- [ ] Kontras memadai (teks gelap di atas latar krem; teks terang di atas foto/gradien gelap).
- [ ] Ukuran file ringan (PNG atau konversi ke JPG kualitas 85–90 untuk foto).
