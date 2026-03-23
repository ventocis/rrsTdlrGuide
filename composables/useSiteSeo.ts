/**
 * SEO-aware wrappers around useSeoMeta / useHead.
 *
 * On QA (NUXT_PUBLIC_ENV=qa) all calls are no-ops so that no OG, Twitter,
 * canonical, or description tags are injected into the static HTML.
 * The global nuxt.config head already injects noindex/nofollow on QA.
 */

type SeoMetaParams = Parameters<typeof useSeoMeta>[0]

/** Drop-in replacement for useSeoMeta. Skipped entirely on QA. */
export function useSiteSeoMeta(params: SeoMetaParams) {
  const { env } = useRuntimeConfig().public
  if (env === 'qa') return
  useSeoMeta(params)
}

/** Injects canonical + og:url for a page. Skipped entirely on QA. */
export function useSiteCanonical(canonical: string, ogUrl?: string) {
  const { env } = useRuntimeConfig().public
  if (env === 'qa') return
  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    meta: ogUrl ? [{ property: 'og:url', content: ogUrl }] : []
  })
}
