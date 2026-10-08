---
name: semburat-design
description: Membuat paket aset visual SEMBURAT (gambar OG/hero, carousel Instagram 7 slide, kartu fakta, cover Story/Reel, gambar post X, dan spesifikasi video Remotion) dari satu artikel, sesuai identitas brand dan aturan hak cipta. Gunakan skill ini setiap kali pengguna menyebut desain konten, template visual, carousel, thumbnail, cover story/reel, OG image, kartu fakta, paket sosial media, atau repurposing artikel SEMBURAT menjadi visual, walaupun pengguna tidak menyebut kata "template" atau "skill".
---

# SEMBURAT Design

Skill ini mengubah **satu artikel yang sudah disetujui** menjadi paket visual siap unggah.
Identitas brand: _"Yang sedang muncul, kami rangkai menjadi cerita."_ Nada visual: modern, jelas,
tidak sensasional. Latar biru malam, aksen gradien "fajar" (amber → ember → rose).

## Kapan dipakai

- Artikel baru perlu visual: hero/OG, carousel, kartu fakta, cover Story/Reel, gambar X.
- Pengguna meminta desain ulang atau varian format dari artikel yang sama.
- Pengguna ingin menambah/mengubah template (baca `references/templates.md` dulu).

Jangan dipakai untuk: menulis artikel, mencari gambar berlisensi, atau memposting ke platform (itu tugas engine lain).

## Input yang dibutuhkan

Kumpulkan dari artikel/riset sebelum membuat apa pun. Jika ada yang kurang, tanyakan satu hal yang paling menentukan.

| Field                  | Keterangan                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| `slug`                 | slug artikel (nama file keluaran)                                                                       |
| `kicker`               | label kategori/bagian, pendek (mis. "Gaming")                                                           |
| `title`                | judul 10–110 karakter, informatif, bukan clickbait                                                      |
| `image` + `image_type` | opsional. `official`, `press_kit`, `licensed`, `public_domain`, `original`, `ai_generated`, atau `none` |
| `credit`               | wajib bila `image_type` bukan `none`/`original`/`ai_generated`                                          |
| `sources`              | daftar sumber untuk slide terakhir (maks. 6)                                                            |
| `body`, `stat`         | untuk kartu fakta dan slide isi (maks. 20 kata per slide, ideal ≤ 15)                                   |

## Alur kerja

1. **Cek aset dulu.** Lihat status aset artikel di asset registry. Jangan mengambil gambar dari situs resmi tanpa izin. Jika tidak ada aset legal, pakai `image_type: none` (desain tipografi) atau grafik original.
2. **Pilih template** sesuai kebutuhan (tabel di bawah). Satu artikel biasanya butuh: `og-hero`, `carousel`, `story-cover`, dan opsional `fact-card`, `x-post`.
3. **Tulis file JSON konten** (contoh ada di `assets/examples/`). Carousel mengikuti urutan PRD: Hook → Apa yang terjadi → Fakta kunci → Konteks → Kenapa penting → Kesimpulan → Sumber.
4. **Validasi** dengan `python scripts/render.py --template <nama> --data <file.json> --check-only`. Perbaiki semua ERROR; pertimbangkan PERINGATAN.
5. **Render** tanpa `--check-only`. Hasil PNG ada di folder `--out`.
6. **Periksa hasil**: lihat setiap PNG. Teks terbaca di layar HP? Tidak ada teks terpotong? Watermark tidak menutup isi? Kredit terlihat?
7. **Laporkan** daftar file keluaran, aset yang dipakai, serta catatan (mis. "gambar belum berlisensi, memakai desain tipografi"). Catat juga ke tabel `assets`/`content_variants` bila dijalankan dalam pipeline.

## Template yang tersedia

| Nama          | Ukuran    | Dipakai untuk                                    |
| ------------- | --------- | ------------------------------------------------ |
| `og-hero`     | 1200×630  | Website hero, OG image, Facebook link preview    |
| `x-post`      | 1600×900  | Post/thread X                                    |
| `fact-card`   | 1080×1080 | Kartu fakta/angka (Feed IG, Threads, X)          |
| `story-cover` | 1080×1920 | Cover Story, Reel, TikTok, Shorts                |
| `carousel`    | 1080×1350 | Carousel IG: slide `cover`, `content`, `sources` |

Video (Remotion) tidak dirender oleh skrip ini. Untuk video, hasilkan file props sesuai `references/remotion-spec.md`.

## Aturan yang tidak boleh dilanggar (dan alasannya)

- **Selalu ada kredit & sumber.** Gambar dari pihak lain wajib dikreditkan, dan carousel wajib diakhiri slide Sumber. Alasannya hukum dan kepercayaan pembaca. Validator menolak render tanpa kredit.
- **Tidak ada gambar AI yang menyerupai produk atau peristiwa nyata.** Gambar AI hanya untuk ilustrasi konsep dan diberi lencana "Ilustrasi AI" otomatis. Alasannya: pembaca bisa mengira itu foto asli.
- **Jangan hapus atau tutupi atribusi.** Watermark SEMBURAT ditaruh di sudut yang bebas dan tidak menutupi kredit.
- **Teks singkat.** Maksimal sekitar 15 kata per slide agar terbaca cepat di HP.
- **Hook di judul, bukan sensasi.** Judul harus informatif dan bisa dipertanggungjawabkan oleh isi artikel. Hindari urgensi palsu dan huruf kapital berlebihan.
- **Hormati safe area.** Story/Reel memakai margin atas 250px dan bawah 340px karena tertutup antarmuka platform.

## Contoh

**Contoh 1**
Input: Artikel "Patch MLBB ubah peran tank", tanpa gambar berlisensi, minta paket IG.
Output: `carousel` 7 slide (cover → 5 isi → sumber) dengan `image_type: none`, plus `story-cover`. Catatan: tidak ada aset legal, memakai desain tipografi.

**Contoh 2**
Input: Peluncuran ponsel baru, ada gambar dari media kit resmi.
Output: `og-hero` dan `story-cover` dengan `image_type: press_kit` dan `credit: "Gambar: [Merek] (media kit resmi)"`. Jika izin penggunaan media kit belum jelas, jangan pakai gambarnya.

## Struktur skill

- `scripts/render.py` — render HTML → PNG (Playwright/Chromium).
- `scripts/validate_content.py` — validasi aturan desain.
- `assets/templates/` — template HTML + `templates.json`.
- `assets/tokens.*` — token brand (hasil `packages/brand/build_tokens.py`; jangan edit manual).
- `assets/examples/` — contoh JSON konten.
- `references/templates.md` — cara menambah/mengubah template.
- `references/remotion-spec.md` — spesifikasi props dan adegan video.
- `references/brand-guidelines.md` — pedoman visual dan suara.
- `evals/evals.json` — prompt uji.

## Persiapan lingkungan

```bash
pip install playwright && playwright install chromium
```

Unduh font Plus Jakarta Sans dan Inter (lisensi OFL) ke `assets/fonts/` bila ingin tampilan konsisten di semua mesin; tanpa itu render memakai font sistem sebagai cadangan.
