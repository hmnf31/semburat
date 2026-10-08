import type { SoftLaunchArticle } from '../article-types';

export const explainer01: SoftLaunchArticle = {
  id: 'sl-explainer-001',
  slug: 'apa-itu-qris',
  title: 'Apa Itu QRIS dan Bagaimana Biayanya Bekerja',
  dek: 'Satu kode QR yang dibuat Bank Indonesia agar semua aplikasi pembayaran bisa dipakai di satu titik pembayaran.',
  summary:
    'QRIS adalah standar kode QR pembayaran yang ditetapkan Bank Indonesia. Diluncurkan 17 Agustus 2019 dan wajib dipakai sejak 31 Desember 2019, QRIS menyatukan berbagai dompet digital dalam satu kode. Biaya layanan merchant (MDR) dibebankan ke pedagang, bukan konsumen.',
  body: `QRIS (Quick Response Code Indonesian Standard) adalah standar kode QR pembayaran yang ditetapkan Bank Indonesia. Sebelum QRIS, satu aplikasi pembayaran hanya bisa menerima pembayaran dari pengguna aplikasi yang sama. Dengan standar ini, seluruh Penyedia Jasa Pembayaran wajib menerapkan QRIS sehingga satu kode dapat dibaca oleh berbagai aplikasi dompet digital dan perbankan.

Laman resmi Bank Indonesia mencatat QRIS diluncurkan pada 17 Agustus 2019 dan wajib digunakan mulai 31 Desember 2019. QRIS memiliki dua model: Merchant Presented Mode, di mana pedagang menampilkan kode lalu dipindai konsumen (statis bila nominal diisi manual, dinamis bila nominal sudah tertanam), dan Customer Presented Mode, di mana konsumen menampilkan kode dari ponsel untuk dipindai pedagang, lazim dipakai pada parkir, transportasi, dan ritel modern.

Biaya yang melekat pada pedagang bernama Merchant Discount Rate (MDR). Menurut penjelasan Bank Indonesia, MDR ditetapkan berdasarkan kategori merchant dan nilai transaksi, dan peraturannya berlaku efektif mulai 15 Maret 2025: usaha mikro dengan transaksi sampai Rp500.000 dikenai 0 persen, usaha mikro di atas Rp500.000 dikenai 0,3 persen, sedangkan usaha kecil, menengah, dan besar dikenai 0,7 persen. Kategori khusus mencakup pendidikan 0,6 persen, stasiun pengisian bahan bakar umum 0,4 persen, serta badan layanan umum dan pembayaran sosial pemerintah sebesar 0 persen. Bank Indonesia menegaskan MDR ditanggung pedagang dan tidak boleh dibebankan kepada konsumen.

Sisi konsumen perlu menerapkan dua kebiasaan. Pertama, verifikasi nama penerima di aplikasi sebelum menekan bayar, karena QRIS statis tidak memuat nominal sehingga nominal diisi manual. Kedua, ketahui batas nominal. Peraturan Anggota Dewan Gubernur Nomor 21/18/PADG/2019 menetapkan batas nominal transaksi QRIS paling banyak Rp2.000.000 per transaksi, sementara penerbit dapat menetapkan batas kumulatif harian atau bulanan berdasarkan manajemen risikonya.

QRIS menyelesaikan satu masalah nyata: fragmentasi. Pedagang cukup membuka satu akun di penyedia jasa pembayaran mana pun untuk menerima pembayaran dari aplikasi mana pun, dan konsumen cukup memindai satu kode yang sama di mana pun.`,
  category: 'Explainer',
  subcategory: 'Keuangan Digital',
  status: 'published',
  riskLevel: 'LOW',
  qualityScore: 93,
  publishedAt: '2026-09-29T09:00:00+07:00',
  sources: [
    {
      title: 'QRIS — Bank Indonesia',
      url: 'https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/QRIS/default.aspx',
      accessedAt: '2026-09-29T10:00:00+07:00',
    },
    {
      title: 'MDR QRIS Bagi Merchant: Kategorisasi dan Simulasi — Bank Indonesia',
      url: 'https://www.bi.go.id/id/publikasi/ruang-media/cerita-bi/Pages/mdr-qris.aspx',
      accessedAt: '2026-09-29T10:15:00+07:00',
    },
    {
      title:
        'PADG QRIS: Implementasi Standar Nasional Quick Response Code untuk Pembayaran — Bank Indonesia',
      url: 'https://www.bi.go.id/id/publikasi/peraturan/Pages/padg_211819.aspx',
      accessedAt: '2026-09-29T10:30:00+07:00',
    },
  ],
  assets: [
    {
      id: 'asset-sl-explainer-001',
      type: 'image',
      title: 'Terminal pembayaran dengan kode QRIS',
      license: 'CC BY 4.0',
      credit: 'VulcanSphere',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Ingenico_Move_2500_payment_terminal_showing_QRIS_QR_code_for_payment_(2026-04-05).jpg',
    },
  ],
  keyPoints: [
    'QRIS ditetapkan Bank Indonesia dan wajib dipakai untuk pembayaran lewat QR sejak 31 Desember 2019.',
    'MDR ditanggung pedagang dan tidak boleh dibebankan kepada konsumen.',
    'MDR usaha mikro 0 persen untuk transaksi sampai Rp500.000 dan 0,3 persen di atasnya; usaha kecil–besar 0,7 persen.',
    'PADG QRIS membatasi nominal transaksi maksimal Rp2.000.000 per transaksi.',
  ],
  faq: [
    {
      question: 'Apakah konsumen dikenai biaya saat membayar dengan QRIS?',
      answer:
        'Tidak. Bank Indonesia menegaskan MDR ditanggung pedagang dan tidak boleh dibebankan kepada konsumen.',
    },
    {
      question: 'Apa bedanya QRIS statis dan dinamis?',
      answer:
        'QRIS statis tidak memuat nominal sehingga pembeli mengisi jumlah sendiri, sedangkan QRIS dinamis sudah tertanam nominal sehingga nominal tidak bisa salah isi.',
    },
    {
      question: 'Berapa batas nominal satu transaksi QRIS?',
      answer:
        'PADG QRIS No. 21/18/PADG/2019 menetapkan batas nominal paling banyak Rp2.000.000 per transaksi, dengan batas kumulatif harian atau bulanan yang dapat ditetapkan penerbit.',
    },
  ],
};
