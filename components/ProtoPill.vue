<script setup lang="ts">
/**
 * Presentational pill using prototype design tokens.
 * variant: cert-free | cert-paid | cert-mail | format-online | format-inperson | format-both | lang-engspanish | lang-english | lang-spanish | lang-other
 */
const props = defineProps<{
  label: string
  variant: string
}>()

const style = computed(() => {
  const v = props.variant
  const base =
    'padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; border: 1px solid; line-height: 1.2; white-space: nowrap; display: inline-flex; align-items: center;'
  if (v === 'cert-free') return `${base} var(--pill-cert-free-border); background: var(--pill-cert-free-bg); color: var(--pill-cert-free-text);`
  if (v === 'cert-paid') return `${base} var(--pill-cert-paid-border); background: var(--pill-cert-paid-bg); color: var(--pill-cert-paid-text);`
  if (v === 'cert-mail') return `${base} var(--pill-cert-mail-border); background: var(--pill-cert-mail-bg); color: var(--pill-cert-mail-text);`
  if (v === 'format-online') return `${base} var(--pill-format-online-border); background: var(--pill-format-online-bg); color: var(--pill-format-online-text);`
  if (v === 'format-inperson') return `${base} var(--pill-format-inperson-border); background: var(--pill-format-inperson-bg); color: var(--pill-format-inperson-text);`
  if (v === 'format-both') return `${base} var(--pill-format-both-border); background: var(--pill-format-both-bg); color: var(--pill-format-both-text);`
  if (v === 'lang-engspanish') return `${base} var(--pill-lang-engspanish-border); background: var(--pill-lang-engspanish-bg); color: var(--pill-lang-engspanish-text);`
  if (v === 'lang-english') return `${base} var(--pill-lang-english-border); background: var(--pill-lang-english-bg); color: var(--pill-lang-english-text);`
  if (v === 'lang-spanish') return `${base} var(--pill-lang-spanish-border); background: var(--pill-lang-spanish-bg); color: var(--pill-lang-spanish-text);`
  return `${base} var(--pill-lang-other-border); background: var(--pill-lang-other-bg); color: var(--pill-lang-other-text);`
})
</script>

<template>
  <span class="inline-block" :style="style">{{ label }}</span>
</template>
