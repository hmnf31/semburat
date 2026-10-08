# 08 — Temuan Saat Membangun Kit (Catatan untuk PRD)

Hal-hal yang ditemukan ketika aturan PRD diterjemahkan menjadi kode dan tes. Putuskan sikap Anda lalu perbarui PRD bila perlu.

1. **Skor tren maksimum hanya 95.** Bobot positif PRD bagian 11.2 berjumlah 95% (25+20+15+15+10+10), jadi skor 100 mustahil dan skor 90+ ("Priority") hanya tercapai dengan hampir semua sinyal sangat tinggi dan risiko nyaris nol.
   _Pilihan:_ terima apa adanya, atau normalisasi dengan membagi 0,95 (`trend_score(..., normalize=True)`), atau turunkan ambang Priority.
2. **Deteksi duplikat berbasis kata terlalu rapuh.** Pembanding kata mentah gagal menyamakan "baru"/"terbaru" dan "ubah"/"mengubah". Kit memakai stemmer awalan ringan, tetapi PRD bagian 40 benar bahwa pembandingan **semantik** dibutuhkan (embedding atau pembanding LLM) untuk produksi.
3. **Klasifikasi risiko kata kunci hanya lantai pengaman.** Ia menangkap topik jelas sensitif, tetapi tidak memahami konteks. Gunakan `max(kata kunci, klasifikasi LLM)` dan jangan pernah biarkan kata kunci menurunkan risiko.
4. **Aturan "skor ≥ 90 → auto-publish" bertentangan dengan soft launch yang aman.** Kit menambah saklar `auto_publish_enabled` (default `false`). Nyalakan hanya lewat Gerbang 3.
5. **Frekuensi job di PRD (tiap 15 menit) berisiko menghabiskan kuota gratis.** Mulai dari 1–2 jam, naikkan setelah memantau kuota (PRD bagian 38 sendiri bilang frekuensi harus bisa diatur).
6. **Skenario pendapatan sangat sensitif terhadap RPM dan persetujuan iklan.** Perlakukan tabel sebagai rentang, bukan target.
7. **Slide Sumber pada carousel dijadikan wajib** (validator menolak carousel tanpa slide `sources`), karena PRD bagian 20 dan 29 menuntut sumber dan kredit.
8. **Gambar AI untuk produk/peristiwa nyata dilarang di validator** (PRD bagian 24). Validator memakai bendera `depicts_real_product`, yang harus diisi jujur oleh pipeline atau reviewer.
9. **Angka free tier tidak diverifikasi di kit ini.** Semua angka kuota (Cloudflare, GitHub Actions, OpenRouter) dan syarat monetisasi platform harus dicek ke sumber resmi saat Anda mengatur.
10. **Posting otomatis ke sosial media belum ada.** Konsisten dengan PRD bagian 55: siapkan paket, publish manual sampai izin API platform tersedia.
