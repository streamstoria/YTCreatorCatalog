import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

const BUILD_TARGETS = {
  CHROME: 'chrome',
  FIREFOX: 'firefox',
  EDGE: 'edge'
};

// Helper to load the manifest
function getManifest(target) {
  const manifest = JSON.parse(fs.readFileSync('./src/manifest.json', 'utf-8'));
  return manifest;
}

// Build configuration factory
function createBuildConfig(target) {
  const manifest = getManifest(target);
  const isFirefox = target === BUILD_TARGETS.FIREFOX;
  
  const config = {
    build: {
      outDir: `dist-${target}`,
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
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    optimizeDeps: {
      include: ['vue']
    }
  };

  // Only use crx plugin for Chrome and Edge
  if (!isFirefox) {
    config.plugins.push(crx({ manifest }));
  }

  return config;
}

// Post-build hook for Firefox
async function firefoxPostBuild() {
  const manifest = JSON.parse(fs.readFileSync('./src/manifest.json', 'utf-8'));
  const firefoxManifest = {
    ...manifest,
    manifest_version: 2,
    browser_specific_settings: {
      gecko: {
        id: "ytcreatorcatalog@yourdomain.com",
        strict_min_version: "57.0"
      }
    },
    browser_action: manifest.action,
    background: {
      scripts: ["src/background/index.js"],
      type: "module"
    }
  };
  delete firefoxManifest.action;

  // Write Firefox manifest to dist directory
  const targetDir = 'dist-firefox';
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(targetDir, 'manifest.json'),
    JSON.stringify(firefoxManifest, null, 2)
  );
}

// Export configurations for each target
export default defineConfig(({ mode }) => {
  const target = process.env.BUILD_TARGET || BUILD_TARGETS.CHROME;
  const config = createBuildConfig(target);

  if (target === BUILD_TARGETS.FIREFOX) {
    config.build.rollupOptions.output.manualChunks = undefined;
    config.build.write = true;
    config.build.emptyOutDir = true;
    config.build.copyPublicDir = true;
    config.plugins.push({
      name: 'firefox-post-build',
      closeBundle: async () => {
        await firefoxPostBuild();
      }
    });
  }

  return config;
});