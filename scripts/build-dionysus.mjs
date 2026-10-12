// Asset pipeline for the Dionysus bust.
//
// Source is a local 42 MB export (assets/dionysus-bust-source.glb) carrying four
// 4K PNG maps. This produces textured GLBs small enough to ship: the maps are
// downsized and re-encoded to WebP, and the one map nothing samples is dropped.
//
// Two variants are emitted. Phones pay ~130 KB less for maps they cannot resolve
// anyway — the bust is a third the size there, and the renderer caps its pixel
// ratio lower. gate.ts picks between them at the layout breakpoint.
//
// Run with: npm run build:dionysus
import { mkdir, stat } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, quantize, textureCompress, weld } from '@gltf-transform/functions';
import sharp from 'sharp';

// fileURLToPath, not URL.pathname: the latter keeps percent-encoding (a path
// with a space becomes %20) and produces a leading-slash path on Windows.
const SRC = fileURLToPath(new URL('../assets/dionysus-bust-source.glb', import.meta.url));
const out = (name) => fileURLToPath(new URL(`../public/models/${name}`, import.meta.url));

/**
 * 4K is far past what this asset can show: the bust never renders larger than
 * ~550 CSS px on desktop, so even 1K is roughly two texels per pixel. Keep these
 * in step with MODELS in src/components/Sculpture/sculpture.ts.
 */
const VARIANTS = [
  { file: 'dionysus-bust.glb', size: 1024 },
  { file: 'dionysus-bust-mobile.glb', size: 512 },
];

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

async function build({ file, size }) {
  // Re-read per variant: transform() mutates the document in place, so the two
  // resolutions cannot share one parse without the second resampling the first.
  const doc = await io.read(SRC);
  const root = doc.getRoot();

  // KHR_materials_specular carries a 9.7 MB specular map in its own texture slot,
  // where the standard material setters cannot reach it and prune() cannot
  // collect it. three's MeshStandardMaterial ignores the extension anyway, so the
  // whole thing goes — that alone is 9.7 MB of the 42.
  for (const extension of root.listExtensionsUsed()) extension.dispose();

  // Deliberately NOT weld({tolerance}) + simplify() here. A non-zero weld
  // tolerance merges vertices across UV seams, which silently tears the texture
  // mapping; simplify() then bakes the damage in. Textured, the images dominate
  // the payload anyway, so the mesh stays full density and welds losslessly.
  await doc.transform(
    dedup(),
    prune(),
    weld(),

    // Colour maps carry the albedo and tolerate lossy WebP well.
    textureCompress({
      encoder: sharp,
      targetFormat: 'webp',
      resize: [size, size],
      quality: 82,
      slots: /baseColorTexture|metallicRoughnessTexture/,
    }),

    // Normals encode direction per channel, so lossy blocking shows up as
    // visible shading noise across flat areas. Near-lossless keeps it clean.
    textureCompress({
      encoder: sharp,
      targetFormat: 'webp',
      resize: [size, size],
      quality: 95,
      effort: 6,
      slots: /normalTexture/,
    }),

    quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }),
  );

  const path = out(file);
  await mkdir(dirname(path), { recursive: true });
  await io.write(path, doc);

  let triangles = 0;
  for (const mesh of root.listMeshes())
    for (const prim of mesh.listPrimitives()) {
      const indices = prim.getIndices();
      triangles += (indices ? indices.getCount() : prim.getAttribute('POSITION').getCount()) / 3;
    }

  const bytes = (await stat(path)).size;
  console.log(
    `\n${file} — ${(bytes / 1024).toFixed(1)} KiB, ${Math.round(triangles)} triangles, ${size}px maps`,
  );
  for (const texture of root.listTextures())
    console.log(
      `  ${texture.getName().padEnd(26)}`,
      texture.getMimeType(),
      `${(texture.getImage().byteLength / 1024).toFixed(1).padStart(7)} KiB`,
    );
}

console.log('reading', SRC);
for (const variant of VARIANTS) await build(variant);
