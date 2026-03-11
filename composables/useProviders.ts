import providersRaw from '~/data/providers.json'
import { computed, ref } from 'vue'

export type DuplicateBrand = {
  name: string
  url: string
  license?: string
  rating?: number
}

export type Provider = {
  id: number
  name: string
  license?: string
  website?: string
  duplicates: DuplicateBrand[]
  rating: number
  price: number
  priceDisplay: string
  stateFee: number
  stateFeeDisplay: string
  totalCost: number
  totalCostDisplay: string
  online: boolean
  inPerson: boolean
  languages: string[]
  instantCert: 'Free' | 'Paid' | 'Mail'
  lastVerified?: string
  featured?: boolean
}

type SortKey = 'rating' | 'price' | 'totalCost' | 'name'
type SortDir = 'asc' | 'desc'

// Mark our overall pick (Road Ready Safety) as featured
const baseProviders = (providersRaw as Provider[]).map((p) => ({
  ...p,
  featured: p.name === 'Road Ready Safety' ? true : p.featured
}))

// Shared reactive state (single source of truth across components)
const sortBy = ref<SortKey>('rating')
const sortDir = ref<SortDir>('desc')
const searchQuery = ref('')
/** Multi-select: empty = All (no filter). Otherwise show providers matching ANY selected format. */
const formatFilter = ref<string[]>([])
/** Multi-select: empty = All. Otherwise show providers matching ANY selected cert type. */
const certFilter = ref<string[]>([])
const expandedRows = ref<Record<number, boolean>>({})

const totalProviders = baseProviders.length

const totalBrands = computed(() =>
  baseProviders.reduce((sum, p) => sum + 1 + (p.duplicates?.length || 0), 0)
)

const hasActiveFilters = computed(
  () => formatFilter.value.length > 0 || certFilter.value.length > 0
)

const filtered = computed(() => {
    return baseProviders.filter((p) => {
      // Format: empty = show all. Else include if provider matches ANY selected format.
      if (formatFilter.value.length > 0) {
        const matchFormat =
          (formatFilter.value.includes('online') && p.online) ||
          (formatFilter.value.includes('in-person') && p.inPerson) ||
          (formatFilter.value.includes('both') && p.online && p.inPerson)
        if (!matchFormat) return false
      }

      // Certificate: empty = show all. Else include if provider's cert is in selected set.
      if (certFilter.value.length > 0) {
        const cert = p.instantCert.toLowerCase()
        if (!certFilter.value.includes(cert)) return false
      }

      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        if (p.name.toLowerCase().includes(q)) return true
        if (p.license && p.license.toLowerCase().includes(q)) return true
        if (
          p.duplicates?.some((d) => d.name.toLowerCase().includes(q))
        ) {
          return true
        }
        return false
      }

      return true
    })
  })

const providers = computed(() => {
    const arr = [...filtered.value]
    const dir = sortDir.value === 'asc' ? 1 : -1

    arr.sort((a, b) => {
      // Always keep featured provider(s) at the top
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1

      if (sortBy.value === 'rating') return (a.rating - b.rating) * dir
      if (sortBy.value === 'price') {
        return (a.price - b.price) * dir
      }
      if (sortBy.value === 'totalCost') {
        return (a.totalCost - b.totalCost) * dir
      }
      if (sortBy.value === 'name') {
        return a.name.localeCompare(b.name) * dir
      }
      return 0
    })

    return arr
  })

const resultCount = computed(() => providers.value.length)

function toggleSort(col: SortKey) {
    if (sortBy.value === col) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = col
      sortDir.value = col === 'name' ? 'asc' : 'asc'
    }
  }

function toggleExpand(id: number) {
    expandedRows.value = {
      ...expandedRows.value,
      [id]: !expandedRows.value[id]
    }
  }

function clearFilters() {
    formatFilter.value = []
    certFilter.value = []
  }

/** Toggle a format filter. "all" clears selection; others add/remove from set. */
function toggleFormat(key: string) {
    if (key === 'all') {
      formatFilter.value = []
      return
    }
    const next = [...formatFilter.value]
    const idx = next.indexOf(key)
    if (idx >= 0) next.splice(idx, 1)
    else next.push(key)
    formatFilter.value = next
  }

/** Toggle a certificate filter. "all" clears selection; others add/remove. */
function toggleCert(key: string) {
    if (key === 'all') {
      certFilter.value = []
      return
    }
    const k = key.toLowerCase()
    const next = [...certFilter.value]
    const idx = next.indexOf(k)
    if (idx >= 0) next.splice(idx, 1)
    else next.push(k)
    certFilter.value = next
  }

export function useProviders() {
  return {
    providers,
    totalProviders,
    totalBrands,
    resultCount,
    sortBy,
    sortDir,
    searchQuery,
    formatFilter,
    certFilter,
    expandedRows,
    toggleSort,
    toggleExpand,
    clearFilters,
    hasActiveFilters,
    toggleFormat,
    toggleCert
  }
}
