#!/usr/bin/env node
import { readFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function size(p) { try { return (await stat(p)).size; } catch { return 0; } }
async function walk(dir) {
  const out = [];
  let entries; try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else if (e.isFile()) out.push(p);
  }
  return out;
}
const mb = b => (b / (1024 * 1024)).toFixed(2);

const manifest = JSON.parse(await readFile(path.join(ROOT, 'assets.json'), 'utf8'));
const coreJs = await readFile(path.join(ROOT, 'core.js'), 'utf8');

const headerMatches = [...coreJs.matchAll(/headerImage:\s*'([^']+)'/g)].map(m => m[1]);
const projPathMatches = [...coreJs.matchAll(/gallery:\s*\{\s*path:\s*'([^']+)'\s*\}/g)].map(m => m[1]);
const projIds = [...coreJs.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);

const projPathById = {};
projIds.forEach((id, i) => { projPathById[id] = projPathMatches[i]; });
projPathById['personal-art'] = 'assets/personal-art/';

let served = 0;
let parts = {};

const addPart = async (label, files) => {
  let total = 0;
  for (const f of files) total += await size(path.join(ROOT, f));
  parts[label] = total;
  served += total;
};

await addPart('icons', (await walk(path.join(ROOT, 'assets/icons'))).map(p => path.relative(ROOT, p)));
await addPart('cv', ['assets/DenissSalomovsCV.pdf']);
await addPart('headers', headerMatches);

const galleryFull = [];
const galleryThumb = [];
for (const [id, entries] of Object.entries(manifest)) {
  const base = projPathById[id];
  if (!base) { console.error(`unknown project id in manifest: ${id}`); continue; }
  for (const e of entries) {
    if (typeof e === 'string') {
      galleryFull.push(base + e);
      galleryThumb.push(base + e);
    } else {
      galleryFull.push(base + e.full);
      galleryThumb.push(base + e.thumb);
    }
  }
}
await addPart('gallery_full', galleryFull);
await addPart('gallery_thumb', galleryThumb);

// Cold homepage load: only icons + headers + CV (galleries are gated behind clicks).
const coldHomepage = parts.icons + parts.headers + parts.cv;

console.log('Served bytes breakdown');
console.log('  icons         :', mb(parts.icons), 'MB');
console.log('  headers       :', mb(parts.headers), 'MB');
console.log('  CV PDF        :', mb(parts.cv), 'MB');
console.log('  gallery thumbs:', mb(parts.gallery_thumb), 'MB');
console.log('  gallery fulls :', mb(parts.gallery_full), 'MB');
console.log('  ------');
console.log('  TOTAL served  :', mb(served), 'MB  (if every visitor sees every full)');
console.log('  cold homepage :', mb(coldHomepage), 'MB  (no gallery expanded)');
console.log('  worst Art tab :', mb(parts.icons + parts.headers + parts.cv + parts.gallery_thumb), 'MB  (every thumb loaded, no fulls)');

let disk = 0;
for (const p of await walk(path.join(ROOT, 'assets'))) disk += await size(p);
console.log('  disk total    :', mb(disk), 'MB  (originals + optimized siblings + icons + CV)');
