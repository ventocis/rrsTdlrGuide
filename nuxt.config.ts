import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/pricing', '/eligibility-checker', '/terms', '/privacy', '/submit-review', '/court-outreach']
    }
  },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      /** Canonical site URL for SEO (sitemap, og:url, canonical). Set NUXT_PUBLIC_SITE_URL in production. */
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://tdlrguide.com',
      /** Form submission endpoint. Override with NUXT_PUBLIC_FORM_ACTION if needed. */
      formAction: process.env.NUXT_PUBLIC_FORM_ACTION || 'https://formspree.io/f/maqpolpb',
      /** Optional: reCAPTCHA v3 site key for Formspree. When set, the submit-review form sends a token. */
      recaptchaSiteKey: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
    }
  },
  app: {
    head: {
      title: 'TDLR Guide — Compare Texas Defensive Driving Courses',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Compare Texas’ top-rated driver safety and defensive driving courses. TDLR-approved. Real prices, ratings, formats, and student reviews. Find the best course for ticket dismissal.'
        },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'TDLR Guide — Compare Texas Defensive Driving Courses' },
        {
          property: 'og:description',
          content: 'Compare Texas’ top-rated driver safety and defensive driving courses. TDLR-approved. Real prices, ratings, and student reviews.'
        },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'TDLR Guide — Compare Texas Defensive Driving Courses' },
        {
          name: 'twitter:description',
          content: 'Compare Texas’ top-rated driver safety and defensive driving courses. TDLR-approved. Real prices, ratings, and student reviews.'
        }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png'
        }
      ]
    }
  },
  ui: {
    // basic Nuxt UI config, can be customized later
  },
  future: {
    compatibilityVersion: 4
  }
})

