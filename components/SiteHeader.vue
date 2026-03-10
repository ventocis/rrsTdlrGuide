<script setup lang="ts">
import { useProviders } from '~/composables/useProviders'

const { searchQuery, totalProviders, totalBrands } = useProviders()
</script>

<template>
  <header
    class="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-7"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(13,148,136,0.12)_0%,transparent_60%)]"
    />
    <div
      class="relative mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4"
    >
      <div>
        <div class="mb-1 flex items-center gap-2.5">
          <span
            class="text-[22px] font-extrabold tracking-tight text-slate-50"
          >
            tdlrguide
          </span>
          <span
            class="rounded bg-teal-900/40 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-teal-300 ring-1 ring-teal-500/60"
          >
            BETA
          </span>
        </div>
        <p class="m-0 text-sm text-slate-400">
          Compare {{ totalProviders }} unique Texas defensive driving providers
          · {{ totalBrands }} total brand names
        </p>
      </div>
      <div class="relative w-full max-w-xs">
        <UInput
          v-model="searchQuery"
          placeholder="Search providers or brands..."
          size="md"
          class="w-full text-sm"
          icon="i-heroicons-magnifying-glass-20-solid"
          :ui="{
            base: 'bg-white/5 border-white/10 text-slate-50 placeholder:text-slate-400',
            rounded: 'rounded-lg',
          }"
        />
      </div>
    </div>
  </header>
</template>

