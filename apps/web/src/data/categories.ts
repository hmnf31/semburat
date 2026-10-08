export interface CategoryData {
  name: string;
  description: string;
}

export const categories: Record<string, CategoryData> = {
  viral: {
    name: 'Viral',
    description: 'Tren yang menyebar cepat di media sosial Indonesia beserta konteksnya.',
  },
  teknologi: {
    name: 'Teknologi',
    description: 'Perkembangan teknologi, kecerdasan buatan, dan dampaknya di Indonesia.',
  },
  gaming: {
    name: 'Gaming',
    description: 'Industri dan komunitas game Indonesia.',
  },
  explainer: {
    name: 'Explainer',
    description: 'Penjelasan latar belakang topik yang sedang ramai dibahas.',
  },
};
