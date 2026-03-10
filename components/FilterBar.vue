<script setup lang="ts">
import { useProviders } from '~/composables/useProviders'

const { formatFilter, certFilter, clearFilters, hasActiveFilters } =
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
</script>

<template>
  <div class="mx-auto max-w-5xl px-5 pt-3">
    <div
      class="flex flex-wrap items-center gap-4 text-[12px] text-slate-600"
    >
      <div class="flex items-center gap-1.5">
        <span class="font-semibold">Format:</span>
        <UButton
          v-for="f in formatOptions"
          :key="f.key"
          size="2xs"
          :variant="formatFilter === f.key ? 'soft' : 'outline'"
          :color="formatFilter === f.key ? 'teal' : 'gray'"
          class="rounded-md px-2.5 py-1 text-[12px] font-semibold"
          @click="formatFilter = f.key"
        >
          {{ f.label }}
        </UButton>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="font-semibold">Certificate:</span>
        <UButton
          v-for="f in certOptions"
          :key="f.key"
          size="2xs"
          :variant="certFilter === f.key ? 'soft' : 'outline'"
          :color="certFilter === f.key ? 'teal' : 'gray'"
          class="rounded-md px-2.5 py-1 text-[12px] font-semibold"
          @click="certFilter = f.key"
        >
          {{ f.label }}
        </UButton>
      </div>
      <UButton
        v-if="hasActiveFilters"
        size="2xs"
        color="red"
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

