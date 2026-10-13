#!/usr/bin/env node
/**
 * Derives operator identity for currently-licensed driving safety providers.
 *
 * The Texas market is a handful of operators running hundreds of white-label
 * brands, so "one row per licence" would bury the real choices. This proposes
 * one row per operator with its brands collapsed underneath.
 *
 * Identity is keyed on ONE signal per licence, in priority order — phone, then
 * street+zip, then the licence itself. Deliberately NOT transitive: chaining
 * phone->address->phone merges unrelated businesses that share an office suite.
 *
 * Output is a PROPOSAL for human review, not an applied change. Merging two real
 * competitors into one row is the error here a customer would notice.
 *
 * Run: npm run data:groups
 * Output: tdlr-source/operator-groups.csv
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { readSnapshot, resolveSnapshot, toCsv, isCurrent, normPhone, normAddr, siteLicences } from './lib/tdlr.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const snap = resolveSnapshot(root, process.argv)
const ds = readSnapshot(snap, 'vsDriverSafetyProvider.csv').filter(isCurrent)
const providers = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'providers.json'), 'utf8'))
const site = siteLicences(providers)

const keyOf = (r) => {
  const ph = normPhone(r.Phone)
  if (ph.length === 10) return `phone:${ph}`
  const ad = normAddr(r)
  if (ad.length > 6) return `addr:${ad}`
  return `lic:${r['License Number'].toUpperCase()}`
}

const groups = new Map()
for (const r of ds) {
  const k = keyOf(r)
  if (!groups.has(k)) groups.set(k, [])
  groups.get(k).push(r)
}

/** Prefer a name the site already shows, so existing rows keep their identity. */
const displayName = (members) => {
  for (const m of members) {
    const s = site.get(m['License Number'].toUpperCase())
    if (s && s.role === 'parent' && s.name) return s.name
  }
  const counts = new Map()
  for (const m of members) counts.set(m.Licensee, (counts.get(m.Licensee) || 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)[0][0]
}

const rows = []
for (const [key, members] of groups) {
  const lics = members.map((m) => m['License Number'].toUpperCase()).sort()
  const onSite = lics.filter((l) => site.has(l))
  const siteRowIds = [...new Set(onSite.map((l) => site.get(l).id))].sort((a, b) => a - b)
  const phones = [...new Set(members.map((m) => normPhone(m.Phone)).filter((p) => p.length === 10))]
  const addrs = [...new Set(members.map(normAddr).filter((a) => a.length > 6))]
  const cities = [...new Set(members.map((m) => m.City).filter(Boolean))].sort()

  const flags = []
  // The gate from the plan: a group may vary on one axis, not both.
  if (phones.length > 1 && addrs.length > 1) flags.push('REVIEW:phone+addr both vary')
  // Site currently splits this operator across several rows.
  if (siteRowIds.length > 1) flags.push(`SPLIT:site has ${siteRowIds.length} rows`)
  // Entirely new operator.
  if (onSite.length === 0) flags.push('NEW:not on site')
  // Partially listed — some brands known, others not.
  else if (onSite.length < lics.length) flags.push(`PARTIAL:${onSite.length}/${lics.length} listed`)

  rows.push({
    key,
    name: displayName(members),
    size: lics.length,
    onSite: onSite.length,
    siteRowIds: siteRowIds.join(' '),
    cities: cities.slice(0, 4).join('; ') + (cities.length > 4 ? ` +${cities.length - 4}` : ''),
    phone: phones.join(' '),
    lics: lics.join(' '),
    flags: flags.join('; '),
  })
}

rows.sort((a, b) => b.size - a.size || a.name.localeCompare(b.name))

const outDir = path.join(root, 'tdlr-source')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(
  path.join(outDir, 'operator-groups.csv'),
  toCsv(
    ['ProposedOperator', 'Licences', 'AlreadyListed', 'SiteRowIds', 'Cities', 'Phone', 'GroupKey', 'LicenceNumbers', 'Flags'],
    rows.map((r) => [r.name, r.size, r.onSite, r.siteRowIds, r.cities, r.phone, r.key, r.lics, r.flags])
  )
)

// Street address is a real signal that two phone-keyed groups share an owner, but
// acting on it automatically is wrong: Aceable, I Drive Safely and DriversEd.com
// share an Austin HQ yet compete on price, and collapsing them would hide genuine
// choices. So address-based merges are proposed separately for a human to judge.
const byAddr = new Map()
for (const [key, members] of groups) {
  for (const m of members) {
    const a = normAddr(m)
    if (a.length <= 6) continue
    if (!byAddr.has(a)) byAddr.set(a, new Set())
    byAddr.get(a).add(key)
  }
}
const candidates = []
for (const [addr, keys] of byAddr) {
  if (keys.size < 2) continue
  const ks = [...keys]
  const street = groups.get(ks[0]).find((m) => normAddr(m) === addr)
  candidates.push([
    ks.length,
    ks.map((k) => {
      const r = rows.find((x) => x.key === k)
      return `${r.name} (${r.size})`
    }).join(' | '),
    `${street['Address 1']}, ${street.City} ${street.Zip}`,
    ks.map((k) => rows.find((x) => x.key === k).phone).join(' '),
    ks.join(' '),
  ])
}
candidates.sort((a, b) => b[0] - a[0])
fs.writeFileSync(
  path.join(outDir, 'operator-merge-candidates.csv'),
  toCsv(['GroupsAtAddress', 'ProposedOperators', 'SharedAddress', 'Phones', 'GroupKeys'], candidates)
)

const count = (f) => rows.filter((r) => r.flags.includes(f)).length
console.log(`current CP licences      ${ds.length}`)
console.log(`proposed operators       ${rows.length}`)
console.log(`  multi-licence groups   ${rows.filter((r) => r.size > 1).length}`)
console.log(`  single-licence groups  ${rows.filter((r) => r.size === 1).length}`)
console.log('')
console.log(`needs review (both vary) ${count('REVIEW')}`)
console.log(`site splits one operator ${count('SPLIT')}`)
console.log(`new operators            ${count('NEW')}`)
console.log(`partially listed         ${count('PARTIAL')}`)
console.log('')
console.log(`merge candidates (shared address, NOT auto-merged) ${candidates.length} addresses, ${candidates.reduce((n, c) => n + c[0], 0)} groups`)
console.log(`\nProposals (review before applying):`)
console.log(`  tdlr-source/operator-groups.csv`)
console.log(`  tdlr-source/operator-merge-candidates.csv`)
