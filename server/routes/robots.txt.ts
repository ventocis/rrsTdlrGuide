/**
 * Dynamically generated robots.txt.
 * When NUXT_PUBLIC_SEO_ENABLED=false (QA): block all crawlers including AI bots.
 * When NUXT_PUBLIC_SEO_ENABLED=true or unset (prod/local): allow all legitimate
 * crawlers, allow AI crawlers, block low-value scrapers, reference sitemap.
 *
 * Prerendered by Nitro at build time so the static output already contains
 * the correct content for each environment.
 */
export default defineEventHandler(() => {
  const seoEnabled = process.env.NUXT_PUBLIC_SEO_ENABLED !== 'false'

  const content = !seoEnabled
    ? [
        '# QA environment — block all crawlers',
        'User-agent: *',
        'Disallow: /',
        '',
        'User-agent: GPTBot',
        'Disallow: /',
        '',
        'User-agent: OAI-SearchBot',
        'Disallow: /',
        '',
        'User-agent: PerplexityBot',
        'Disallow: /',
        '',
        'User-agent: Google-Extended',
        'Disallow: /',
        '',
        'User-agent: ClaudeBot',
        'Disallow: /',
        '',
        'User-agent: anthropic-ai',
        'Disallow: /',
        '',
        'User-agent: Bingbot',
        'Disallow: /',
        ''
      ].join('\n')
    : [
        '# Standard crawlers',
        'User-agent: *',
        'Allow: /',
        '',
        '# OpenAI',
        'User-agent: GPTBot',
        'Allow: /',
        'Crawl-delay: 5',
        '',
        'User-agent: OAI-SearchBot',
        'Allow: /',
        '',
        '# Perplexity',
        'User-agent: PerplexityBot',
        'Allow: /',
        '',
        '# Google AI',
        'User-agent: Google-Extended',
        'Allow: /',
        '',
        '# Microsoft / Bing AI',
        'User-agent: Bingbot',
        'Allow: /',
        '',
        '# Anthropic / Claude',
        'User-agent: ClaudeBot',
        'Allow: /',
        '',
        'User-agent: anthropic-ai',
        'Allow: /',
        '',
        '# Block low-value scrapers',
        'User-agent: Bytespider',
        'Disallow: /',
        '',
        'User-agent: AhrefsBot',
        'Disallow: /',
        '',
        'User-agent: SemrushBot',
        'Disallow: /',
        '',
        'User-agent: MJ12bot',
        'Disallow: /',
        '',
        '# Sitemap',
        'Sitemap: https://tdlrguide.com/sitemap.xml',
        ''
      ].join('\n')

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
})
