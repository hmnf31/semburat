import type { SoftLaunchArticle } from '../article-types';

export const viral02: SoftLaunchArticle = {
  id: 'sl-viral-002',
  slug: 'content-credentials-lacak-asal-usul-foto',
  title: 'Content Credentials: Label untuk Menelusuri Asal Foto dan Video',
  dek: 'Standar terbuka C2PA menyimpan riwayat pembuatan dan penyuntingan media dalam data yang ditandatangani kriptografis.',
  summary:
    'Content Credentials adalah istilah teknis untuk C2PA Manifest: catatan provenansi yang ditandatangani kriptografis dan menempel pada foto, video, atau dokumen. Standar ini memungkinkan orang mengecek asal dan riwayat penyuntingan, bukan menilai kebenaran isinya.',
  body: `Coalition for Content Provenance and Authenticity (C2PA) mengembangkan standar terbuka bernama Content Credentials untuk menjawab kekhawatiran bahwa media digital mudah dimanipulasi, baik oleh manusia maupun kecerdasan buatan generatif. Dokumen penjelas resmi menyebut teknologi ini "semacam label informasi gizi untuk konten digital".

Cara kerjanya berjenjang. Perangkat lunak pembuat atau penyunting mengumpulkan pernyataan (assertion) tentang aset: kapan dan di mana konten dibuat, alat apa yang dipakai, riwayat perubahan, hingga penggunaan AI. Pernyataan itu dibungkus menjadi klaim, ditandatangani dengan kunci privat, lalu disimpan sebagai struktur bernama C2PA Manifest, sebutan teknis untuk Content Credentials.

Karena manifest ditandatangani, setiap perubahan setelahnya dapat terdeteksi. Aplikasi yang mendukung dapat memeriksa dua hal sekaligus: apakah data provenansinya utuh dan tidak dirusak, dan apakah informasi itu memang terhubung ke aset yang sedang dilihat.

Batasannya perlu ditegaskan. Dokumen penjelas C2PA menyatakan secara eksplisit bahwa Content Credentials tidak memberi penilaian apakah informasi provenansi itu "benar" atau "salah"; ia hanya menjamin catatan itu terbentuk rapi, bebas dari pemalsuan, dan berasal dari penandatangan yang terdaftar di daftar kepercayaan. Ia juga bukan obat tunggal atas misinformasi, melainkan pelengkap literasi media, pemeriksaan fakta, dan forensik digital.

Agar tahan saat konten berpindah tangan, spesifikasi ini dirancang kompatibel dengan penanda air tak kasat mata dan pencocokan sidik jari digital. Standar ini dirilis dengan lisensi bebas royalti sehingga bisa diimplementasikan secara terbuka maupun tertutup, dan anggotanya mencakup organisasi dari industri periklanan, media, hingga perangkat keras.

Untuk pembaca, artinya sederhana: adanya badge provenansi bukan jaminan kebenaran berita, tetapi ia memberi petunjuk tambahan tentang siapa yang membuat, kapan, dan apakah gambar itu perlu disunting.`,
  category: 'Viral',
  subcategory: 'Verifikasi Konten',
  status: 'published',
  riskLevel: 'LOW',
  qualityScore: 88,
  publishedAt: '2026-10-04T10:00:00+07:00',
  sources: [
    {
      title: 'C2PA and Content Credentials Explainer — C2PA Specifications',
      url: 'https://spec.c2pa.org/specifications/specifications/2.4/explainer/Explainer.html',
      accessedAt: '2026-10-04T10:45:00+07:00',
    },
    {
      title: 'Content Credentials — situs resmi proyek',
      url: 'https://contentcredentials.org/',
      accessedAt: '2026-10-04T11:00:00+07:00',
    },
    {
      title: 'C2PA — koalisi penyedia standar provenansi konten',
      url: 'https://c2pa.org/',
      accessedAt: '2026-10-04T11:15:00+07:00',
    },
  ],
  assets: [
    {
      id: 'asset-sl-viral-002',
      type: 'image',
      title: 'Content Credentials logo',
      license: 'Public domain (PD)',
      credit: 'Coalition for Content Provenance and Authenticity (C2PA)',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Content_credentials_logo.png',
    },
  ],
  keyPoints: [
    'Content Credentials adalah sebutan teknis untuk C2PA Manifest yang ditandatangani kriptografis.',
    'Isinya meliputi asal pembuatan, riwayat penyuntingan, dan penggunaan AI pada sebuah aset.',
    'Standar ini menjamin catatan tidak dirusak, bukan menilai kebenaran klaim di dalamnya.',
    'Dirilis dengan lisensi bebas royalti agar bisa diadopsi penerbit, kreator, dan produsen perangkat.',
  ],
  faq: [
    {
      question: 'Apakah ada Content Credentials berarti kontennya benar?',
      answer:
        'Tidak. Spesifikasi C2PA menyatakan standar ini hanya memastikan catatan provenansi rapi dan bebas pemalsuan, bukan menilai kebenaran isi konten.',
    },
    {
      question: 'Apakah standar ini wajib untuk semua foto dan video?',
      answer:
        'Tidak bersifat paksaan. Adopsinya bersifat sukarela dan dirancang agar interoperabel, termasuk untuk implementasi terbuka maupun tertutup.',
    },
    {
      question: 'Apa yang terjadi bila seseorang memotong atau menyunting ulang gambar?',
      answer:
        'Catatan manifest tidak lagi cocok dengan aset hasil suntingan, sehingga perubahan itu terdeteksi saat verifikasi dilakukan.',
    },
  ],
};
