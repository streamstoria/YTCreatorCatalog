import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
      PROD: true,
      DEV: false
    },
    global: 'window'
  },
  build: {
    outDir: 'dist-firefox/src/content',
    lib: {
      entry: resolve(__dirname, 'src/content/index.js'),
      name: 'content',
      fileName: () => 'content.js',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        extend: true,
        inlineDynamicImports: true,
        intro: 'const process = { env: { NODE_ENV: "production" } };',
        assetFileNames: 'content.[ext]' // Keep CSS file name simple
      }
    },
    cssCodeSplit: false // Bundle all CSS into one file
  },
  plugins: [vue()]
});