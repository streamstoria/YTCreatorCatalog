// scripts/package.js
import { zip } from 'zip-lib';
import fs from 'fs';
import path from 'path';

async function packageExtension() {
  const version = JSON.parse(fs.readFileSync('./package.json')).version;
  const browsers = ['chrome', 'firefox', 'edge'];

  for (const browser of browsers) {
    const distDir = `dist-${browser}`;
    const zipName = `yt-creator-catalog-${browser}-v${version}.zip`;

    if (!fs.existsSync(distDir)) {
      console.error(`${distDir} does not exist. Run build:${browser} first.`);
      continue;
    }

    try {
      await zip(distDir, zipName);
      console.log(`Created ${zipName}`);
    } catch (error) {
      console.error(`Error creating ${zipName}:`, error);
    }
  }
}

packageExtension().catch(console.error);