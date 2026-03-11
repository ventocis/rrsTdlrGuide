<script setup lang="ts">
import type { StudentResponse } from '~/composables/useStudentResponses'
import { useStudentResponses } from '~/composables/useStudentResponses'

const route = useRoute()
const slug = (route.params.providerSlug as string) || ''

const { getReviewsForProvider, getUniqueProviders } = useStudentResponses()

const providerName = computed(() => {
  const providers = getUniqueProviders()
  const found = providers.find((p) => p.slug === slug)
  return found?.name ?? slug.replace(/-/g, ' ')
})

const reviews = computed(() => {
  if (!slug) return []
  const list = getUniqueProviders()
  const found = list.find((p) => p.slug === slug)
  if (!found) return []
  return getReviewsForProvider(found.name)
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

function displayName(r: StudentResponse) {
  const first = r.firstName?.trim() || ''
  const last = r.lastName?.trim() || ''
  if (last) return `${first} ${last[0]}.`
  return first || 'Anonymous'
}

function displayDate(r: StudentResponse) {
  if (!r.submittedAt) return ''
  try {
    return new Date(r.submittedAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return r.submittedAt
  }
}
</script>

<template>
  <div
    class="min-h-screen font-['DM_Sans',system-ui,sans-serif]"
    style="background-color: var(--proto-page-bg);"
  >
    <SiteHeader />
    <main class="mx-auto w-full max-w-[800px] px-4 py-10 sm:px-6">
      <nav class="mb-6 text-[13px]" style="color: var(--proto-text-muted);">
        <NuxtLink to="/" class="hover:underline" style="color: var(--proto-teal);">
          ← Back to guide
        </NuxtLink>
      </nav>

      <h1 class="mb-1 text-xl font-bold" style="color: var(--proto-text);">
        Reviews for {{ providerName }}
      </h1>
      <p class="mb-8 text-[14px]" style="color: var(--proto-text-muted);">
        Student-submitted reviews and corrections for this course.
      </p>

      <div v-if="reviews.length === 0" class="rounded-xl border bg-white py-12 text-center" style="border-color: var(--proto-card-border);">
        <p class="mb-2 font-semibold" style="color: var(--proto-text-muted);">
          No reviews yet
        </p>
        <p class="text-[14px]" style="color: var(--proto-text-light);">
          Be the first to submit a review for this course.
        </p>
        <NuxtLink
          to="/submit-review"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-3 inline-block text-[14px] font-semibold"
          style="color: var(--proto-teal);"
        >
          Submit a review →
        </NuxtLink>
        <p class="mt-4">
          <NuxtLink to="/" class="text-[13px]" style="color: var(--proto-teal);">
            ← Back to guide
          </NuxtLink>
        </p>
      </div>

      <div v-else class="space-y-6">
        <article
          v-for="r in reviews"
          :key="r.id"
          class="rounded-xl border bg-white p-5 shadow-sm"
          style="border-color: var(--proto-card-border);"
        >
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <span class="text-[14px] font-semibold" style="color: var(--proto-text);">
              {{ displayName(r) }}
            </span>
            <ProtoPill
              v-if="r.format"
              :label="r.format"
              :variant="formatVariant(r.format)"
            />
            <ProtoPill
              v-if="r.language"
              :label="r.language"
              :variant="langVariant(r.language)"
            />
            <ProtoPill
              v-if="r.instantCert"
              :label="r.instantCert"
              :variant="certVariant(r.instantCert)"
            />
            <span
              v-if="r.licenseCp"
              class="rounded-full border px-2 py-0.5 text-[11px] font-medium"
              style="border-color: var(--proto-card-border); color: var(--proto-text-muted);"
            >
              {{ r.licenseCp }}
            </span>
            <span
              v-if="displayDate(r)"
              class="text-[12px]"
              style="color: var(--proto-text-light);"
            >
              {{ displayDate(r) }}
            </span>
          </div>
          <div v-if="r.notes" class="text-[14px] leading-relaxed" style="color: var(--proto-text);">
            {{ r.notes }}
          </div>
          <div class="mt-2 flex flex-wrap gap-3 text-[13px]" style="color: var(--proto-text-muted);">
            <span v-if="r.rating">
              Rating: <strong style="color: var(--proto-text);">{{ r.rating }}</strong>/5
            </span>
            <span v-if="r.totalPaid !== undefined && r.totalPaid !== null && r.totalPaid !== ''">
              Paid: <strong style="color: var(--proto-text);">{{ typeof r.totalPaid === 'number' ? `$${r.totalPaid.toFixed(2)}` : r.totalPaid }}</strong>
            </span>
          </div>
        </article>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
