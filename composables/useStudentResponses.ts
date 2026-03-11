import studentResponsesRaw from '~/data/student-responses.json'
import { computed, ref } from 'vue'

export type StudentResponse = {
  id?: string
  firstName: string
  lastName: string
  providerOrCourse: string
  providerLicense?: string
  totalPaid?: number | string
  rating: number
  notes?: string
  submittedAt?: string
  licenseCp?: string
  format?: string
  language?: string
  instantCert?: 'Free' | 'Paid' | 'Mail'
}

type SortKey = 'rating' | 'provider' | 'date'
type SortDir = 'asc' | 'desc'

const raw = (studentResponsesRaw as StudentResponse[]).map((r, i) => ({
  ...r,
  id: r.id ?? `sr-${i}`
}))

const sortBy = ref<SortKey>('date')
const sortDir = ref<SortDir>('desc')
const searchQuery = ref('')

const filtered = computed(() => {
  const list = [...raw]
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    return list.filter(
      (r) =>
        r.providerOrCourse.toLowerCase().includes(q) ||
        r.firstName.toLowerCase().includes(q) ||
        r.lastName.toLowerCase().includes(q) ||
        (r.licenseCp && r.licenseCp.toLowerCase().includes(q))
    )
  }
  return list
})

const studentResponses = computed(() => {
  const arr = [...filtered.value]
  const dir = sortDir.value === 'asc' ? 1 : -1
  arr.sort((a, b) => {
    if (sortBy.value === 'rating') return (a.rating - b.rating) * dir
    if (sortBy.value === 'provider') return a.providerOrCourse.localeCompare(b.providerOrCourse) * dir
    if (sortBy.value === 'date') {
      const da = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
      const db = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
      return (da - db) * dir
    }
    return 0
  })
  return arr
})

const resultCount = computed(() => studentResponses.value.length)

function toggleSort(col: SortKey) {
  if (sortBy.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = col
    sortDir.value = col === 'provider' ? 'asc' : 'desc'
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function providerSlug(providerOrCourse: string): string {
  return slugify(providerOrCourse)
}

function getReviewsForProvider(providerOrCourse: string): StudentResponse[] {
  const slug = slugify(providerOrCourse)
  return raw.filter((r) => slugify(r.providerOrCourse) === slug)
}

function getUniqueProviders(): { name: string; slug: string }[] {
  const seen = new Set<string>()
  const out: { name: string; slug: string }[] = []
  for (const r of raw) {
    const s = slugify(r.providerOrCourse)
    if (!seen.has(s)) {
      seen.add(s)
      out.push({ name: r.providerOrCourse, slug: s })
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}

export function useStudentResponses() {
  return {
    studentResponses,
    resultCount,
    sortBy,
    sortDir,
    searchQuery,
    toggleSort,
    providerSlug,
    getReviewsForProvider,
    getUniqueProviders
  }
}
