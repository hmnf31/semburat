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
    displayName: '[NAMA PENGELOLA / REDAKSI]',
    legalName: '[NAMA/BADAN]',
    role: '[PERAN]',
    address: '[ALAMAT/EMAIL]',
  },
  emails: {
    editorial: '[EMAIL REDAKSI]',
    correction: '[EMAIL KOREKSI]',
    copyright: '[EMAIL HAK CIPTA]',
    partnership: '[EMAIL KERJASAMA]',
    privacy: '[EMAIL PRIVASI]',
  },
  responseBusinessDays: 3,
  policyLastUpdated: '[TANGGAL]',
  jurisdiction: 'Republik Indonesia',
  minimumAge: 13,
  analyticsProvider: '[NAMA ALAT ANALITIK]',
  newsletterProvider: '[LAYANAN NEWSLETTER]',
  serviceProviders: '[DAFTAR PENYEDIA]',
  cookieNote:
    '[Jelaskan cookie yang dipakai. Jika memakai jaringan iklan (mis. AdSense) atau afiliasi, jelaskan bahwa pihak ketiga dapat memasang cookie dan sebutkan cara menolak/mengelola.]',
  dataRetentionNote: '[Jelaskan berapa lama data disimpan dan langkah keamanan dasar.]',
  reviewMethodologyNote:
    '[Jelaskan bagaimana Anda menguji/mengumpulkan data ulasan. Jangan mengklaim pengujian langsung bila tidak dilakukan.]',
  sponsorLabel: 'Konten Bersponsor',
};

export function emailHtml(address: string): string {
  if (address.startsWith('[')) return address;
  const escaped = address.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<a href="mailto:${escaped}" class="text-sb-primary hover:text-sb-primary-surface hover:underline">${escaped}</a>`;
}
