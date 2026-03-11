<script setup lang="ts">
import { useProviders } from '~/composables/useProviders'

const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl as string) || 'https://tdlrguide.com'

useProviders()

const jsonLd = {
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

useHead({
  link: [{ rel: 'canonical', href: siteUrl + '/' }],
  meta: [
    { property: 'og:url', content: siteUrl + '/' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd)
    }
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
    <FilterBar />
    <ProviderTable />
    <StudentResponsesTable />
    <SiteFooter />
  </div>
</template>

