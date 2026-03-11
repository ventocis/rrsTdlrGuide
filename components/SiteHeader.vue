<script setup lang="ts">
import { useProviders } from '~/composables/useProviders'

const { searchQuery, totalProviders, totalBrands } = useProviders()
</script>

<template>
  <header
    class="relative overflow-hidden bg-gradient-to-br from-rui-neutral-900 to-rui-neutral-800 px-4 py-5 sm:px-6 sm:py-6"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(79,115,219,0.12)_0%,transparent_55%)]"
    />
    <div
      class="relative mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
    >
      <!-- Left: logo + BETA, then tagline/counts stacked underneath -->
      <div class="flex flex-col gap-2 sm:gap-3">
        <div class="flex items-center gap-2 sm:shrink-0">
          <img
            src="/TDLR%20GUIDE%20LOGO%20(altcolor).png"
            alt="TDLR Guide logo"
            class="h-14 w-auto object-contain drop-shadow-md sm:h-16"
          />
          <span
            class="rounded-full bg-rui-primary-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rui-primary-200 ring-1 ring-rui-primary-400/50"
          >
            BETA
          </span>
        </div>

        <!-- Tagline + counts -->
        <div class="mt-1 space-y-0.5 sm:min-w-0">
          <p
            class="m-0 text-[13px] font-medium leading-snug text-rui-neutral-200 sm:text-[14px]"
          >
            Don't overpay for your ticket dismissal. Compare Texas’ top-rated
            courses.
          </p>
          <p class="m-0 text-[12px] leading-snug text-rui-neutral-400">
            Compare 33 unique Texas defensive driving providers · 236 total
            brand names
          </p>
        </div>
      </div>

      <!-- Search -->
      <div class="w-full sm:w-auto sm:min-w-[240px] sm:max-w-[280px]">
        <UInput
          v-model="searchQuery"
          placeholder="Search providers or brands..."
          size="md"
          class="w-full text-sm"
          icon="i-heroicons-magnifying-glass-20-solid"
          :ui="{
            base: 'bg-white/10 border-rui-neutral-500/30 text-rui-neutral-100 placeholder:text-rui-neutral-400 backdrop-blur-sm',
            rounded: 'rounded-lg',
          }"
        />
      </div>
    </div>
  </header>
</template>

