#!/usr/bin/env node

/**
 * generate-favicons.mjs
 *
 * Builds the three-tier "dp_" mono cursor mark and generates a complete
 * favicon set for both reader/ and cms/.
 *
 * Tier 1 — Primary  (512px) : full "dp" + cursor bar
 * Tier 2 — Mid      (32px)  : "d" + cursor bar
 * Tier 3 — Favicon  (16px)  : cyan dot on dark badge
 *
 * Usage: node generate-favicons.mjs
 */

import {
  readFileSync, writeFileSync, mkdirSync,
  copyFileSync, existsSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Theme tokens (from reader/src/index.css & cms/src/index.css) ────────────
const AMBER = '#F2B84B';   // --accent         → "d"
const CYAN  = '#7DD3FC';   // --accent-secondary → "p" + cursor bar
const BG    = '#12161F';   // --surface         → badge background

// ─── Font ────────────────────────────────────────────────────────────────────
const FONT_PATH = join(__dirname, 'JetBrainsMono-Bold.ttf');
if (!existsSync(FONT_PATH)) {
  console.error('✗ Missing font: JetBrainsMono-Bold.ttf');
  console.error('  Download from https://github.com/JetBrains/JetBrainsMono');
  process.exit(1);
}
const font = opentype.loadSync(FONT_PATH);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const r = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

/**
 * Build an ICO file from PNG buffers.
 * Uses PNG payloads inside the ICO container (supported everywhere).
 */
function createIco(images) {
  const count = images.length;
  const HEAD = 6;
  const ENTRY = 16;
  let offset = HEAD + ENTRY * count;

  const header = Buffer.alloc(HEAD + ENTRY * count);
  header.writeUInt16LE(0, 0);       // reserved
  header.writeUInt16LE(1, 2);       // type = ICO
  header.writeUInt16LE(count, 4);   // image count

  const chunks = [header];
  for (let i = 0; i < count; i++) {
    const { width, data } = images[i];
    const off = HEAD + ENTRY * i;
    header.writeUInt8(width < 256 ? width : 0, off);
    header.writeUInt8(width < 256 ? width : 0, off + 1);
    header.writeUInt8(0, off + 2);    // palette
    header.writeUInt8(0, off + 3);    // reserved
    header.writeUInt16LE(1, off + 4); // planes
    header.writeUInt16LE(32, off + 6); // bpp
    header.writeUInt32LE(data.length, off + 8);
    header.writeUInt32LE(offset, off + 12);
    offset += data.length;
    chunks.push(data);
  }
  return Buffer.concat(chunks);
}

// ─── Tier 1: Primary mark ────────────────────────────────────────────────────
function buildPrimarySvg(size) {
  const fontSize = size * 0.44;
  const scale    = fontSize / font.unitsPerEm;
  const rx       = r(size * 28 / 200);

  // Glyph metrics
  const dAdv = font.charToGlyph('d').advanceWidth * scale;

  // Cap-height for cursor bar
  const capH = (font.tables.os2?.sCapHeight ?? font.ascender * 0.72) * scale;

  // Cursor bar dimensions
  const curW   = r(fontSize * 0.095);
  const curGap = r(fontSize * 0.05);

  // Horizontal centering
  const contentW = dAdv * 2 + curGap + curW;
  const x0 = (size - contentW) / 2;

  // Vertical centering — use the actual bounding box of "dp"
  const probe   = font.getPath('dp', 0, 0, fontSize);
  const bb      = probe.getBoundingBox();
  const textH   = bb.y2 - bb.y1;
  const baseline = (size - textH) / 2 - bb.y1;

  // Individual glyph paths
  const dPath = font.getPath('d', x0, baseline, fontSize).toPathData(2);
  const pPath = font.getPath('p', x0 + dAdv, baseline, fontSize).toPathData(2);

  // Cursor bar
  const curX = r(x0 + dAdv * 2 + curGap);
  const curY = r(baseline - capH);
  const curRx = Math.max(1, r(curW * 0.12));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rx}" fill="${BG}"/>
  <path d="${dPath}" fill="${AMBER}"/>
  <path d="${pPath}" fill="${CYAN}"/>
  <rect x="${curX}" y="${curY}" width="${curW}" height="${r(capH)}" rx="${curRx}" fill="${CYAN}"/>
</svg>`;
}

// ─── Tier 2: Mid mark ("d" + cursor bar) ─────────────────────────────────────
function buildMidSvg(size) {
  const fontSize = size * 0.55;
  const scale    = fontSize / font.unitsPerEm;
  const rx       = Math.max(2, r(size * 4 / 32));

  const dAdv = font.charToGlyph('d').advanceWidth * scale;

  const capH   = (font.tables.os2?.sCapHeight ?? font.ascender * 0.72) * scale;
  const curW   = Math.max(2, r(fontSize * 0.11));
  const curGap = Math.max(1, r(fontSize * 0.06));

  const contentW = dAdv + curGap + curW;
  const x0 = (size - contentW) / 2;

  const probe    = font.getPath('d', 0, 0, fontSize);
  const bb       = probe.getBoundingBox();
  const textH    = bb.y2 - bb.y1;
  const baseline = (size - textH) / 2 - bb.y1;

  const dPath = font.getPath('d', x0, baseline, fontSize).toPathData(2);

  const curX  = r(x0 + dAdv + curGap);
  const curY  = r(baseline - capH);
  const curRx = Math.max(1, r(curW * 0.15));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rx}" fill="${BG}"/>
  <path d="${dPath}" fill="${AMBER}"/>
  <rect x="${curX}" y="${curY}" width="${curW}" height="${r(capH)}" rx="${curRx}" fill="${CYAN}"/>
</svg>`;
}

