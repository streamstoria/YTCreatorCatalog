import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { build } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function copyDir(src, dest, excludePaths = []) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    // Skip excluded paths
    if (excludePaths.some(exclude => srcPath.includes(exclude))) {
      continue;
    }

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, excludePaths);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function buildFirefox() {
  const srcDir = path.join(projectRoot, 'dist-chrome');
  const destDir = path.join(projectRoot, 'dist-firefox');

  // Ensure the destination directory exists
  await fs.promises.mkdir(destDir, { recursive: true });

  // Copy all files from Chrome build except content and background scripts
  await copyDir(srcDir, destDir, ['src/content', 'src/background']);

  console.log('Building Firefox content script...');
  // Build content script separately with the Firefox config
  await build({
    configFile: path.join(projectRoot, 'vite.firefox-content.config.js'),
    mode: 'production'
  });

  console.log('Building Firefox background script...');
  // Build background script separately
  await build({
    configFile: path.join(projectRoot, 'vite.firefox-background.config.js'),
    mode: 'production'
  });

  // Copy the Firefox manifest
  const firefoxManifestPath = path.join(projectRoot, 'manifest.firefox.json');
  await fs.promises.copyFile(
    firefoxManifestPath,
    path.join(destDir, 'manifest.json')
  );

  console.log('Firefox build completed successfully!');
}

buildFirefox().catch(console.error);