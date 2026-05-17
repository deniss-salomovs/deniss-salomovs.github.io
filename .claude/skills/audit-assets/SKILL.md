---
name: audit-assets
description: Read-only inventory of `assets/` — total size, per-folder size, top heaviest files, and a count of how many raw sources still lack optimized webp/webm siblings. Triggers when the user asks to "audit assets", "show asset sizes", "what's left to optimize", "сколько весят ассеты", "что ещё не сжато". Run before and after `optimize-portfolio-assets` to confirm savings.
---

# Audit portfolio assets

## When to invoke

- Before starting an optimization pass (to capture the baseline).
- After an optimization pass (to confirm savings against `[[project-asset-inventory]]`).
- User asks how heavy the site is, what the worst offenders are, or whether everything is converted.

## What to report

Run the snippets below from the repo root and present results as a short, structured report — no narration, no recommendations, just the numbers.

### 1. Per-extension totals

```powershell
Get-ChildItem -Path assets -Recurse -File |
  Group-Object Extension |
  ForEach-Object { [PSCustomObject]@{
    Ext=$_.Name
    Count=$_.Count
    TotalMB=[math]::Round((($_.Group | Measure-Object Length -Sum).Sum/1MB),2)
  } } |
  Sort-Object TotalMB -Descending |
  Format-Table -AutoSize
```

### 2. Per-folder totals (gallery folders only)

```powershell
$base = "assets"
Get-ChildItem -Path $base -Directory -Recurse |
  Where-Object { $_.FullName -notmatch 'icons' } |
  ForEach-Object {
    $size = (Get-ChildItem -Path $_.FullName -File -Recurse | Measure-Object Length -Sum).Sum
    [PSCustomObject]@{
      Folder=$_.FullName.Substring((Resolve-Path $base).Path.Length+1)
      MB=[math]::Round($size/1MB,2)
    }
  } |
  Sort-Object MB -Descending |
  Format-Table -AutoSize
```

### 3. Top 20 heaviest individual files

```powershell
Get-ChildItem -Path assets -Recurse -File |
  Where-Object { $_.Extension -in '.gif','.png','.jpg','.jpeg','.mp4','.mov','.mkv','.webp','.webm' } |
  Sort-Object Length -Descending |
  Select-Object -First 20 |
  ForEach-Object { [PSCustomObject]@{
    MB=[math]::Round($_.Length/1MB,2)
    Path=$_.FullName.Substring((Resolve-Path assets).Path.Length+1)
  } } |
  Format-Table -AutoSize
```

### 4. Optimization coverage

Count raw sources whose optimized sibling is **missing**:

- For `*.png`, `*.jpg`: missing if no `<stem>.webp` next to it.
- For `*.gif`: missing if no `<stem>.webp` next to it.
- For `*.mp4`, `*.mov`, `*.mkv`: missing if no `<stem>.webm` next to it.
- Independently check `<stem>.thumb.<webp|webm>` existence for the thumbnail pass.

Report two numbers: `unoptimized_full=<N>`, `unoptimized_thumb=<N>`. List the first 10 offenders by path. Exclude anything under `assets/icons/` from all checks.

### 5. Served bytes (the number that actually matters)

This is what real visitors download — the only regression metric that counts. Originals stay on disk for re-encoding flexibility, so disk total will grow during conversion; that is not a regression.

Compute as: sum of file sizes for everything **referenced by the live site**:
- `assets/icons/**` (referenced from `index.html`)
- Every `headerImage` from `projectsData` in `core.js`
- `assets/DenissSalomovsCV.pdf`
- For each entry in `assets.json`: both `full` and `thumb` (or the bare filename if legacy entry)

Files **not counted** as served:
- Originals (`*.png`, `*.jpg`, `*.gif`, `*.mp4`, `*.mov`, `*.mkv`) that already have an optimized sibling and are not referenced anywhere — they sit on disk but no live URL points at them.

Report: `served_bytes=<X> MB`, `disk_bytes=<Y> MB`. The two will diverge once conversion starts — that is correct and expected.

## Comparison to baseline

The `[[project-asset-inventory]]` memory holds the 2026-05-17 disk baseline (~600 MB) and, after the first optimization pass, the served-bytes baseline. After every optimization pass, state:
- New `served_bytes` MB
- Delta vs served baseline (MB and %)
- Whether the **target** (`served_bytes` under 80 MB, 0 unoptimized) is reached

Disk total is reported alongside for context but does not gate ship/hold decisions.

## What this skill does *not* do

- Does **not** modify any files.
- Does **not** run ffmpeg — that's `optimize-portfolio-assets`.
- Does **not** update memory automatically — propose a memory update to the user if the baseline should be re-anchored.
