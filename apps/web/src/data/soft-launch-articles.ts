export type SoftLaunchRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type SoftLaunchStatus =
  | 'draft'
  | 'researching'
  | 'verified'
  | 'editorial_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived'
  | 'rejected'
  | 'needs_research'
  | 'needs_asset'
  | 'needs_license'
  | 'needs_review';

export interface SoftLaunchSource {
  title: string;
  url: string;
  accessedAt: string;
}

export interface SoftLaunchAsset {
  id: string;
  type: 'image' | 'video';
  title: string;
  license: string;
  credit: string;
  sourceUrl: string;
}

export interface SoftLaunchFaq {
  question: string;
  answer: string;
}

export interface SoftLaunchArticle {
  id: string;
  slug: string;
  title: string;
  dek: string;
  summary: string;
  body: string;
  category: string;
  subcategory: string;
  status: SoftLaunchStatus;
  riskLevel: SoftLaunchRiskLevel;
  qualityScore: number;
  publishedAt: string;
  sources: SoftLaunchSource[];
  assets: SoftLaunchAsset[];
  keyPoints: string[];
  faq: SoftLaunchFaq[];
}

export const softLaunchArticles: SoftLaunchArticle[] = [
  {
    id: 'sl-viral-001',
    slug: 'tantangan-es-krim-30-detik',
    title: 'Tantangan Es Krim 30 Detik Menghebohkan Timeline',
    dek: 'Tantangan menghabiskan es krim dalam 30 detik menyebar cepat di media sosial, memicu perdebatan soal keamanan dan tersedak.',
    summary:
      'Tantangan es krim 30 detik kembali viral di Indonesia. Konten sederhana ini menyebar lintas provinsi dalam hitungan jam, namun memicu kekhawatiran risiko tersedak, terutama bagi anak-anak.',
    body: 'Tantangan es krim 30 detik kembali menghiasi timeline media sosial Indonesia. Peserta diminta menghabiskan satu bungkus es krim dalam waktu setengah menit sambil merekam ekspresi mereka. Seorang kreator asal Bandung dilaporkan menjadi salah satu yang pertama mempopulerkan tantangan ini lewat platform video pendek. Meski terdengar ringan, tantangan ini memicu perdebatan soal keamanan. Sejumlah netizen mengingatkan risiko tersedak, terutama bagi anak-anak yang meniru tanpa pengawasan. Di sisi lain, tren ini membuktikan betapa cepatnya konten sederhana menyebar lintas provinsi dalam hitungan jam. Ahli komunikasi menyarankan penonton kritis membaca konteks sebelum ikut serta.',
    category: 'Viral',
    subcategory: 'Tren Media Sosial',
    status: 'published',
    riskLevel: 'MEDIUM',
    qualityScore: 82,
    publishedAt: '2026-10-05T09:00:00+07:00',
    sources: [
      {
        title: 'Tren tantangan es krim di platform video pendek (contoh)',
        url: 'https://example.com/tantangan-es-krim',
        accessedAt: '2026-10-05T10:30:00+07:00',
      },
      {
        title: 'Peringatan risiko tersedak pada anak (contoh)',
        url: 'https://example.com/peringatan-tersedak',
        accessedAt: '2026-10-05T11:00:00+07:00',
      },
    ],
    assets: [
      {
        id: 'asset-sl-001',
        type: 'image',
        title: 'Ilustrasi es krim (placeholder)',
        license: 'CC0 1.0 (placeholder)',
        credit: 'Kreator placeholder via Unsplash (contoh)',
        sourceUrl: 'https://example.com/kredit-es-krim',
      },
    ],
    keyPoints: [
      'Tantangan es krim 30 detik menyebar cepat lintas provinsi.',
      'Risiko tersedak mengemuka, terutama bagi anak-anak.',
      'Kreator Bandung disebut sebagai salah satu perintis tren.',
      'Penonton disarankan kritis membaca konteks sebelum meniru.',
    ],
    faq: [
      {
        question: 'Apa itu tantangan es krim 30 detik?',
        answer:
          'Tantangan di mana peserta menghabiskan satu bungkus es krim dalam 30 detik sambil direkam, lalu membagikannya ke media sosial.',
      },
      {
        question: 'Mengapa tantangan ini dipertanyakan?',
        answer:
          'Karena berpotensi menimbulkan risiko tersedak, khususnya bagi anak-anak yang meniru tanpa pengawasan orang dewasa.',
      },
    ],
  },
  {
    id: 'sl-viral-002',
    slug: 'kucing-penumpang-ojol',
    title: 'Rekaman Kucing Penumpang Ojol Mengundang Gelak Tawa',
    dek: 'Klip 45 detik seekor kucing oranye naik ojol ditonton ribuan kali dalam sehari.',
    summary:
      'Rekaman kucing oranye yang menaiki ojol menjadi viral. Klip 45 detik itu ditonton ribuan kali dalam sehari, meski keasliannya belum dikonfirmasi.',
    body: 'Rekaman seekor kucing yang naik ojol kembali menjadi perbincangan di media sosial. Video pendek itu memperlihatkan kucing berbulu oranye duduk tenang di jok depan sambil mengamati jalanan kota. Sang pengemudi tampak melambat dan sesekali menoleh ke penumpang tidak biasanya. Warga yang merekam kejadian itu mengunggah klip berdurasi 45 detik dan langsung ditonton ribuan kali dalam sehari. Komentar bermunculan, ada yang menyebut kucing itu tampak lebih tenang daripada penumpang manusia. Sejumlah akun hewan peliharaan ikut membagikan ulang klip tersebut. Peristiwa ini menunjukkan betapa cepatnya konten ringan menyebar, meski keaslian rekaman belum dikonfirmasi pihak berwenang.',
    category: 'Viral',
    subcategory: 'Video Viral',
    status: 'published',
    riskLevel: 'LOW',
    qualityScore: 85,
    publishedAt: '2026-10-04T15:30:00+07:00',
    sources: [
      {
        title: 'Klip kucing penumpang ojol di platform video pendek (contoh)',
        url: 'https://example.com/kucing-ojol',
        accessedAt: '2026-10-04T16:00:00+07:00',
      },
      {
        title: 'Tanggapan komunitas hewan peliharaan (contoh)',
        url: 'https://example.com/komunitas-hewan',
        accessedAt: '2026-10-04T17:15:00+07:00',
      },
    ],
    assets: [
      {
        id: 'asset-sl-002',
        type: 'video',
        title: 'Klip contoh kucing penumpang ojol (placeholder)',
        license: 'CC BY 4.0 (placeholder)',
        credit: 'Rekaman placeholder oleh kreator contoh',
        sourceUrl: 'https://example.com/kredit-kucing-ojol',
      },
    ],
    keyPoints: [
      'Klip 45 detik ditonton ribuan kali dalam sehari.',
      'Kucing oranye terlihat tenang di jok depan ojol.',
      'Keaslian rekaman belum dikonfirmasi pihak berwenang.',
      'Konten ringan cepat menyebar lintas akun media sosial.',
    ],
    faq: [
      {
        question: 'Sudahkah keaslian video dikonfirmasi?',
        answer:
          'Belum. Hingga artikel ini diterbitkan, pihak berwenang belum mengonfirmasi keaslian rekaman.',
      },
      {
        question: 'Mengapa video ini cepat menyebar?',
        answer:
          'Kontennya ringan dan lucu, sehingga mudah dibagikan ulang oleh akun hewan peliharaan.',
      },
    ],
  },
  {
    id: 'sl-tech-001',
    slug: 'terjemahan-real-time-ponsel-menengah',
    title: 'Fitur Terjemahan Real-Time Hadir di Ponsel Kelas Menengah',
    dek: 'Terjemahan real-time kini berjalan di perangkat tanpa koneksi internet, tetapi hasilnya tetap perlu diverifikasi.',
    summary:
      'Fitur terjemahan real-time hadir di ponsel kelas menengah. Model kecerdasan buatan berjalan langsung di perangkat, namun hasil terjemahan tetap perlu diverifikasi untuk dokumen penting.',
    body: 'Fitur terjemahan real-time mulai hadir di ponsel kelas menengah. Teknologi ini memanfaatkan model kecerdasan buatan yang berjalan langsung di perangkat, sehingga tidak selalu membutuhkan koneksi internet. Pengguna dapat mengarahkan kamera ke teks berbahasa asing dan melihat hasil terjemahan muncul di layar hampir seketika. Produsen mengklaim akurasi meningkat signifikan untuk bahasa sehari-hari. Meski demikian, hasil terjemahan tetap perlu diverifikasi untuk dokumen penting seperti kontrak atau surat resmi. Kementerian komunikasi mendorong pengembang menyediakan bahasa daerah agar manfaatnya lebih luas. Fitur serupa sebelumnya hanya tersedia di perangkat kelas premium.',
    category: 'Teknologi',
    subcategory: 'Kecerdasan Buatan',
    status: 'published',
    riskLevel: 'LOW',
    qualityScore: 88,
    publishedAt: '2026-10-03T08:00:00+07:00',
    sources: [
      {
        title: 'Pengumuman fitur terjemahan pada perangkat (contoh)',
        url: 'https://example.com/terjemahan-perangkat',
        accessedAt: '2026-10-03T09:00:00+07:00',
      },
      {
        title: 'Dorongan bahasa daerah dari kementerian (contoh)',
        url: 'https://example.com/bahasa-daerah',
        accessedAt: '2026-10-03T09:45:00+07:00',
      },
    ],
    assets: [
      {
        id: 'asset-sl-003',
        type: 'image',
        title: 'Ilustrasi kamera menerjemahkan teks (placeholder)',
        license: 'CC BY-SA 4.0 (placeholder)',
        credit: 'Ilustrator placeholder via Pexels (contoh)',
        sourceUrl: 'https://example.com/kredit-terjemahan',
      },
    ],
    keyPoints: [
      'Model AI berjalan langsung di perangkat tanpa internet.',
      'Kamera menerjemahkan teks berbahasa asing hampir seketika.',
      'Hasil tetap perlu diverifikasi untuk kontrak atau surat resmi.',
      'Kementerian mendorong dukungan bahasa daerah.',
    ],
    faq: [
      {
        question: 'Apakah fitur ini memerlukan internet?',
        answer:
          'Tidak selalu. Model berjalan di perangkat, meski beberapa bahasa mungkin tetap memerlukan koneksi.',
      },
      {
        question: 'Bisakah hasil terjemahan dipakai untuk dokumen resmi?',
        answer:
          'Tidak disarankan. Hasil mesin tetap perlu diverifikasi oleh penerjemah manusia untuk dokumen penting.',
      },
    ],
  },
  {
    id: 'sl-tech-002',
    slug: 'pusat-data-hijau-indonesia',
    title: 'Kementerian Dorong Pembangunan Pusat Data Hijau',
    dek: 'Pusat data hijau ditargetkan menekan konsumsi listrik seiring meningkatnya permintaan layanan digital.',
    summary:
      'Kementerian komunikasi mendorong pusat data hijau dengan energi terbarukan dan pendingin efisien. Insentif pajak disiapkan, namun regulasi pendukung masih dibahas.',
    body: 'Kementerian komunikasi mendorong pembangunan pusat data hijau di Indonesia. Langkah ini menyusul meningkatnya permintaan layanan digital dari sektor publik dan swasta. Pusat data hijau memanfaatkan energi terbarukan serta sistem pendingin efisien untuk menekan konsumsi listrik. Pemerintah menyiapkan insentif pajak bagi operator yang memenuhi standar efisiensi. Beberapa daerah di Jawa dan Sulawesi disebut sebagai kandidat lokasi karena ketersediaan energi. Analis menilai langkah ini penting agar pertumbuhan digital tidak berbanding terbalik dengan kenaikan emisi. Regulasi pendukung masih dalam proses pembahasan bersama kementerian energi.',
    category: 'Teknologi',
    subcategory: 'Infrastruktur Digital',
    status: 'published',
    riskLevel: 'LOW',
    qualityScore: 84,
    publishedAt: '2026-10-02T10:00:00+07:00',
    sources: [
      {
        title: 'Rencana pusat data hijau kementerian (contoh)',
        url: 'https://example.com/pusat-data-hijau',
        accessedAt: '2026-10-02T11:00:00+07:00',
      },
      {
        title: 'Analisis efisiensi energi pusat data (contoh)',
        url: 'https://example.com/efisiensi-energi',
        accessedAt: '2026-10-02T11:30:00+07:00',
      },
    ],
    assets: [
      {
        id: 'asset-sl-004',
        type: 'image',
        title: 'Foto panel surya untuk pusat data (placeholder)',
        license: 'CC0 1.0 (placeholder)',
        credit: 'Fotografer placeholder via Unsplash (contoh)',
        sourceUrl: 'https://example.com/kredit-panel-surya',
      },
    ],
    keyPoints: [
      'Pusat data hijau pakai energi terbarukan dan pendingin efisien.',
      'Insentif pajak disiapkan bagi operator yang memenuhi standar.',
      'Jawa dan Sulawesi menjadi kandidat lokasi.',
      'Regulasi pendukung masih dibahas bersama kementerian energi.',
    ],
    faq: [
      {
        question: 'Apa itu pusat data hijau?',
        answer:
          'Pusat data yang memanfaatkan energi terbarukan dan sistem pendingin efisien untuk menekan konsumsi listrik.',
      },
      {
        question: 'Daerah mana saja yang jadi kandidat lokasi?',
        answer:
          'Beberapa daerah di Jawa dan Sulawesi disebut kandidat karena ketersediaan energinya.',
      },
    ],
  },
  {
    id: 'sl-tech-003',
    slug: 'pesan-offline-daerah-3t',
    title: 'Aplikasi Perpesanan Rancang Mode Offline untuk Daerah 3T',
    dek: 'Mode offline memungkinkan pesan tersimpan dan terkirim begitu perangkat kembali menangkap sinyal.',
    summary:
      'Aplikasi perpesanan merancang mode offline untuk daerah 3T. Pesan tersimpan dan terkirim saat sinyal kembali, dengan enkripsi end-to-end.',
    body: 'Aplikasi perpesanan merancang mode offline khusus untuk daerah 3T (terdepan, terluar, tertinggal). Mode ini memungkinkan pesan tersimpan dan terkirim begitu perangkat kembali menangkap sinyal. Fitur dikembangkan setelah riset menunjukkan koneksi di beberapa wilayah timur masih terbatas. Pengguna juga dapat membaca berita ringan yang diunduh lebih dulu saat kuota tersedia. Pemerintah menilai langkah ini sejalan dengan program pemerataan infrastruktur digital. Pengembang berkomitmen menjaga privasi pengguna dengan enkripsi end-to-end. Uji coba awal dijadwalkan berlangsung di beberapa kabupaten Papua dan Nusa Tenggara Timur.',
    category: 'Teknologi',
    subcategory: 'Aplikasi',
    status: 'published',
    riskLevel: 'LOW',
    qualityScore: 80,
    publishedAt: '2026-10-01T13:00:00+07:00',
    sources: [
      {
        title: 'Riset koneksi di wilayah timur Indonesia (contoh)',
        url: 'https://example.com/koneksi-wilayah-timur',
        accessedAt: '2026-10-01T14:00:00+07:00',
      },
      {
        title: 'Pernyataan pengembang soal mode offline (contoh)',
        url: 'https://example.com/mode-offline',
        accessedAt: '2026-10-01T14:30:00+07:00',
      },
    ],
    assets: [
      {
        id: 'asset-sl-005',
        type: 'image',
        title: 'Ilustrasi ponsel di daerah terpencil (placeholder)',
        license: 'CC BY 4.0 (placeholder)',
        credit: 'Fotografer placeholder via Pexels (contoh)',
        sourceUrl: 'https://example.com/kredit-daerah-3t',
      },
    ],
    keyPoints: [
      'Mode offline menyimpan pesan hingga sinyal kembali.',
      'Fitur menyasar daerah 3T dengan koneksi terbatas.',
      'Enkripsi end-to-end dijanjikan pengembang.',
      'Uji coba dijadwalkan di Papua dan Nusa Tenggara Timur.',
    ],
    faq: [
      {
        question: 'Bagaimana mode offline mengirim pesan?',
        answer:
          'Pesan tersimpan di perangkat dan otomatis terkirim begitu sinyal kembali tersedia.',
      },
      {
        question: 'Di mana uji coba dilakukan?',
        answer: 'Uji coba awal dijadwalkan di beberapa kabupaten di Papua dan Nusa Tenggara Timur.',
      },
    ],
  },
  {
    id: 'sl-gaming-001',
    slug: 'konsol-generasi-terbaru-retail-indonesia',
    title: 'Konsol Generasi Terbaru Mulai Masuk Toko Retail Indonesia',
    dek: 'Rilis resmi di Jakarta dihadiri ratusan penggemar, dengan stok gelombang pertama terbatas.',
    summary:
      'Konsol permainan generasi terbaru mulai masuk toko ritel Indonesia. Harga kompetitif, stok gelombang pertama terbatas, dan distributor mengimbau pembelian via kanal resmi.',
    body: 'Konsol permainan generasi terbaru mulai masuk toko ritel Indonesia. Rilis resmi di Jakarta dihadiri ratusan penggemar yang mengantri sejak pagi. Harga eceran yang ditawarkan berada di kisaran yang kompetitif dibanding pasar regional. Penjual menyiapkan stok terbatas untuk gelombang pertama, sementara stok berikutnya dijadwalkan tiba bulan depan. Spesifikasi utama meliputi prosesor lebih cepat, penyimpanan internal lebih besar, dan dukungan resolusi tinggi. Komunitas gamer lokal menyambut baik peluncuran ini, meski sebagian mempertanyakan ketersediaan judul lokal di hari pertama. Pihak distributor mengimbau pembelian melalui kanal resmi agar terhindar dari produk palsu.',
    category: 'Gaming',
    subcategory: 'Konsol',
    status: 'published',
    riskLevel: 'LOW',
    qualityScore: 81,
    publishedAt: '2026-09-30T11:00:00+07:00',
    sources: [
      {
        title: 'Pengumuman rilis konsol di Indonesia (contoh)',
        url: 'https://example.com/rilis-konsol',
        accessedAt: '2026-09-30T12:00:00+07:00',
      },
      {
        title: 'Respons komunitas gamer lokal (contoh)',
        url: 'https://example.com/komunitas-gamer',
        accessedAt: '2026-09-30T12:45:00+07:00',
      },
    ],
    assets: [
      {
        id: 'asset-sl-006',
        type: 'image',
        title: 'Foto konsol generasi terbaru (placeholder)',
        license: 'CC0 1.0 (placeholder)',
        credit: 'Fotografer placeholder via Unsplash (contoh)',
        sourceUrl: 'https://example.com/kredit-konsol',
      },
    ],
    keyPoints: [
      'Rilis resmi di Jakarta dihadiri ratusan penggemar.',
      'Harga eceran kompetitif dibanding pasar regional.',
      'Stok gelombang pertama terbatas; gelombang kedua bulan depan.',
      'Distributor mengimbau pembelian lewat kanal resmi.',
    ],
    faq: [
      {
        question: 'Kapan stok gelombang kedua tersedia?',
        answer: 'Stok berikutnya dijadwalkan tiba bulan depan setelah rilis gelombang pertama.',
      },
      {
        question: 'Mengapa distributor menyarankan kanal resmi?',
        answer: 'Agar pembeli terhindar dari produk palsu dan mendapat garansi resmi.',
      },
    ],
  },
  {
    id: 'sl-gaming-002',
    slug: 'turnamen-esports-nasional-jakarta',
    title: 'Turnamen Esports Nasional Digelar di Jakarta',
    dek: 'Lebih dari seribu peserta bersaing di kategori mobile dan komputer dengan hadiah terbesar sepanjang tahun ini.',
    summary:
      'Turnamen esports nasional digelar di Jakarta dengan lebih dari seribu peserta. Pertandingan disiarkan langsung, dan tim Surabaya serta Makassar menjadi favorit.',
    body: 'Turnamen esports nasional digelar di Jakarta akhir pekan ini. Lebih dari seribu peserta dari berbagai provinsi bersaing dalam kategori mobile dan komputer. Panitia menyediakan hadiah total yang menjadi yang terbesar sepanjang tahun ini. Pertandingan disiarkan langsung melalui platform video dengan komentator berbahasa Indonesia. Tim asal Surabaya dan Makassar menjadi favorit setelah dominasi di babak penyisihan. Penyelenggara menekankan sportivitas dan penerapan aturan anti-kecurangan ketat. Turnamen ini juga membuka kelas gratis bagi pelajar yang tertarik pada industri kreatif. Penonton hadirin diprediksi menembus angka lima ribu orang selama dua hari.',
    category: 'Gaming',
    subcategory: 'Esports',
    status: 'published',
    riskLevel: 'LOW',
    qualityScore: 86,
    publishedAt: '2026-09-29T14:00:00+07:00',
    sources: [
      {
        title: 'Pengumuman turnamen esports nasional (contoh)',
        url: 'https://example.com/turnamen-esports',
        accessedAt: '2026-09-29T15:00:00+07:00',
      },
      {
        title: 'Daftar tim unggulan babak penyisihan (contoh)',
        url: 'https://example.com/tim-unggulan',
        accessedAt: '2026-09-29T15:30:00+07:00',
      },
    ],
    assets: [
      {
        id: 'asset-sl-007',
        type: 'image',
        title: 'Suasana arena esports (placeholder)',
        license: 'CC BY-SA 4.0 (placeholder)',
        credit: 'Fotografer placeholder via Pexels (contoh)',
        sourceUrl: 'https://example.com/kredit-arena-esports',
      },
    ],
    keyPoints: [
      'Lebih dari seribu peserta dari berbagai provinsi.',
      'Hadiah total terbesar sepanjang tahun ini.',
      'Disiarkan langsung dengan komentator berbahasa Indonesia.',
      'Kelas gratis dibuka bagi pelajar.',
    ],
    faq: [
      {
        question: 'Kategori apa saja yang dipertandingkan?',
        answer: 'Dua kategori, yaitu mobile dan komputer, dengan babak penyisihan dan final.',
      },
      {
        question: 'Apakah turnamen ini gratis ditonton?',
        answer: 'Ya. Pertandingan disiarkan langsung melalui platform video tanpa biaya.',
      },
    ],
  },
  {
    id: 'sl-gaming-003',
    slug: 'produsen-game-wajib-tampilkan-peluang-item',
    title: 'Produsen Game Wajib Tampilkan Peluang Item Berbayar',
    dek: 'Pedoman mengharuskan persentase kemunculan tiap item ditampilkan sebelum pembelian kotak misteri.',
    summary:
      'Produsen permainan daring diingatkan menampilkan peluang item berbayar secara jelas, menyusul kekhawatiran pengeluaran berlebihan pada pemain muda.',
    body: 'Produsen permainan daring diingatkan untuk menampilkan peluang item berbayar secara jelas. Aturan ini menyusul kekhawatiran bahwa mekanisme kotak misteri dapat mendorong pengeluaran berlebihan, khususnya di kalangan pemain muda. Pedoman mengharuskan persentase kemunculan tiap item ditampilkan sebelum pembelian. Beberapa studio telah menyesuaikan toko dalam gim mereka. Kementerian perlindungan anak mendesak pengawasan lebih ketat terhadap sistem pembayaran. Pelanggaran dapat dikenai sanksi berupa peninjauan ulang izin operasi. Keluarga diimbau mengaktifkan kontrol orang tua dan membatasi durasi bermain.',
    category: 'Gaming',
    subcategory: 'Regulasi',
    status: 'published',
    riskLevel: 'MEDIUM',
    qualityScore: 83,
    publishedAt: '2026-09-28T09:30:00+07:00',
    sources: [
      {
        title: 'Pedoman transparansi peluang item (contoh)',
        url: 'https://example.com/peluang-item',
        accessedAt: '2026-09-28T10:00:00+07:00',
      },
      {
        title: 'Desakan pengawasan dari kementerian perlindungan anak (contoh)',
        url: 'https://example.com/pengawasan-anak',
        accessedAt: '2026-09-28T10:30:00+07:00',
      },
    ],
    assets: [
      {
        id: 'asset-sl-008',
        type: 'image',
        title: 'Ilustrasi toko dalam gim (placeholder)',
        license: 'CC BY 4.0 (placeholder)',
        credit: 'Ilustrator placeholder via Unsplash (contoh)',
        sourceUrl: 'https://example.com/kredit-toko-gim',
      },
    ],
    keyPoints: [
      'Persentase kemunculan item harus ditampilkan sebelum pembelian.',
      'Kekhawatiran pengeluaran berlebihan pada pemain muda.',
      'Pelanggaran berisiko peninjauan ulang izin operasi.',
      'Keluarga diimbau mengaktifkan kontrol orang tua.',
    ],
    faq: [
      {
        question: 'Apa yang diwajibkan pedoman baru ini?',
        answer:
          'Produsen harus menampilkan persentase kemunculan tiap item berbayar sebelum pengguna membeli.',
      },
      {
        question: 'Apa sanksi bagi produsen yang melanggar?',
        answer: 'Peninjauan ulang izin operasi, sesuai desakan kementerian perlindungan anak.',
      },
    ],
  },
  {
    id: 'sl-explainer-001',
    slug: 'apa-itu-komputasi-awan',
    title: 'Apa Itu Komputasi Awan dan Mengapa Banyak Dipakai?',
    dek: 'Komputasi awan memindahkan penyimpanan dan pengolahan data ke server jarak jauh yang diakses lewat internet.',
    summary:
      'Komputasi awan adalah menyimpan dan mengolah data melalui server jarak jauh. Fleksibel dan terukur biayanya, namun koneksi stabil tetap menjadi syarat utama.',
    body: 'Komputasi awan adalah cara menyimpan dan mengolah data melalui jaringan server jarak jauh. Alih-alih menyimpan berkas di hard disk lokal, pengguna mengakses layanan lewat internet. Model ini populer karena fleksibilitasnya: kapasitas bisa ditambah atau dikurangi sesuai kebutuhan tanpa membeli perangkat baru. Contoh sehari-hari meliputi penyimpanan foto daring dan aplikasi perkantoran berbasis web. Keamanannya bergantung pada penyedia, sehingga pilih layanan yang menerapkan enkripsi dan audit berkala. Biaya pun cenderung lebih terukur karena pengguna membayar sesuai pemakaian. Namun koneksi stabil tetap menjadi syarat utama.',
    category: 'Explainer',
    subcategory: 'Teknologi',
    status: 'published',
    riskLevel: 'LOW',
    qualityScore: 90,
    publishedAt: '2026-09-27T08:00:00+07:00',
    sources: [
      {
        title: 'Glosarium komputasi awan (contoh)',
        url: 'https://example.com/glosarium-awan',
        accessedAt: '2026-09-27T09:00:00+07:00',
      },
      {
        title: 'Panduan memilih layanan awan (contoh)',
        url: 'https://example.com/panduan-awan',
        accessedAt: '2026-09-27T09:30:00+07:00',
      },
    ],
    assets: [
      {
        id: 'asset-sl-009',
        type: 'image',
        title: 'Diagram server jarak jauh (placeholder)',
        license: 'CC0 1.0 (placeholder)',
        credit: 'Ilustrator placeholder via Unsplash (contoh)',
        sourceUrl: 'https://example.com/kredit-diagram-awan',
      },
    ],
    keyPoints: [
      'Data disimpan dan diolah di server jarak jauh.',
      'Kapasitas fleksibel tanpa beli perangkat baru.',
      'Biaya terukur sesuai pemakaian.',
      'Koneksi stabil menjadi syarat utama.',
    ],
    faq: [
      {
        question: 'Apa contoh komputasi awan sehari-hari?',
        answer: 'Penyimpanan foto daring dan aplikasi perkantoran berbasis web adalah contoh umum.',
      },
      {
        question: 'Apakah komputasi awan aman?',
        answer:
          'Keamanan bergantung pada penyedia. Pilih layanan yang menerapkan enkripsi dan audit berkala.',
      },
    ],
  },
  {
    id: 'sl-explainer-002',
    slug: 'apa-itu-qris-pembayaran-digital',
    title: 'Apa Itu QRIS: Penjelasan Singkat Pembayaran Digital',
    dek: 'QRIS menyatukan pembayaran digital dalam satu kode yang bisa dibaca berbagai aplikasi dompet digital.',
    summary:
      'QRIS adalah standar kode respons cepat yang menyatukan pembayaran digital di Indonesia. Satu kode dibaca berbagai aplikasi, mengurangi ketergantungan pada tunai.',
    body: 'QRIS adalah standar kode respons cepat yang menyatukan pembayaran digital di Indonesia. Dikembangkan oleh otoritas moneter, QRIS memungkinkan satu kode dibaca oleh berbagai aplikasi dompet digital dan perbankan. Pedagang cukup menampilkan satu kode, sementara pembeli memilih aplikasi masing-masing. Sistem ini mengurangi ketergantungan pada tunai dan mempermudah pencatatan transaksi. Transaksi kecil tanpa biaya administrasi mendorong adopsi di warung dan pasar tradisional. Pengguna disarankan memverifikasi nama pedagang sebelum menekan tombol bayar. Adopsi QRIS terus meluas, termasuk untuk pembayaran transportasi umum dan tol.',
    category: 'Explainer',
    subcategory: 'Keuangan Digital',
    status: 'published',
    riskLevel: 'LOW',
    qualityScore: 89,
    publishedAt: '2026-09-26T10:00:00+07:00',
    sources: [
      {
        title: 'Penjelasan standar QRIS dari otoritas moneter (contoh)',
        url: 'https://example.com/standar-qris',
        accessedAt: '2026-09-26T11:00:00+07:00',
      },
      {
        title: 'Data adopsi QRIS di pasar tradisional (contoh)',
        url: 'https://example.com/adopsi-qris',
        accessedAt: '2026-09-26T11:30:00+07:00',
      },
    ],
    assets: [
      {
        id: 'asset-sl-010',
        type: 'image',
        title: 'Ilustrasi kode QRIS (placeholder)',
        license: 'CC BY-SA 4.0 (placeholder)',
        credit: 'Ilustrator placeholder via Pexels (contoh)',
        sourceUrl: 'https://example.com/kredit-qris',
      },
    ],
    keyPoints: [
      'Satu kode dibaca berbagai aplikasi dompet digital.',
      'Mengurangi ketergantungan pada tunai.',
      'Transaksi kecil tanpa biaya administrasi.',
      'Verifikasi nama pedagang sebelum membayar.',
    ],
    faq: [
      {
        question: 'Siapa yang mengembangkan QRIS?',
        answer:
          'Otoritas moneter Indonesia mengembangkan QRIS sebagai standar nasional pembayaran digital.',
      },
      {
        question: 'Apakah QRIS dikenakan biaya untuk transaksi kecil?',
        answer:
          'Tidak. Transaksi kecil bebas biaya administrasi, mendorong adopsi di warung dan pasar tradisional.',
      },
    ],
  },
];
