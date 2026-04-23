import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const enableSeo = import.meta.env.VITE_ENABLE_SEO === 'true';
  const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://txcourseguide.com').replace(/\/$/, '');

  const content = enableSeo
    ? `User-agent: *
Allow: /

# AI crawlers — limited crawl delay
User-agent: GPTBot
Crawl-delay: 10

User-agent: OAI-SearchBot
Crawl-delay: 10

User-agent: PerplexityBot
Crawl-delay: 10

User-agent: ClaudeBot
Crawl-delay: 10

# Block scrapers with no clear benefit
User-agent: Bytespider
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

Sitemap: ${siteUrl}/sitemap-index.xml`
    : `# QA — no indexing
User-agent: *
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: OAI-SearchBot
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Bingbot
Disallow: /`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
