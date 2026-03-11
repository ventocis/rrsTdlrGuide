<script setup lang="ts">
import { useProviders } from '~/composables/useProviders'

const { formatFilter, certFilter, clearFilters, hasActiveFilters, toggleFormat, toggleCert } =
  useProviders()

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
</script>

<template>
  <div class="mx-auto w-full max-w-[1600px] px-2 pt-3.5 sm:px-5" style="background-color: var(--proto-page-bg);">
    <div
      class="flex flex-wrap items-center justify-between gap-3 rounded-none px-2 py-0 sm:px-5"
      style="background-color: var(--proto-page-bg);"
    >
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-1.5">
          <span
            class="text-[12px] font-semibold"
            style="color: var(--proto-label);"
          >
            Format
          </span>
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
          <span
            class="text-[12px] font-semibold"
            style="color: var(--proto-label);"
          >
            Certificate
          </span>
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

      <button
        v-if="hasActiveFilters"
        type="button"
        class="px-2.5 py-1 text-[12px] font-semibold text-[#EF4444] transition-colors hover:opacity-80"
        @click="clearFilters"
      >
        Clear filters
      </button>
    </div>
  </div>
</template>

