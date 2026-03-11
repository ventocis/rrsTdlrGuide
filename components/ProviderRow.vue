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
  if (value === 'Free') return 'success'   // Nuxt UI: green
  if (value === 'Paid') return 'error'     // Nuxt UI: red
  if (value === 'Mail') return 'neutral'   // Nuxt UI: gray
  return 'neutral'
}

function formatColor(label: string) {
  if (label === 'Online / In-Person') return 'primary'  // Nuxt UI: violet/purple
  if (label === 'In-Person') return 'warning'           // Nuxt UI: orange
  if (label === 'Online') return 'info'                 // Nuxt UI: blue
  return 'neutral'
}

function langColor(label: string) {
  if (label === 'Eng / Spanish') return 'warning'      // Nuxt UI: orange/amber
  if (label === 'English') return 'neutral'
  if (label === 'Spanish') return 'warning'
  if (label.toLowerCase() === 'not found') return 'error'
  return 'neutral'
}
</script>

<template>
  <tr
    :class="[
      'cursor-default border-b border-rui-neutral-200 transition-colors',
      provider.featured
        ? 'bg-rui-success-50'
        : 'bg-white hover:bg-rui-neutral-50',
      hasDupes ? 'cursor-pointer' : ''
    ]"
    @click="hasDupes && emit('toggle')"
  >
    <td class="h-12 px-3">
      <div class="flex items-center gap-2">
        <span class="flex h-4 w-4 items-center justify-center text-rui-neutral-400">
          <UIcon
            v-if="hasDupes"
            name="i-heroicons-chevron-down-20-solid"
            class="h-3.5 w-3.5 text-rui-neutral-400 transition-transform duration-150"
            :class="isExpanded ? 'rotate-180' : ''"
          />
        </span>
        <span class="text-sm font-bold text-rui-neutral-900">
          {{ provider.name }}
        </span>
        <span
          v-if="provider.featured"
          class="bg-rui-success-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white rounded-full shadow-sm"
        >
          Overall Pick
        </span>
        <span
          v-if="hasDupes"
          class="text-[11px] font-medium text-rui-neutral-500"
        >
          +{{ provider.duplicates.length }}
        </span>
      </div>
    </td>
    <td class="h-12 px-3 text-center">
      <div class="flex items-center justify-center gap-1">
        <StarRating :rating="provider.rating" />
        <span class="text-sm font-bold text-rui-neutral-900">
          {{ provider.rating.toFixed(1) }}
        </span>
      </div>
    </td>
    <td class="h-12 px-3">
      <template
        v-if="
          provider.priceDisplay &&
          provider.priceDisplay.toString().trim().toLowerCase() === 'not found'
        "
      >
        <span class="text-sm text-rui-neutral-500">—</span>
      </template>
      <template v-else>
        <span class="text-sm text-rui-neutral-700">
          ${{ provider.price.toFixed(2) }}
        </span>
      </template>
    </td>
    <td class="h-12 px-3">
      <template
        v-if="
          provider.stateFeeDisplay &&
          provider.stateFeeDisplay.toString().trim().toLowerCase() === 'not found'
        "
      >
        <span class="text-sm text-rui-neutral-500">—</span>
      </template>
      <template v-else>
        <span class="text-sm text-rui-neutral-600">
          ${{ provider.stateFee.toFixed(2) }}
        </span>
      </template>
    </td>
    <td class="h-12 px-3">
      <template
        v-if="
          provider.totalCostDisplay &&
          provider.totalCostDisplay.toString().trim().toLowerCase() === 'not found'
        "
      >
        <span class="text-sm text-rui-neutral-500">—</span>
      </template>
      <template v-else>
        <span
          class="inline-flex items-center rounded border border-rui-success-200 bg-rui-success-50 px-2 py-0.5 text-sm font-extrabold text-rui-neutral-900"
        >
          ${{ provider.totalCost.toFixed(2) }}
        </span>
      </template>
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
      <template
        v-if="
          !provider.online &&
          !provider.inPerson
        "
      >
        <span class="text-sm text-rui-neutral-500">—</span>
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
    <td class="h-12 px-3 text-center">
      <template
        v-if="languageLabel.toString().trim().toLowerCase() === 'not found'"
      >
        <span class="text-sm text-rui-neutral-500">—</span>
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

