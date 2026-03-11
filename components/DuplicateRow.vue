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

function certVariant(value: string) {
  if (value === 'Free') return 'cert-free'
  if (value === 'Paid') return 'cert-paid'
  return 'cert-mail'
}

function formatVariant(label: string) {
  if (label === 'Online / In-Person') return 'format-both'
  if (label === 'In-Person') return 'format-inperson'
  return 'format-online'
}

function langVariant(label: string) {
  if (label === 'Eng / Spanish') return 'lang-engspanish'
  if (label === 'English') return 'lang-english'
  if (label === 'Spanish') return 'lang-spanish'
  return 'lang-other'
}
</script>

<template>
  <tr
    class="border-b h-10 bg-[var(--proto-hover-bg)]"
    style="border-bottom-color: var(--proto-row-border);"
  >
    <td class="pl-11 pr-3 py-0">
      <div class="flex items-center gap-1.5">
        <span class="text-[11px]" style="color: var(--proto-text-light);">↳</span>
        <span class="text-[13px]" style="color: var(--proto-text-muted);">
          {{ dupe.name }}
        </span>
        <span class="text-[11px]" style="color: #B0B7C0;">
          {{ dupe.url }}
        </span>
      </div>
    </td>
    <td class="h-10 px-3 py-0 text-center text-[12px]" style="color: var(--proto-text-light);">
      —
    </td>
    <td class="px-3 py-0">
      <span class="text-[13px]" style="color: var(--proto-text-muted);">
        <template
          v-if="
            parent.priceDisplay &&
            parent.priceDisplay.toString().trim().toLowerCase() === 'not found'
          "
        >
          <span style="color: var(--proto-text-light);">—</span>
        </template>
        <template v-else>
          ${{ parent.price.toFixed(2) }}
        </template>
      </span>
    </td>
    <td class="px-3 py-0">
      <span class="text-[13px]" style="color: var(--proto-text-muted);">
        <template
          v-if="
            parent.stateFeeDisplay &&
            parent.stateFeeDisplay.toString().trim().toLowerCase() === 'not found'
          "
        >
          <span style="color: var(--proto-text-light);">—</span>
        </template>
        <template v-else>
          ${{ parent.stateFee.toFixed(2) }}
        </template>
      </span>
    </td>
    <td class="px-3 py-0">
      <span class="text-[13px] font-semibold" style="color: var(--proto-text-muted);">
        <template
          v-if="
            parent.totalCostDisplay &&
            parent.totalCostDisplay.toString().trim().toLowerCase() === 'not found'
          "
        >
          <span style="color: var(--proto-text-light);">—</span>
        </template>
        <template v-else>
          ${{ parent.totalCost.toFixed(2) }}
        </template>
      </span>
    </td>
    <td class="px-3 py-0 text-center">
      <ProtoPill :label="parent.instantCert" :variant="certVariant(parent.instantCert)" />
    </td>
    <td class="px-3 py-0 text-center">
      <template
        v-if="!parent.online && !parent.inPerson"
      >
        <span class="text-[13px]" style="color: var(--proto-text-light);">—</span>
      </template>
      <template v-else>
        <ProtoPill :label="formatLabel" :variant="formatVariant(formatLabel)" />
      </template>
    </td>
    <td class="px-3 py-0 text-center">
      <template
        v-if="languageLabel.toString().trim().toLowerCase() === 'not found'"
      >
        <span class="text-[13px]" style="color: var(--proto-text-light);">—</span>
      </template>
      <template v-else>
        <ProtoPill :label="languageLabel" :variant="langVariant(languageLabel)" />
      </template>
    </td>
  </tr>
</template>

