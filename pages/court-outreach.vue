<script setup lang="ts">
import type { CourtRecord } from '~/composables/useCourts'

const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl as string) || 'https://tdlrguide.com'

const seoTitle = 'Texas Court Outreach Directory | TDLR Guide'
const seoDescription = 'Find Texas court contact information by county and court type. Email addresses, judge names, and court websites for defensive driving and ticket dismissal.'

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: `${siteUrl}/court-outreach`,
  ogType: 'website',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/court-outreach` }],
  meta: [
    { property: 'og:url', content: `${siteUrl}/court-outreach` },
    { name: 'keywords', content: 'Texas courts, court email, court directory, defensive driving court contact' }
  ]
})

const { allCourtsRows, uniqueCourtCount, uniqueCourtsWithEmailCount } = useCourts()

const emailAvailableOnly = ref(false)
const selectedRow = ref<CourtRecord | null>(null)
const composerEmail = ref('')

const filteredRows = computed(() => {
  if (!emailAvailableOnly.value) return allCourtsRows
  return allCourtsRows.filter((row) => row.email != null && String(row.email).trim() !== '')
})

function truncateEmail(email: string, maxLen = 20) {
  const s = String(email).trim()
  if (!s) return ''
  if (s.length <= maxLen) return s
  return s.slice(0, maxLen) + '…'
}

async function copyEmail(email: string) {
  const s = String(email).trim()
  if (!s) return
  try {
    await navigator.clipboard.writeText(s)
    // Optional: show a brief toast; for now we rely on native behavior
  } catch (_) {
    // Fallback: no clipboard API
  }
}

function selectRow(row: CourtRecord) {
  selectedRow.value = row
  composerEmail.value = row.email != null ? String(row.email).trim() : ''
}

function openInMailClient() {
  const to = composerEmail.value.trim()
  const subject = encodeURIComponent('Defensive driving / ticket dismissal inquiry')
  const body = encodeURIComponent(
    'Dear Judge,\n\nI am writing regarding my traffic citation and possible defensive driving course completion for dismissal.\n\nThank you.'
  )
  const mailto = to ? `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}` : `mailto:?subject=${subject}&body=${body}`
  window.location.href = mailto
}

function exportCsv() {
  const rows = filteredRows.value
  const headers = ['County', 'Court Type', 'Court', 'Website', 'Judge', 'Email']
  const escape = (v: string) => {
    const s = String(v ?? '').trim()
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(
      [
        escape(row.county),
        escape(row.courtType),
        escape(row.court),
        escape(row.website),
        escape(row.judgeName),
        escape(row.email ?? '')
      ].join(',')
    )
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'texas-courts-directory.csv'
  a.click()
  URL.revokeObjectURL(url)
}

watch(selectedRow, (row) => {
  if (row) composerEmail.value = row.email != null ? String(row.email).trim() : ''
})
</script>

<template>
  <div
    class="court-outreach-page min-h-screen font-['DM_Sans',system-ui,sans-serif]"
    style="background-color: var(--proto-page-bg);"
  >
    <SiteHeader />
    <main class="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
      <h1 class="mb-2 text-2xl font-bold leading-tight sm:text-3xl" style="color: var(--proto-text);">
        Texas Court Outreach Directory
      </h1>
      <p class="mb-6 text-[14px]" style="color: var(--proto-text-muted);">
        Contact information for Texas courts. Use the eligibility checker to find your court, or browse below. Email column is copyable; select a row to edit the address and open in your mail client.
      </p>

      <div
        class="mb-6 rounded-lg border px-4 py-3"
        style="background: var(--proto-teal-bg); border-color: var(--proto-teal-border);"
      >
        <p class="text-[15px]" style="color: var(--proto-text);">
          <strong>{{ uniqueCourtsWithEmailCount }} of {{ uniqueCourtCount }} courts</strong> have email addresses on file.
        </p>
      </div>

      <div class="mb-4 flex flex-wrap items-center gap-4">
        <label class="flex cursor-pointer items-center gap-2">
          <UCheckbox v-model="emailAvailableOnly" />
          <span class="text-[14px]" style="color: var(--proto-text);">Email available only</span>
        </label>
        <UButton
          size="sm"
          variant="soft"
          color="neutral"
          @click="exportCsv"
        >
          Export CSV
        </UButton>
      </div>

      <div class="overflow-x-auto rounded-lg border" style="border-color: var(--proto-card-border); background: #fff;">
        <table class="w-full border-collapse text-[14px]" style="color: var(--proto-text);">
          <thead>
            <tr style="background: var(--proto-text); color: #fff;">
              <th class="px-3 py-2.5 text-left font-semibold">County</th>
              <th class="px-3 py-2.5 text-left font-semibold">Court Type</th>
              <th class="px-3 py-2.5 text-left font-semibold">Court</th>
              <th class="px-3 py-2.5 text-left font-semibold">Website</th>
              <th class="px-3 py-2.5 text-left font-semibold">Judge</th>
              <th class="px-3 py-2.5 text-left font-semibold">Email</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, i) in filteredRows"
              :key="`${row.county}-${row.courtType}-${row.court}-${row.judgeName}-${i}`"
              class="border-b cursor-pointer transition-colors hover:bg-[var(--proto-hover-bg)]"
              :class="{ 'bg-[var(--proto-teal-bg)]': selectedRow === row }"
              style="border-color: var(--proto-row-border);"
              @click="selectRow(row)"
            >
              <td class="px-3 py-2.5">{{ row.county }}</td>
              <td class="px-3 py-2.5">{{ row.courtType }}</td>
              <td class="px-3 py-2.5">{{ row.court }}</td>
              <td class="px-3 py-2.5">
                <a
                  v-if="row.website"
                  :href="row.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium hover:underline"
                  style="color: var(--proto-teal);"
                  @click.stop
                >
                  Link
                </a>
                <span v-else class="text-[var(--proto-text-muted)]">—</span>
              </td>
              <td class="px-3 py-2.5">{{ row.judgeName || '—' }}</td>
              <td class="px-3 py-2.5">
                <span
                  v-if="row.email"
                  class="inline-flex items-center gap-1 cursor-pointer hover:underline"
                  :title="row.email"
                  @click.stop="copyEmail(row.email)"
                >
                  {{ truncateEmail(row.email) }}
                  <UIcon name="i-heroicons-clipboard-document" class="h-3.5 w-3.5 opacity-70" />
                </span>
                <span v-else class="text-[var(--proto-text-muted)]">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="selectedRow"
        class="mt-6 rounded-lg border p-4"
        style="background: #fff; border-color: var(--proto-card-border);"
      >
        <h3 class="mb-3 text-base font-semibold" style="color: var(--proto-text);">
          Email composer — {{ selectedRow.court }}
        </h3>
        <div class="flex flex-wrap items-end gap-3">
          <div class="min-w-[280px] flex-1">
            <label class="mb-1 block text-[13px] font-medium" style="color: var(--proto-text-muted);">To (email)</label>
            <UInput
              v-model="composerEmail"
              type="email"
              placeholder="Email not available — enter manually."
              class="w-full"
              size="md"
            />
          </div>
          <UButton
            color="primary"
            @click="openInMailClient"
          >
            Open in mail client
          </UButton>
        </div>
      </div>

      <p class="mt-8">
        <NuxtLink to="/" class="text-[14px] font-semibold hover:underline" style="color: var(--proto-teal);">
          ← Back to guide
        </NuxtLink>
      </p>
    </main>
    <SiteFooter />
  </div>
</template>
