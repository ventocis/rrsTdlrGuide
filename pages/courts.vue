<script setup lang="ts">
import type { CourtRecord } from '~/composables/useCourts'

const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl as string) || 'https://tdlrguide.com'

const seoTitle =
  'Texas Court Lookup — Find Your JP or Municipal Court | TDLR Guide'
const seoDescription =
  'Look up any Texas Justice of the Peace or Municipal court by county. Get judge name, phone, email, and website for defensive driving ticket dismissal.'

useSiteSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: `${siteUrl}/courts`,
  ogType: 'website',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  robots: 'index, follow'
})

// Structured data for Google and AI: WebApplication + BreadcrumbList
const jsonLdWebApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Texas Court Lookup',
  description: seoDescription,
  url: `${siteUrl}/courts`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: {
    '@type': 'Organization',
    name: 'TDLR Guide',
    url: siteUrl
  },
  mainEntity: {
    '@type': 'WebPage',
    name: seoTitle,
    description: seoDescription,
    primaryImageOfPage: { '@type': 'ImageObject', url: `${siteUrl}/favicon.png` }
  }
}

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'TDLR Guide', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Texas Court Lookup', item: `${siteUrl}/courts` }
  ]
}

useSiteCanonical(`${siteUrl}/courts`, `${siteUrl}/courts`)

useHead({
  meta: [
    {
      name: 'keywords',
      content:
        'Texas court lookup, JP court Texas, municipal court Texas, Justice of the Peace, court directory Texas, defensive driving court, ticket dismissal court, TDLR'
    }
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLdWebApp) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLdBreadcrumb) }
  ],
  __dangerouslyDisableSanitizers: ['script']
})

const selectedCourt = ref<CourtRecord | null>(null)

/** Only use as link when it looks like a real URL (avoids "Website Not Found" etc. breaking prerender). */
const courtWebsiteUrl = computed(() => {
  const w = selectedCourt.value?.website
  if (!w || typeof w !== 'string') return ''
  const t = w.trim()
  if (t === '' || t.toLowerCase() === 'website not found' || t.toLowerCase() === 'not found' || t.toLowerCase() === 'n/a') return ''
  if (t.startsWith('http://') || t.startsWith('https://')) return t
  return ''
})

function formatPhone(phone: string) {
  const raw = String(phone || '').trim()
  if (!raw) return ''
  const digits = raw.replace(/[^\d+]/g, '')
  return digits || raw
}
</script>

