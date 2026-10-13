#!/usr/bin/env node
/**
 * Builds src/data/driver-ed.json from a TDLR roster plus a reviewed research
 * worksheet.
 *
 * Only facts that came from TDLR or from a confirmed site visit are written.
 * Price is deliberately left null rather than filled from a scraped dollar
 * amount: the scraper found $9.95 on a provider that sells defensive driving
 * alongside driver ed, and six different prices on another. An unknown price
 * renders as a dash. A wrong price would be worse than no price.
 *
 * Run: node scripts/build-driver-ed.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseCsv } from './lib/tdlr.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const R = (p) => parseCsv(fs.readFileSync(path.join(root, p), 'utf8'))

const roster = R('tdlr-source/reports/de-online.csv')
const research = new Map(R('tdlr-source/reports/de-research-de-online.csv').map((r) => [r.License, r]))
const branches = R('tdlr-source/reports/de-branches.csv')
const providers = JSON.parse(fs.readFileSync(path.join(root, 'src/data/providers.json'), 'utf8'))

// An operator holding both a CP and a C licence is worth cross-linking.
const norm = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
const byName = new Map(providers.map((p) => [norm(p.name), p]))

const branchesFor = (licence) => {
  const stem = licence.replace(/[A-Z]$/, '')
  return branches
    .filter((b) => b['License'].replace(/[A-Z]$/, '') === stem)
    .map((b) => ({ license: b['License'], city: b.City, county: b.County, address: b.Address, phone: b.Phone }))
}

const TODAY = new Date().toISOString().slice(0, 10)
let id = 1
const out = roster.map((r) => {
  const res = research.get(r.License)
  const confirmed = res && res.Status.startsWith('CONFIRMED')
  const cp = byName.get(norm(r.Licensee))
  return {
    id: id++,
    license: r.License,
    name: r.Licensee,
    profession: 'Online only driver education provider',
    delivery: 'online',
    website: confirmed ? (res.ResolvedUrl || res.CandidateUrl) : null,
    // null = not researched yet, and rendered as a dash. Never a scraped guess.
    price: null,
    priceDisplay: null,
    courseTypes: [],
    btwHours: null,
    locations: branchesFor(r.License),
    city: r.City || null,
    county: r.County || null,
    phone: r.Phone || null,
    licenseExpires: r.Expires || null,
    alsoDefensiveDriving: cp ? cp.license : null,
    lastVerified: TODAY,
    verified: { roster: true, website: !!confirmed, price: false },
  }
})

const dest = path.join(root, 'src/data/driver-ed.json')
fs.writeFileSync(dest, JSON.stringify(out, null, 2))

console.log(`wrote src/data/driver-ed.json — ${out.length} providers`)
console.log(`  website confirmed   ${out.filter((p) => p.verified.website).length}`)
console.log(`  price researched    ${out.filter((p) => p.verified.price).length}`)
console.log(`  also sell defensive driving ${out.filter((p) => p.alsoDefensiveDriving).length}`)
