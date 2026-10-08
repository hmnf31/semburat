import type { SoftLaunchArticle } from '../article-types';

export const viral01: SoftLaunchArticle = {
  id: 'sl-viral-001',
  slug: 'mengapa-konten-keliru-menyebar-lebih-cepat',
  title: 'Mengapa Konten Keliru Menyebar Lebih Cepat dari Koreksinya',
  dek: 'Studi ilmiah atas 126.000 unggahan menemukan kabar keliru mencapai lebih banyak orang, lebih cepat, dan lebih dalam daripada kabar benar.',
  summary:
    'Riset yang dipublikasikan di jurnal Science menganalisis sekitar 126.000 rantai unggahan di Twitter dari 2006 hingga 2017 dan menemukan kabar keliru menyebar lebih jauh, lebih cepat, dan lebih luas daripada kabar benar. Mekanismenya bukan robot, melainkan manusia yang terdorong membagikan hal yang terasa baru.',
  body: `Riset tim Soroush Vosoughi, Deb Roy, dan Sinan Aral dari Massachusetts Institute of Technology dipublikasikan di jurnal Science pada Maret 2018 dengan judul "The spread of true and false news online". Studi itu memetakan sekitar 126.000 rantai unggahan (cascade) yang tersebar lewat sekitar 3 juta akun dan dikutip lebih dari 4,5 juta kali selama periode 2006–2017.

Untuk memisahkan kabar benar dan keliru, peneliti memakai penilaian enam organisasi pemeriksa fakta independen yang setuju satu sama lain pada 95–98 persen kasus. Hasilnya konsisten di seluruh kategori informasi: kekeliruan menyebar lebih jauh, lebih cepat, lebih dalam, dan lebih luas daripada kebenaran.

Angka yang paling sering dikutip: 1 persen teratas rantai kabar keliru menjangkau antara 1.000 dan 100.000 orang, sementara kabar benar jarang menembus 1.000 orang. Liputan MIT News atas studi yang sama mencatat kabar keliru 70 persen lebih mungkin dibagikan ulang, dan kabar benar butuh sekitar enam kali lebih lama untuk menjangkau 1.500 orang.

Yang menarik, peneliti menguji kemungkinan bahwa bot pemicu penyebaran itu. Setelah seluruh bot dibuang dari data, perbedaannya tetap ada. Kesimpulannya: manusia, bukan robot, yang paling banyak menyebar informasi keliru. Penjelasan yang diusulkan tim adalah kebaruan (novelty) dan reaksi emosional, karena kabar keliru lebih sering memantulkan respons terkejut, jijik, dan takut, sementara kabar benar memantulkan antisipasi, sedih, gembira, dan kepercayaan.

Praktiknya untuk pembaca: karena koreksian selalu bergerak lebih lambat, keputusan untuk membagikan sebaiknya diambil setelah memeriksa sumber asli, bukan setelah menyimak reaksi. Media yang bertanggung jawab memilih memverifikasi lebih dulu dan menyatakan apa yang belum terkonfirmasi, alih-alih mengisi kekosongan cerita dengan tebakan.`,
  category: 'Viral',
  subcategory: 'Literasi Media',
  status: 'published',
  riskLevel: 'LOW',
  qualityScore: 91,
  publishedAt: '2026-10-07T08:30:00+07:00',
  sources: [
    {
      title: 'The spread of true and false news online — Science (2018)',
      url: 'https://www.science.org/doi/10.1126/science.aap9559',
      accessedAt: '2026-10-07T09:15:00+07:00',
    },
    {
      title: 'Study: On Twitter, false news travels faster than true stories — MIT News',
      url: 'https://news.mit.edu/2018/study-twitter-false-news-travels-faster-true-stories-0308',
      accessedAt: '2026-10-07T09:30:00+07:00',
    },
  ],
  assets: [
    {
      id: 'asset-sl-viral-001',
      type: 'image',
      title: 'Fighting Fake News — U.S. Army Europe and Africa',
      license: 'Public domain (PD)',
      credit: 'U.S. Army / Sgt. Stephen Perez',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Fighting_Fake_News-_How_you_can_help_stop_the_spread_of_Misinformation,_Disinformation_(6616039).jpg',
    },
  ],
  keyPoints: [
    'Studi mengkaji sekitar 126.000 rantai unggahan dari sekitar 3 juta akun (2006–2017).',
    'Kabar keliru menyebar lebih jauh, lebih cepat, dan lebih luas di semua kategori informasi.',
    'Setelah bot dibuang dari data, pola penyebarannya tetap sama, artinya manusia pemicu utamanya.',
    'Koreksian selalu terlambat, maka tunda berbagi sampai sumber asli diperiksa.',
  ],
  faq: [
    {
      question: 'Apakah studi ini menyebut robot sebagai penyebab utama?',
      answer:
        'Tidak. Setelah bot dihapus dari data, perbedaan penyebaran tetap ada, sehingga peneliti menyimpulkan manusia yang paling banyak menyebarkan informasi keliru.',
    },
    {
      question: 'Berapa lama data riset ini dikumpulkan?',
      answer:
        'Data mencakup periode 2006–2017 di Twitter, diverifikasi oleh enam organisasi pemeriksa fakta dengan tingkat kesepakatan 95–98 persen.',
    },
    {
      question: 'Apa implikasinya bagi pembaca media sosial?',
      answer:
        'Karena keliru menyebar lebih cepat dari koreksinya, sebaiknya cek sumber asli sebelum membagikan, dan waspadai unggahan yang dirancang memancing reaksi kejutan atau takut.',
    },
  ],
};
