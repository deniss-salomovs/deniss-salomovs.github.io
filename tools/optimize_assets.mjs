#!/usr/bin/env node
import { readdir, stat, readFile, writeFile, access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), '..');
const ASSETS_JSON = path.join(REPO_ROOT, 'assets.json');
const ASSET_MANAGER_HTML = path.join(REPO_ROOT, 'asset-manager.html');

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg']);
const GIF_EXT = new Set(['.gif']);
const VIDEO_EXT = new Set(['.mp4', '.mov', '.mkv']);

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function readProjectsFromAssetManager() {
  const html = await readFile(ASSET_MANAGER_HTML, 'utf8');
  // Pull the `const projects = [ ... ];` block and parse {id, path} pairs.
  const block = html.match(/const\s+projects\s*=\s*\[([\s\S]*?)\];/);
  if (!block) throw new Error('Could not locate projects array in asset-manager.html');
  const entries = [...block[1].matchAll(/\{\s*id:\s*'([^']+)'\s*,\s*path:\s*'([^']+)'\s*\}/g)];
  if (!entries.length) throw new Error('No project entries parsed from asset-manager.html');
  return entries.map(m => ({ id: m[1], path: m[2].replace(/\/$/, '') }));
}

function isThumb(name) {
  // Matches `<stem>.thumb.<ext>` — our generated thumbnail siblings.
  return /\.thumb\.(webp|webm)$/i.test(name);
}

function isHeader(name) {
  return /^header\./i.test(name);
}

