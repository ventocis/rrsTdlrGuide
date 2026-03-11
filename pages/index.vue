<script setup lang="ts">
import { useProviders } from '~/composables/useProviders'

// ensure composable is initialized on page load
useProviders()
</script>

<template>
  <div
    class="min-h-screen font-['DM_Sans',system-ui,sans-serif]"
    style="background-color: var(--proto-page-bg);"
  >
    <SiteHeader />
    <FilterBar />
    <ProviderTable />
    <StudentResponsesTable />
    <SiteFooter />
  </div>
</template>

