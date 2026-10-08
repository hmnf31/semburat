import type { SoftLaunchArticle } from '../article-types';

export const gaming02: SoftLaunchArticle = {
  id: 'sl-gaming-002',
  slug: 'kontrol-pembelian-dalam-gim-untuk-anak',
  title: 'Kontrol Pembelian Dalam Gim untuk Anak',
  dek: 'Permintaan persetujuan, verifikasi setiap pembelian, dan laporan penerimaan adalah tiga pengaturan yang tersedia di Google Play.',
  summary:
    'Google Play menyediakan persetujuan pembelian, verifikasi pembelian, dan pengelolaan konten lewat Family Link. Ketiganya hanya berlaku untuk transaksi yang melewati sistem penagihan Google Play, sehingga metode pembayaran lain perlu dijaga terpisah.',
  body: `Pembelian dalam gim (in-app purchase) berlangsung dalam hitungan detik dan sering tanpa percakapan apa pun. Untuk keluarga, Google Play menyiapkan tiga pengaturan yang saling melengkapi.

Pertama, persetujuan pembelian (purchase approvals). Dalam keluarga Google, manajer keluarga dapat mengatur agar anggota lain meminta izin sebelum membeli. Pilihannya mencakup semua konten, semua pembelian yang memakai metode pembayaran keluarga, hanya pembelian dalam gim, atau tanpa persetujuan sama sekali. Saat permintaan masuk, manajer keluarga meninjau dan menyetujui dengan kata sandi akun Google.

Kedua, verifikasi pembelian. Pengaturan ini meminta biometrik atau kata sandi akun Google pada setiap pembayaran lewat penagihan Google Play. Google menambahkan catatan penting: verifikasi selalu diwajibkan pada aplikasi atau gim yang dirancang untuk usia 12 tahun ke bawah, meski pengaturan pengguna diatur lain.

Ketiga, pembatasan konten lewat Family Link. Orang tua dapat menetapkan tingkat usia maksimal untuk aplikasi, film, televisi, dan buku, sekaligus meminta persetujuan untuk setiap unduhan baru. Pengaturan ini berlaku di layanan Google Play dan tidak berlaku otomatis di toko aplikasi lain.

Ada batas yang perlu dipahami bersama. Dua pengaturan pertama hanya bekerja untuk transaksi yang melewati sistem penagihan Google Play. Google menegaskan bahwa pembelian yang dilakukan melalui sistem penagihan alternatif tidak terlihat oleh manajer keluarga. Artinya, kunci utamanya adalah memastikan metode pembayaran tidak tersimpan di perangkat anak dan tidak dibagikan.

Satu kebiasaan penutup yang berguna: setiap pembelian yang melalui sistem penagihan Google Play memicu surel tanda terima ke akun manajer keluarga. Membaca surel itu secara berkala memberi gambaran pengeluaran tanpa perlu memantau layar anak terus-menerus.`,
  category: 'Gaming',
  subcategory: 'Kontrol Orang Tua',
  status: 'published',
  riskLevel: 'LOW',
  qualityScore: 88,
  publishedAt: '2026-10-01T10:30:00+07:00',
  sources: [
    {
      title: 'Purchase approvals on Google Play — Google For Families Help',
      url: 'https://support.google.com/families/answer/7039872?hl=id',
      accessedAt: '2026-10-01T11:15:00+07:00',
    },
    {
      title: 'Require verification for purchases — Google Play Help',
      url: 'https://support.google.com/googleplay/answer/1626831?hl=id',
      accessedAt: '2026-10-01T11:30:00+07:00',
    },
    {
      title: "Manage your child's Google Play apps — Google Play Help",
      url: 'https://support.google.com/googleplay/answer/7103028?hl=id',
      accessedAt: '2026-10-01T11:45:00+07:00',
    },
  ],
  assets: [
    {
      id: 'asset-sl-gaming-002',
      type: 'image',
      title: 'Children playing video games',
      license: 'CC BY-SA 3.0',
      credit: 'Gamesingear',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Children_playing_video_games.jpg',
    },
  ],
  keyPoints: [
    'Persetujuan pembelian bisa dibatasi pada semua konten, semua transaksi, atau hanya pembelian dalam gim.',
    'Verifikasi pembelian selalu diwajibkan untuk gim yang ditujukan usia 12 tahun ke bawah.',
    'Family Link membatasi tingkat usia konten dan meminta izin untuk unduhan baru.',
    'Pengaturan ini hanya berlaku untuk transaksi lewat sistem penagihan Google Play.',
  ],
  faq: [
    {
      question: 'Apakah pengaturan ini berlaku untuk semua toko aplikasi?',
      answer:
        'Tidak. Pengaturan persetujuan dan verifikasi berlaku untuk transaksi yang melewati sistem penagihan Google Play di perangkat tersebut.',
    },
    {
      question: 'Apakah pembelian dalam gim selalu butuh persetujuan orang tua?',
      answer:
        'Bergantung pada pilihan pengaturan. Manajer keluarga dapat memilih persetujuan untuk semua pembelian, hanya pembelian dalam gim, atau tidak sama sekali.',
    },
    {
      question: 'Bagaimana memantau pengeluaran tanpa mengambil ponsel anak?',
      answer:
        'Aktifkan persetujuan pembelian dan bacalah surel tanda terima yang dikirim Google Play ke akun manajer keluarga setiap kali transaksi selesai.',
    },
  ],
};
