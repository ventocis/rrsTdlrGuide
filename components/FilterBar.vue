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
  <div class="mx-auto w-full max-w-full px-4 pt-2 sm:px-6">
    <div
      class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rui-neutral-200 bg-rui-neutral-50 px-3 py-2 text-[12px] text-rui-neutral-600 shadow-sm"
    >
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-1.5">
          <span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-rui-neutral-500">
            Format
          </span>
          <div class="inline-flex gap-1 rounded-full bg-rui-neutral-200 p-0.5">
            <UButton
              v-for="f in formatOptions"
              :key="f.key"
              size="2xs"
              :variant="isFormatActive(f.key) ? 'solid' : 'ghost'"
              :color="isFormatActive(f.key) ? 'success' : 'neutral'"
              class="rounded-full px-3 py-1 text-[11px] font-semibold"
              @click="toggleFormat(f.key)"
            >
              {{ f.label }}
            </UButton>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-rui-neutral-500">
            Certificate
          </span>
          <div class="inline-flex gap-1 rounded-full bg-rui-neutral-200 p-0.5">
            <UButton
              v-for="f in certOptions"
              :key="f.key"
              size="2xs"
              :variant="isCertActive(f.key) ? 'solid' : 'ghost'"
              :color="isCertActive(f.key) ? 'success' : 'neutral'"
              class="rounded-full px-3 py-1 text-[11px] font-semibold"
              @click="toggleCert(f.key)"
            >
              {{ f.label }}
            </UButton>
          </div>
        </div>
      </div>

      <UButton
        v-if="hasActiveFilters"
        size="2xs"
        color="error"
        variant="ghost"
        class="px-2.5 py-1 text-[12px] font-semibold"
        icon="i-heroicons-x-mark-20-solid"
        @click="clearFilters"
      >
        Clear filters
      </UButton>
    </div>
  </div>
</template>

