// Renders the 1200x630 social card to public/og.png from src/data/site.ts, so
// the card a link preview shows always matches the site's name and role.
// Run with `bun run build:og` (Bun reads the TypeScript data file directly)
// after changing the copy, the palette below, or the bust poster.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { site } from '../src/data/site.ts';

const OUT = fileURLToPath(new URL('../public/og.png', import.meta.url));
const POSTER = fileURLToPath(new URL('../public/images/bust-poster.webp', import.meta.url));

const BG = '#0F1115';
const BORDER = '#262B35';
const TEXT = '#F4F7FB';
const TEXT_2 = '#A3ACBA';
const MUTED = '#7A8391';
const ANNOTATE = '#E5B25D';

const escapeXml = (value) =>
  String(value).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
  );

// The role is set in two lines like the home page headline: solid, then outlined.
const [roleLead, ...roleRest] = site.role.toUpperCase().split(' ');
const roleTrail = roleRest.join(' ');

// Bust on the right, 600px tall, its top-left at (BUST_X, BUST_Y).
const BUST_H = 600;
const BUST_W = Math.round((BUST_H * 1094) / 1188);
const BUST_X = 1200 - BUST_W - 20;
const BUST_Y = 40;

// Text is drawn with the generic sans/mono families rather than the site
// webfonts: rendering happens in librsvg, which does not see @font-face.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <text x="80" y="96" fill="${MUTED}" font-family="monospace" font-size="19" letter-spacing="3.5">${escapeXml(site.handle.toUpperCase())} / WORKSPACE</text>

  <text x="80" y="268" fill="${TEXT}" font-family="sans-serif" font-size="104" font-weight="700" letter-spacing="-3">${escapeXml(roleLead)}</text>
  <text x="80" y="370" fill="none" stroke="${TEXT_2}" stroke-width="1.5" font-family="sans-serif" font-size="104" font-weight="700" letter-spacing="-3">${escapeXml(roleTrail)}</text>

  <text x="80" y="438" fill="${TEXT}" font-family="sans-serif" font-size="30" font-weight="600">${escapeXml(site.name)}</text>
  <text x="80" y="480" fill="${TEXT_2}" font-family="sans-serif" font-size="25">I design the thinking before the build.</text>

  <line x1="80" y1="546" x2="620" y2="546" stroke="${BORDER}"/>
  <text x="80" y="584" fill="${MUTED}" font-family="monospace" font-size="17" letter-spacing="3">${escapeXml(site.locationShort)}</text>
  <text x="620" y="584" text-anchor="end" fill="${MUTED}" font-family="monospace" font-size="17" letter-spacing="3">DITYATH.DEV</text>
</svg>`;

// Amber frame brackets around the head, drawn over the bust like the
// home page's first chapter.
const bx = (f) => Math.round(BUST_X + f * BUST_W);
const by = (f) => Math.round(BUST_Y + f * BUST_H);
const [l, r, t, b] = [bx(0.24), bx(0.8), by(0.005), by(0.645)];
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <g fill="none" stroke="${ANNOTATE}" stroke-width="1.5">
    <path d="M${l} ${t + 28}V${t}H${l + 28}M${r - 28} ${t}H${r}V${t + 28}M${r} ${b - 28}V${b}H${r - 28}M${l + 28} ${b}H${l}V${b - 28}"/>
  </g>
  <rect x="${l}" y="${t}" width="${r - l}" height="${b - t}" fill="none" stroke="${ANNOTATE}" stroke-width="1" stroke-dasharray="5 6" opacity="0.6"/>
</svg>`;

const bust = await sharp(POSTER).resize({ height: BUST_H }).png().toBuffer();

await mkdir(dirname(OUT), { recursive: true });
await writeFile(
  OUT,
  await sharp(Buffer.from(svg))
    .composite([
      { input: bust, left: BUST_X, top: BUST_Y },
      { input: Buffer.from(overlay), left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer(),
);
console.log('wrote', OUT);
