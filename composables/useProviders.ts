import providersRaw from '~/data/providers.json'
import { computed } from 'vue'

export type DuplicateBrand = {
  name: string
  url: string
  license?: string
}

export type Provider = {
  id: number
  name: string
  license?: string
  website?: string
  duplicates: DuplicateBrand[]
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

type SortKey = 'price' | 'totalCost' | 'name'
type SortDir = 'asc' | 'desc'

const baseProviders = providersRaw as Provider[]
const totalProviders = baseProviders.length

export function useProviders() {
  // useState ensures server and client start with identical state, preventing
  // hydration mismatches caused by module-level refs being cached across SSR requests.
  const sortBy = useState<SortKey>('providers-sortBy', () => 'totalCost')
  const sortDir = useState<SortDir>('providers-sortDir', () => 'desc')
  const searchQuery = useState<string>('providers-searchQuery', () => '')
  const formatFilter = useState<string[]>('providers-formatFilter', () => [])
  const certFilter = useState<string[]>('providers-certFilter', () => [])
  const expandedRows = useState<Record<number, boolean>>('providers-expandedRows', () => ({}))

  const totalBrands = computed(() =>
    baseProviders.reduce((sum, p) => sum + 1 + (p.duplicates?.length || 0), 0)
  )

  const hasActiveFilters = computed(
    () => formatFilter.value.length > 0 || certFilter.value.length > 0
  )

  const filtered = computed(() => {
    return baseProviders.filter((p) => {
      if (formatFilter.value.length > 0) {
        const matchFormat =
          (formatFilter.value.includes('online') && p.online) ||
          (formatFilter.value.includes('in-person') && p.inPerson) ||
          (formatFilter.value.includes('both') && p.online && p.inPerson)
        if (!matchFormat) return false
      }

      if (certFilter.value.length > 0) {
        const cert = p.instantCert.toLowerCase()
        if (!certFilter.value.includes(cert)) return false
      }

      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        if (p.name.toLowerCase().includes(q)) return true
        if (p.license && p.license.toLowerCase().includes(q)) return true
        if (p.duplicates?.some((d) => d.name.toLowerCase().includes(q))) return true
        return false
      }

      return true
    })
  })

  const providers = computed(() => {
    const arr = [...filtered.value]
    const dir = sortDir.value === 'asc' ? 1 : -1

    arr.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1

      if (sortBy.value === 'price') return (a.price - b.price) * dir
      if (sortBy.value === 'totalCost') return (a.totalCost - b.totalCost) * dir
      if (sortBy.value === 'name') return a.name.localeCompare(b.name) * dir
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
      // Name sorts ascending by default; cost sorts descending (highest first)
      sortDir.value = col === 'name' ? 'asc' : 'desc'
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
