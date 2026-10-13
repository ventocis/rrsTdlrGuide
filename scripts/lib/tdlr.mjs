/** Shared helpers for the TDLR data scripts. */
import fs from 'fs'
import path from 'path'

/** Minimal RFC4180 CSV parser — TDLR quotes fields containing commas. */
export function parseCsv(text) {
  const rows = []
  let row = [], field = '', inQ = false
  const s = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (inQ) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++ } else inQ = false
      } else field += c
    } else if (c === '"') inQ = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  const header = rows.shift().map((h) => h.trim())
  return rows
    .filter((r) => r.some((v) => v.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])))
}

export function toCsv(header, rows) {
  const esc = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [header.join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n') + '\n'
}

/** Newest snapshot directory, or an explicit --snapshot=<path>. */
export function resolveSnapshot(rootDir, argv) {
  const explicit = argv.find((a) => a.startsWith('--snapshot='))
  if (explicit) return explicit.slice('--snapshot='.length)
  const dir = path.join(rootDir, 'tdlr-source', 'snapshots')
  if (!fs.existsSync(dir)) throw new Error('No snapshots found. Run `npm run data:pull` first.')
  const dates = fs.readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort()
  if (!dates.length) throw new Error('No snapshots found. Run `npm run data:pull` first.')
  return path.join(dir, dates[dates.length - 1])
}

export function readSnapshot(snapDir, file) {
  const p = path.join(snapDir, file)
  if (!fs.existsSync(p)) throw new Error(`Missing ${file} in ${snapDir}. Re-run \`npm run data:pull\`.`)
  return parseCsv(fs.readFileSync(p, 'utf8'))
}

export const normPhone = (v) => (v || '').replace(/\D/g, '').replace(/^1(\d{10})$/, '$1')
export const normAddr = (r) =>
  `${(r['Address 1'] || '').toUpperCase().replace(/[^A-Z0-9]/g, '')}|${(r.Zip || '').slice(0, 5)}`
export const isCurrent = (r) => r['License Status'] === 'CURRENT'

/** Every licence the site claims, parent rows and duplicate brands alike. */
export function siteLicences(providers) {
  const m = new Map()
  for (const p of providers) {
    const l = (p.license || '').trim().toUpperCase()
    if (l) m.set(l, { name: p.name, id: p.id, role: 'parent' })
    for (const d of p.duplicates || []) {
      const dl = (d.license || '').trim().toUpperCase()
      if (dl) m.set(dl, { name: d.name || '', id: p.id, role: 'duplicate' })
    }
  }
  return m
}
