import type { SoftLaunchArticle } from '../article-types';

export const tech01: SoftLaunchArticle = {
  id: 'sl-tech-001',
  slug: 'pse-lingkungan-digital-wajib-daftar',
  title: 'PSE Lingkungan Digital: Apa Arti Kewajiban Pendaftaran bagi Pengguna di Indonesia',
  dek: 'PP 71/2019 mewajibkan penyelenggara sistem elektronik mendaftar sebelum layanannya dipakai pengguna.',
  summary:
    'Penyelenggara Sistem Elektronik lingkup privat wajib mendaftar kepada pemerintah sebelum layanan digunakan. Kewajiban ini diatur dalam PP 71/2019 dan diperinci Peraturan Menteri tentang PSE Lingkup Privat; pendaftaran kini dilayani lewat kanal resmi Komdigi.',
  body: `Di Indonesia, kewajiban pendaftaran Penyelenggara Sistem Elektronik (PSE) diatur dalam Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik, yang ditetapkan 4 Oktober 2019 dan mulai berlaku 10 Oktober 2019.

Pasal 6 PP tersebut menyatakan setiap PSE wajib melakukan pendaftaran, dan kewajiban itu harus dipenuhi sebelum sistem elektronik digunakan oleh pengguna. Pendaftaran diajukan kepada menteri melalui pelayanan perizinan berusaha terintegrasi secara elektronik. Ketentuan pelaksananya kemudian diperinci lewat peraturan menteri.

Laman resmi PSE Kementerian Komunikasi dan Digital menjelaskan bahwa PSE lingkup privat mencakup orang, badan usaha, dan masyarakat yang menyediakan, mengelola, dan/atau mengoperasikan sistem elektronik, baik untuk kepentingan sendiri maupun pihak lain. Laman itu merujuk Peraturan Menteri Komunikasi dan Digital Nomor 5 Tahun 2020 dan menyatakan pendaftaran dilayani melalui aplikasi OSS, dengan layanan fisik berlokasi di Jakarta.

Mengapa ini relevan bagi pengguna? Pendaftaran menjadikan penyelenggara tercatat dan dapat ditemukan di laman resmi, sehingga ada titik akuntabilitas ketika layanan bermasalah. Bagi platform, kepatuhan pendaftaran juga berjalan bersama kewajiban lain dalam PP yang sama, seperti penyediaan mekanisme pengaduan dan pemenuhan ketentuan pembatasan akses.

Yang perlu diingat: aturan ini mengatur kewajiban penyelenggara, bukan mencabut hak pengguna. Perlindungan data pribadi pengguna berdiri sendiri dalam Undang-Undang Nomor 27 Tahun 2022. Karena itu, ketika sebuah layanan mengaku resmi, langkah verifikasi pertama adalah mengecek apakah penyelenggaranya tercatat di laman PSE resmi dan apakah kanal pengaduannya aktif.`,
  category: 'Teknologi',
  subcategory: 'Regulasi Digital',
  status: 'published',
  riskLevel: 'LOW',
  qualityScore: 87,
  publishedAt: '2026-10-06T09:15:00+07:00',
  sources: [
    {
      title: 'Pendaftaran PSE Lingkup Privat — Kementerian Komunikasi dan Digital',
      url: 'https://pse.komdigi.go.id/home',
      accessedAt: '2026-10-06T10:00:00+07:00',
    },
    {
      title:
        'PP No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik — JDIH BPK',
      url: 'https://peraturan.bpk.go.id/Details/122030/pp-no-71-tahun-2019',
      accessedAt: '2026-10-06T10:20:00+07:00',
    },
  ],
  assets: [
    {
      id: 'asset-sl-tech-001',
      type: 'image',
      title: 'Ilustrasi bawaan SEMBURAT',
      license: 'Karya visual asli SEMBURAT, bukan foto pihak ketiga',
      credit: 'Ilustrasi oleh SEMBURAT',
    },
  ],
  keyPoints: [
    'PP 71/2019 mewajibkan pendaftaran PSE sebelum sistem elektronik dipakai pengguna.',
    'PSE lingkup privat mencakup orang, badan usaha, dan masyarakat penyedia layanan digital.',
    'Pendaftaran dilayani lewat kanal resmi Komdigi/OSS dan hasilnya dapat dicek publik.',
    'Status PSE tidak menggantikan hak pengguna atas data pribadi yang diatur UU PDP.',
  ],
  faq: [
    {
      question: 'Siapa saja yang termasuk PSE lingkup privat?',
      answer:
        'Menurut laman resmi Komdigi, setiap orang, badan usaha, dan masyarakat yang menyediakan, mengelola, atau mengoperasikan sistem elektronik untuk keperluan sendiri maupun pihak lain.',
    },
    {
      question: 'Kapan pendaftaran wajib dilakukan?',
      answer:
        'Pasal 6 PP 71/2019 menetapkan pendaftaran wajib dilakukan sebelum sistem elektronik mulai digunakan oleh pengguna.',
    },
    {
      question: 'Di mana saya memeriksa status sebuah layanan?',
      answer:
        'Di laman resmi pendaftaran PSE Kementerian Komunikasi dan Digital, yang mencantumkan penyelenggara yang sudah terdaftar.',
    },
  ],
};
