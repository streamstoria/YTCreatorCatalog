import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import manifest from './src/manifest.json';

export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        manage: resolve(__dirname, 'src/manage/index.html'),
        content: resolve(__dirname, 'src/content/index.js'),
        background: resolve(__dirname, 'src/background/index.js')
      },
      output: {
        entryFileNames: `src/[name]/[name].js`,
        chunkFileNames: `src/[name]/[name].js`,
        assetFileNames: `src/[name]/[name].[ext]`
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  }
});