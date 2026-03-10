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
  'sticky top-0 z-10 bg-white border-b-2 border-slate-200 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 whitespace-nowrap select-none cursor-pointer px-3 py-3'

function headerClasses(col: string) {
  return [
    thBase,
    col === 'provider' ? 'text-left min-w-[220px]' : '',
    ['rating', 'price', 'fee', 'total', 'cert', 'format', 'lang', 'mb'].includes(
      col
    )
      ? 'text-center'
      : ''
  ]
}

function sortArrow(col: string) {
  const active = sortBy === col
  return active ? (sortDir === 'asc' ? '▲' : '▼') : '▼'
}
</script>

<template>
  <div class="mx-auto mb-16 mt-3 max-w-5xl px-5">
    <div
      class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="min-w-[860px] w-full border-collapse">
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
                @click="toggleSort('price')"
              >
                <span class="inline-flex items-center justify-center">
                  Total Cost
                  <span
                    class="ml-1 text-[10px]"
                    :class="sortBy === 'price' ? 'opacity-100' : 'opacity-25'"
                  >
                    {{ sortArrow('price') }}
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
              <th :class="headerClasses('mb')">
                Money-Back
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
    </div>

    <div
      v-if="providers.length === 0"
      class="py-12 text-center text-slate-500"
    >
      <div class="mb-2 text-3xl">🔍</div>
      <p class="text-[15px] font-semibold">
        No providers match your filters
      </p>
    </div>

    <div
      class="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-slate-400"
    >
      <span>
        Showing {{ resultCount }} of {{ totalProviders }} providers · Duplicate
        brands grouped under parent company
      </span>
      <span>
        Data sourced from TDLR public records ·
        <button
          type="button"
          class="font-semibold text-teal-600 hover:text-teal-700"
        >
          Submit a correction →
        </button>
      </span>
    </div>
  </div>
</template>
