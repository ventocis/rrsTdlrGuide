import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'static'
  },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      /** Form submission endpoint. Override with NUXT_PUBLIC_FORM_ACTION if needed. */
      formAction: process.env.NUXT_PUBLIC_FORM_ACTION || 'https://formspree.io/f/maqpolpb',
      /** Optional: reCAPTCHA v3 site key for Formspree. When set, the submit-review form sends a token. */
      recaptchaSiteKey: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
    }
  },
  app: {
    head: {
      title: 'TDLR Guide — Compare Texas Defensive Driving Courses',
      meta: [
        {
          name: 'description',
          content:
            'Compare every TDLR-approved defensive driving course in Texas. Real prices, real reviews, no duplicates.'
        },
        {
          property: 'og:title',
          content: 'TDLR Guide — Compare Texas Defensive Driving Courses'
        },
        {
          property: 'og:description',
          content: 'Compare every TDLR-approved defensive driving course in Texas.'
        }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
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

