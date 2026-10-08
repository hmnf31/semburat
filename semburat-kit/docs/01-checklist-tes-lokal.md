# 01 — Checklist Tes Lokal (Tahap A)

Tujuan: logika inti benar **sebelum** menyentuh Cloudflare. Centang `[x]` saat lulus, catat hasil di `templates/test-log.md`.

## Cara menjalankan tes yang sudah ada di kit ini

```bash
python -m unittest discover -s tests -v
```

`tests/reference/semburat_rules.py` adalah implementasi **referensi** aturan PRD (skor tren, risiko, publish, slug, duplikat, kredit).
Bandingkan hasilnya dengan implementasi Anda di `services/`. Jika berbeda, putuskan mana yang benar, lalu samakan.
Cara termudah: tulis tes yang sama terhadap kode Anda (impor fungsi Anda, pakai kasus uji yang sama).

## A1. Unit

- [ ] Skor tren sesuai rumus PRD (lihat catatan skor maksimum 95 di `08-temuan-analisis-prd.md`).
- [ ] Ambang aksi: 90 / 75 / 60 / 40 (uji nilai batas, mis. 89.99 dan 90).
- [ ] Klasifikasi risiko: topik politik/kriminal/kesehatan/keuangan/tuduhan selalu `high`.
- [ ] Aturan publish: topik sensitif tidak pernah auto-publish; selama soft launch `auto_publish=false`.
- [ ] Quality score: bobot berjumlah 100%.
- [ ] Slug aman (aksen, simbol, panjang).
- [ ] Deteksi duplikat menangkap judul bervariasi ("baru"~"terbaru", "ubah"~"mengubah").
- [ ] Pembuat kredit visual per tipe lisensi.
- [ ] Skema data menolak input tidak valid (artikel, tren, riset, aset, content_variants, analytics).

## A2. Integrasi

- [ ] Trend → `trends` (D1 lokal/miniflare).
- [ ] Trend → Research → `research` (`facts_json`, `claims_json`, `conflicts_json`, `confidence_score`).
- [ ] Setiap fakta penting punya minimal satu URL sumber.
- [ ] Research → artikel + judul + SEO + FAQ + ringkasan.
- [ ] Status artikel berubah sesuai aturan publish.
- [ ] Artikel disetujui muncul di web (build Astro).
- [ ] Satu `article_id` → semua varian di `content_variants`.
- [ ] Artikel mirip memperbarui artikel lama, bukan membuat baru.

## A3. Dry-run end-to-end

- [ ] 5 topik dari `tests/fixtures/topics-uji.json` lewat seluruh pipeline dengan `SEMBURAT_DRY_RUN=true`.
- [ ] Setiap job punya `job_id, started_at, completed_at, status, error, retry_count`.
- [ ] Log terbaca, tidak memuat secret.
- [ ] Waktu tren → draf dan biaya token per artikel tercatat.

## A4. Evaluasi kualitas prompt (20 topik uji)

Nilai tiap artikel 1–5 pada kolom berikut (gunakan `templates/article-review-checklist.md`):

- [ ] Akurasi fakta (cek ke sumber asli, bukan ke ringkasan AI).
- [ ] Tidak ada kutipan palsu.
- [ ] "Diduga/dilaporkan" tidak berubah jadi "terjadi".
- [ ] Ada sintesis dan konteks, bukan parafrase satu sumber.
- [ ] Bahasa Indonesia natural, bukan clickbait.
- [ ] "Apa yang kita tahu / belum tahu" bermakna.
- [ ] `prompt_version`, model, dan pengaturan tercatat per hasil.
- [ ] Topik sensitif (#19, #20) **tidak** lolos auto-publish.

## A5. Tes kegagalan

- [ ] LLM timeout → retry backoff → fallback model → antrean gagal.
- [ ] Sumber 404/kosong → `NEEDS_RESEARCH`, bukan artikel kosong.
- [ ] Kuota habis → job berhenti rapi + alert Telegram.
- [ ] Gagal tulis DB → tidak ada data setengah jadi.
- [ ] Dua job bersamaan → tidak ada artikel ganda.
- [ ] Kill switch menghentikan semua job.
- [ ] Teks sumber berisi instruksi tersembunyi (prompt injection) tidak mengubah perilaku AI.

## A6. Keamanan

- [ ] Tidak ada API key di repo atau riwayat git (`git log -p | grep -i -E "api[_-]?key|token"`).
- [ ] `.env` di `.gitignore`.
- [ ] Endpoint admin Worker butuh autentikasi.
- [ ] Bot Telegram hanya menjawab ID yang diizinkan.
- [ ] Form kontak/newsletter divalidasi dan dibatasi laju.

## A7. Desain (setelah template ada)

- [ ] `python skills/semburat-design/scripts/render.py --template og-hero --data skills/semburat-design/assets/examples/artikel-og.json --out /tmp/uji` menghasilkan PNG 1200×630.
- [ ] Carousel contoh menghasilkan 7 PNG 1080×1350.
- [ ] Data yang melanggar aturan (gambar tanpa kredit, gambar AI produk nyata) ditolak.
