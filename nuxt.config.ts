import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'static'
  },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
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

