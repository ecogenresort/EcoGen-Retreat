import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'public', 'assets', 'images');
const MANIFEST_PATH = path.join(ROOT, 'assets', 'manifest.json');

const SOURCE_GLOBS = ['pages', 'components', 'constants.ts', 'index.html'];
const IMAGE_URL_PATTERN =
  /https?:\/\/[^\s"'<>]+?\.(?:jpg|jpeg|png|gif|webp|svg|avif)(?:\?[^\s"'<>]*)?/gi;
const CLOUDINARY_IMAGE_PATTERN =
  /https?:\/\/res\.cloudinary\.com\/[^\s"'<>]+?\/image\/upload\/[^\s"'<>]+/gi;

function collectSourceFiles() {
  const files = [];

  for (const entry of SOURCE_GLOBS) {
    const fullPath = path.join(ROOT, entry);
    if (!fs.existsSync(fullPath)) continue;

    if (fs.statSync(fullPath).isDirectory()) {
      for (const name of fs.readdirSync(fullPath)) {
        if (/\.(tsx?|html)$/.test(name)) {
          files.push(path.join(fullPath, name));
        }
      }
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function extractImageUrls(content) {
  const urls = new Set();
  for (const match of content.matchAll(IMAGE_URL_PATTERN)) {
    urls.add(match[0]);
  }
  for (const match of content.matchAll(CLOUDINARY_IMAGE_PATTERN)) {
    urls.add(match[0]);
  }
  return urls;
}

function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').replace(/\s+/g, '-');
}

function filenameFromUrl(url) {
  const parsed = new URL(url);
  const basename = path.basename(parsed.pathname);

  if (basename && basename !== '/' && basename.includes('.')) {
    return sanitizeFilename(decodeURIComponent(basename.split('?')[0]));
  }

  const slug = parsed.pathname.split('/').filter(Boolean).pop() ?? 'image';
  const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 8);
  return sanitizeFilename(`${slug}-${hash}.jpg`);
}

function extensionFromContentType(contentType) {
  const type = contentType?.split(';')[0]?.trim().toLowerCase();
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/avif': '.avif',
  };
  return map[type] ?? '.jpg';
}

async function downloadImage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'EcoGen-Retreat-Asset-Downloader/1.0',
      Accept: 'image/*,*/*;q=0.8',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  let filename = filenameFromUrl(url);
  if (!path.extname(filename)) {
    filename += extensionFromContentType(response.headers.get('content-type'));
  }

  const outputPath = path.join(ASSETS_DIR, filename);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);

  return {
    url,
    localPath: path.join('assets', 'images', filename).replace(/\\/g, '/'),
    filename,
    bytes: buffer.length,
  };
}

async function main() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  const files = collectSourceFiles();
  const urls = new Set();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    for (const url of extractImageUrls(content)) {
      urls.add(url);
    }
  }

  console.log(`Found ${urls.size} unique image URLs in source files.`);

  const manifest = {
    generatedAt: new Date().toISOString(),
    assets: [],
    failed: [],
  };

  for (const url of urls) {
    try {
      const result = await downloadImage(url);
      manifest.assets.push(result);
      console.log(`✓ ${result.filename} (${result.bytes} bytes)`);
    } catch (error) {
      manifest.failed.push({ url, error: error.message });
      console.error(`✗ ${url}\n  ${error.message}`);
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`\nDownloaded ${manifest.assets.length}/${urls.size} images to ${ASSETS_DIR}`);
  if (manifest.failed.length) {
    console.log(`Failed: ${manifest.failed.length} (see assets/manifest.json)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
