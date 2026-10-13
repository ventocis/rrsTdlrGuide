#!/usr/bin/env node
/**
 * Validates src/data/providers.json before it ships.
 *
 * Catches the three failures this directory has actually had: a licence the
 * state no longer approves, a total that doesn't equal its own parts, and a row
 * with no verification date. Run with --strict to fail on the warnings too.
 *
 * Run: npm run check:data
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { readSnapshot, resolveSnapshot, isCurrent } from './lib/tdlr.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const strict = process.argv.includes('--strict')
const providers = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'providers.json'), 'utf8'))

const errors = [], warnings = []
const NOT_FOUND = (v) => String(v ?? '').trim().toLowerCase() === 'not found'

const seenId = new Set(), seenLic = new Map()
for (const p of providers) {
  const at = `${p.license || '(no licence)'} ${p.name}`

  if (seenId.has(p.id)) errors.push(`duplicate id ${p.id} (${at})`)
  seenId.add(p.id)

  for (const lic of [p.license, ...(p.duplicates || []).map((d) => d.license)]) {
    const l = (lic || '').trim().toUpperCase()
    if (!l) continue
    if (seenLic.has(l)) errors.push(`licence ${l} appears twice (${seenLic.get(l)} and ${at})`)
    seenLic.set(l, at)
  }

  // A total that isn't price + fee is either an add-on we chose to show or a bug.
  // Rows that legitimately differ must say so with totalIncludesExtras: true.
  if (!NOT_FOUND(p.priceDisplay) && !NOT_FOUND(p.totalCostDisplay)) {
    const expected = Number(p.price) + Number(p.stateFee)
    if (Math.abs(Number(p.totalCost) - expected) > 0.005 && p.totalIncludesExtras !== true) {
      errors.push(`${at}: total ${p.totalCost} != price ${p.price} + fee ${p.stateFee} (set totalIncludesExtras if intended)`)
    }
  }

  if (!String(p.lastVerified || '').trim()) warnings.push(`${at}: no lastVerified date`)
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(p.lastVerified)) errors.push(`${at}: lastVerified "${p.lastVerified}" is not YYYY-MM-DD`)

  if (p.website && !/^https?:\/\//i.test(p.website)) warnings.push(`${at}: website "${p.website}" has no scheme`)
}

// Cross-check against the state, when a snapshot is available.
let licNote = 'skipped (no TDLR snapshot — run `npm run data:pull`)'
try {
  const snap = resolveSnapshot(root, process.argv)
  const current = new Set(readSnapshot(snap, 'vsDriverSafetyProvider.csv').filter(isCurrent).map((r) => r['License Number'].toUpperCase()))
  const stale = [...seenLic.keys()].filter((l) => l.startsWith('CP') && !current.has(l))
  for (const l of stale) warnings.push(`${seenLic.get(l)}: licence ${l} is not CURRENT at TDLR`)
  licNote = `${seenLic.size} licences checked, ${stale.length} not current`
} catch {}

// Findings land in a tracked file so they become a worklist rather than console
// noise. Nothing is auto-corrected: a wrong total must be researched, not hidden
// behind an override flag.
const reportDir = path.join(root, 'tdlr-source', 'reports')
fs.mkdirSync(reportDir, { recursive: true })
fs.writeFileSync(
  path.join(reportDir, 'data-issues.md'),
  `# Data issues in src/data/providers.json\n\n` +
    `Generated ${new Date().toISOString().slice(0, 10)} by \`npm run check:data\`. ` +
    `Do not silence an error by setting \`totalIncludesExtras\` unless the add-on has been verified at checkout.\n\n` +
    `## Errors (${errors.length})\n\n` + (errors.map((e) => `- ${e}`).join('\n') || '_none_') +
    `\n\n## Warnings (${warnings.length})\n\n` + (warnings.map((w) => `- ${w}`).join('\n') || '_none_') + '\n'
)

console.log(`providers       ${providers.length}`)
console.log(`licence check   ${licNote}`)
console.log(`errors          ${errors.length}`)
console.log(`warnings        ${warnings.length}`)
for (const e of errors) console.error(`  ERROR  ${e}`)
for (const w of warnings.slice(0, 20)) console.warn(`  warn   ${w}`)
if (warnings.length > 20) console.warn(`  ... and ${warnings.length - 20} more warnings`)

console.log(`\nWorklist: tdlr-source/reports/data-issues.md`)

if (errors.length || (strict && warnings.length)) process.exit(1)
