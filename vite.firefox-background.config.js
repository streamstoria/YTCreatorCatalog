import { defineConfig } from 'vite';
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
    outDir: 'dist-firefox/src/background',
    lib: {
      entry: resolve(__dirname, 'src/background/index.js'),
      name: 'background',
      fileName: () => 'background.js',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        extend: true,
        inlineDynamicImports: true,
        intro: 'const process = { env: { NODE_ENV: "production" } };'
      }
    }
  }
});