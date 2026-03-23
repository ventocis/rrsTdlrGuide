<script setup lang="ts">
import { useProviders } from '~/composables/useProviders'
import type { Provider } from '~/composables/useProviders'

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

const INITIAL_LIMIT = 25
const showAll = ref(false)

// Reset to first 25 whenever the filtered list changes (new filter/search applied)
watch(resultCount, () => { showAll.value = false })

const visibleProviders = computed(() =>
  showAll.value ? providers.value : providers.value.slice(0, INITIAL_LIMIT)
)

const thBase =
  'sticky top-0 z-10 border-b-2 bg-white px-3 py-3 text-[11px] font-bold uppercase tracking-[0.05em] whitespace-nowrap select-none cursor-pointer'
  + ' border-[var(--proto-card-border)] text-[var(--proto-label)]'

function headerClasses(col: string) {
  return [
    thBase,
    col === 'provider' ? 'text-left min-w-[220px]' : '',
    ['license', 'price', 'fee', 'total', 'cert', 'format', 'lang'].includes(col)
      ? 'text-center'
      : ''
  ]
}
function sortArrow(col: string) {
  const active = sortBy.value === col
  return active ? (sortDir.value === 'asc' ? '▲' : '▼') : '▼'
}

// ── Mobile card helpers ──────────────────────────────────────────────
function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function isValidUrl(url?: string): boolean {
  if (!url) return false
  const t = url.trim().toLowerCase()
  if (!t || t === 'not found' || t === 'n/a') return false
  return true
}

function openProviderWebsite(p: Provider) {
  if (!p.website) return
  let u = p.website.trim()
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', 'provider_click', {
      provider_name: p.name,
      provider_slug: slugify(p.name),
      destination_url: u
    })
  }
  window.open(u, '_blank', 'noopener,noreferrer')
}

function formatLabel(p: Provider): string {
  if (p.online && p.inPerson) return 'Online / In-Person'
  if (p.inPerson) return 'In-Person'
  return 'Online'
}

function langLabel(langs: string[]): string {
  if (langs.length === 2 && langs.includes('English') && langs.includes('Spanish')) return 'Eng / Español'
  return langs.join(', ')
}

function certPillStyle(cert: string): string {
  if (cert === 'Free') return 'background:var(--pill-cert-free-bg);color:var(--pill-cert-free-text);border:1px solid var(--pill-cert-free-border)'
  if (cert === 'Paid') return 'background:var(--pill-cert-paid-bg);color:var(--pill-cert-paid-text);border:1px solid var(--pill-cert-paid-border)'
  return 'background:var(--pill-cert-mail-bg);color:var(--pill-cert-mail-text);border:1px solid var(--pill-cert-mail-border)'
}

function formatPillStyle(p: Provider): string {
  if (p.online && p.inPerson) return 'background:var(--pill-format-both-bg);color:var(--pill-format-both-text);border:1px solid var(--pill-format-both-border)'
  if (p.inPerson) return 'background:var(--pill-format-inperson-bg);color:var(--pill-format-inperson-text);border:1px solid var(--pill-format-inperson-border)'
  return 'background:var(--pill-format-online-bg);color:var(--pill-format-online-text);border:1px solid var(--pill-format-online-border)'
}

function langPillStyle(langs: string[]): string {
  if (langs.includes('English') && langs.includes('Spanish')) return 'background:var(--pill-lang-engspanish-bg);color:var(--pill-lang-engspanish-text);border:1px solid var(--pill-lang-engspanish-border)'
  if (langs.includes('Spanish') && langs.length === 1) return 'background:var(--pill-lang-spanish-bg);color:var(--pill-lang-spanish-text);border:1px solid var(--pill-lang-spanish-border)'
  if (langs.includes('English') && langs.length === 1) return 'background:var(--pill-lang-english-bg);color:var(--pill-lang-english-text);border:1px solid var(--pill-lang-english-border)'
  return 'background:var(--pill-lang-other-bg);color:var(--pill-lang-other-text);border:1px solid var(--pill-lang-other-border)'
}
</script>