<template>
  <div
    class="court-lookup-page min-h-screen font-['DM_Sans',system-ui,sans-serif]"
    style="background-color: var(--proto-page-bg);"
  >
    <SiteHeader />

    <main class="mx-auto w-full max-w-[960px] px-4 py-8 sm:px-6" role="main">
      <header class="mb-6" aria-label="Page header">
        <h1
          class="mb-2 text-2xl font-bold leading-tight sm:text-3xl"
          style="color: var(--proto-text);"
        >
          Texas Court Lookup — Find Your JP or Municipal Court
        </h1>
        <p
          class="max-w-[640px] text-[14px]"
          style="color: var(--proto-text-muted);"
        >
          Look up any Texas Justice of the Peace or Municipal court by county.
          Get judge name, phone, email, and website for defensive driving and
          ticket dismissal. Free directory from TDLR Guide.
        </p>
      </header>

      <!-- Section 1 — Court Finder -->
      <section
        aria-labelledby="court-finder-heading"
        class="mb-6 rounded-2xl border bg-white p-4 sm:p-6"
        style="border-color: var(--proto-card-border);"
      >
        <h2
          id="court-finder-heading"
          class="mb-2 text-lg font-semibold"
          style="color: var(--proto-text);"
        >
          Court Finder
        </h2>
        <p class="mb-4 text-[13px]" style="color: var(--proto-text-muted);">
          Start by selecting your county, then court type, then the specific
          court handling your ticket.
        </p>

        <CourtSelector v-model:selectedCourt="selectedCourt" />

        <!-- Court detail card -->
        <div
          v-if="selectedCourt"
          class="mt-5 rounded-xl border bg-[var(--proto-hover-bg)] p-4 sm:p-5"
          style="border-color: var(--proto-card-border);"
        >
          <h3
            class="mb-1 text-base font-semibold"
            style="color: var(--proto-text);"
          >
            {{ selectedCourt.court }} —
            {{ selectedCourt.courtType }}
          </h3>
          <p class="mb-3 text-[13px]" style="color: var(--proto-text-muted);">
            {{ selectedCourt.county }} County
          </p>

          <div class="grid gap-3 text-[13px] sm:grid-cols-2">
            <div>
              <h4 class="mb-1 font-semibold" style="color: var(--proto-text);">
                Judge
              </h4>
              <p class="m-0" style="color: var(--proto-text);">
                {{
                  [
                    selectedCourt.prefix,
                    selectedCourt.firstName,
                    selectedCourt.middleName,
                    selectedCourt.lastName,
                    selectedCourt.suffix
                  ]
                    .filter((p) => p && String(p).trim() !== '')
                    .join(' ') || 'Not listed'
                }}
              </p>
              <p
                v-if="selectedCourt.title"
                class="m-0 text-[12px]"
                style="color: var(--proto-text-muted);"
              >
                {{ selectedCourt.title }}
              </p>
            </div>

            <div>
              <h4 class="mb-1 font-semibold" style="color: var(--proto-text);">
                Address
              </h4>
              <p class="m-0" style="color: var(--proto-text);">
                {{ selectedCourt.address || 'Not on file' }}
              </p>
              <p
                class="m-0 text-[13px]"
                style="color: var(--proto-text);"
              >
                {{
                  [selectedCourt.city, selectedCourt.zipCode]
                    .filter((p) => p && String(p).trim() !== '')
                    .join(', ') || ''
                }}
              </p>
            </div>

            <div>
              <h4 class="mb-1 font-semibold" style="color: var(--proto-text);">
                Phone
              </h4>
              <p class="m-0" style="color: var(--proto-text);">
                <a
                  v-if="selectedCourt.phone"
                  :href="`tel:${formatPhone(selectedCourt.phone)}`"
                  class="font-medium hover:underline"
                  style="color: var(--proto-teal);"
                >
                  {{ selectedCourt.phone }}
                </a>
                <span v-else>Not on file</span>
              </p>
            </div>

            <div>
              <h4 class="mb-1 font-semibold" style="color: var(--proto-text);">
                Email
              </h4>
              <p class="m-0" style="color: var(--proto-text);">
                <a
                  v-if="selectedCourt.email"
                  :href="`mailto:${selectedCourt.email}`"
                  class="font-medium hover:underline break-all"
                  style="color: var(--proto-teal);"
                >
                  {{ selectedCourt.email }}
                </a>
                <span v-else>Not on file</span>
              </p>
            </div>

            <div>
              <h4 class="mb-1 font-semibold" style="color: var(--proto-text);">
                Website
              </h4>
              <p class="m-0" style="color: var(--proto-text);">
                <a
                  v-if="courtWebsiteUrl"
                  :href="courtWebsiteUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium hover:underline"
                  style="color: var(--proto-teal);"
                >
                  Visit court website
                </a>
                <span v-else>Not on file</span>
              </p>
            </div>
          </div>

          <p
            class="mt-4 text-[12px]"
            style="color: var(--proto-text-muted);"
          >
            Information sourced from public court directory records. Verify
            details with the court before submitting documents.
          </p>
        </div>
      </section>

      <!-- Section 2 — Eligibility CTA (always visible) -->
      <section
        class="eligibility-cta-card mt-4 rounded-2xl border px-4 py-4 sm:px-6 sm:py-5"
        style="background: var(--proto-teal-bg); border-color: var(--proto-teal-border);"
        aria-labelledby="eligibility-cta-heading"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="eligibility-cta-heading"
              class="mb-1 text-base font-semibold sm:text-lg"
              style="color: var(--proto-text);"
            >
              Not sure if you qualify for defensive driving?
            </h2>
            <p
              class="m-0 max-w-[520px] text-[13px]"
              style="color: var(--proto-text-muted);"
            >
              Answer 5 quick questions to find out if your ticket is eligible
              for dismissal — and get your exact next steps.
            </p>
          </div>
          <NuxtLink
            to="/eligibility-checker"
            class="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white transition-colors"
            style="background: var(--proto-header-from);"
          >
            Check My Eligibility →
          </NuxtLink>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

