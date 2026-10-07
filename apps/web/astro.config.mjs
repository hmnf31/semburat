import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  adapter: undefined, // Cloudflare Pages uses static output
  integrations: [react()],
  vite: {
    plugins: [tailwind()],
    resolve: {
      alias: {
        '@semburat/web': '/src',
      },
    },
  },
});
