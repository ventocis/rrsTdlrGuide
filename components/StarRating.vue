<script setup lang="ts">
const props = defineProps<{
  rating: number
}>()

const full = computed(() => Math.floor(props.rating))
const partial = computed(() => props.rating - full.value)
</script>

<template>
  <span class="inline-flex items-center gap-[3px] align-middle">
    <svg
      v-for="i in 5"
      :key="i"
      width="12"
      height="12"
      viewBox="0 0 20 20"
    >
      <defs>
        <linearGradient :id="`s${rating}-${i}`">
          <stop
            :offset="`${i - 1 < full ? 100 : i - 1 === full ? partial * 100 : 0}%`"
            stop-color="#D97706"
          />
          <stop
            :offset="`${i - 1 < full ? 100 : i - 1 === full ? partial * 100 : 0}%`"
            stop-color="#D1D5DB"
          />
        </linearGradient>
      </defs>
      <path
        d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33-3.87-3.77 5.34-.78L10 1z"
        :fill="`url(#s${rating}-${i})`"
      />
    </svg>
  </span>
</template>

