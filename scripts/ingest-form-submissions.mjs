#!/usr/bin/env node
/**
 * Fetches Formspree submissions and writes data/student-responses.json.
 *
 * Requires: FORMSPREE_API_TOKEN in env (API key from Formspree form settings).
 * Form hash id is taken from FORM_ID or defaults to maqpolpb (from form URL f/maqpolpb).
 *
 * Run before generate: FORMSPREE_API_TOKEN=xxx node scripts/ingest-form-submissions.mjs
 * Or: npm run ingest:reviews (add script to package.json)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.join(__dirname, '..', 'data', 'student-responses.json')

const FORM_ID = process.env.FORM_ID || 'maqpolpb'
const API_TOKEN = process.env.FORMSPREE_API_TOKEN

function parseNum(v) {
  if (v === '' || v == null) return undefined
  if (typeof v === 'number') return Number.isNaN(v) ? undefined : v
  const n = parseFloat(String(v).replace(/[$,]/g, ''))
  return Number.isNaN(n) ? undefined : n
}

function mapCert(v) {
  if (!v || typeof v !== 'string') return undefined
  const s = v.trim().toLowerCase()
  if (s === 'free' || s.includes('included')) return 'Free'
  if (s === 'paid') return 'Paid'
  if (s === 'mail') return 'Mail'
  return undefined
}

function toStudentResponse(sub, index) {
  const d = sub.data || sub
  const createdAt = sub.created_at || sub.createdAt || ''
  const providerOrCourse =
    d.provider_or_course?.trim() ||
    d.provider_name?.trim() ||
    ''
  const providerLicense =
    d.provider_license?.trim() || d.course_license_cp?.trim() || undefined
  return {
    id: sub.id ? String(sub.id) : `sr-${index}`,
    firstName: d.first_name?.trim() || '',
    lastName: d.last_name?.trim() || '',
    providerOrCourse,
    providerLicense: providerLicense || undefined,
    totalPaid: parseNum(d.total_price_paid),
    rating: Math.min(5, Math.max(1, parseInt(d.rating, 10) || 0)),
    notes: d.notes?.trim() || undefined,
    submittedAt: createdAt || undefined,
    licenseCp: d.license_cp?.trim() || undefined,
    format: d.format?.trim() || undefined,
    language: d.language?.trim() || undefined,
    instantCert: mapCert(d.cert)
  }
}

async function main() {
  if (!API_TOKEN) {
    console.error('Set FORMSPREE_API_TOKEN to fetch submissions.')
    process.exit(1)
  }

  const url = `https://formspree.io/api/0/forms/${FORM_ID}/submissions?limit=1000&order=desc`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  })

  if (!res.ok) {
    console.error(`Formspree API error: ${res.status} ${res.statusText}`)
    process.exit(1)
  }

  const json = await res.json()
  const submissions = json.submissions || []
  const out = submissions.map((s, i) => toStudentResponse(s, i))

  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2))
  console.log(`Wrote ${out.length} student responses to ${outputPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
