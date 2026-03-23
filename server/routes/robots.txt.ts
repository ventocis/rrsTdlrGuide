/**
 * Dynamically generated robots.txt.
 * When NUXT_PUBLIC_SEO_ENABLED=false (QA): block all crawlers.
 * When NUXT_PUBLIC_SEO_ENABLED=true or unset (prod/local): allow all, reference sitemap.
 *
 * Prerendered by Nitro at build time so the static output already contains
 * the correct content for each environment.
 */
export default defineEventHandler(() => {
  const seoEnabled = process.env.NUXT_PUBLIC_SEO_ENABLED !== 'false'

  const content = !seoEnabled
    ? [
        '# QA environment — not for public indexing',
        'User-agent: *',
        'Disallow: /',
        ''
      ].join('\n')
    : [
        '# TDLR Guide — Texas defensive driving course comparison',
        'User-agent: *',
        'Allow: /',
        '',
        '# Sitemap',
        'Sitemap: https://tdlrguide.com/sitemap.xml',
        ''
      ].join('\n')

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
})
