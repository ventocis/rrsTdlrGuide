import providersRaw from '~/data/providers.json'
import { computed, ref } from 'vue'

export type DuplicateBrand = {
  name: string
  url: string
}

export type Provider = {
  id: number
  name: string
  duplicates: DuplicateBrand[]
  rating: number
  reviewCount?: number
  price: number
  stateFee: number
  online: boolean
  inPerson: boolean
  languages: string[]
  instantCert: 'Free' | 'Paid' | 'Mail'
  moneyBack: boolean
  lastVerified: string
  featured?: boolean
}

type SortKey = 'rating' | 'price' | 'reviews' | 'name'
type SortDir = 'asc' | 'desc'

const baseProviders = providersRaw as Provider[]

export function useProviders() {
  const sortBy = ref<SortKey>('rating')
  const sortDir = ref<SortDir>('desc')
  const searchQuery = ref('')
  const formatFilter = ref<'all' | 'online' | 'in-person' | 'both'>('all')
  const certFilter = ref<'all' | 'free' | 'paid' | 'mail'>('all')
  const expandedRows = ref<Record<number, boolean>>({})

  const totalProviders = baseProviders.length

  const totalBrands = computed(() =>
    baseProviders.reduce((sum, p) => sum + 1 + (p.duplicates?.length || 0), 0)
  )

  const hasActiveFilters = computed(
    () => formatFilter.value !== 'all' || certFilter.value !== 'all'
  )

  const filtered = computed(() => {
    return baseProviders.filter((p) => {
      if (formatFilter.value === 'online' && !p.online) return false
      if (formatFilter.value === 'in-person' && !p.inPerson) return false
      if (formatFilter.value === 'both' && !(p.online && p.inPerson)) return false

      if (
        certFilter.value !== 'all' &&
        p.instantCert.toLowerCase() !== certFilter.value
      ) {
        return false
      }

      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        if (p.name.toLowerCase().includes(q)) return true
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
      if (sortBy.value === 'rating') return (a.rating - b.rating) * dir
      if (sortBy.value === 'price') {
        const ta = a.price + a.stateFee
        const tb = b.price + b.stateFee
        return (ta - tb) * dir
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
      sortDir.value = col === 'price' ? 'asc' : 'desc'
    }
  }

  function toggleExpand(id: number) {
    expandedRows.value = {
      ...expandedRows.value,
      [id]: !expandedRows.value[id]
    }
  }

  function clearFilters() {
    formatFilter.value = 'all'
    certFilter.value = 'all'
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
    hasActiveFilters
  }
}
