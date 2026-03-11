<script setup lang="ts">
import { useProviders } from '~/composables/useProviders'

const { searchQuery, totalProviders, totalBrands } = useProviders()
</script>

<template>
  <header
    class="relative overflow-hidden py-6 px-3 sm:px-5"
    style="background: linear-gradient(135deg, var(--proto-header-from), var(--proto-header-to));"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-100"
      style="background: radial-gradient(ellipse at 30% 50%, rgba(13,148,136,0.12) 0%, transparent 60%);"
    />
    <div
      class="relative mx-auto flex w-full max-w-[1600px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
    >
      <!-- Left: logo + BETA + tagline -->
      <div class="flex flex-col gap-2 sm:shrink-0">
        <div class="flex items-center gap-2">
          <NuxtLink to="/" class="flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--proto-teal)] focus:ring-offset-2 focus:ring-offset-transparent rounded">
            <img
              src="/TDLR%20GUIDE%20LOGO%20(altcolor).png"
              alt="TDLR Guide logo"
              class="h-14 w-auto object-contain drop-shadow-md sm:h-16"
            />
          </NuxtLink>
          <span
            class="rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider"
            style="background: rgba(13,148,136,0.2); border: 1px solid rgba(13,148,136,0.3); color: var(--proto-teal-text);"
          >
            BETA
          </span>
        </div>
        <p
          class="m-0 mt-0.5 text-[14px] font-medium leading-snug"
          style="color: var(--proto-header-subtitle);"
        >
          Don't overpay for your ticket dismissal. Compare Texas' top-rated courses.
        </p>
      </div>

      <!-- Search -->
      <div class="relative w-full sm:w-[280px]">
        <span
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--proto-header-subtitle)]"
          aria-hidden="true"
        >
          <UIcon name="i-heroicons-magnifying-glass-20-solid" class="h-4 w-4" />
        </span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search providers or brands..."
          class="w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-10 pr-4 text-[13px] text-[#F9FAFB] placeholder:text-[#94A3B8] outline-none transition-colors focus:border-[var(--proto-teal)] focus:bg-white/15 focus:ring-2 focus:ring-[var(--proto-teal)]/30"
          aria-label="Search providers or brands"
        />
      </div>
    </div>
  </header>
</template>

