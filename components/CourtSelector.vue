<script setup lang="ts">
import type { CourtRecord } from '~/composables/useCourts'

const props = defineProps<{
  /** Currently selected court (controlled by parent via v-model:selectedCourt). */
  selectedCourt?: CourtRecord | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedCourt', value: CourtRecord | null): void
}>()

const { allCourtsRows } = useCourts()

const selectedCounty = ref<string | null>(null)
const selectedCourtType = ref<string | null>(null)
const internalSelectedCourt = ref<CourtRecord | null>(props.selectedCourt ?? null)

const countyOptions = computed(() => {
  const counties = [...new Set(allCourtsRows.map((r) => r.county))].filter(Boolean).sort()
  return counties.map((c) => ({ label: c, value: c }))
})

const courtTypeOptions = computed(() => {
  if (!selectedCounty.value) return []
  const types = [...new Set(
    allCourtsRows
      .filter((r) => r.county === selectedCounty.value)
      .map((r) => r.courtType)
  )].filter(Boolean).sort()
  return types.map((t) => ({ label: t, value: t }))
})

const courtNameOptions = computed(() => {
  if (!selectedCounty.value || !selectedCourtType.value) return []
  const rows = allCourtsRows.filter(
    (r) => r.county === selectedCounty.value && r.courtType === selectedCourtType.value
  )
  const seen = new Set<string>()
  const options: { label: string; value: CourtRecord }[] = []
  for (const row of rows) {
    if (seen.has(row.court)) continue
    seen.add(row.court)
    options.push({ label: row.court, value: row })
  }
  return options
})

watch(
  () => props.selectedCourt,
  (val) => {
    internalSelectedCourt.value = val ?? null
    if (!val) {
      selectedCounty.value = null
      selectedCourtType.value = null
    } else {
      selectedCounty.value = val.county || null
      selectedCourtType.value = val.courtType || null
    }
  }
)

watch(internalSelectedCourt, (val) => {
  emit('update:selectedCourt', val ?? null)
})

function handleCountyChange(value: string | null) {
  selectedCounty.value = value
  selectedCourtType.value = null
  internalSelectedCourt.value = null
}

function handleCourtTypeChange(value: string | null) {
  selectedCourtType.value = value
  internalSelectedCourt.value = null
}

function handleCourtChange(court: CourtRecord | null) {
  internalSelectedCourt.value = court
}
</script>

<template>
  <div class="court-selector">
    <div v-if="countyOptions.length === 0" class="court-empty-state">
      No court data is loaded. Place <strong>Courts Directory By County (1).xlsx</strong> in the project root
      and run <code>npm run build:courts</code> to populate the list.
    </div>
    <div v-else class="court-dropdowns">
      <div class="court-dropdown-field">
        <label class="court-dropdown-label">County</label>
        <USelectMenu
          v-model="selectedCounty"
          :items="countyOptions"
          value-key="value"
          placeholder="Select county"
          class="court-select-menu"
          @update:model-value="handleCountyChange"
        />
      </div>
      <div class="court-dropdown-field">
        <label class="court-dropdown-label">Court Type</label>
        <USelectMenu
          v-model="selectedCourtType"
          :items="courtTypeOptions"
          value-key="value"
          placeholder="Select court type"
          class="court-select-menu"
          :disabled="!selectedCounty"
          @update:model-value="handleCourtTypeChange"
        />
      </div>
      <div class="court-dropdown-field">
        <label class="court-dropdown-label">Court</label>
        <USelectMenu
          v-model="internalSelectedCourt"
          :items="courtNameOptions"
          value-key="value"
          placeholder="Select court"
          class="court-select-menu"
          :disabled="!selectedCounty || !selectedCourtType"
          @update:model-value="handleCourtChange"
        />
      </div>
    </div>
  </div>
</template>

<style>
.court-selector .court-dropdowns {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.court-selector .court-dropdown-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.court-selector .court-dropdown-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--navy, var(--proto-header-from));
}

.court-selector .court-select-menu[data-slot='base'],
.court-selector .court-dropdowns button.court-select-menu {
  width: 100% !important;
  padding: 12px 16px !important;
  border: 2px solid var(--proto-card-border) !important;
  border-radius: 10px !important;
  font-family: 'DM Sans', system-ui, sans-serif !important;
  font-size: 0.95rem !important;
  font-weight: 500 !important;
  color: var(--navy, var(--proto-header-from)) !important;
  background: #fff !important;
  box-shadow: none !important;
}

.court-selector .court-dropdowns button.court-select-menu[data-state='open'],
.court-selector .court-dropdowns button.court-select-menu:focus-visible {
  border-color: var(--navy-mid, var(--proto-header-to)) !important;
  outline: none !important;
}

.court-selector .court-empty-state {
  margin-top: 12px;
  padding: 14px 18px;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--proto-text-muted);
  background: var(--proto-hover-bg);
  border-radius: 10px;
  border: 1px solid var(--proto-card-border);
}

.court-selector .court-empty-state code {
  font-size: 0.85em;
  padding: 2px 6px;
  background: var(--proto-card-border);
  border-radius: 4px;
}
</style>

