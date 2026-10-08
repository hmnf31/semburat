import type { SoftLaunchArticle } from '../article-types';

export const gaming03: SoftLaunchArticle = {
  id: 'sl-gaming-003',
  slug: 'peluang-item-berbayar-harus-diumumkan',
  title: 'Peluang Item Berbayar Wajib Diumumkan: Apa Artinya bagi Pemain',
  dek: 'Aturan App Store dan Google Play mewajibkan peluang tiap jenis item ditampilkan sebelum pembelian.',
  summary:
    'Baik Apple maupun Google mewajibkan pengembang mengungkapkan peluang (odds) memperoleh setiap jenis item dari mekanisme acak sebelum pembelian dilakukan. Kewajiban ini membuat pemain dapat menimbang peluang, meski tetap bukan jaminan mendapat item yang diinginkan.',
  body: `Mekanisme item acak, yang dikenal dengan istilah loot box atau kotak harta, sudah menjadi bagian lumrah dari gim modern. Yang berubah adalah aturan mainnya di dua toko aplikasi terbesar.

Pedoman Tinjauan Aplikasi Apple berbunyi tegas: aplikasi yang menawarkan "loot box" atau mekanisme lain yang memberikan item virtual acak berbayar harus mengungkapkan peluang memperoleh setiap jenis item kepada pelanggan sebelum pembelian. Persyaratan itu berlaku sebelum transaksi, bukan sesudahnya.

Di sisi Android, kebijakan Google Play mengikuti arah yang sama. Sebuah tinjauan hukum atas pembaruan kebijakan Google Play mencatat bahwa aplikasi yang menawarkan mekanisme memperoleh item virtual acak dari pembelian wajib mengungkapkan peluang tersebut secara jelas sebelum pembelian dilakukan, meniru persyaratan yang sudah lebih dulu diterapkan Apple.

Apa artinya bagi pemain? Dua hal sekaligus. Pertama, tersedia informasi yang bisa dibandingkan. Peluang tiap jenis item kini dapat dibaca sebelum menekan tombol beli, sehingga keputusan tidak lagi dibuat dalam kegelapan. Kedua, peluang yang diungkapkan tetaplah peluang: angka 1 persen berarti dari seribu kali pembelian, secara statistik satu di antaranya menghasilkan item tersebut, dan hasil pada satu kali pembelian tetap acak sepenuhnya.

Perlu dibedakan juga antara kewajiban mengungkapkan dan larangan total. Aturan ini mengatur transparansi, bukan melarang mekanisme item acak. Di beberapa yurisdiksi lain memang ada aturan yang lebih ketat, namun pada dua toko aplikasi ini fokusnya adalah kewajiban informasi sebelum pembelian.

Praktik yang wajar bagi pemain: baca halaman peluang yang biasanya tersimpan di dalam toko gim, tetapkan batas pengeluaran sendiri, dan perlakukan mekanisme ini sebagai hiburan, bukan investasi. Untuk pemain muda, pengaturan persetujuan pembelian di toko aplikasi tetap menjadi lapisan pertahanan pertama.`,
  category: 'Gaming',
  subcategory: 'Kebijakan Platform',
  status: 'published',
  riskLevel: 'LOW',
  qualityScore: 85,
  publishedAt: '2026-09-28T13:00:00+07:00',
  sources: [
    {
      title: 'App Review Guidelines — Apple Developer',
      url: 'https://developer.apple.com/app-store/review/guidelines/',
      accessedAt: '2026-09-28T14:00:00+07:00',
    },
    {
      title: 'Google Play Now Requires Disclosure of Loot Box Odds — Fenwick',
      url: 'https://www.fenwick.com/insights/publications/google-play-now-requires-disclosure-of-loot-box-odds',
      accessedAt: '2026-09-28T14:20:00+07:00',
    },
    {
      title: 'Google Play Developer Policy Center',
      url: 'https://play.google.com/about/developer-content-policy/',
      accessedAt: '2026-09-28T14:35:00+07:00',
    },
  ],
  assets: [
    {
      id: 'asset-sl-gaming-003',
      type: 'image',
      title: 'Video game loot box mockup',
      license: 'CC BY-SA 4.0',
      credit: 'Sameboat',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Video_game_loot_box_mockup.png',
    },
  ],
  keyPoints: [
    'Apple mewajibkan peluang tiap jenis item diungkapkan sebelum pembelian.',
    'Google Play menerapkan kewajiban serupa untuk mekanisme item acak berbayar.',
    'Kewajiban ini soal transparansi, bukan larangan atas mekanisme item acak.',
    'Peluang yang diungkapkan tidak menjamin hasil pada satu kali pembelian.',
  ],
  faq: [
    {
      question: 'Apakah loot box dilarang di App Store dan Google Play?',
      answer:
        'Tidak. Yang diwajibkan adalah pengungkapan peluang memperoleh setiap jenis item sebelum pembelian, bukan pelarangan mekanisme tersebut.',
    },
    {
      question: 'Di mana peluang ini biasanya ditampilkan?',
      answer:
        'Peluang umumnya tersedia di dalam toko gim, dekat mekanisme pembelian, sehingga pemain dapat membacanya sebelum menekan tombol beli.',
    },
    {
      question: 'Apakah pengungkapan peluang membuat peluang lebih besar?',
      answer:
        'Tidak. Pengungkapan hanya membuat peluang terlihat. Peluang yang tertera tetap berlaku apa adanya pada setiap pembelian.',
    },
  ],
};
