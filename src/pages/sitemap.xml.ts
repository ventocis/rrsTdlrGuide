import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://txcourseguide.com').replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];

  // Pages with explicit priority and changefreq.
  // Update this list whenever a new page route is added.
  const pages: { path: string; priority: string; changefreq: string }[] = [
    { path: '/',                   priority: '1.0', changefreq: 'weekly'  },
    { path: '/eligibility-checker', priority: '0.9', changefreq: 'weekly'  },
    { path: '/courts',              priority: '0.9', changefreq: 'weekly'  },
    { path: '/ticket-calculator',   priority: '0.8', changefreq: 'monthly' },
    { path: '/pricing',             priority: '0.8', changefreq: 'monthly' },
    { path: '/faq',                 priority: '0.8', changefreq: 'monthly' },
    { path: '/houston',             priority: '0.8', changefreq: 'monthly' },
    { path: '/dallas',              priority: '0.8', changefreq: 'monthly' },
    { path: '/harris-county',       priority: '0.8', changefreq: 'monthly' },
    { path: '/san-antonio',         priority: '0.8', changefreq: 'monthly' },
    { path: '/austin',              priority: '0.8', changefreq: 'monthly' },
    { path: '/live',               priority: '0.7', changefreq: 'weekly'  },
    // Excluded: /404, /privacy, /terms (noindex or low-value)
  ];

  const urls = pages
    .map(
      ({ path, priority, changefreq }) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
