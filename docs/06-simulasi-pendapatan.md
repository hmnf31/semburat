# 06 — Simulasi Pendapatan (24 bulan)

> **Ini alat berpikir, bukan ramalan.** Semua angka adalah asumsi. Ganti dengan data nyata (Search Console, AdSense, afiliasi) begitu ada.
> Jalankan sendiri: `python tools/revenue_simulator.py` (ubah RPM dengan `--rpm-ad` dan `--rpm-aff`, simpan CSV dengan `--csv`).

## Asumsi

- RPM iklan display Indonesia sekitar Rp 20.000 per 1.000 pageview (kisaran wajar Rp 15–25 ribu; sangat bergantung niche dan jaringan iklan).
- Afiliasi sekitar Rp 10.000 per 1.000 pageview, **hanya jika** ada konten bernuansa beli (review, perbandingan, rekomendasi). Tanpa itu mendekati nol.
- Persetujuan iklan: bulan ke-4 (skenario dasar), bulan ke-9 (skenario buruk). Persetujuan tidak dijamin.
- Sponsor: skenario dasar mulai bulan ke-9 (Rp 1 juta), ke-12 (Rp 3 juta), ke-18 (Rp 8 juta). Skenario buruk: tidak ada.
- Reinvestasi 35% dari pendapatan; domain Rp 200 ribu/tahun.
- Pendapatan sosial media (YouTube/TikTok/Instagram) tidak dihitung, karena syaratnya berubah-ubah.

## Tiga skenario

- **Buruk** — traffic stagnan di kisaran 400–500 pageview/hari (konten tipis, tidak konsisten, atau tidak terindeks baik).
- **Dasar** — pertumbuhan wajar situs baru yang konsisten dan fokus niche.
- **Baik** — sekitar 2× skenario dasar. Optimistis dan jarang terjadi. **Jangan jadikan target perencanaan.**

## Hasil

## Skenario BURUK

| Bulan | Pageview/hari | Iklan   | Afiliasi | Sponsor | Total (Rp) | Kumulatif bersih* (Rp) |
| ----- | ------------- | ------- | -------- | ------- | ---------- | ---------------------- |
| 1     | 5             | 0       | 0        | 0       | 0          | -16.667                |
| 3     | 40            | 0       | 0        | 0       | 0          | -50.000                |
| 6     | 200           | 0       | 60.000   | 0       | 60.000     | -61.000                |
| 9     | 300           | 180.000 | 90.000   | 0       | 270.000    | 162.000                |
| 12    | 400           | 240.000 | 120.000  | 0       | 360.000    | 755.500                |
| 18    | 450           | 270.000 | 135.000  | 0       | 405.000    | 2.161.875              |
| 24    | 500           | 300.000 | 150.000  | 0       | 450.000    | 3.743.750              |

## Skenario DASAR

| Bulan | Pageview/hari | Iklan      | Afiliasi   | Sponsor   | Total (Rp) | Kumulatif bersih* (Rp) |
| ----- | ------------- | ---------- | ---------- | --------- | ---------- | ---------------------- |
| 1     | 10            | 0          | 0          | 0         | 0          | -16.667                |
| 3     | 150           | 0          | 45.000     | 0         | 45.000     | -20.750                |
| 6     | 1.500         | 900.000    | 450.000    | 0         | 1.350.000  | 1.772.000              |
| 9     | 5.000         | 3.000.000  | 1.500.000  | 1.000.000 | 5.500.000  | 9.099.500              |
| 12    | 12.000        | 7.200.000  | 3.600.000  | 3.000.000 | 13.800.000 | 29.264.500             |
| 18    | 45.000        | 27.000.000 | 13.500.000 | 8.000.000 | 48.500.000 | 153.802.000            |
| 24    | 90.000        | 54.000.000 | 27.000.000 | 8.000.000 | 89.000.000 | 434.989.500            |

## Skenario BAIK

| Bulan | Pageview/hari | Iklan       | Afiliasi   | Sponsor    | Total (Rp)  | Kumulatif bersih* (Rp) |
| ----- | ------------- | ----------- | ---------- | ---------- | ----------- | ---------------------- |
| 1     | 20            | 0           | 0          | 0          | 0           | -16.667                |
| 3     | 300           | 180.000     | 90.000     | 0          | 270.000     | 156.700                |
| 6     | 3.000         | 1.800.000   | 900.000    | 0          | 2.700.000   | 3.792.200              |
| 9     | 10.000        | 6.000.000   | 3.000.000  | 1.500.000  | 10.500.000  | 18.172.200             |
| 12    | 24.000        | 14.400.000  | 7.200.000  | 4.500.000  | 26.100.000  | 56.927.200             |
| 18    | 90.000        | 54.000.000  | 27.000.000 | 12.000.000 | 93.000.000  | 298.627.200            |
| 24    | 180.000       | 108.000.000 | 54.000.000 | 12.000.000 | 174.000.000 | 845.502.200            |

- Kumulatif bersih = total pendapatan dikurangi reinvestasi dan domain. BELUM termasuk biaya API/LLM berbayar (di luar reinvestasi) dan nilai waktu Anda sebagai operator/editor. Pajak tidak dihitung.

## Cara membaca

1. **Dua belas bulan pertama adalah investasi waktu**, bukan penghasilan. Pada skenario dasar, bulan ke-6 baru sekitar Rp 1,3 juta/bulan.
2. **Perbedaan skenario buruk vs dasar bukan nasib, tetapi kualitas dan konsistensi.** Pengendalinya: niche sempit, konten evergreen, review manual, sumber jelas, pembaruan artikel.
3. **Angka bersih lebih kecil dari total.** Belum dihitung: biaya API/LLM berbayar di luar reinvestasi, pajak, dan nilai waktu Anda.
4. **Sensitivitas terbesar** adalah pageview dan RPM. Uji: `python tools/revenue_simulator.py --scenario dasar --rpm-ad 10000 --rpm-aff 5000` untuk melihat skenario pesimistis RPM.

## Jalur reinvestasi (tetap modal 0)

| Pendapatan bulanan | Investasi berikutnya                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| Rp 0               | Semua layanan gratis; fokus kualitas dan konsistensi                    |
| ≥ Rp 200 ribu      | Domain sendiri (ganti `pages.dev`), email domain                        |
| > Rp 1 juta        | Kredit LLM berbayar agar kualitas/kuota stabil                          |
| > Rp 5 juta        | Workers berbayar jika kuota mentok, alat newsletter, editor paruh waktu |
| > Rp 15 juta       | Voice over/video matang, media kit sponsor, desainer lepas              |
| > Rp 30 juta       | Pertimbangkan sub-brand; uji produk data (Trend Radar)                  |
