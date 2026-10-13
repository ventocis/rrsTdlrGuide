#!/usr/bin/env node
/**
 * Builds a research worksheet for driver education providers.
 *
 * Websites are established two ways, never guessed:
 *   1. the operator already appears in src/data/providers.json with a verified
 *      website (several hold both a CP and a C licence)
 *   2. the licensee name IS a domain, which is then confirmed to resolve
 * Anything else is left blank for a human to fill.
 *
 * Prices are candidates only. A scraped dollar amount is a lead, not a fact —
 * it lands in the worksheet, never straight into the site data.
 *
 * Run: node scripts/research-driver-ed.mjs <roster.csv>
 * Output: tdlr-source/reports/de-research-<roster>.csv
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseCsv, toCsv } from './lib/tdlr.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const rosterPath = process.argv[2]
if (!rosterPath) { console.error('usage: node scripts/research-driver-ed.mjs <roster.csv>'); process.exit(1) }

const roster = parseCsv(fs.readFileSync(path.join(root, rosterPath), 'utf8'))
const providers = JSON.parse(fs.readFileSync(path.join(root, 'src/data/providers.json'), 'utf8'))

const norm = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
const known = new Map()
for (const p of providers) {
  if (p.website && !/not found/i.test(p.website)) known.set(norm(p.name), { url: p.website, lic: p.license })
  for (const d of p.duplicates || []) {
    if (d.url && !/not found/i.test(d.url) && /^https?:/i.test(d.url)) known.set(norm(d.name), { url: d.url, lic: d.license })
  }
}

const domainFromName = (name) => {
  const m = name.trim().match(/^([A-Z0-9][A-Z0-9-]*\.(?:COM|NET|ORG))$/i)
  return m ? `https://${m[1].toLowerCase()}` : null
}

const PRICE = /\$\s?(\d{1,3}(?:\.\d{2})?)\b/g

async function probe(url) {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000) })
    if (!res.ok) return { ok: false, note: `HTTP ${res.status}` }
    const html = await res.text()
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ')
    const texan = /\btexas\b/i.test(text)
    const driverEd = /driver'?s?\s*ed|driver education|teen driv|behind[- ]the[- ]wheel|permit/i.test(text)
    const prices = [...new Set([...text.matchAll(PRICE)].map((m) => Number(m[1])))]
      .filter((n) => n >= 5 && n <= 500).sort((a, b) => a - b)
    return { ok: true, finalUrl: res.url, texan, driverEd, prices, note: '' }
  } catch (err) {
    return { ok: false, note: err.name === 'TimeoutError' ? 'timeout' : err.message.slice(0, 40) }
  }
}

const rows = []
for (const r of roster) {
  const name = r.Licensee
  const hit = known.get(norm(name))
  const guess = domainFromName(name)
  const url = hit?.url ?? guess ?? ''
  const source = hit ? `cross-ref from ${hit.lic}` : guess ? 'name is a domain' : ''

  let status = 'NEEDS MANUAL LOOKUP', prices = '', finalUrl = ''
  if (url) {
    const p = await probe(url)
    if (!p.ok) status = `unreachable (${p.note})`
    else {
      finalUrl = p.finalUrl
      prices = p.prices.join(' ')
      status = p.texan && p.driverEd ? 'CONFIRMED texas driver ed'
        : p.driverEd ? 'driver ed, texas not stated'
        : p.texan ? 'texas, driver ed not stated'
        : 'reachable, content unclear'
    }
  }
  rows.push([r.License, name, r.City, r.Phone, url, source, finalUrl, status, prices])
  console.log(`  ${r.License.padEnd(7)} ${name.slice(0, 34).padEnd(34)} ${status}${prices ? '  $' + prices : ''}`)
}

const out = path.join(root, 'tdlr-source/reports', `de-research-${path.basename(rosterPath, '.csv')}.csv`)
fs.writeFileSync(out, toCsv(
  ['License', 'Licensee', 'City', 'Phone', 'CandidateUrl', 'UrlSource', 'ResolvedUrl', 'Status', 'CandidatePrices'],
  rows
))
console.log(`\nWorksheet: ${path.relative(root, out)}`)
console.log(`confirmed: ${rows.filter((r) => r[7].startsWith('CONFIRMED')).length}/${rows.length}`)