// ─── Tier 3: Favicon (cyan dot on dark badge) ───────────────────────────────
function buildFaviconSvg(size) {
  const rx      = r(size * 3 / 16);
  const dotSize = r(size * 0.375);
  const dotRx   = Math.max(1, r(dotSize * 0.22));
  const dotXY   = r((size - dotSize) / 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rx}" fill="${BG}"/>
  <rect x="${dotXY}" y="${dotXY}" width="${dotSize}" height="${dotSize}" rx="${dotRx}" fill="${CYAN}"/>
</svg>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const outDir = join(__dirname, 'output');
  ensureDir(outDir);

  // 1. Build source SVGs ─────────────────────────────────────────────────────
  console.log('Building source SVGs…');

  const primarySvg  = buildPrimarySvg(512);
  const midSvg      = buildMidSvg(128);     // authored at 128, rendered to 32
  const faviconSvg  = buildFaviconSvg(64);  // authored at 64, rendered to 16

  writeFileSync(join(__dirname, 'logo-source.svg'), primarySvg);
  writeFileSync(join(__dirname, 'logo-32.svg'),     midSvg);
  writeFileSync(join(__dirname, 'logo-16.svg'),     faviconSvg);
  console.log('  ✓ logo-source.svg  (512×512 primary)');
  console.log('  ✓ logo-32.svg      (128×128 mid-tier source)');
  console.log('  ✓ logo-16.svg      (64×64 favicon-tier source)');

  // 2. Render PNGs ───────────────────────────────────────────────────────────
  console.log('\nRendering PNGs…');

  const toBuffer = (svg, size) =>
    sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

  const [apple, a192, a512, png32, png16, png48] = await Promise.all([
    toBuffer(primarySvg, 180),    // apple-touch-icon
    toBuffer(primarySvg, 192),    // android-chrome
    toBuffer(primarySvg, 512),    // android-chrome
    toBuffer(faviconSvg,  32),    // favicon 32×32 — dot, not mid-tier
    toBuffer(faviconSvg,  16),    // favicon 16×16
    toBuffer(faviconSvg, 48), // 48×48 for ICO — dot, not mid-tier
  ]);

  const pngFiles = {
    'apple-touch-icon.png':        apple,
    'android-chrome-192x192.png':  a192,
    'android-chrome-512x512.png':  a512,
    'favicon-32x32.png':           png32,
    'favicon-16x16.png':           png16,
  };

  for (const [name, buf] of Object.entries(pngFiles)) {
    writeFileSync(join(outDir, name), buf);
    console.log(`  ✓ ${name}`);
  }

  // 3. Create ICO ────────────────────────────────────────────────────────────
  console.log('\nCreating favicon.ico…');
  const ico = createIco([
    { width: 16, data: png16 },
    { width: 32, data: png32 },
    { width: 48, data: png48 },
  ]);
  writeFileSync(join(outDir, 'favicon.ico'), ico);
  console.log('  ✓ favicon.ico (16 + 32 + 48)');

  // 4. Copy primary SVG as favicon.svg ───────────────────────────────────────
  writeFileSync(join(outDir, 'favicon.svg'), primarySvg);
  console.log('  ✓ favicon.svg (primary mark)');

  // 5. Create site.webmanifest ───────────────────────────────────────────────
  const manifest = {
    name: 'Blog — Dharmil',
    short_name: 'dp_',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: '#0B0E14',
    background_color: '#0B0E14',
    display: 'standalone',
  };
  writeFileSync(join(outDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');
  console.log('  ✓ site.webmanifest');

  // 6. Copy to both apps ────────────────────────────────────────────────────
  const targets = [
    join(__dirname, '..', '..', 'reader', 'public'),
    join(__dirname, '..', '..', 'cms',    'public'),
  ];

  const filesToCopy = [
    'favicon.ico', 'favicon.svg',
    'favicon-16x16.png', 'favicon-32x32.png',
    'apple-touch-icon.png',
    'android-chrome-192x192.png', 'android-chrome-512x512.png',
    'site.webmanifest',
  ];

  console.log('\nCopying to app public/ directories…');
  for (const dir of targets) {
    ensureDir(dir);
    for (const f of filesToCopy) {
      copyFileSync(join(outDir, f), join(dir, f));
    }
    console.log(`  ✓ ${dir}`);
  }

  console.log('\n✅  All assets generated successfully!');
}

main().catch((err) => {
  console.error('✗ Error:', err);
  process.exit(1);
});
