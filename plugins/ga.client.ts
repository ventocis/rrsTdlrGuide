export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const id = config.public?.googleAnalyticsId as string | undefined
  if (!id || typeof id !== 'string' || id.trim() === '') return

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
        async: true
      },
      {
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  })
})
