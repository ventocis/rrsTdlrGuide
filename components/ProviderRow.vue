<script setup lang="ts">
import type { Provider } from '~/composables/useProviders'
import { useStudentResponses } from '~/composables/useStudentResponses'

const props = defineProps<{
  provider: Provider
  isExpanded: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const { providerSlug } = useStudentResponses()

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

const hasWebsite = computed(() => {
  const u = props.provider.website?.trim() || ''
  if (!u) return false
  if (u.toLowerCase() === 'not found') return false
  return true
})

function openWebsite() {
  if (!hasWebsite.value || !props.provider.website) return
  let u = props.provider.website.trim()
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', 'provider_click', {
      provider_name: props.provider.name,
      provider_slug: providerSlug(props.provider.name),
      destination_url: u
    })
  }
  window.open(u, '_blank', 'noopener,noreferrer')
}

function onRowClick() {
  if (hasDupes.value) emit('toggle')
  else if (hasWebsite.value) openWebsite()
}
</script>

<template>
  <tr
    :class="[
      'border-b transition-colors h-12',
      provider.featured
        ? 'bg-[var(--proto-teal-bg)]'
        : 'bg-white hover:bg-[var(--proto-hover-bg)]',
      hasDupes || hasWebsite ? 'cursor-pointer' : 'cursor-default'
    ]"
    style="border-bottom-color: var(--proto-row-border);"
    :data-provider-name="provider.name"
    :data-provider-slug="providerSlug(provider.name)"
    @click="onRowClick"
  >
    <td class="px-3 py-0">
      <div class="flex items-center gap-2">
        <span class="flex h-3.5 w-3.5 items-center justify-center" style="color: var(--proto-text-light);">
          <UIcon
            v-if="hasDupes"
            name="i-heroicons-chevron-down-20-solid"
            class="h-3.5 w-3.5 transition-transform duration-200"
            style="color: var(--proto-text-light);"
            :class="isExpanded ? 'rotate-180' : ''"
          />
        </span>
        <span class="text-[14px] font-bold" style="color: var(--proto-text);">
          {{ provider.name }}
        </span>
        <span
          v-if="provider.featured"
          class="rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white"
          style="background: linear-gradient(90deg, var(--proto-teal), var(--proto-teal-dark)); letter-spacing: 0.05em;"
        >
          Overall Pick
        </span>
        <span
          v-if="hasDupes"
          class="text-[11px] font-medium"
          style="color: var(--proto-text-light);"
        >
          +{{ provider.duplicates.length }}
        </span>
        <NuxtLink
          :to="`/reviews/${providerSlug(provider.name)}`"
          class="ml-2 text-[11px] font-semibold hover:underline"
          style="color: var(--proto-teal);"
          @click.stop
        >
          View reviews
        </NuxtLink>
      </div>
    </td>
    <td class="px-3 py-0">
      <span class="text-[13px]" style="color: var(--proto-text-muted);">
        {{ provider.license || '—' }}
      </span>
    </td>
    <td class="px-3 py-0 text-center">
      <div class="flex items-center justify-center gap-1">
        <StarRating :rating="provider.rating" />
        <span class="text-[13px] font-bold" style="color: var(--proto-text);">
          {{ provider.rating.toFixed(1) }}
        </span>
      </div>
    </td>
    <td class="px-3 py-0">
      <template
        v-if="
          provider.priceDisplay &&
          provider.priceDisplay.toString().trim().toLowerCase() === 'not found'
        "
      >
        <span class="text-[13px]" style="color: var(--proto-text-light);">—</span>
      </template>
      <template v-else>
        <span class="text-[13px]" style="color: #374151;">
          ${{ provider.price.toFixed(2) }}
        </span>
      </template>
    </td>
    <td class="px-3 py-0">
      <template
        v-if="
          provider.stateFeeDisplay &&
          provider.stateFeeDisplay.toString().trim().toLowerCase() === 'not found'
        "
      >
        <span class="text-[13px]" style="color: var(--proto-text-light);">—</span>
      </template>
      <template v-else>
        <span class="text-[13px]" style="color: var(--proto-text-muted);">
          ${{ provider.stateFee.toFixed(2) }}
        </span>
      </template>
    </td>
    <td class="px-3 py-0">
      <template
        v-if="
          provider.totalCostDisplay &&
          provider.totalCostDisplay.toString().trim().toLowerCase() === 'not found'
        "
      >
        <span class="text-[13px]" style="color: var(--proto-text-light);">—</span>
      </template>
      <template v-else>
        <span
          class="inline-flex items-center rounded px-2 py-0.5 text-[14px] font-extrabold"
          style="background: #F0FDF4; border: 1px solid #D1FAE5; color: var(--proto-text);"
        >
          ${{ provider.totalCost.toFixed(2) }}
        </span>
      </template>
    </td>
    <td class="px-3 py-0 text-center">
      <ProtoPill :label="provider.instantCert" :variant="certVariant(provider.instantCert)" />
    </td>
    <td class="px-3 py-0 text-center">
      <template
        v-if="
          !provider.online &&
          !provider.inPerson
        "
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

