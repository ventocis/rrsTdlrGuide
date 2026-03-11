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
  if (value === 'Free') return 'success'
  if (value === 'Paid') return 'error'
  if (value === 'Mail') return 'neutral'
  return 'neutral'
}

function formatColor(label: string) {
  if (label === 'Online / In-Person') return 'primary'
  if (label === 'In-Person') return 'warning'
  if (label === 'Online') return 'info'
  return 'neutral'
}

function langColor(label: string) {
  if (label === 'Eng / Spanish') return 'warning'
  if (label === 'English') return 'neutral'
  if (label === 'Spanish') return 'warning'
  if (label.toLowerCase() === 'not found') return 'error'
  return 'neutral'
}
</script>

<template>
  <tr class="border-b border-rui-neutral-200 bg-rui-neutral-100">
    <td class="h-10 px-3 pl-11">
      <div class="flex items-center gap-1.5">
        <span class="text-[11px] text-rui-neutral-500">↳</span>
        <span class="text-[13px] text-rui-neutral-600">
          {{ dupe.name }}
        </span>
        <span class="text-[11px] text-rui-neutral-500">
          {{ dupe.url }}
        </span>
      </div>
    </td>
    <td class="h-10 px-3 text-center text-[12px] text-rui-neutral-400">
      —
    </td>
    <td class="h-10 px-3">
      <span class="text-[13px] text-rui-neutral-600">
        <template
          v-if="
            parent.priceDisplay &&
            parent.priceDisplay.toString().trim().toLowerCase() === 'not found'
          "
        >
          <span class="text-rui-neutral-500">—</span>
        </template>
        <template v-else>
          ${{ parent.price.toFixed(2) }}
        </template>
      </span>
    </td>
    <td class="h-10 px-3">
      <span class="text-[13px] text-rui-neutral-500">
        <template
          v-if="
            parent.stateFeeDisplay &&
            parent.stateFeeDisplay.toString().trim().toLowerCase() === 'not found'
          "
        >
          <span class="text-rui-neutral-500">—</span>
        </template>
        <template v-else>
          ${{ parent.stateFee.toFixed(2) }}
        </template>
      </span>
    </td>
    <td class="h-10 px-3">
      <span class="text-[13px] font-semibold text-rui-neutral-700">
        <template
          v-if="
            parent.totalCostDisplay &&
            parent.totalCostDisplay.toString().trim().toLowerCase() === 'not found'
          "
        >
          <span class="text-rui-neutral-500">—</span>
        </template>
        <template v-else>
          ${{ parent.totalCost.toFixed(2) }}
        </template>
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
      <template
        v-if="!parent.online && !parent.inPerson"
      >
        <span class="text-[13px] text-rui-neutral-500">—</span>
      </template>
      <template v-else>
        <UBadge
          :label="formatLabel"
          size="xs"
          :color="formatColor(formatLabel)"
          variant="soft"
          class="px-2.5 py-0.5 text-[12px] font-semibold"
        />
      </template>
    </td>
    <td class="h-10 px-3 text-center">
      <template
        v-if="languageLabel.toString().trim().toLowerCase() === 'not found'"
      >
        <span class="text-[13px] text-rui-neutral-500">—</span>
      </template>
      <template v-else>
        <UBadge
          :label="languageLabel"
          size="xs"
          :color="langColor(languageLabel)"
          variant="soft"
          class="px-2.5 py-0.5 text-[12px] font-semibold"
        />
      </template>
    </td>
  </tr>
</template>

