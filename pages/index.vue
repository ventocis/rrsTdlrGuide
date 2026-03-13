<script setup lang="ts">
import { useProviders } from '~/composables/useProviders'

const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl as string) || 'https://tdlrguide.com'

useProviders()

// Structured data for Google and AI: WebSite + Organization
const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TDLR Guide',
  description: 'Compare Texas’ top-rated driver safety and defensive driving courses. TDLR-approved. Real prices, ratings, formats, and student reviews. Find the best course for ticket dismissal.',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string'
  }
}

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TDLR Guide',
  url: siteUrl,
  description: 'Independent comparison guide for TDLR-approved defensive driving and driver safety courses in Texas.'
}

useHead({
  link: [{ rel: 'canonical', href: siteUrl + '/' }],
  meta: [
    { property: 'og:url', content: siteUrl + '/' },
    {
      name: 'keywords',
      content:
        'Texas defensive driving, TDLR approved courses, driver safety course Texas, ticket dismissal, defensive driving comparison, TDLR Guide, compare courses'
    }
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLdWebSite) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLdOrganization) }
  ],
  __dangerouslyDisableSanitizers: ['script']
})
</script>

<template>
  <div
    class="min-h-screen font-['DM_Sans',system-ui,sans-serif]"
    style="background-color: var(--proto-page-bg);"
  >
    <SiteHeader />
    <main role="main" aria-label="Compare Texas defensive driving courses">
      <FilterBar />
      <ProviderTable />
      <StudentResponsesTable />
    </main>
    <SiteFooter />
  </div>
</template>

