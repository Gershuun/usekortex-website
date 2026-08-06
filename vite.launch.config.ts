import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const description = 'Explore the Kortex app universe and launch nine private, installable web tools for evidence, safety, focus, and everyday life.';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'kortex-launch-index',
      transformIndexHtml(html) {
        return html
          .replace('Explore Kortex Contacts, Captions, Filters, Trails, and a growing family of playful mobile apps for iOS and Android.', description)
          .replace('"numberOfItems": 4', '"numberOfItems": 19');
      },
    },
  ],
  resolve: {
    alias: [{
      find: '/src/main.tsx',
      replacement: fileURLToPath(new URL('./src/main.launch.tsx', import.meta.url)),
    }],
  },
});
