#!/usr/bin/env node
/**
 * Adds newly-licensed operators to src/data/providers.json as roster rows.
 *
 * Writes only what TDLR asserts: name, licence, and that the licence is current.
 * Price, fee, total, format, language and certificate delivery are all recorded
 * as unknown, because nobody has checked them. They are NOT guessed, and
 * instantCert is 'Unknown' rather than the old 'Mail' default — claiming a
 * delivery method for an unchecked provider is the error that started this.
 *
 * Unknown-price rows already sort to the bottom of the table, so completeness
 * does not cost the comparison anything.
 *
 * Run: node scripts/add-operators.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseCsv, readSnapshot, resolveSnapshot, isCurrent } from './lib/tdlr.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dest = path.join(root, 'src/data/providers.json')
const providers = JSON.parse(fs.readFileSync(dest, 'utf8'))

// Derived from the reviewed grouping plus a snapshot, both of which are either
// tracked or one command away — rather than from an intermediate CSV that would
// have to be committed to keep this reproducible.
const groups = parseCsv(fs.readFileSync(path.join(root, 'tdlr-source/operator-groups.csv'), 'utf8'))
const snap = resolveSnapshot(root, process.argv)
const byLicence = new Map(
  readSnapshot(snap, 'vsDriverSafetyProvider.csv').filter(isCurrent).map((r) => [r['License Number'].toUpperCase(), r])
)
const roster = groups
  .filter((g) => g.Flags.includes('NEW') || g.Flags.includes('PARTIAL'))
  .map((g) => {
    const lic = g.LicenceNumbers.split(' ')[0].toUpperCase()
    const s = byLicence.get(lic) ?? {}
    return {
      License: lic,
      Licensee: g.ProposedOperator,
      City: s.City ?? '',
      GroupSize: g.Licences,
      Flags: g.Flags,
    }
  })

const have = new Set()
for (const p of providers) {
  if (p.license) have.add(p.license.toUpperCase())
  for (const d of p.duplicates || []) if (d.license) have.add(d.license.toUpperCase())
}

let nextId = Math.max(...providers.map((p) => p.id)) + 1
const added = []
for (const r of roster) {
  const lic = r.License.toUpperCase()
  if (have.has(lic)) continue          // the two PARTIAL operators are already listed
  if (!r.Flags.includes('NEW')) continue
  providers.push({
    id: nextId++,
    name: r.Licensee.trim(),
    license: lic,
    duplicates: [],
    price: 0,
    priceDisplay: 'Not Found',
    stateFee: 0,
    stateFeeDisplay: 'Not Found',
    totalCost: 0,
    totalCostDisplay: 'Not Found',
    online: false,
    inPerson: false,
    languages: ['Not Found'],
    instantCert: 'Unknown',
    moneyBack: false,
    lastVerified: '',
    featured: false,
  })
  added.push([lic, r.Licensee.trim(), r.City, r.GroupSize])
}

providers.sort((a, b) => a.id - b.id)
fs.writeFileSync(dest, JSON.stringify(providers, null, 2).replace(/\n$/, ''))

console.log(`added ${added.length} operators — ${providers.length} rows total`)
for (const [lic, name, city, size] of added) {
  console.log(`  ${lic.padEnd(8)} ${name.slice(0, 38).padEnd(38)} ${(city || '').slice(0, 16).padEnd(16)} ${size} licence${size === '1' ? '' : 's'}`)
}
