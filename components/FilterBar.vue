<script setup lang="ts">
import { useProviders } from '~/composables/useProviders'

const {
  formatFilter, certFilter, clearFilters, hasActiveFilters,
  toggleFormat, toggleCert, searchQuery,
  sortBy, sortDir, resultCount
} = useProviders()

// ── Shared filter options (desktop + drawer) ─────────────────────────
const formatOptions = [
  { key: 'all', label: 'All' },
  { key: 'online', label: 'Online' },
  { key: 'in-person', label: 'In-Person' },
  { key: 'both', label: 'Online / In-Person' }
] as const

const certOptions = [
  { key: 'all', label: 'All' },
  { key: 'free', label: 'Free' },
  { key: 'paid', label: 'Paid' },
  { key: 'mail', label: 'Mail' }
] as const

function isFormatActive(key: string) {
  if (key === 'all') return formatFilter.value.length === 0
  return formatFilter.value.includes(key)
}
function isCertActive(key: string) {
  if (key === 'all') return certFilter.value.length === 0
  return certFilter.value.includes(key.toLowerCase())
}

// ── Sort: computed two-way binding ───────────────────────────────────
const sortOptions = [
  { value: 'totalCost-asc', label: 'Total cost: Low → High' },
  { value: 'totalCost-desc', label: 'Total cost: High → Low' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'name-asc', label: 'Name: A–Z' },
]

/** Two-way binding for sort — used with v-model in the drawer radio buttons. */
const currentSort = computed({
  get: () => `${sortBy.value}-${sortDir.value}`,
  set: (val: string) => {
    const [col, dir] = val.split('-') as [any, any]
    sortBy.value = col
    sortDir.value = dir
  }
})

// ── Mobile drawer ────────────────────────────────────────────────────
const drawerOpen = ref(false)

