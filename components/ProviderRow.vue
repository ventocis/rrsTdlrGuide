<script setup lang="ts">
import type { Provider } from '~/composables/useProviders'

const props = defineProps<{
  provider: Provider
  isExpanded: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const hasDupes = computed(
  () => props.provider.duplicates && props.provider.duplicates.length > 0
)

const formatLabel = computed(() => {
  const p = props.provider
  if (p.online && p.inPerson) return 'Online / In-Person'
  if (p.inPerson) return 'In-Person'
  return 'Online'
})

const languageLabel = computed(() => {
  const langs = props.provider.languages
  if (langs.length > 2) return langs.join(', ')
  if (
    langs.length === 2 &&
    langs.includes('English') &&
    langs.includes('Spanish')
  ) {
    return 'Eng / Spanish'
  }
  return langs.join(', ')
})

function certColor(value: string) {
  if (value === 'Free') return 'emerald'
  if (value === 'Paid') return 'red'
  return 'gray'
}

function formatColor(label: string) {
  if (label === 'Online / In-Person') return 'violet'
  if (label === 'In-Person') return 'orange'
  return 'blue'
}

function langColor(label: string) {
  if (label === 'Eng / Spanish') return 'orange'
  if (label === 'English') return 'gray'
  if (label === 'Spanish') return 'yellow'
  return 'slate'
}
</script>

<template>
  <tr
    :class="[
      'cursor-default border-b border-slate-100 transition-colors',
      provider.featured
        ? 'bg-teal-50'
        : 'bg-white hover:bg-slate-50',
      hasDupes ? 'cursor-pointer' : ''
    ]"
    @click="hasDupes && emit('toggle')"
  >
    <td class="h-12 px-3">
      <div class="flex items-center gap-2">
        <span class="flex h-4 w-4 items-center justify-center text-slate-400">
          <UIcon
            v-if="hasDupes"
            name="i-heroicons-chevron-down-20-solid"
            class="h-3.5 w-3.5 transition-transform"
            :class="isExpanded ? 'rotate-180' : ''"
          />
        </span>
        <span class="text-sm font-bold text-slate-900">
          {{ provider.name }}
        </span>
        <span
          v-if="provider.featured"
          class="bg-gradient-to-r from-teal-600 to-teal-700 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white rounded-[3px]"
        >
          ✦ PICK
        </span>
        <span
          v-if="hasDupes"
          class="text-[11px] font-medium text-slate-400"
        >
          +{{ provider.duplicates.length }}
        </span>
      </div>
    </td>
    <td class="h-12 px-3 text-center">
      <div class="flex items-center justify-center gap-1">
        <StarRating :rating="provider.rating" />
        <span class="text-sm font-bold text-slate-900">
          {{ provider.rating.toFixed(1) }}
        </span>
      </div>
    </td>
    <td class="h-12 px-3">
      <span class="text-sm text-slate-700">
        ${{ provider.price.toFixed(2) }}
      </span>
    </td>
    <td class="h-12 px-3">
      <span class="text-sm text-slate-500">
        ${{ provider.stateFee.toFixed(2) }}
      </span>
    </td>
    <td class="h-12 px-3">
      <span
        class="inline-flex items-center rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-sm font-extrabold text-slate-900"
      >
        ${{ (provider.price + provider.stateFee).toFixed(2) }}
      </span>
    </td>
    <td class="h-12 px-3 text-center">
      <UBadge
        :label="provider.instantCert"
        size="xs"
        :color="certColor(provider.instantCert)"
        variant="soft"
        class="px-2.5 py-0.5 text-[12px] font-semibold"
      />
    </td>
    <td class="h-12 px-3 text-center">
      <UBadge
        :label="formatLabel"
        size="xs"
        :color="formatColor(formatLabel)"
        variant="soft"
        class="px-2.5 py-0.5 text-[12px] font-semibold"
      />
    </td>
    <td class="h-12 px-3 text-center">
      <UBadge
        :label="languageLabel"
        size="xs"
        :color="langColor(languageLabel)"
        variant="soft"
        class="px-2.5 py-0.5 text-[12px] font-semibold"
      />
    </td>
    <td class="h-12 px-3 text-center">
      <span class="inline-flex items-center justify-center">
        <UIcon
          v-if="provider.moneyBack"
          name="i-heroicons-check-circle-20-solid"
          class="h-4 w-4 text-emerald-500"
        />
        <UIcon
          v-else
          name="i-heroicons-x-circle-20-solid"
          class="h-4 w-4 text-red-500"
        />
      </span>
    </td>
  </tr>
</template>
