import type { SoftLaunchArticle } from '../article-types';

export const gaming01: SoftLaunchArticle = {
  id: 'sl-gaming-001',
  slug: 'amankan-akun-game-dengan-verifikasi-dua-langkah',
  title: 'Amankan Akun Game dengan Verifikasi Dua Langkah',
  dek: 'Kata sandi yang bocor belum cukup untuk membobol akun bila verifikasi dua langkah sudah aktif.',
  summary:
    'Akun game menyimpan riwayat pembelian dan koleksi bernilai nyata. Steam Guard dan verifikasi pembelian Google Play menambah lapisan kedua berupa kode atau autentikasi biometrik sehingga kata sandi saja tidak cukup untuk masuk.',
  body: `Akun game bukan sekadar profil. Riwayat pembelian, item koleksi, dan metode pembayaran yang tersimpan di dalamnya menjadikan keamanan akun sebagai hal yang nyata nilainya. Ancaman yang paling umum tetap sama: kata sandi yang bocor lewat layanan lain dan dipakai ulang oleh penyerang.

Steam menyediakan lapisan kedua bernama Steam Guard. Halaman bantuan resminya menjelaskan dua bentuk: kode keamanan yang dikirimkan lewat surel terdaftar, dan autentikator di aplikasi seluler yang menghasilkan kode saat masuk. Steam juga menawarkan kode pemulihan sekali pakai untuk kasus perangkat hilang, sehingga penguncian kedua tidak berujung pada kehilangan akses permanen.

Di Android, Google Play menambah lapisan pada sisi pembelian. Fitur verifikasi pembelian meminta biometrik atau kata sandi akun Google setiap kali pembayaran dilakukan lewat penagihan Google Play. Paling penting, Google menegaskan bahwa verifikasi selalu diwajibkan untuk setiap pembelian pada aplikasi atau gim yang dirancang untuk usia 12 tahun ke bawah, berapa pun pengaturan penggunanya.

Praktik yang disarankan Steam untuk rekomendasi keamanan akun melengkapi keduanya: gunakan kata sandi panjang dan unik untuk tiap layanan, aktifkan verifikasi dua langkah, dan berhati-hati pada pesan luar yang meminta data akun. Pesan yang mengaku dari tim gim namun meminta kata sandi atau kode adalah pola yang sudah lama dikenal.

Urutan pemasangan yang paling masuk akal: aktifkan autentikator di ponsel lebih dulu, simpan kode pemulihan di tempat terpisah dari perangkat, lalu periksa pengaturan verifikasi pembelian di toko aplikasi. Dengan tiga langkah itu, satu kata sandi yang bocor tidak serta-merta membuka gerbang akun.`,
  category: 'Gaming',
  subcategory: 'Keamanan Akun',
  status: 'published',
  riskLevel: 'LOW',
  qualityScore: 86,
  publishedAt: '2026-10-05T16:30:00+07:00',
  sources: [
    {
      title: 'Steam Guard — Steam Support',
      url: 'https://help.steampowered.com/en/faqs/view/06B0-26E6-2CF8-254C',
      accessedAt: '2026-10-05T17:15:00+07:00',
    },
    {
      title: 'Account Security Recommendations — Steam Support',
      url: 'https://help.steampowered.com/en/faqs/view/6639-EB3C-EC79-FF60',
      accessedAt: '2026-10-05T17:30:00+07:00',
    },
    {
      title: 'Require verification for purchases — Google Play Help',
      url: 'https://support.google.com/googleplay/answer/1626831?hl=id',
      accessedAt: '2026-10-05T17:45:00+07:00',
    },
  ],
  assets: [
    {
      id: 'asset-sl-gaming-001',
      type: 'image',
      title: 'Ilustrasi bawaan SEMBURAT',
      license: 'Karya visual asli SEMBURAT, bukan foto pihak ketiga',
      credit: 'Ilustrasi oleh SEMBURAT',
    },
  ],
  keyPoints: [
    'Steam Guard menawarkan kode lewat surel maupun autentikator aplikasi seluler.',
    'Verifikasi pembelian Google Play meminta biometrik atau kata sandi setiap transaksi.',
    'Verifikasi selalu diwajibkan untuk gim yang dirancang untuk usia 12 tahun ke bawah.',
    'Kata sandi unik per layanan mencegah satu kebocoran menular ke akun lain.',
  ],
  faq: [
    {
      question: 'Apa bedanya kode Steam Guard lewat surel dan autentikator seluler?',
      answer:
        'Keduanya adalah lapisan kedua. Kode surel dikirim ke alamat terdaftar, sedangkan autentikator menghasilkan kode langsung di perangkat dan menyediakan kode pemulihan bila perangkat hilang.',
    },
    {
      question: 'Apakah verifikasi pembelian bisa dimatikan per aplikasi?',
      answer:
        'Pengaturannya berlaku untuk penagihan Google Play di perangkat tersebut. Untuk gim yang ditujukan usia 12 tahun ke bawah, verifikasi tetap diwajibkan Google Play.',
    },
    {
      question: 'Bagaimana bila ponsel dengan autentikator hilang?',
      answer:
        'Gunakan kode pemulihan yang disimpan saat pemasangan, atau hubungi dukungan resmi penyedia layanan untuk memulihkan akses dengan bukti kepemilikan akun.',
    },
  ],
};
