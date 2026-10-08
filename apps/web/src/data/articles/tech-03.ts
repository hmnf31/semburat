import type { SoftLaunchArticle } from '../article-types';

export const tech03: SoftLaunchArticle = {
  id: 'sl-tech-003',
  slug: 'kenali-phishing-sebelum-kena',
  title: 'Kenali Phishing Sebelum Kena: Tiga Tanda yang Paling Sering Muncul',
  dek: 'Pesan yang mendesak, meminta data pribadi, dan memakai tautan pendek tak tepercaya adalah umpan yang paling lazim.',
  summary:
    'Phishing adalah upaya memperoleh data pribadi atau memasang perangkat berbahaya lewat pesan yang menyamar sebagai pihak tepercaya. Panduan CISA menandai tiga gejala utama: bahasa mendesak, permintaan data sensitif, dan alamat tautan yang janggal.',
  body: `Cybersecurity and Infrastructure Security Agency (CISA) mendefinisikan phishing sebagai upaya penjahat siber agar kita membuka tautan, surel, atau lampiran berbahaya yang bisa meminta data pribadi atau menginfeksi perangkat. Umpannya bisa datang sebagai surel, pesan singkat, pesan langsung di media sosial, bahkan telepon, dan biasanya dirancang terlihat berasal dari orang atau lembaga tepercaya.

Panduan "Recognize and Report Phishing" dari CISA menandai tiga gejala yang paling sering muncul. Pertama, bahasa yang mendesak atau memancing emosi, terutama yang mengancam akibat buruk bila tidak segera ditanggapi. Kedua, permintaan mengirimkan informasi pribadi atau finansial. Ketiga, tautan pendek yang tidak tepercaya serta alamat surel atau tautan yang salah, seperti domain yang mirip namun salah eja. CISA juga mencatat bahwa tata bahasa yang buruk dulu menjadi penanda, tetapi era kecerdasan buatan membuat pesan palsu bisa terlihat sempurna, sehingga penanda lain lebih bisa diandalkan.

Langkah berikutnya bukan mengklik, melainkan mengabaikan. CISA menyarankan mengenali, menahan diri, lalu menghapus pesan tanpa membalas dan tanpa membuka lampiran, termasuk tautan "berhenti berlangganan". Bila pesan itu terasa mungkin asli, hubungi lembaga terkait lewat jalur resmi yang Anda ketahui sendiri, misalnya dengan mengetik alamat situsnya secara manual, bukan lewat tautan di pesan.

Di Indonesia, modus serupa juga dipantau instansi resmi. Direktorat Jenderal Pajak misalnya mengimbau publik memeriksa domain dan mengabaikan tautan di luar pajak.go.id, serta menghapus pesan yang melampirkan berkas berformat apk. Pesan jenis ini kerap disertai ajakan memperbarui data demi memicu respons cepat.

Dua kebiasaan menutup celah paling besar: aktifkan verifikasi dua langkah pada akun penting dan pakai pengelola kata sandi agar setiap layanan punya kata sandi unik yang panjang. Dengan keduanya, kebocoran satu kata sandi tidak langsung membuka akses ke akun lain.`,
  category: 'Teknologi',
  subcategory: 'Keamanan Digital',
  status: 'published',
  riskLevel: 'LOW',
  qualityScore: 89,
  publishedAt: '2026-09-30T07:45:00+07:00',
  sources: [
    {
      title: 'Recognize and Report Phishing — CISA',
      url: 'https://www.cisa.gov/secure-our-world/recognize-and-report-phishing',
      accessedAt: '2026-09-30T08:30:00+07:00',
    },
    {
      title: 'Waspada Penipuan Mengatasnamakan Direktorat Jenderal Pajak — pajak.go.id',
      url: 'https://pajak.go.id/id/pengumuman/waspada-penipuan-mengatasnamakan-direktorat-jenderal-pajak',
      accessedAt: '2026-09-30T08:50:00+07:00',
    },
  ],
  assets: [
    {
      id: 'asset-sl-tech-003',
      type: 'image',
      title: 'Ilustrasi bawaan SEMBURAT',
      license: 'Karya visual asli SEMBURAT, bukan foto pihak ketiga',
      credit: 'Ilustrasi oleh SEMBURAT',
    },
  ],
  keyPoints: [
    'Tiga penanda utama: bahasa mendesak, permintaan data sensitif, dan alamat tautan yang janggal.',
    'CISA menyarankan mengenali, menahan diri, lalu menghapus tanpa membalas atau membuka lampiran.',
    'Bila ragu, hubungi lembaga lewat kontak resmi yang Anda ketahui, bukan lewat tautan di pesan.',
    'Verifikasi dua langkah dan pengelola kata sandi menutup celah kebocoran satu kata sandi.',
  ],
  faq: [
    {
      question: 'Tata bahasa yang buruk masih jadi penanda phishing?',
      answer:
        'CISA menyatakan penanda itu melemah karena kecerdasan buatan membuat pesan bisa terlihat rapi. Gejala lain seperti bahasa mendesak dan permintaan data lebih bisa diandalkan.',
    },
    {
      question: 'Saya sudah membuka tautannya, apa yang harus dilakukan?',
      answer:
        'Putuskan koneksi bila perangkat terasa janggal, ubah kata sandi akun terkait dari perangkat lain, dan aktifkan verifikasi dua langkah. Lapor lewat kanal resmi penyedia layanan.',
    },
    {
      question: 'Ke mana melaporkan pesan mencurigakan di Indonesia?',
      answer:
        'Laporkan lewat kanal resmi lembaga yang dimaksud pesan itu. Untuk penipuan daring, tersedia pula kanal pengaduan resmi pemerintah seperti Lapor.go.id.',
    },
  ],
};
