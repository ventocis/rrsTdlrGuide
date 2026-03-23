<template>
  <footer
    class="border-t bg-white py-6 px-3 sm:px-5"
    style="border-color: var(--proto-card-border);"
  >
    <div
      class="mx-auto flex w-full max-w-[1600px] flex-col gap-3 text-[11px]"
      style="color: var(--proto-text-light);"
    >
      <p class="m-0 text-[10px] leading-snug" style="color: var(--proto-text-light);">
        Compare {{ totalProviders }} unique Texas defensive driving providers · {{ totalBrands }} total brand names
      </p>
      <p class="m-0 max-w-[800px] leading-snug" style="color: var(--proto-text-muted); font-size: 10px;">
        This site is for informational and comparison purposes only. We are not affiliated with TDLR or the State of Texas. Prices and details may change; always verify with the provider and TDLR before making decisions. Use of this site is subject to our
        <NuxtLink to="/terms" class="font-medium underline" style="color: var(--proto-teal);">Terms of Use</NuxtLink>
        and
        <NuxtLink to="/privacy" class="font-medium underline" style="color: var(--proto-teal);">Privacy Policy</NuxtLink>.
      </p>
      <p class="m-0 max-w-[800px] leading-snug" style="color: var(--proto-text-muted); font-size: 10px;">
        <strong>Affiliate disclosure:</strong> TDLR Guide may earn a commission when you purchase a course through links on this site. This does not affect our rankings or editorial independence.
      </p>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span>
          Independent guide · Not affiliated with TDLR or the State of Texas
        </span>
        <span>
          Data last updated: Mar 9, 2026
        </span>
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-1">
        <NuxtLink to="/privacy" class="font-medium" style="color: var(--proto-teal);">
          Privacy Policy
        </NuxtLink>
        <NuxtLink to="/terms" class="font-medium" style="color: var(--proto-teal);">
          Terms of Use
        </NuxtLink>
        <a href="mailto:info@tdlrguide.com" class="font-medium" style="color: var(--proto-teal);">
          info@tdlrguide.com
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { totalProviders, totalBrands } = useProviders()
</script>
