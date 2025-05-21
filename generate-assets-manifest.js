import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetDir = path.join(__dirname, 'public/assets');

const manifest = {};

fs.readdirSync(assetDir).forEach((folder) => {
  const folderPath = path.join(assetDir, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    manifest[folder] = fs
      .readdirSync(folderPath)
      .filter((f) => /\.(jpg|jpeg|png|gif|svg)$/.test(f));
  }
});

fs.writeFileSync(
  path.join(__dirname, 'public/assets-manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('✅ assets-manifest.json generated!');
