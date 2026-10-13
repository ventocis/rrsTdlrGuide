#!/usr/bin/env node
/**
 * Diffs a TDLR snapshot against the live site data and writes the work lists
 * that drive each research chunk. Read-only with respect to src/data/.
 *
 * Run: npm run data:reconcile  [-- --snapshot=tdlr-source/snapshots/2026-10-13]
 * Output: tdlr-source/reports/*.csv + reconcile-report.md
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { readSnapshot, resolveSnapshot, toCsv, isCurrent, siteLicences } from './lib/tdlr.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const snap = resolveSnapshot(root, process.argv)
const outDir = path.join(root, 'tdlr-source', 'reports')
fs.mkdirSync(outDir, { recursive: true })

const ds = readSnapshot(snap, 'vsDriverSafetyProvider.csv')
const de = readSnapshot(snap, 'vsDriverEduProvider.csv')
const br = readSnapshot(snap, 'vsDriverEduProviderBranch.csv')
const providers = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'providers.json'), 'utf8'))

const site = siteLicences(providers)
const dsCurrent = new Map(ds.filter(isCurrent).map((r) => [r['License Number'].toUpperCase(), r]))
const dsAll = new Map(ds.map((r) => [r['License Number'].toUpperCase(), r]))

const row = (r) => [r['License Number'], r.Licensee, r.City, r.County, r.Phone, r['License Expiration Date']]
const HDR = ['License', 'Licensee', 'City', 'County', 'Phone', 'Expires']

// Licences TDLR currently approves that the site never mentions.
const missing = [...dsCurrent.keys()].filter((l) => !site.has(l)).sort().map((l) => dsCurrent.get(l))
// Licences the site still advertises that TDLR no longer approves.
const dead = [...site.keys()].filter((l) => l.startsWith('CP') && !dsCurrent.has(l)).sort()

const write = (name, header, rows) => {
  fs.writeFileSync(path.join(outDir, name), toCsv(header, rows))
  return rows.length
}

const nMissing = write('ds-missing-from-site.csv', HDR, missing.map(row))
const nDead = write('ds-dead-on-site.csv', ['License', 'SiteName', 'SiteRowId', 'Role', 'TDLRStatus'],
  dead.map((l) => {
    const s = site.get(l)
    return [l, s.name, s.id, s.role, dsAll.get(l)?.['License Status'] ?? 'NOT IN TDLR FILE']
  }))

const PROF = {
  'de-primary.csv': 'DRIVER EDUCATION PROVIDER - PRIMARY',
  'de-online.csv': 'ONLINE ONLY DRIVER EDUCATION PROVIDER',
  'de-parent.csv': 'PARENT TAUGHT',
  'de-exempt.csv': 'DRIVER EDUCATION PROVIDER EXEMPT ENTITY',
}
const deCounts = {}
for (const [file, prof] of Object.entries(PROF)) {
  deCounts[file] = write(file, HDR, de.filter((r) => isCurrent(r) && r.Profession === prof).map(row))
}
const nBranch = write('de-branches.csv', ['License', 'Licensee', 'City', 'County', 'Address', 'Phone'],
  br.filter(isCurrent).map((r) => [r['License Number'], r.Licensee, r.City, r.County, r['Address 1'], r.Phone]))

const md = `# Reconciliation report

Snapshot: \`${path.relative(root, snap)}\`
Generated: ${new Date().toISOString().slice(0, 10)}

## Defensive driving (the existing directory)

| | |
|---|---|
| Licences the site claims (rows + duplicate brands) | ${site.size} |
| CURRENT at TDLR | ${dsCurrent.size} |
| CURRENT at TDLR, absent from the site | **${nMissing}** |
| On the site, no longer CURRENT at TDLR | **${nDead}** |

Absent licences are mostly additional brands of operators already listed — group
by operator (\`npm run data:groups\`) before researching any of them.

## Driver education (the new section)

| Profession | CURRENT |
|---|---|
| Primary (commercial schools) | ${deCounts['de-primary.csv']} |
| Online only | ${deCounts['de-online.csv']} |
| Parent taught | ${deCounts['de-parent.csv']} |
| Branch locations | ${nBranch} |
| Exempt entities (ISDs, colleges) — excluded from the comparison | ${deCounts['de-exempt.csv']} |

Listable universe: ${deCounts['de-primary.csv'] + deCounts['de-online.csv'] + deCounts['de-parent.csv']} providers plus ${nBranch} branch locations.
`
fs.writeFileSync(path.join(outDir, 'reconcile-report.md'), md)

console.log(`snapshot            ${path.relative(root, snap)}`)
console.log(`site licences       ${site.size}`)
console.log(`TDLR current (CP)   ${dsCurrent.size}`)
console.log(`  missing from site ${nMissing}`)
console.log(`  dead on site      ${nDead}`)
console.log(`driver ed listable  ${deCounts['de-primary.csv'] + deCounts['de-online.csv'] + deCounts['de-parent.csv']} (+${nBranch} branches, ${deCounts['de-exempt.csv']} exempt excluded)`)
console.log(`\nReports: tdlr-source/reports/`)
