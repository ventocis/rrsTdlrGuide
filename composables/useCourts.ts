import courtsRaw from '~/data/courts.json'

export type CourtRow = {
  county: string
  courtType: string
  court: string
  website: string
  prefix: string
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  title: string
  email: string
  address: string
  city: string
  zipCode: string
  phone: string
}

export type CourtRecord = CourtRow & {
  judgeName: string
}

function buildJudgeName(row: CourtRow): string {
  const parts = [
    row.prefix,
    row.firstName,
    row.middleName,
    row.lastName,
    row.suffix
  ].filter((s) => s != null && String(s).trim() !== '')
  return parts.map((s) => String(s).trim()).join(' ').trim()
}

const rows = (courtsRaw as CourtRow[]).map((row) => ({
  ...row,
  judgeName: buildJudgeName(row)
})) as CourtRecord[]

/** Deduplicate by (County, Court Type, Court). First row per combo is kept. */
const seen = new Set<string>()
const courtOptions: { label: string; value: CourtRecord }[] = []

for (const row of rows) {
  const key = `${row.county}|${row.courtType}|${row.court}`
  if (seen.has(key)) continue
  seen.add(key)
  const label = `${row.county} — ${row.courtType} — ${row.court}`
  courtOptions.push({ label, value: row })
}

export function useCourts() {
  return {
    /** Options for eligibility dropdown: deduplicated by County + Court Type + Court; label = "County — Court Type — Court". */
    courtOptions,
    /** All rows (one per judge) for court-outreach table. */
    allCourtsRows: rows,
    /** Unique court count (for summary stat). */
    uniqueCourtCount: courtOptions.length,
    /** Count of unique courts that have at least one row with non-empty email. */
    uniqueCourtsWithEmailCount: (() => {
      const keysWithEmail = new Set<string>()
      for (const row of rows) {
        if (row.email != null && String(row.email).trim() !== '') {
          keysWithEmail.add(`${row.county}|${row.courtType}|${row.court}`)
        }
      }
      return keysWithEmail.size
    })()
  }
}
