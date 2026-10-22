import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH is set by the GitHub Pages workflow (the site lives under /<repo>/).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Questions and lessons change less often than the app; a separate chunk caches independently.
        manualChunks: id => (id.includes('/src/content/') ? 'content' : id.includes('node_modules') ? 'vendor' : undefined),
      },
    },
  },
});
