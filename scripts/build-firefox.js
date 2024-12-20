import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
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

  // Copy all files from Chrome build
  await copyDir(srcDir, destDir);

  // Read the original manifest
  const manifestPath = path.join(projectRoot, 'src', 'manifest.json');
  const manifest = JSON.parse(await fs.promises.readFile(manifestPath, 'utf8'));

  // Create Firefox manifest
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

  // Write Firefox manifest
  await fs.promises.writeFile(
    path.join(destDir, 'manifest.json'),
    JSON.stringify(firefoxManifest, null, 2)
  );

  console.log('Firefox build completed successfully!');
}

buildFirefox().catch(console.error);