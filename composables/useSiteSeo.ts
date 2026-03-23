/**
 * SEO-aware wrappers around useSeoMeta / useHead.
 *
 * When NUXT_PUBLIC_SEO_ENABLED=false (QA) all calls are no-ops so that no OG,
 * Twitter, canonical, or description tags are injected into the static HTML.
 * The global nuxt.config head already injects noindex/nofollow when SEO is off.
 */

type SeoMetaParams = Parameters<typeof useSeoMeta>[0]

/** Drop-in replacement for useSeoMeta. Skipped when SEO is disabled. */
export function useSiteSeoMeta(params: SeoMetaParams) {
  const { seoEnabled } = useRuntimeConfig().public as { seoEnabled: boolean }
  if (!seoEnabled) return
  useSeoMeta(params)
}

/** Injects canonical + og:url for a page. Skipped when SEO is disabled. */
export function useSiteCanonical(canonical: string, ogUrl?: string) {
  const { seoEnabled } = useRuntimeConfig().public as { seoEnabled: boolean }
  if (!seoEnabled) return
  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    meta: ogUrl ? [{ property: 'og:url', content: ogUrl }] : []
  })
}
