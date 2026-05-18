---
name: optimize-portfolio-assets
description: Batch-optimize the portfolio asset library. Converts raw png/jpg/gif/mp4/mov/mkv under `assets/projects/` and `assets/personal-art/` to web-friendly formats (webp / animated webp / webm) and generates low-resolution thumbnail siblings used by the gallery grid, while keeping originals untouched. Triggers when the user asks to "optimize assets", "convert to webp", "convert videos to webm", "generate thumbnails", "сжать ассеты", "перевести гифки в webp", or similar. Mandatory whenever new media is dropped into `assets/projects/*/` or `assets/personal-art/`.
---

# Optimize portfolio assets

## When to invoke

- Client/Deniss drops new raw media into `assets/projects/*/` or `assets/personal-art/`.
- An audit (see `audit-assets` skill) shows raw `.png/.jpg/.gif/.mp4/.mov/.mkv` files that don't have webp/webm siblings yet.
- User says "optimize", "convert", "compress assets", "make thumbnails", "сжать", "перевести в webp/webm".

Do **not** invoke for `assets/icons/` (UI icons stay as-is) or for `DenissSalomovsCV.pdf`.

## Output contract

For every source file `<name>.<ext>` the skill produces, *next to it*, these siblings:

| Source                  | Full-quality sibling     | Low-res preview sibling   |
|-------------------------|--------------------------|----------------------------|
| `*.png`, `*.jpg`        | `*.webp`                 | `*.thumb.webp`             |
| `*.gif`                 | `*.webp` (animated)      | `*.thumb.webp` (animated)  |
| `*.mp4`, `*.mov`, `*.mkv` | `*.webm` (VP9 + Opus)    | `*.thumb.webm` (low bitrate) |

Originals are **kept on disk** but `assets.json` is rewritten to reference only the optimized siblings. The gallery loads `*.thumb.*` in the grid; the lightbox loads the full `*.webp`/`*.webm` on open. (See `frontend-loader-engineer` agent for the consumer side.)

**Headers** (`header.*` at the root of each project folder) are also converted to `.webp`, but only the full sibling — no thumb tier is generated because the UI shows each header at a single fixed size. Headers are **not** added to `assets.json`; they are referenced directly from `projectsData` in `core.js`, which the optimizer leaves untouched. After a fresh header conversion, the `projectsData[i].headerImage` paths in `core.js` must be manually updated from `.png`/`.gif` to `.webp` — this is a one-time edit per added/renamed header.

The conversion script must be **idempotent**: re-running the skill must skip files whose optimized siblings are already newer than the source.

## Pipeline (use `ffmpeg`, already installed)

Run from the repo root. The `asset-optimizer` agent owns execution.

### Static images (png, jpg) → webp

```
ffmpeg -y -i SRC -c:v libwebp -q:v 80 -compression_level 6 -an OUT.webp
ffmpeg -y -i SRC -vf "scale='min(640,iw)':-2" -c:v libwebp -q:v 60 -compression_level 6 -an OUT.thumb.webp
```

### Animated gif → animated webp

```
ffmpeg -y -i SRC -loop 0 -c:v libwebp -lossless 0 -q:v 70 -compression_level 6 -loop 0 -preset picture -an OUT.webp
ffmpeg -y -i SRC -vf "scale='min(480,iw)':-2,fps=15" -loop 0 -c:v libwebp -q:v 50 -compression_level 6 -loop 0 -preset picture -an OUT.thumb.webp
```

### Video (mp4, mov, mkv) → webm

```
ffmpeg -y -i SRC -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 -c:a libopus -b:a 96k OUT.webm
ffmpeg -y -i SRC -vf "scale='min(720,iw)':-2,fps=24" -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 -deadline good -cpu-used 4 -an OUT.thumb.webm
```

Tune `-crf` if a single output is still over ~3 MB for full or ~500 KB for thumb. Never go below `-crf 24` (full) or `-crf 32` (thumb) — quality cliff.

## Driver script

Implement (or extend) `tools/optimize_assets.mjs` (Node 22, no extra deps) that:

1. Walks `assets/projects/**` and `assets/personal-art/**`, skipping `assets/icons/`.
2. For each source file with an extension in the table above, checks if both the full and thumb siblings exist and are newer than the source — if so, skip.
3. Otherwise shells out to `ffmpeg` with the commands above.
4. Logs `[skip|conv|fail] <relpath> (<src MB> → <out MB>)`.
5. After the walk, regenerates `assets.json` by scanning the same folders. Each project's array now contains objects:
   ```json
   { "full": "5.webp", "thumb": "5.thumb.webp", "type": "image" }
   ```
   (`type` is `image` or `video`). Keep ordering by leading number where present, then lexicographic — same as `core.js`/`asset-manager.html`.

The script is the source of truth for the conversion. Do not hand-craft one-off ffmpeg calls.

## Acceptance check

After a full run, the `audit-assets` skill should report:
- `assets/` total under **80 MB**
- No source `.png/.jpg/.gif/.mp4/.mov/.mkv` without optimized siblings (outside `icons/`)
- `assets.json` validates: every referenced `full`/`thumb` exists on disk

If any of those fail, fix the pipeline before declaring done.

## What this skill does *not* do

- Does **not** edit `core.js` or `style.css` — that is the `frontend-loader-engineer` agent's job, which consumes the new `assets.json` shape.
- Does **not** delete originals — leave them; we may want to re-encode later with different knobs.
- Does **not** commit anything — committing is a user action.