<template>
  <div class="mx-auto mb-16 mt-3.5 w-full max-w-[1600px] px-2 sm:px-5">

    <!-- ─── Desktop table (hidden on mobile) ─────────────────────────── -->
    <div
      class="hidden sm:block w-full min-w-0 max-w-full overflow-x-auto overflow-y-visible rounded-xl border bg-white shadow-sm"
      style="border-color: var(--proto-card-border); box-shadow: 0 1px 3px rgba(0,0,0,0.04); -webkit-overflow-scrolling: touch;"
    >
      <div style="display: block; width: 100%; min-width: 880px;">
        <table class="w-full border-collapse" style="min-width: 880px;">
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
            <template v-for="p in visibleProviders" :key="p.id">
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

    <!-- ─── Mobile card stack (hidden on desktop) ─────────────────────── -->
    <div class="flex flex-col gap-3 sm:hidden">
      <div
        v-for="p in visibleProviders"
        :key="p.id"
        class="rounded-xl border bg-white shadow-sm overflow-hidden"
        :style="expandedRows[p.id] && p.duplicates?.length
          ? 'border-color: var(--proto-teal);'
          : 'border-color: var(--proto-card-border);'"
      >
        <!-- ── Card body (tappable to open website) ── -->
        <div
          class="px-4 py-3.5"
          :class="(p.website && isValidUrl(p.website)) ? 'cursor-pointer active:opacity-80' : ''"
          @click="p.website && isValidUrl(p.website) && openProviderWebsite(p)"
        >
          <!-- Name + license + total cost -->
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="truncate text-[14px] font-semibold leading-tight" style="color: var(--proto-text);">
                {{ p.name }}
              </p>
              <p v-if="p.license" class="mt-0.5 text-[11px]" style="color: var(--proto-text-light);">
                {{ p.license }}
              </p>
            </div>
            <div class="shrink-0 text-right">
              <p
                v-if="p.totalCostDisplay && p.totalCostDisplay.toString().trim().toLowerCase() !== 'not found'"
                class="text-[20px] font-extrabold leading-tight"
                style="color: var(--proto-text);"
              >
                ${{ p.totalCost.toFixed(0) }}
              </p>
              <p v-else class="text-[18px] font-bold leading-tight" style="color: var(--proto-text-light);">—</p>
              <p class="text-[10px] font-medium uppercase tracking-wide" style="color: var(--proto-text-light);">total</p>
            </div>
          </div>

          <!-- Pills -->
          <div class="mt-2.5 flex flex-wrap gap-1.5">
            <span class="rounded-full px-2 py-0.5 text-[11px] font-semibold" :style="certPillStyle(p.instantCert)">
              {{ (p.instantCert === 'Free' || p.instantCert === 'Paid') ? 'Instant Cert' : 'Cert' }}: {{ p.instantCert }}
            </span>
            <span v-if="p.online || p.inPerson" class="rounded-full px-2 py-0.5 text-[11px] font-semibold" :style="formatPillStyle(p)">
              {{ formatLabel(p) }}
            </span>
            <span v-if="p.languages?.length" class="rounded-full px-2 py-0.5 text-[11px] font-semibold" :style="langPillStyle(p.languages)">
              {{ langLabel(p.languages) }}
            </span>
          </div>

          <!-- Price breakdown footnote -->
          <p
            v-if="p.priceDisplay && p.priceDisplay.toString().trim().toLowerCase() !== 'not found'"
            class="mt-2 text-[11px]"
            style="color: var(--proto-text-light);"
          >
            Course ${{ p.price.toFixed(0) }}
            <template v-if="p.stateFeeDisplay && p.stateFeeDisplay.toString().trim().toLowerCase() !== 'not found'">
              · Cert ${{ p.stateFee.toFixed(0) }}
            </template>
          </p>

          <!-- Footer row: visit hint -->
          <div v-if="isValidUrl(p.website)" class="mt-2.5 flex items-center justify-end">
            <span class="text-[11px]" style="color: var(--proto-text-light);">
              Tap to visit ↗
            </span>
          </div>
        </div>

        <!-- ── Duplicate brand expander ── -->
        <div v-if="p.duplicates?.length">
          <!-- Toggle row -->
          <button
            type="button"
            class="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors"
            :style="expandedRows[p.id]
              ? 'background: var(--proto-teal-bg); border-top: 1px solid var(--proto-teal);'
              : 'background: var(--proto-page-bg); border-top: 1px solid var(--proto-card-border);'"
            @click="toggleExpand(p.id)"
          >
            <span class="text-[11px] font-semibold" :style="expandedRows[p.id] ? 'color: var(--proto-teal-dark)' : 'color: var(--proto-text-muted)'">
              Same company · {{ p.duplicates.length }} more brand{{ p.duplicates.length === 1 ? '' : 's' }}
            </span>
            <span class="text-[12px]" :style="expandedRows[p.id] ? 'color: var(--proto-teal)' : 'color: var(--proto-text-light)'">
              {{ expandedRows[p.id] ? 'Hide ↑' : 'Show ↓' }}
            </span>
          </button>

          <!-- Expanded duplicate list -->
          <div v-if="expandedRows[p.id]" style="background: var(--proto-teal-bg);">
            <div
              v-for="(d, i) in p.duplicates"
              :key="i"
              class="flex items-center justify-between px-4 py-2.5"
              :style="i < p.duplicates.length - 1 ? 'border-bottom: 1px solid var(--proto-teal-border);' : ''"
            >
              <div class="min-w-0">
                <p class="truncate text-[13px] font-medium" style="color: var(--proto-text);">
                  {{ d.name }}
                </p>
                <p v-if="d.license" class="text-[10px]" style="color: var(--proto-text-light);">
                  {{ d.license }} · Same brand as parent
                </p>
              </div>
              <a
                v-if="isValidUrl(d.url)"
                :href="d.url.startsWith('http') ? d.url : `https://${d.url}`"
                target="_blank"
                rel="noopener noreferrer"
                class="ml-3 shrink-0 text-[11px] font-semibold"
                style="color: var(--proto-teal);"
                @click.stop
              >
                Visit ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="providers.length === 0"
      class="py-12 text-center text-[15px] font-semibold"
      style="color: var(--proto-text-muted); padding: 48px 20px;"
    >
      <div class="mb-2 text-3xl">🔍</div>
      <p>No providers match your filters</p>
    </div>

    <!-- Show all / Show fewer button -->
    <div
      v-if="providers.length > INITIAL_LIMIT"
      class="mt-5 flex justify-center"
    >
      <button
        type="button"
        class="rounded-xl border px-6 py-2.5 text-[13px] font-semibold transition-colors hover:opacity-80"
        style="border-color: var(--proto-card-border); background: white; color: var(--proto-text);"
        @click="showAll = !showAll"
      >
        {{ showAll ? 'Show fewer ↑' : `Show all ${resultCount} providers ↓` }}
      </button>
    </div>

    <!-- Metadata footer -->
    <div
      class="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px]"
      style="color: var(--proto-text-light);"
    >
      <span>
        Showing {{ visibleProviders.length }} of {{ resultCount }} providers · Duplicate
        brands grouped under parent company
      </span>
      <span>
        Data sourced from TDLR public records and available websites found at time of search ·
        <a
          href="mailto:info@tdlrguide.com"
          class="font-semibold hover:opacity-90"
          style="color: var(--proto-teal);"
        >
          Submit a correction → info@tdlrguide.com
        </a>
      </span>
    </div>
  </div>
</template>
