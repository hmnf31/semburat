# packages/brand

Sumber tunggal identitas SEMBURAT.

- `tokens.json` — warna, font, ukuran format, aturan desain (edit di sini).
- `tokens.css` — dihasilkan otomatis (`python packages/brand/build_tokens.py`).
- `brand.config.json` — konfigurasi brand untuk engine (voice, kategori, akun sosial, aturan editorial).

Setelah mengubah `tokens.json`, jalankan `build_tokens.py` supaya website dan skill desain tetap sinkron.
Palet adalah usulan awal ("fajar": amber → ember → rose di atas biru malam). Ganti sesuai logo final Anda.