async function walkFiles(dir) {
  const out = [];
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...await walkFiles(full));
    } else if (ent.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function classify(file) {
  const ext = path.extname(file).toLowerCase();
  if (IMAGE_EXT.has(ext)) return { kind: 'image', outExt: '.webp' };
  if (GIF_EXT.has(ext)) return { kind: 'gif', outExt: '.webp' };
  if (VIDEO_EXT.has(ext)) return { kind: 'video', outExt: '.webm' };
  return null;
}

function siblings(file, kind) {
  const dir = path.dirname(file);
  const stem = path.basename(file, path.extname(file));
  const ext = kind === 'video' ? '.webm' : '.webp';
  return {
    full: path.join(dir, `${stem}${ext}`),
    thumb: path.join(dir, `${stem}.thumb${ext}`),
  };
}

function ffmpegArgsFor(kind, src, full, thumb) {
  if (kind === 'image') {
    return [
      ['-y', '-i', src, '-c:v', 'libwebp', '-q:v', '80', '-compression_level', '6', '-an', full],
      ['-y', '-i', src, '-vf', "scale='min(640,iw)':-2", '-c:v', 'libwebp', '-q:v', '60', '-compression_level', '6', '-an', thumb],
    ];
  }
  if (kind === 'gif') {
    return [
      ['-y', '-i', src, '-loop', '0', '-c:v', 'libwebp', '-lossless', '0', '-q:v', '70', '-compression_level', '6', '-loop', '0', '-preset', 'picture', '-an', full],
      ['-y', '-i', src, '-vf', "scale='min(480,iw)':-2,fps=15", '-loop', '0', '-c:v', 'libwebp', '-q:v', '50', '-compression_level', '6', '-loop', '0', '-preset', 'picture', '-an', thumb],
    ];
  }
  // video
  return [
    ['-y', '-i', src, '-c:v', 'libvpx-vp9', '-crf', '32', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-c:a', 'libopus', '-b:a', '96k', full],
    ['-y', '-i', src, '-vf', "scale='min(720,iw)':-2,fps=24", '-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', '-an', thumb],
  ];
}

function runFfmpeg(args) {
  return new Promise((resolve) => {
    const proc = spawn('ffmpeg', args, { windowsHide: true });
    let stderr = '';
    proc.stderr.on('data', d => { stderr += d.toString(); });
    proc.on('error', err => resolve({ code: -1, stderr: err.message }));
    proc.on('close', code => resolve({ code, stderr }));
  });
}

async function mtime(p) {
  try { return (await stat(p)).mtimeMs; } catch { return -1; }
}

async function sizeOf(p) {
  try { return (await stat(p)).size; } catch { return 0; }
}

function mb(bytes) { return (bytes / (1024 * 1024)).toFixed(2); }

async function shouldSkip(src, full, thumb) {
  if (!(await exists(full)) || !(await exists(thumb))) return false;
  const srcM = await mtime(src);
  const fM = await mtime(full);
  const tM = await mtime(thumb);
  return fM >= srcM && tM >= srcM;
}

async function processOne(src, repoRel) {
  const cls = classify(src);
  if (!cls) return null;
  const { full, thumb } = siblings(src, cls.kind);
  const srcSize = await sizeOf(src);
  // Headers render at a single size in the UI — no thumb tier is needed.
  const headerOnly = isHeaderFile(src);

  if (headerOnly) {
    if (await exists(full) && (await mtime(full)) >= (await mtime(src))) {
      const fSize = await sizeOf(full);
      console.log(`[skip] ${repoRel} (${mb(srcSize)}MB -> ${mb(fSize)}MB header)`);
      return { status: 'skip', srcSize, fullSize: fSize, thumbSize: 0 };
    }
    const [argsFull] = ffmpegArgsFor(cls.kind, src, full, thumb);
    const r = await runFfmpeg(argsFull);
    if (r.code !== 0) {
      console.log(`[fail] ${repoRel} (header)`);
      return { status: 'fail', srcSize, fullSize: 0, thumbSize: 0, stderr: r.stderr, stage: 'header' };
    }
    const fSize = await sizeOf(full);
    console.log(`[conv] ${repoRel} (${mb(srcSize)}MB -> ${mb(fSize)}MB header)`);
    return { status: 'conv', srcSize, fullSize: fSize, thumbSize: 0 };
  }

  if (await shouldSkip(src, full, thumb)) {
    const fSize = await sizeOf(full);
    const tSize = await sizeOf(thumb);
    console.log(`[skip] ${repoRel} (${mb(srcSize)}MB -> ${mb(fSize)}MB + ${mb(tSize)}MB)`);
    return { status: 'skip', srcSize, fullSize: fSize, thumbSize: tSize };
  }
  const [argsFull, argsThumb] = ffmpegArgsFor(cls.kind, src, full, thumb);
  const r1 = await runFfmpeg(argsFull);
  if (r1.code !== 0) {
    console.log(`[fail] ${repoRel} (full)`);
    return { status: 'fail', srcSize, fullSize: 0, thumbSize: 0, stderr: r1.stderr, stage: 'full' };
  }
  const r2 = await runFfmpeg(argsThumb);
  if (r2.code !== 0) {
    console.log(`[fail] ${repoRel} (thumb)`);
    return { status: 'fail', srcSize, fullSize: await sizeOf(full), thumbSize: 0, stderr: r2.stderr, stage: 'thumb' };
  }
  const fSize = await sizeOf(full);
  const tSize = await sizeOf(thumb);
  console.log(`[conv] ${repoRel} (${mb(srcSize)}MB -> ${mb(fSize)}MB + ${mb(tSize)}MB)`);
  return { status: 'conv', srcSize, fullSize: fSize, thumbSize: tSize };
}

function shouldConsiderSource(file) {
  const base = path.basename(file);
  if (isThumb(base)) return false;
  return classify(file) !== null;
}

function isHeaderFile(file) {
  return isHeader(path.basename(file));
}

function sortKey(name) {
  const m = name.match(/\d+/);
  const n = m ? parseInt(m[0], 10) : Number.MAX_SAFE_INTEGER;
  return [n, name.toLowerCase()];
}

function cmpName(a, b) {
  const [an, al] = sortKey(a);
  const [bn, bl] = sortKey(b);
  if (an !== bn) return an - bn;
  return al < bl ? -1 : al > bl ? 1 : 0;
}

async function collectProjectEntries(absProjDir) {
  const files = await walkFiles(absProjDir);
  // Headers are referenced from projectsData in core.js, not from assets.json — skip them here.
  const sources = files.filter(f => shouldConsiderSource(f) && !isHeaderFile(f));
  const present = new Set(files.map(f => f.toLowerCase()));
  const entries = [];
  for (const src of sources) {
    const cls = classify(src);
    const { full, thumb } = siblings(src, cls.kind);
    if (!present.has(full.toLowerCase()) || !present.has(thumb.toLowerCase())) continue;
    entries.push({
      full: path.basename(full),
      thumb: path.basename(thumb),
      type: cls.kind === 'video' ? 'video' : 'image',
    });
  }
  entries.sort((a, b) => cmpName(a.full, b.full));
  return entries;
}

function parseScopeArg(arg, projects) {
  if (!arg) return null;
  const norm = arg.replace(/\\/g, '/').replace(/\/$/, '');
  // Accept either a project path (matches asset-manager paths) or a project id.
  for (const p of projects) {
    if (norm === p.path || norm.endsWith('/' + p.path) || norm === p.id) return p;
  }
  throw new Error(`Scope argument "${arg}" did not match any project in asset-manager.html`);
}

async function main() {
  const projects = await readProjectsFromAssetManager();
  const scopeArg = process.argv[2] || null;
  const scope = parseScopeArg(scopeArg, projects);
  const targets = scope ? [scope] : projects;

  const totals = { sources: 0, conv: 0, skip: 0, fail: 0, before: 0, afterFull: 0, afterThumb: 0 };
  const failures = [];

  for (const proj of targets) {
    const absDir = path.join(REPO_ROOT, proj.path);
    const files = await walkFiles(absDir);
    for (const f of files) {
      if (!shouldConsiderSource(f)) continue;
      totals.sources++;
      const rel = path.relative(REPO_ROOT, f).replace(/\\/g, '/');
      const result = await processOne(f, rel);
      if (!result) continue;
      totals.before += result.srcSize;
      totals.afterFull += result.fullSize;
      totals.afterThumb += result.thumbSize;
      if (result.status === 'conv') totals.conv++;
      else if (result.status === 'skip') totals.skip++;
      else if (result.status === 'fail') {
        totals.fail++;
        failures.push({ path: rel, stage: result.stage, stderr: result.stderr });
      }
    }
  }

  if (failures.length) {
    console.error('\nFAILURES:');
    for (const f of failures) {
      console.error(`  ${f.path} [${f.stage}]`);
      const tail = (f.stderr || '').trim().split('\n').slice(-8).join('\n');
      console.error(tail.replace(/^/gm, '    '));
    }
    process.exitCode = 1;
    return;
  }

  // Update assets.json for the processed scope only.
  let manifest = {};
  try { manifest = JSON.parse(await readFile(ASSETS_JSON, 'utf8')); } catch {}
  for (const proj of targets) {
    const absDir = path.join(REPO_ROOT, proj.path);
    manifest[proj.id] = await collectProjectEntries(absDir);
  }
  await writeFile(ASSETS_JSON, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  const afterTotal = totals.afterFull + totals.afterThumb;
  const deltaPct = totals.before > 0 ? ((1 - afterTotal / totals.before) * 100).toFixed(1) : '0.0';
  console.log('\nSummary:');
  console.log(`  Sources: ${totals.sources}  Converted: ${totals.conv}  Skipped: ${totals.skip}  Failed: ${totals.fail}`);
  console.log(`  Size before: ${mb(totals.before)} MB  after (full+thumb): ${mb(afterTotal)} MB  delta: ${deltaPct}%`);
  console.log(`  Scope: ${scope ? scope.path : 'all projects'}`);
}

main().catch(err => { console.error(err); process.exit(2); });
