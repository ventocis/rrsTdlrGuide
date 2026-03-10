<script setup lang="ts">
import type { Provider, DuplicateBrand } from '~/composables/useProviders'

const props = defineProps<{
  dupe: DuplicateBrand
  parent: Provider
}>()

const formatLabel = computed(() => {
  const p = props.parent
  if (p.online && p.inPerson) return 'Online / In-Person'
  if (p.inPerson) return 'In-Person'
  return 'Online'
})

const languageLabel = computed(() => {
  const langs = props.parent.languages
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
  <tr class="border-b border-slate-100 bg-slate-50/80">
    <td class="h-10 px-3 pl-11">
      <div class="flex items-center gap-1.5">
        <span class="text-[11px] text-slate-400">↳</span>
        <span class="text-[13px] text-slate-600">
          {{ dupe.name }}
        </span>
        <span class="text-[11px] text-slate-400">
          {{ dupe.url }}
        </span>
      </div>
    </td>
    <td class="h-10 px-3 text-center text-[12px] text-slate-300">
      —
    </td>
    <td class="h-10 px-3">
      <span class="text-[13px] text-slate-600">
        ${{ parent.price.toFixed(2) }}
      </span>
    </td>
    <td class="h-10 px-3">
      <span class="text-[13px] text-slate-400">
        ${{ parent.stateFee.toFixed(2) }}
      </span>
    </td>
    <td class="h-10 px-3">
      <span class="text-[13px] font-semibold text-slate-700">
        ${{ (parent.price + parent.stateFee).toFixed(2) }}
      </span>
    </td>
    <td class="h-10 px-3 text-center">
      <UBadge
        :label="parent.instantCert"
        size="xs"
        :color="certColor(parent.instantCert)"
        variant="soft"
        class="px-2.5 py-0.5 text-[12px] font-semibold"
      />
    </td>
    <td class="h-10 px-3 text-center">
      <UBadge
        :label="formatLabel"
        size="xs"
        :color="formatColor(formatLabel)"
        variant="soft"
        class="px-2.5 py-0.5 text-[12px] font-semibold"
      />
    </td>
    <td class="h-10 px-3 text-center">
      <UBadge
        :label="languageLabel"
        size="xs"
        :color="langColor(languageLabel)"
        variant="soft"
        class="px-2.5 py-0.5 text-[12px] font-semibold"
      />
    </td>
    <td class="h-10 px-3 text-center">
      <span class="inline-flex items-center justify-center">
        <UIcon
          v-if="parent.moneyBack"
          name="i-heroicons-check-circle-20-solid"
          class="h-4 w-4 text-emerald-500/80"
        />
        <UIcon
          v-else
          name="i-heroicons-x-circle-20-solid"
          class="h-4 w-4 text-red-400"
        />
      </span>
    </td>
  </tr>
</template>
