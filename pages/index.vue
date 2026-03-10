<script setup lang="ts">
import { useProviders } from '~/composables/useProviders'

// ensure composable is initialized on page load
useProviders()
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 font-[family-name:var(--font-dm-sans,DM_Sans,_system-ui,_sans-serif)]"
  >
    <SiteFooter />
    <SiteHeader />
    <FilterBar />
    <ProviderTable />
  </div>
</template>

