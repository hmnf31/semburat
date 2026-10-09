# packages/brand

Sumber tunggal identitas SEMBURAT (Warm Editorial Minimalism).

- `tokens.json` — warna, font, ukuran format, aturan desain (edit di sini).
- `tokens.css` — dihasilkan otomatis (`python packages/brand/build_tokens.py`).
- `brand.config.json` — konfigurasi brand untuk engine (voice, kategori, akun sosial, aturan editorial).
- `logo/` — `icon.svg`, `icon-inverse.svg`, `wordmark.svg`, `wordmark-inverse.svg` (wordmark pakai Newsreader/Georgia).

Identitas tayang: latar kertas hangat (`#FAFAF7`/`#F5F4EE`), tinta cokelat gelap (`#1C1917`),
aksen terakota (`#C25E43`), judul serif **Newsreader**, isi **Plus Jakarta Sans**, watermark
`SEMBURAT` di sudut kanan bawah, garis brand terakota 12px di tepi atas template.

Setelah mengubah `tokens.json`, jalankan `build_tokens.py` supaya `packages/brand/tokens.css`
dan salinan di `.kilo/skills/semburat-design/assets/` tetap sinkron.
`apps/web/src/styles/tokens.css` (website) memakai palet yang sama dari `DESIGN.MD`; jaga nilainya tetap cocok saat salah satu diubah.
