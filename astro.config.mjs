import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';

const site = process.env.ASTRO_SITE ?? 'http://localhost:4321';
const base = process.env.ASTRO_BASE ?? '/';

export default defineConfig({
  site,
  base,
  integrations: [vue(), tailwind()],
  vite: {
    resolve: {
      alias: { '@': new URL('./src', import.meta.url).pathname }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vue')) return 'vendor-vue';
              if (id.includes('html2canvas')) return 'vendor-html2canvas';
              if (id.includes('jspdf')) return 'vendor-jspdf';
            }
          }
        }
      },
      chunkSizeWarningLimit: 1024
    }, resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
    // 如需按需调试，可在这里加 alias 或 define
  }
});
