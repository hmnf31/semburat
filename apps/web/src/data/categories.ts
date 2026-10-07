export interface CategoryData {
  name: string;
  description: string;
}

export const categories: Record<string, CategoryData> = {
  berita: {
    name: 'Berita',
    description: 'Kategori placeholder untuk berita terkini.',
  },
  teknologi: {
    name: 'Teknologi',
    description: 'Kategori placeholder untuk liputan teknologi.',
  },
};
