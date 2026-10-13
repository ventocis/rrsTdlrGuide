#!/usr/bin/env node
/**
 * Reads "Courts Directory By County (1).xlsx" (MergedData sheet) and writes data/courts.json.
 *
 * Expected columns (flexible header matching, case-insensitive):
 *   County, Court Type, Court, Website (or Hyperlink), Prefix, First Name, Middle Name, Last Name, Email
 *   Optional: Address, City, Zip Code, Phone
 *
 * Output: JSON array of rows with camelCase keys: county, courtType, court, website, prefix, firstName, middleName, lastName, email, etc.
 *
 * Run: npm run build:courts
 * Place "Courts Directory By County (1).xlsx" in the project root first.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as XLSXNS from 'xlsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const workbookPath = path.join(__dirname, '..', 'Courts Directory By County (1).xlsx')
const outputPath = path.join(__dirname, '..', 'data', 'courts.json')

if (!fs.existsSync(workbookPath)) {
  console.error(`Courts Directory By County (1).xlsx not found at ${workbookPath}`)
  console.error('Place the file in the project root and run again.')
  process.exit(1)
}

const XLSX = XLSXNS.default || XLSXNS
const wb = XLSX.readFile(workbookPath)

const sheetName = 'MergedData'
if (!wb.SheetNames.includes(sheetName)) {
  console.error(`Sheet "${sheetName}" not found. Available sheets: ${wb.SheetNames.join(', ')}`)
  process.exit(1)
}

const sheet = wb.Sheets[sheetName]
let rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

// Build flexible header map: normalized key -> actual key from first row
const headerMap = new Map()
if (rows.length && typeof rows[0] === 'object') {
  for (const key of Object.keys(rows[0])) {
    const norm = key.toLowerCase().replace(/\s+/g, ' ').trim()
    headerMap.set(norm, key)
    headerMap.set(norm.replace(/\s/g, ''), key)
  }
}

function getKey(alias) {
  const n = String(alias || '').toLowerCase().replace(/\s+/g, ' ').trim()
  return headerMap.get(n) ?? headerMap.get(n.replace(/\s/g, '')) ?? alias
}

function getRaw(row, key) {
  const actualKey = getKey(key)
  const v = row[actualKey]
  return v === undefined || v === null ? '' : String(v).trim()
}

const columnAliases = {
  county: ['County'],
  courtType: ['Court Type', 'CourtType'],
  court: ['Court'],
  website: ['Website', 'Hyperlink'],
  prefix: ['Prefix'],
  firstName: ['First Name', 'FirstName'],
  middleName: ['Middle Name', 'MiddleName'],
  lastName: ['Last Name', 'LastName'],
  suffix: ['Suffix'],
  title: ['Title'],
  email: ['Email'],
  address: ['Address'],
  city: ['City'],
  zipCode: ['Zip Code', 'ZipCode'],
  phone: ['Phone']
}

function getFirst(row, aliases) {
  for (const a of aliases) {
    const v = getRaw(row, a)
    if (v !== undefined && v !== '') return v
  }
  return ''
}

const courts = rows.map((row) => ({
  county: getFirst(row, columnAliases.county),
  courtType: getFirst(row, columnAliases.courtType),
  court: getFirst(row, columnAliases.court),
  website: getFirst(row, columnAliases.website),
  prefix: getFirst(row, columnAliases.prefix),
  firstName: getFirst(row, columnAliases.firstName),
  middleName: getFirst(row, columnAliases.middleName),
  lastName: getFirst(row, columnAliases.lastName),
  suffix: getFirst(row, columnAliases.suffix),
  title: getFirst(row, columnAliases.title),
  email: getFirst(row, columnAliases.email),
  address: getFirst(row, columnAliases.address),
  city: getFirst(row, columnAliases.city),
  zipCode: getFirst(row, columnAliases.zipCode),
  phone: getFirst(row, columnAliases.phone)
}))

// Ensure data directory exists
const dataDir = path.dirname(outputPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

fs.writeFileSync(outputPath, JSON.stringify(courts, null, 2))
console.log(`Wrote ${courts.length} court rows from ${sheetName} to ${outputPath}`)

if (process.argv.includes('--inspect') && courts.length > 0) {
  console.log('\nFirst row sample:', JSON.stringify(courts[0], null, 2))
}
