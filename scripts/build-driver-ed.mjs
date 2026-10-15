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

// Licence type is the only honest source for how a course reaches a student:
// TDLR says "online only", or it licenses a physical location, or it is the
// parent-taught programme. Nothing here is inferred from a provider's marketing.
const ROSTERS = [
  { file: 'de-online.csv', profession: 'Online only driver education provider', delivery: 'online' },
  { file: 'de-primary.csv', profession: 'Driver education provider', delivery: 'in-person' },
  { file: 'de-parent.csv', profession: 'Parent-taught course provider', delivery: 'parent-taught' },
]
const roster = ROSTERS.flatMap((g) =>
  R(`tdlr-source/reports/${g.file}`).map((r) => ({ ...r, _profession: g.profession, _delivery: g.delivery }))
)
const research = new Map(
  fs.existsSync(path.join(root, 'tdlr-source/research/de-online.csv'))
    ? R('tdlr-source/research/de-online.csv').map((r) => [r.License, r])
    : []
)
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
    profession: r._profession,
    delivery: r._delivery,
    website: confirmed ? (res.ResolvedUrl || res.CandidateUrl) : null,
    // null = not researched yet, and rendered as a dash. Never a scraped guess.
    price: null,
    priceDisplay: null,
    courseTypes: r._delivery === 'parent-taught' ? ['parent-taught'] : [],
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

// Providers licensed too recently to appear in TDLR's published file. Kept in a
// tracked file rather than hand-edited into the output, so regenerating does not
// silently drop them — the mistake that cost a round trip in July.
const addPath = path.join(root, 'tdlr-source/driver-ed-additions.json')
if (fs.existsSync(addPath)) {
  for (const a of JSON.parse(fs.readFileSync(addPath, 'utf8'))) {
    // Same file does two jobs: a licence already in TDLR's roster gets the
    // verified research layered onto it; one that isn't there yet is added.
    const existing = out.find((p) => p.license === a.license)
    if (existing) {
      for (const [k, v] of Object.entries(a)) {
        if (k.startsWith('_') || k === 'license') continue
        existing[k] = v
      }
      existing.verified = {
        roster: existing.verified.roster,
        website: !!a.website || existing.verified.website,
        price: a.price != null || existing.verified.price,
      }
      continue
    }
    const cp = byName.get(norm(a.name))
    out.push({
      id: id++,
      license: a.license,
      name: a.name,
      profession: a.profession,
      delivery: a.delivery,
      website: a.website ?? null,
      price: a.price ?? null,
      priceDisplay: a.priceDisplay ?? null,
      courseTypes: a.courseTypes ?? [],
      btwHours: a.btwHours ?? null,
      locations: a.locations ?? [],
      city: a.city ?? null,
      county: a.county ?? null,
      phone: a.phone ?? null,
      licenseExpires: a.licenseExpires ?? null,
      alsoDefensiveDriving: cp ? cp.license : null,
      lastVerified: a.lastVerified ?? TODAY,
      source: a.source ?? 'owner-reported',
      verified: { roster: false, website: !!a.website, price: a.price != null },
    })
  }
  out.sort((a, b) => a.name.localeCompare(b.name))
  out.forEach((p, i) => { p.id = i + 1 })
}

out.sort((a, b) => a.name.localeCompare(b.name))
out.forEach((p, i) => { p.id = i + 1 })

const dest = path.join(root, 'src/data/driver-ed.json')
fs.writeFileSync(dest, JSON.stringify(out, null, 2))

console.log(`wrote src/data/driver-ed.json — ${out.length} providers`)
console.log(`  website confirmed   ${out.filter((p) => p.verified.website).length}`)
console.log(`  price researched    ${out.filter((p) => p.verified.price).length}`)
console.log(`  also sell defensive driving ${out.filter((p) => p.alsoDefensiveDriving).length}`)
console.log(`  awaiting TDLR file  ${out.filter((p) => p.source === 'owner-reported').length}`)
for (const d of ['online', 'in-person', 'parent-taught']) {
  console.log(`  ${d.padEnd(14)} ${out.filter((p) => p.delivery === d).length}`)
}
console.log(`  branch locations    ${out.reduce((n, p) => n + p.locations.length, 0)}`)
