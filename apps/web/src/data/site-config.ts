export interface SiteOperator {
  displayName: string;
  legalName: string;
  role: string;
  address: string;
}

export interface SiteEmails {
  editorial: string;
  correction: string;
  copyright: string;
  partnership: string;
  privacy: string;
}

export interface SiteConfig {
  operator: SiteOperator;
  emails: SiteEmails;
  responseBusinessDays: number;
  policyLastUpdated: string;
  jurisdiction: string;
  minimumAge: number;
  analyticsProvider: string;
  newsletterProvider: string;
  serviceProviders: string;
  cookieNote: string;
  dataRetentionNote: string;
  reviewMethodologyNote: string;
  sponsorLabel: string;
}

export const siteConfig: SiteConfig = {
  operator: {
    displayName: 'Huda Muhamad Nur Fauzi',
    legalName: 'Sawadina.Co',
    role: 'Owner',
    address: 'hudamuhamadnf31@gmail.com',
  },
  emails: {
    editorial: 'semburatproject@gmail.com',
    correction: 'semburatproject@gmail.com',
    copyright: 'semburatproject@gmail.com',
    partnership: 'semburatproject@gmail.com',
    privacy: 'semburatproject@gmail.com',
  },
  responseBusinessDays: 3,
  policyLastUpdated: '8 Oktober 2026',
  jurisdiction: 'Republik Indonesia',
  minimumAge: 13,
  analyticsProvider:
    'log bawaan Cloudflare Pages sebagai data agregat tanpa cookie pelacakan pihak ketiga',
  newsletterProvider: 'layanan email redaksi (belum ada penyedia newsletter pihak ketiga)',
  serviceProviders:
    'Cloudflare (hosting Pages/Workers/D1 dan keamanan jaringan), GitHub (penyimpanan kode), serta penyedia email yang dipakai redaksi',
  cookieNote:
    'Situs ini tidak memakai cookie analitik atau iklan. Cookie hanya dapat dipakai bila fitur yang membutuhkannya ditambahkan (misalnya pendaftaran newsletter atau preferensi), dan Anda dapat menghapus atau memblokir cookie kapan saja lewat pengaturan browser. Bila kelak situs memakai jaringan iklan atau tautan afiliasi, pihak ketiga dapat memasang cookie dan bagian ini akan kami perbarui sekaligus ditandai di halaman terkait.',
  dataRetentionNote:
    'Data yang Anda kirim lewat kontak hanya disimpan selama diperlukan untuk menanggapi laporan atau pertanyaan, lalu dihapus bila tidak lagi diperlukan. Catatan teknis seperti log ditangani penyedia hosting sesuai kebijakannya. Anda dapat meminta akses, koreksi, atau penghapusan data melalui email privasi sewaktu-waktu.',
  reviewMethodologyNote:
    'Ulasan dan artikel produk disusun dari sumber resmi (spesifikasi, rilis, dokumen publik), catatan redaksi, dan konfirmasi langsung bila tersedia. Kami tidak mengklaim pengujian atau pengalaman langsung yang tidak kami lakukan. Metode pengumpulan, tanggal akses, dan sumbernya dicantumkan pada artikel terkait.',
  sponsorLabel: 'Konten Bersponsor',
};

export function emailHtml(address: string): string {
  if (address.startsWith('[')) return address;
  const escaped = address.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<a href="mailto:${escaped}" class="text-sb-primary hover:text-sb-primary-surface hover:underline">${escaped}</a>`;
}
