#!/usr/bin/env node
/**
 * Downloads TDLR's authoritative licence files into a dated snapshot.
 *
 * Source: https://www.tdlr.texas.gov/LicenseSearch/licfile.asp
 * TDLR refreshes these continuously, so re-pull before each research chunk
 * rather than trusting an old snapshot.
 *
 * Run: npm run data:pull
 * Output: tdlr-source/snapshots/<YYYY-MM-DD>/*.csv  (gitignored — re-pullable)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = 'https://www.tdlr.texas.gov/dbproduction2'

const FILES = [
  ['vsDriverSafetyProvider.csv', 'driving safety providers (CP####) — the defensive-driving directory'],
  ['vsDriverEduProvider.csv', 'driver education providers (C####) — all professions'],
  ['vsDriverEduProviderBranch.csv', 'driver education branch locations (C####A/B/C)'],
]

const date = new Date().toISOString().slice(0, 10)
const outDir = path.join(__dirname, '..', 'tdlr-source', 'snapshots', date)
fs.mkdirSync(outDir, { recursive: true })

let failed = 0
for (const [file, note] of FILES) {
  const url = `${BASE}/${file}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const text = await res.text()
    // A truncated or error page would silently poison every downstream chunk.
    if (!text.startsWith('"License Number"') && !text.startsWith('License Number')) {
      throw new Error('unexpected header — TDLR may have changed the format')
    }
    fs.writeFileSync(path.join(outDir, file), text)
    const rows = text.trim().split('\n').length - 1
    console.log(`  ok   ${file.padEnd(32)} ${String(rows).padStart(5)} rows  ${note}`)
  } catch (err) {
    failed++
    console.error(`  FAIL ${file.padEnd(32)} ${err.message}`)
  }
}

console.log(`\nSnapshot: tdlr-source/snapshots/${date}`)
if (failed) {
  console.error(`${failed} file(s) failed — do not run reconcile against a partial snapshot.`)
  process.exit(1)
}
