import { defineNuxtConfig } from 'nuxt/config'

const seoEnabled = process.env.NUXT_PUBLIC_SEO_ENABLED !== 'false'

export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: {
      routes: [
        '/pricing',
        '/eligibility-checker',
        '/terms',
        '/privacy',
        '/court-outreach',
        '/courts',
        '/ticket-calculator',
        '/robots.txt'
      ]
    }
  },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      /** 'qa' | 'prod' — set via NUXT_PUBLIC_ENV in CI */
      env: process.env.NUXT_PUBLIC_ENV || 'prod',
      /** SEO meta tags, canonical links, OG tags enabled. Set NUXT_PUBLIC_SEO_ENABLED=false on QA. */
      seoEnabled: process.env.NUXT_PUBLIC_SEO_ENABLED !== 'false',
      /** Google Analytics loading enabled. Set NUXT_PUBLIC_GOOGLE_ANALYTICS_ENABLED=false on QA. */
      googleAnalyticsEnabled: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ENABLED !== 'false',
      /** Canonical site URL for SEO. Set NUXT_PUBLIC_SITE_URL in production. */
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://tdlrguide.com',
      /** Form submission endpoint. */
      formAction: process.env.NUXT_PUBLIC_FORM_ACTION || 'https://formspree.io/f/maqpolpb',
      /** Optional: reCAPTCHA v3 site key for Formspree. */
      recaptchaSiteKey: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
      /** Google Analytics 4 Measurement ID. Set NUXT_PUBLIC_GOOGLE_ANALYTICS_ID in production only. */
      googleAnalyticsId: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''
    }
  },
  app: {
    head: {
      title: 'TDLR Guide \u2014 Compare Texas Defensive Driving Courses',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // QA: block all crawling. Prod: normal indexing.
        seoEnabled
          ? { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' }
          : { name: 'robots', content: 'noindex, nofollow' },
        { name: 'theme-color', content: '#0d9488' },
        // Prod-only: description, keywords, Search Console verification, OG, Twitter
        ...(seoEnabled ? [
          {
            name: 'description',
            content: 'Compare Texas\u2019 top-rated driver safety and defensive driving courses. TDLR-approved. Real prices, formats, and certificate delivery options. Find the best course for ticket dismissal.'
          },
          {
            name: 'keywords',
            content: 'Texas defensive driving, TDLR approved courses, driver safety course Texas, ticket dismissal, defensive driving comparison, TDLR Guide'
          },
          { name: 'google-site-verification', content: 'FF_Yk4-XqbVumU8j1MUU3UDOsTQ3Sb0K1MB0xKdUqFc' },
          { property: 'og:type', content: 'website' },
          { property: 'og:site_name', content: 'TDLR Guide' },
          { property: 'og:title', content: 'TDLR Guide \u2014 Compare Texas Defensive Driving Courses' },
          { property: 'og:description', content: 'Compare Texas\u2019 top-rated driver safety and defensive driving courses. TDLR-approved. Real prices, formats, and certificate delivery options.' },
          { property: 'og:image', content: 'https://tdlrguide.com/favicon.png' },
          { property: 'og:url', content: 'https://tdlrguide.com/' },
          { property: 'og:locale', content: 'en_US' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: 'TDLR Guide \u2014 Compare Texas Defensive Driving Courses' },
          { name: 'twitter:description', content: 'Compare Texas\u2019 top-rated driver safety and defensive driving courses. TDLR-approved. Real prices, formats, and certificate delivery options.' }
        ] as any[] : [])
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'
        },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  ui: {},
  future: {
    compatibilityVersion: 4
  }
})
