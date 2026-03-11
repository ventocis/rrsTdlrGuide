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
      <!-- Left: logo + BETA, then tagline/counts stacked underneath -->
      <div class="flex flex-col gap-2 sm:gap-3">
        <div class="flex items-center gap-2 sm:shrink-0">
          <img
            src="/TDLR%20GUIDE%20LOGO%20(altcolor).png"
            alt="TDLR Guide logo"
            class="h-14 w-auto object-contain drop-shadow-md sm:h-16"
          />
          <span
            class="rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider"
            style="background: rgba(13,148,136,0.2); border: 1px solid rgba(13,148,136,0.3); color: var(--proto-teal-text);"
          >
            BETA
          </span>
        </div>

        <!-- Tagline + counts -->
        <div class="mt-1 space-y-0.5 sm:min-w-0">
          <p
            class="m-0 text-[14px] leading-snug"
            style="color: var(--proto-header-subtitle);"
          >
            Don't overpay for your ticket dismissal. Compare Texas’ top-rated
            courses.
          </p>
          <p class="m-0 text-[12px] leading-snug"
            style="color: var(--proto-header-subtitle);">
            Compare 33 unique Texas defensive driving providers · 236 total
            brand names
          </p>
        </div>
      </div>

      <!-- Search -->
      <div class="w-full sm:w-[280px]">
        <UInput
          v-model="searchQuery"
          placeholder="Search providers or brands..."
          size="md"
          icon="i-heroicons-magnifying-glass-20-solid"
          class="w-full !rounded-lg !border !border-[length:1px] !border-[var(--proto-search-border)] !bg-[var(--proto-search-bg)] !py-2.5 !pl-9 !pr-4 !text-[13px] !text-[#F9FAFB] placeholder:!text-[#94A3B8]"
        />
      </div>
    </div>
  </header>
</template>

