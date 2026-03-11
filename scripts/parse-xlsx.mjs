#!/usr/bin/env node
/**
 * Reads TDLRguide.xlsx (first sheet) and writes data/providers.json.
 *
 * Expected columns (first row = header; names are matched flexibly, case-insensitive):
 *   Provider, License, Website, Rating, Price, Fee, Minimum Certificate Cost,
 *   Total Cost, Instant Certificate, Format, Language, Duplicate Group
 *
 * - Cell values like "Not Found" / "N/A" are preserved from the spreadsheet so the
 *   table can display them exactly as-entered. Numeric fields are still parsed for
 *   sorting, but the original text is kept separately for display.
 * - Independent or blank Duplicate Group = one provider per row, no dropdown.
 * - Same "Duplicate Group N" = one provider; first row = main, rest = duplicates (dropdown).
 *
 * Run: npm run build:data
 * Inspect detected columns: node scripts/parse-xlsx.mjs --inspect
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as XLSXNS from 'xlsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const workbookPath = path.join(__dirname, '..', 'TDLRguide.xlsx')
const outputPath = path.join(__dirname, '..', 'data', 'providers.json')

if (!fs.existsSync(workbookPath)) {
  console.error(`TDLRguide.xlsx not found at ${workbookPath}`)
  process.exit(1)
}

const XLSX = XLSXNS.default || XLSXNS
const wb = XLSX.readFile(workbookPath)
const sheetName = wb.SheetNames[0]
const sheet = wb.Sheets[sheetName]

// Convert to JSON rows preserving header names
let rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

// Build flexible header map: normalized key -> actual key from first row
const headerMap = new Map()
if (rows.length && typeof rows[0] === 'object') {
  for (const key of Object.keys(rows[0])) {
    const norm = key.toLowerCase().replace(/\s+/g, ' ').trim()
    headerMap.set(norm, key)
    headerMap.set(norm.replace(/\s/g, ''), key) // "totalcost" -> "Total Cost"
  }
}

function getKey(alias) {
  const n = alias.toLowerCase().replace(/\s+/g, ' ').trim()
  return headerMap.get(n) ?? headerMap.get(n.replace(/\s/g, '')) ?? alias
}

// Raw cell value straight from the sheet (used for display)
function getRaw(row, key) {
  const actualKey = getKey(key)
  return row[actualKey] ?? (typeof actualKey === 'string'
    ? row[actualKey.toLowerCase?.()] ?? ''
    : '')
}

// Normalised cell value (trimmed) for grouping / parsing
function get(row, key) {
  const v = getRaw(row, key)
  return typeof v === 'string' ? v.trim() : v
}

function parseNumber(value) {
  if (value === '' || value == null) return 0
  if (typeof value === 'number') return Number.isNaN(value) ? 0 : value
  const n = parseFloat(String(value).replace(/[$,]/g, ''))
  return Number.isNaN(n) ? 0 : n
}

function mapInstantCert(raw) {
  const v = String(raw || '').toLowerCase()
  if (!v) return 'Mail'
  if (v.includes('included') || v.includes('free') || v === '0') return 'Free'
  if (v.includes('mail')) return 'Mail'
  if (v.includes('paid') || v.includes('$')) return 'Paid'
  return 'Mail'
}

function mapFormatFlags(raw) {
  const v = String(raw || '').toLowerCase()
  const online = v.includes('online')
  const inPerson = v.includes('in-person') || v.includes('in person')
  return { online, inPerson }
}

function mapLanguages(raw) {
  const v = String(raw || '').trim()
  if (!v) return ['English']

  const lower = v.toLowerCase()
  if (lower === 'not found' || lower === 'n/a' || lower === 'na') {
    return ['Not Found']
  }
  if (lower === 'eng') return ['English']
  if (lower.startsWith('eng') && lower.includes('spanish')) {
    return ['English', 'Spanish']
  }
  return v.split(',').map((p) => p.trim()).filter(Boolean)
}

// Group rows: "Independent" or blank = each row is its own provider (no duplicates).
// "Duplicate Group N" = one provider per group; first row = parent, rest = duplicates (or no dropdown if only one row).
const groups = new Map()
for (const row of rows) {
  const raw = get(row, 'Duplicate Group')
  const group = String(raw || '').trim() || 'Independent'
  const key = group
  if (!groups.has(key)) groups.set(key, [])
  groups.get(key).push(row)
}

const providers = []
let id = 1

// Independent: each row is a separate provider with no duplicates
const independentRows = groups.get('Independent') || []
for (const row of independentRows) {
  providers.push(buildProvider(row, [], id++))
}

// Duplicate Group N: one provider per group; first = parent, rest = duplicates (empty if only one row)
for (const [groupKey, groupRows] of groups.entries()) {
  if (groupKey === 'Independent' || !groupRows.length) continue

  const [first, ...rest] = groupRows
  providers.push(buildProvider(first, rest, id++))
}

function buildProvider(first, rest, id) {
  const name = get(first, 'Provider')
  const license = get(first, 'License')
  const websiteRaw = getRaw(first, 'Website')
  const rating = parseNumber(get(first, 'Rating'))
  const priceRaw = getRaw(first, 'Price')
  const feeRaw = getRaw(first, 'Fee')
  const totalCostRaw = getRaw(first, 'Total Cost')
  const price = parseNumber(priceRaw)
  const fee = parseNumber(feeRaw)
  const totalCost = parseNumber(totalCostRaw)
  const instantCertRaw = get(first, 'Instant Certificate')
  const formatRaw = get(first, 'Format')
  const languageRaw = get(first, 'Language')

  const { online, inPerson } = mapFormatFlags(formatRaw)

  return {
    id,
    name,
    license,
    duplicates: rest.map((r) => ({
      name: get(r, 'Provider'),
      url: String(getRaw(r, 'Website')).replace(/^\[\"?|\"?\]$/g, '').trim(),
      license: get(r, 'License') || undefined,
      rating: parseNumber(get(r, 'Rating')) || undefined
    })),
    rating,
    price,
    priceDisplay: priceRaw === undefined || priceRaw === null ? '' : String(priceRaw),
    stateFee: fee,
    stateFeeDisplay: feeRaw === undefined || feeRaw === null ? '' : String(feeRaw),
    totalCost,
    totalCostDisplay:
      totalCostRaw === undefined || totalCostRaw === null ? '' : String(totalCostRaw),
    online,
    inPerson,
    languages: mapLanguages(languageRaw),
    instantCert: mapInstantCert(instantCertRaw),
    moneyBack: false,
    lastVerified: '',
    featured: false
  }
}

fs.writeFileSync(outputPath, JSON.stringify(providers, null, 2))
console.log(`Wrote ${providers.length} providers from ${sheetName} to ${outputPath}`)

// Optional: dump detected headers and first data row for debugging
if (process.argv.includes('--inspect')) {
  console.log('\nDetected column mapping (normalized -> actual):')
  const aliases = ['Provider', 'License', 'Website', 'Rating', 'Price', 'Fee', 'Total Cost', 'Instant Certificate', 'Format', 'Language', 'Duplicate Group']
  for (const a of aliases) console.log(`  ${a} -> ${getKey(a)}`)
  const first = rows.find(r => get(r, 'Provider'))
  if (first) {
    console.log('\nFirst data row sample:')
    console.log('  Provider:', get(first, 'Provider'))
    console.log('  Price:', get(first, 'Price'), '| Fee:', get(first, 'Fee'), '| Total Cost:', get(first, 'Total Cost'))
    console.log('  Format:', get(first, 'Format'), '| Language:', get(first, 'Language'))
  }
}

