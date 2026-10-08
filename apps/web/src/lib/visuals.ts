import artExplainer from '../assets/categories/explainer.svg';
import artGaming from '../assets/categories/gaming.svg';
import artTeknologi from '../assets/categories/teknologi.svg';
import artViral from '../assets/categories/viral.svg';
import heroImage from '../assets/hero-placeholder.svg';
import imageC2pa from '../assets/articles/content-credentials-lacak-asal-usul-foto.png';
import imageMisinformation from '../assets/articles/mengapa-konten-keliru-menyebar-lebih-cepat.jpg';
import imagePdp from '../assets/articles/uu-pdp-hak-pengguna-atas-data-pribadi.png';
import imagePhishing from '../assets/articles/kenali-phishing-sebelum-kena.png';
import imageTwofactor from '../assets/articles/amankan-akun-game-dengan-verifikasi-dua-langkah.jpg';
import imageKidsGaming from '../assets/articles/kontrol-pembelian-dalam-gim-untuk-anak.jpg';
import imageLootbox from '../assets/articles/peluang-item-berbayar-harus-diumumkan.png';
import imageQris from '../assets/articles/apa-itu-qris.jpg';
import imageSolar from '../assets/articles/apa-itu-plts-atap.jpg';

interface VisualAsset {
  src: string;
  width: number;
  height: number;
}

export interface ResolvedVisual {
  src: string;
  width: number;
  height: number;
  kind: 'source' | 'illustration';
}

const sourceImages: Record<string, VisualAsset> = {
  'mengapa-konten-keliru-menyebar-lebih-cepat': imageMisinformation,
  'content-credentials-lacak-asal-usul-foto': imageC2pa,
  'uu-pdp-hak-pengguna-atas-data-pribadi': imagePdp,
  'kenali-phishing-sebelum-kena': imagePhishing,
  'amankan-akun-game-dengan-verifikasi-dua-langkah': imageTwofactor,
  'kontrol-pembelian-dalam-gim-untuk-anak': imageKidsGaming,
  'peluang-item-berbayar-harus-diumumkan': imageLootbox,
  'apa-itu-qris': imageQris,
  'apa-itu-plts-atap': imageSolar,
};

const categoryIllustrations: Record<string, VisualAsset> = {
  Viral: artViral,
  Teknologi: artTeknologi,
  Gaming: artGaming,
  Explainer: artExplainer,
};

export function resolveVisual(slug: string, category: string): ResolvedVisual {
  const source = sourceImages[slug];
  if (source) {
    return { src: source.src, width: source.width, height: source.height, kind: 'source' };
  }
  const illustration = categoryIllustrations[category] ?? heroImage;
  return {
    src: illustration.src,
    width: illustration.width,
    height: illustration.height,
    kind: 'illustration',
  };
}
