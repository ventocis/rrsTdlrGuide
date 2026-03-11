<script setup lang="ts">
import { useProviders } from '~/composables/useProviders'

const {
  providers,
  sortBy,
  sortDir,
  toggleSort,
  expandedRows,
  toggleExpand,
  resultCount,
  totalProviders
} = useProviders()

const thBase =
  'sticky top-0 z-10 border-b-2 bg-white px-3 py-3 text-[11px] font-bold uppercase tracking-[0.05em] whitespace-nowrap select-none cursor-pointer'
  + ' border-[var(--proto-card-border)] text-[var(--proto-label)]'

function headerClasses(col: string) {
  return [
    thBase,
    col === 'provider' ? 'text-left min-w-[220px]' : '',
    ['license', 'rating', 'price', 'fee', 'total', 'cert', 'format', 'lang'].includes(col)
      ? 'text-center'
      : ''
  ]
}
function sortArrow(col: string) {
  const active = sortBy.value === col
  return active ? (sortDir.value === 'asc' ? '▲' : '▼') : '▼'
}
</script>

<template>
  <div class="mx-auto mb-16 mt-3.5 w-full max-w-[1600px] px-2 sm:px-5">
    <div
      class="w-full min-w-0 overflow-x-auto rounded-xl border bg-white shadow-sm"
      style="border-color: var(--proto-card-border); box-shadow: 0 1px 3px rgba(0,0,0,0.04); -webkit-overflow-scrolling: touch; overflow-x: scroll;"
    >
      <table class="w-full border-collapse" style="min-width: 880px; width: max(100%, 880px);">
          <thead>
            <tr>
              <th
                :class="headerClasses('provider')"
                @click="toggleSort('name')"
              >
                <span class="inline-flex items-center">
                  Provider
                  <span
                    class="ml-1 text-[10px]"
                    :class="sortBy === 'name' ? 'opacity-100' : 'opacity-25'"
                  >
                    {{ sortArrow('name') }}
                  </span>
                </span>
              </th>
              <th :class="headerClasses('license')">
                License
              </th>
              <th
                :class="headerClasses('rating')"
                @click="toggleSort('rating')"
              >
                <span class="inline-flex items-center justify-center">
                  Rating
                  <span
                    class="ml-1 text-[10px]"
                    :class="sortBy === 'rating' ? 'opacity-100' : 'opacity-25'"
                  >
                    {{ sortArrow('rating') }}
                  </span>
                </span>
              </th>
              <th
                :class="headerClasses('price')"
                @click="toggleSort('price')"
              >
                <span class="inline-flex items-center justify-center">
                  Price
                  <span
                    class="ml-1 text-[10px]"
                    :class="sortBy === 'price' ? 'opacity-100' : 'opacity-25'"
                  >
                    {{ sortArrow('price') }}
                  </span>
                </span>
              </th>
              <th :class="headerClasses('fee')">
                Fee
              </th>
              <th
                :class="headerClasses('total')"
                @click="toggleSort('totalCost')"
              >
                <span class="inline-flex items-center justify-center">
                  Total Cost
                  <span
                    class="ml-1 text-[10px]"
                    :class="sortBy === 'totalCost' ? 'opacity-100' : 'opacity-25'"
                  >
                    {{ sortArrow('totalCost') }}
                  </span>
                </span>
              </th>
              <th :class="headerClasses('cert')">
                Instant Cert
              </th>
              <th :class="headerClasses('format')">
                Format
              </th>
              <th :class="headerClasses('lang')">
                Language
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="p in providers" :key="p.id">
              <ProviderRow
                :provider="p"
                :is-expanded="!!expandedRows[p.id]"
                @toggle="toggleExpand(p.id)"
              />
              <template v-if="expandedRows[p.id] && p.duplicates?.length">
                <DuplicateRow
                  v-for="(d, i) in p.duplicates"
                  :key="`${p.id}-${i}`"
                  :dupe="d"
                  :parent="p"
                />
              </template>
            </template>
          </tbody>
        </table>
    </div>
    <p class="mt-1.5 text-center text-[11px] sm:hidden" style="color: var(--proto-text-light);">
      Scroll horizontally to see all columns
    </p>

    <div
      v-if="providers.length === 0"
      class="py-12 text-center text-[15px] font-semibold"
      style="color: var(--proto-text-muted); padding: 48px 20px;"
    >
      <div class="mb-2 text-3xl">🔍</div>
      <p>No providers match your filters</p>
    </div>

    <div
      class="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px]"
      style="color: var(--proto-text-light);"
    >
      <span>
        Showing {{ resultCount }} of {{ totalProviders }} providers · Duplicate
        brands grouped under parent company
      </span>
      <span>
        Data sourced from TDLR public records and available websites found at time of search ·
        <NuxtLink
          to="/submit-review"
          target="_blank"
          rel="noopener noreferrer"
          class="font-semibold hover:opacity-90"
          style="color: var(--proto-teal);"
        >
          Submit a correction by filling out form →
        </NuxtLink>
      </span>
    </div>
  </div>
</template>
