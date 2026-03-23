/**
 * Dynamically generated robots.txt.
 * On QA (NUXT_PUBLIC_ENV=qa): block all crawlers.
 * On prod (default): allow all, reference sitemap.
 *
 * This file is prerendered by Nitro at build time so the static
 * output already contains the correct content for each environment.
 */
export default defineEventHandler(() => {
  const isQA = process.env.NUXT_PUBLIC_ENV === 'qa'

  const content = isQA
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