function openDrawer() {
  drawerOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeDrawer() {
  drawerOpen.value = false
  document.body.style.overflow = ''
}

function clearAllFilters() {
  clearFilters()
  sortBy.value = 'totalCost'
  sortDir.value = 'asc'
}

// ── Active chip labels for collapsed mobile bar ──────────────────────
const activeChips = computed(() => {
  const chips: { label: string; clearFn: () => void }[] = []
  for (const f of formatFilter.value) {
    const opt = formatOptions.find((o) => o.key === f)
    if (opt) chips.push({ label: opt.label, clearFn: () => toggleFormat(f) })
  }
  for (const c of certFilter.value) {
    const label = c.charAt(0).toUpperCase() + c.slice(1) + ' cert'
    chips.push({ label, clearFn: () => toggleCert(c) })
  }
  return chips
})

// ── Sort label shown in result count bar ─────────────────────────────
const sortLabel = computed(() => {
  const s = sortBy.value
  const d = sortDir.value
  if (s === 'totalCost') return d === 'asc' ? 'Total: Low → High' : 'Total: High → Low'
  if (s === 'price') return d === 'asc' ? 'Price: Low → High' : 'Price: High → Low'
  if (s === 'name') return 'Name: A–Z'
  return ''
})
</script>

<template>
  <!-- ─── Desktop filter bar (hidden on mobile) ──────────────────────── -->
  <div class="hidden sm:block mx-auto w-full max-w-[1600px] px-2 pt-3.5 sm:px-5" style="background-color: var(--proto-page-bg);">
    <div
      class="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-none px-2 py-0 sm:px-5"
      style="background-color: var(--proto-page-bg);"
    >
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-1.5">
          <span class="text-[12px] font-semibold" style="color: var(--proto-label);">Format</span>
          <div class="inline-flex gap-1">
            <button
              v-for="f in formatOptions"
              :key="f.key"
              type="button"
              class="rounded-md border px-2.5 py-1 text-[12px] font-semibold transition-colors"
              :class="isFormatActive(f.key)
                ? 'border-[var(--proto-teal)] bg-[var(--proto-teal-bg)] text-[var(--proto-teal)]'
                : 'border-[var(--proto-card-border)] bg-white text-[var(--proto-text-muted)]'"
              @click="toggleFormat(f.key)"
            >
              {{ f.label }}
            </button>
          </div>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[12px] font-semibold" style="color: var(--proto-label);">Certificate</span>
          <div class="inline-flex gap-1">
            <button
              v-for="f in certOptions"
              :key="f.key"
              type="button"
              class="rounded-md border px-2.5 py-1 text-[12px] font-semibold transition-colors"
              :class="isCertActive(f.key)
                ? 'border-[var(--proto-teal)] bg-[var(--proto-teal-bg)] text-[var(--proto-teal)]'
                : 'border-[var(--proto-card-border)] bg-white text-[var(--proto-text-muted)]'"
              @click="toggleCert(f.key)"
            >
              {{ f.label }}
            </button>
          </div>
        </div>
      </div>

      <div class="relative min-w-[200px] flex-1 sm:max-w-[280px] sm:flex-none">
        <span class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" aria-hidden="true">
          <UIcon name="i-heroicons-magnifying-glass-20-solid" class="h-4 w-4" style="color: var(--proto-text-muted);" />
        </span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search providers or brands..."
          class="w-full rounded-lg border py-2 pl-10 pr-4 text-[13px] outline-none transition-colors placeholder:text-[var(--proto-text-muted)] focus:border-[var(--proto-teal)] focus:ring-2 focus:ring-[var(--proto-teal)]/30"
          style="border-color: var(--proto-card-border); background: white; color: var(--proto-text);"
          aria-label="Search providers or brands"
        />
      </div>

      <button
        v-if="hasActiveFilters"
        type="button"
        class="ml-auto px-2.5 py-1 text-[12px] font-semibold text-[#EF4444] transition-colors hover:opacity-80"
        @click="clearFilters"
      >
        Clear filters
      </button>
    </div>
  </div>

  <!-- ─── Mobile filter bar (hidden on desktop) ─────────────────────── -->
  <div class="sm:hidden sticky top-0 z-30 w-full" style="background-color: var(--proto-page-bg); box-shadow: 0 1px 0 var(--proto-card-border);">
    <div class="flex items-center gap-2 px-3 py-2.5">
      <!-- Search -->
      <div class="relative flex-1">
        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true">
          <UIcon name="i-heroicons-magnifying-glass-20-solid" class="h-4 w-4" style="color: var(--proto-text-muted);" />
        </span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search..."
          class="w-full rounded-lg border py-2 pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--proto-text-muted)] focus:border-[var(--proto-teal)]"
          style="border-color: var(--proto-card-border); background: white; color: var(--proto-text);"
          aria-label="Search providers"
        />
      </div>
      <!-- Filter & Sort button -->
      <button
        type="button"
        class="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors"
        :class="hasActiveFilters
          ? 'border-[var(--proto-teal)] bg-[var(--proto-teal-bg)] text-[var(--proto-teal)]'
          : 'border-[var(--proto-card-border)] bg-white'"
        style="color: var(--proto-text);"
        @click="openDrawer"
        aria-label="Open filter and sort drawer"
      >
        <UIcon name="i-heroicons-adjustments-horizontal-20-solid" class="h-4 w-4" />
        Filter & Sort
        <span
          v-if="hasActiveFilters"
          class="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style="background: var(--proto-teal);"
        >
          {{ (formatFilter.length + certFilter.length) }}
        </span>
      </button>
    </div>

    <!-- Active filter chips -->
    <div v-if="activeChips.length" class="flex flex-wrap gap-1.5 px-3 pb-2">
      <button
        v-for="chip in activeChips"
        :key="chip.label"
        type="button"
        class="flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
        style="background: var(--proto-teal-bg); border-color: var(--proto-teal); color: var(--proto-teal-dark);"
        @click="chip.clearFn"
      >
        {{ chip.label }}
        <span class="text-[12px] leading-none">×</span>
      </button>
    </div>

    <!-- Result count + sort label -->
    <div class="px-3 pb-2 text-[11px]" style="color: var(--proto-text-light);">
      {{ resultCount }} providers · {{ sortLabel }}
    </div>
  </div>

  <!-- ─── Mobile bottom sheet drawer ────────────────────────────────── -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="drawerOpen"
        class="fixed inset-0 z-40 bg-black/50 sm:hidden"
        aria-hidden="true"
        @click="closeDrawer"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-250 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="drawerOpen"
        class="fixed bottom-0 left-0 right-0 z-50 flex max-h-[85dvh] flex-col rounded-t-2xl bg-white sm:hidden"
        style="box-shadow: 0 -4px 24px rgba(0,0,0,0.15);"
        role="dialog"
        aria-modal="true"
        aria-label="Filter and sort options"
      >
        <!-- Drag handle -->
        <div class="flex justify-center pt-3 pb-1">
          <div class="h-1 w-10 rounded-full" style="background: var(--proto-card-border);" />
        </div>

        <!-- Drawer header -->
        <div class="flex items-center justify-between px-4 py-2">
          <span class="text-[15px] font-bold" style="color: var(--proto-text);">Filter &amp; Sort</span>
          <div class="flex items-center gap-3">
            <button
              v-if="hasActiveFilters"
              type="button"
              class="text-[13px] font-semibold"
              style="color: #EF4444;"
              @click="clearAllFilters"
            >
              Clear all
            </button>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-full"
              style="background: var(--proto-page-bg);"
              aria-label="Close"
              @click="closeDrawer"
            >
              <UIcon name="i-heroicons-x-mark-20-solid" class="h-4 w-4" style="color: var(--proto-text-muted);" />
            </button>
          </div>
        </div>

        <!-- Scrollable content -->
        <div class="flex-1 overflow-y-auto px-4 pb-2">

          <!-- Sort section -->
          <div class="mb-5">
            <p class="mb-2 text-[11px] font-bold uppercase tracking-wider" style="color: var(--proto-text-muted);">Sort by</p>
            <div class="flex flex-col gap-0">
              <label
                v-for="opt in sortOptions"
                :key="opt.value"
                class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 transition-colors"
                :style="currentSort === opt.value ? 'background: var(--proto-teal-bg);' : ''"
              >
                <input
                  type="radio"
                  :value="opt.value"
                  v-model="currentSort"
                  class="accent-[var(--proto-teal)] h-4 w-4 shrink-0"
                />
                <span
                  class="text-[14px]"
                  :style="currentSort === opt.value ? 'color: var(--proto-teal-dark); font-weight: 600;' : 'color: var(--proto-text);'"
                >
                  {{ opt.label }}
                </span>
              </label>
            </div>
          </div>

          <!-- Format section -->
          <div class="mb-5">
            <p class="mb-2 text-[11px] font-bold uppercase tracking-wider" style="color: var(--proto-text-muted);">Format</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="f in formatOptions"
                :key="f.key"
                type="button"
                class="rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors"
                :class="isFormatActive(f.key)
                  ? 'border-[var(--proto-teal)] bg-[var(--proto-teal-bg)] text-[var(--proto-teal)]'
                  : 'border-[var(--proto-card-border)] bg-white text-[var(--proto-text-muted)]'"
                @click="toggleFormat(f.key)"
              >
                {{ f.label }}
              </button>
            </div>
          </div>

          <!-- Certificate section -->
          <div class="mb-4">
            <p class="mb-2 text-[11px] font-bold uppercase tracking-wider" style="color: var(--proto-text-muted);">Certificate delivery</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="f in certOptions"
                :key="f.key"
                type="button"
                class="rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors"
                :class="isCertActive(f.key)
                  ? 'border-[var(--proto-teal)] bg-[var(--proto-teal-bg)] text-[var(--proto-teal)]'
                  : 'border-[var(--proto-card-border)] bg-white text-[var(--proto-text-muted)]'"
                @click="toggleCert(f.key)"
              >
                {{ f.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Done button (sticky at bottom) -->
        <div class="px-4 pb-6 pt-3" style="border-top: 1px solid var(--proto-card-border);">
          <button
            type="button"
            class="w-full rounded-xl py-3.5 text-[15px] font-bold text-white transition-opacity active:opacity-90"
            style="background: var(--proto-header-from);"
            @click="closeDrawer"
          >
            Show {{ resultCount }} results
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
