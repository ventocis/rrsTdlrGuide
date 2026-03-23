export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { googleAnalyticsId, googleAnalyticsEnabled } = config.public as {
    googleAnalyticsId: string
    googleAnalyticsEnabled: boolean
  }

  if (!googleAnalyticsEnabled) return
  if (!googleAnalyticsId || googleAnalyticsId.trim() === '') return

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
        async: true
      },
      {
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleAnalyticsId}');`
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  })
})
