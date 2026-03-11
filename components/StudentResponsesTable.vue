<script setup lang="ts">
import type { StudentResponse } from '~/composables/useStudentResponses'
import { useStudentResponses } from '~/composables/useStudentResponses'

const {
  studentResponses,
  resultCount,
  sortBy,
  sortDir,
  toggleSort,
  providerSlug
} = useStudentResponses()

const thBase =
  'sticky top-0 z-10 border-b-2 bg-white px-3 py-3 text-[11px] font-bold uppercase tracking-[0.05em] whitespace-nowrap select-none cursor-pointer '
  + 'border-[var(--proto-card-border)] text-[var(--proto-label)]'

function headerClasses(col: string) {
  return [
    thBase,
    col === 'provider' ? 'text-left min-w-[200px]' : '',
    ['license', 'rating', 'total', 'cert', 'format', 'lang', 'date'].includes(col)
      ? 'text-center'
      : ''
  ]
}

function sortArrow(col: string) {
  const active = sortBy.value === col
  return active ? (sortDir.value === 'asc' ? '▲' : '▼') : '▼'
}

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

function displayDate(r: StudentResponse) {
  if (!r.submittedAt) return '—'
  try {
    const d = new Date(r.submittedAt)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return r.submittedAt
  }
}

function displayPaid(r: StudentResponse) {
  const v = r.totalPaid
  if (v === undefined || v === null || v === '') return '—'
  if (typeof v === 'number') return `$${v.toFixed(2)}`
  return String(v)
}
</script>

<template>
  <div class="mx-auto mb-16 mt-3.5 w-full max-w-[1600px] px-2 sm:px-5">
    <h2 class="mb-2 text-lg font-bold" style="color: var(--proto-text);">
      Student responses
    </h2>
    <p class="mb-3 text-[13px]" style="color: var(--proto-text-muted);">
      Reviews and corrections submitted by students. Data is refreshed when we run the ingest script.
    </p>
    <div
      class="w-full min-w-0 overflow-x-auto rounded-xl border bg-white shadow-sm"
      style="border-color: var(--proto-card-border); box-shadow: 0 1px 3px rgba(0,0,0,0.04); -webkit-overflow-scrolling: touch;"
    >
      <table class="w-full min-w-[800px] border-collapse">
        <thead>
          <tr>
            <th
              :class="headerClasses('provider')"
              @click="toggleSort('provider')"
            >
              <span class="inline-flex items-center">
                Provider / Course
                <span
                  class="ml-1 text-[10px]"
                  :class="sortBy === 'provider' ? 'opacity-100' : 'opacity-25'"
                >
                  {{ sortArrow('provider') }}
                </span>
              </span>
            </th>
            <th :class="headerClasses('license')">
              License (CP)
            </th>
            <th :class="headerClasses('provider')">
              First name
            </th>
            <th :class="headerClasses('provider')">
              Last name
            </th>
            <th
              :class="headerClasses('rating')"
              @click="toggleSort('rating')"
            >
              <span class="inline-flex items-center justify-center">
                Rating
                <span
                  class="ml-1 text-[10px]"
                  :class="sortBy === 'rating' ? 'opacity-100' : 'opacity-25'"
                >
                  {{ sortArrow('rating') }}
                </span>
              </span>
            </th>
            <th :class="headerClasses('total')">
              Total paid
            </th>
            <th :class="headerClasses('cert')">
              Cert
            </th>
            <th :class="headerClasses('format')">
              Format
            </th>
            <th :class="headerClasses('lang')">
              Language
            </th>
            <th
              :class="headerClasses('date')"
              @click="toggleSort('date')"
            >
              <span class="inline-flex items-center justify-center">
                Date
                <span
                  class="ml-1 text-[10px]"
                  :class="sortBy === 'date' ? 'opacity-100' : 'opacity-25'"
                >
                  {{ sortArrow('date') }}
                </span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in studentResponses"
            :key="r.id"
            class="border-b bg-white transition-colors hover:bg-[var(--proto-hover-bg)]"
            style="border-bottom-color: var(--proto-row-border);"
          >
            <td class="px-3 py-2">
              <NuxtLink
                :to="`/reviews/${providerSlug(r.providerOrCourse)}`"
                class="text-[14px] font-semibold hover:underline"
                style="color: var(--proto-teal);"
              >
                {{ r.providerOrCourse || '—' }}
              </NuxtLink>
              <span class="ml-1 text-[11px]" style="color: var(--proto-text-light);">
                View all reviews
              </span>
            </td>
            <td class="px-3 py-2 text-center">
              <span class="text-[13px]" style="color: var(--proto-text-muted);">
                {{ r.providerLicense || r.licenseCp || '—' }}
              </span>
            </td>
            <td class="px-3 py-2 text-[13px]" style="color: var(--proto-text);">
              {{ r.firstName }}
            </td>
            <td class="px-3 py-2 text-[13px]" style="color: var(--proto-text);">
              {{ r.lastName }}
            </td>
            <td class="px-3 py-2 text-center">
              <div class="flex items-center justify-center gap-1">
                <StarRating :rating="r.rating" />
                <span class="text-[13px] font-bold" style="color: var(--proto-text);">
                  {{ r.rating }}
                </span>
              </div>
            </td>
            <td class="px-3 py-2 text-center text-[13px]" style="color: var(--proto-text-muted);">
              {{ displayPaid(r) }}
            </td>
            <td class="px-3 py-2 text-center">
              <ProtoPill
                v-if="r.instantCert"
                :label="r.instantCert"
                :variant="certVariant(r.instantCert)"
              />
              <span v-else class="text-[13px]" style="color: var(--proto-text-light);">—</span>
            </td>
            <td class="px-3 py-2 text-center">
              <ProtoPill
                v-if="r.format"
                :label="r.format"
                :variant="formatVariant(r.format)"
              />
              <span v-else class="text-[13px]" style="color: var(--proto-text-light);">—</span>
            </td>
            <td class="px-3 py-2 text-center">
              <ProtoPill
                v-if="r.language"
                :label="r.language"
                :variant="langVariant(r.language)"
              />
              <span v-else class="text-[13px]" style="color: var(--proto-text-light);">—</span>
            </td>
            <td class="px-3 py-2 text-center text-[13px]" style="color: var(--proto-text-muted);">
              {{ displayDate(r) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="mt-1.5 text-center text-[11px] sm:hidden" style="color: var(--proto-text-light);">
      Scroll horizontally to see all columns
    </p>

    <div
      v-if="studentResponses.length === 0"
      class="rounded-xl border bg-white py-12 text-center text-[15px] font-semibold"
      style="border-color: var(--proto-card-border); color: var(--proto-text-muted); padding: 48px 20px;"
    >
      <div class="mb-2 text-3xl">💬</div>
      <p>No student responses yet</p>
      <NuxtLink
        to="/submit-review"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-2 inline-block text-[14px] font-semibold"
        style="color: var(--proto-teal);"
      >
        Submit a review →
      </NuxtLink>
    </div>

    <div
      v-else
      class="mt-3 text-[12px]"
      style="color: var(--proto-text-light);"
    >
      Showing {{ resultCount }} student response(s).
    </div>
  </div>
</template>
