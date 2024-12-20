import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import fs from 'fs';

const BUILD_TARGETS = {
  CHROME: 'chrome',
  FIREFOX: 'firefox',
  EDGE: 'edge'
};

// Helper to load the manifest
function getManifest(target) {
  if (target === BUILD_TARGETS.FIREFOX) {
    return JSON.parse(fs.readFileSync('./manifest.firefox.json', 'utf-8'));
  }
  return JSON.parse(fs.readFileSync('./src/manifest.json', 'utf-8'));
}

export default defineConfig(({ mode }) => {
  const target = process.env.BUILD_TARGET || BUILD_TARGETS.CHROME;
  const manifest = getManifest(target);
  const isFirefox = target === BUILD_TARGETS.FIREFOX;

  const config = {
    build: {
      outDir: `dist-${target}`,
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'src/popup/index.html'),
          manage: resolve(__dirname, 'src/manage/index.html'),
          background: resolve(__dirname, 'src/background/index.js'),
          content: resolve(__dirname, 'src/content/index.js')
        },
        output: {
          format: isFirefox ? 'iife' : 'es',
          entryFileNames: (chunkInfo) => {
            // Use specific names for content and background scripts in Firefox
            if (isFirefox) {
              if (chunkInfo.name === 'content') {
                return 'src/content/content.js';
              }
              if (chunkInfo.name === 'background') {
                return 'src/background/background.js';
              }
            }
            return 'src/[name]/[name].js';
          },
          chunkFileNames: 'src/[name]/[name].js',
          assetFileNames: 'src/[name]/[name].[ext]'
        }
      },
      sourcemap: true
    },
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    }
  };

  // Only use crx plugin for Chrome and Edge
  if (!isFirefox) {
    config.plugins.push(crx({ manifest }));
  }

  return config;
});