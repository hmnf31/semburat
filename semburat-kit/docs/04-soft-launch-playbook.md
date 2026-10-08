# 04 — Playbook Soft Launch (Tahap D, minggu 1–4)

## Pengaturan awal

- `SEMBURAT_AUTO_PUBLISH=false` — semua artikel lewat review manual.
- Fokus 2 niche (usulan: Gaming + Teknologi). Pilar lain menyusul setelah ada data.
- Target 30–50 artikel berkualitas dalam 4 minggu.

| Jenis                               | Porsi awal |
| ----------------------------------- | ---------- |
| Trending/viral (risiko rendah saja) | 20%        |
| Teknologi                           | 25%        |
| Gaming                              | 25%        |
| Explainer / evergreen               | 30%        |

## Indeksasi

- [ ] Daftarkan ke Google Search Console dan Bing Webmaster Tools; kirim sitemap.
- [ ] Pantau status indeks mingguan.
- [ ] Tautan internal antarartikel dan klaster topik (mis. MLBB, AI, smartphone).

## Ritme

- Review harian di jam tetap (30–60 menit pagi + malam). Catat alasan setiap penolakan.
- Ringkasan mingguan memakai `templates/weekly-review.md`.
- Perbaiki prompt berdasarkan alasan penolakan; naikkan `prompt_version` setiap perubahan.

## Kapan menyalakan auto-publish (hanya risiko Low)

- [ ] ≥ 30 artikel berturut-turut lolos review tanpa koreksi fakta besar.
- [ ] Tidak ada insiden hak cipta atau kesalahan serius selama 2 minggu.
- [ ] Ambang awal ≥ 92, turunkan perlahan jika aman. Topik sensitif tetap selalu review.

## Hal yang sering salah di awal

- Menerbitkan terlalu banyak terlalu cepat sebelum kualitas stabil.
- Mengejar topik viral berisiko demi traffic.
- Mengabaikan halaman kebijakan dan label sumber/kredit.
- Tidak mencatat biaya dan kuota sehingga pipeline berhenti mendadak.
