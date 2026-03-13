<script setup lang="ts">
const route = useRoute()
const isSubmitReviewPage = route.path === '/submit-review'
const isPricingPage = route.path === '/pricing'
const isEligibilityPage = route.path === '/eligibility-checker'
const isCourtsPage = route.path === '/courts'
const isTicketCalculatorPage = route.path === '/ticket-calculator'

const mobileMenuOpen = ref(false)
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
function closeMobileMenu() {
  mobileMenuOpen.value = false
}

// Close menu on route change (e.g. after navigating)
watch(() => route.path, closeMobileMenu)
</script>

<template>
  <div class="relative">
    <header
      class="relative overflow-hidden px-3 py-1.5 sm:px-4 sm:py-2"
      style="background: linear-gradient(135deg, var(--proto-header-from), var(--proto-header-to));"
    >
      <div
        class="pointer-events-none absolute inset-0 opacity-100"
        style="background: radial-gradient(ellipse at 30% 50%, rgba(13,148,136,0.12) 0%, transparent 60%);"
      />
      <div class="relative mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-2 py-0 sm:gap-4">
        <!-- Left: logo + BETA + tagline -->
        <div class="flex min-h-[36px] flex-wrap items-center gap-1.5 sm:gap-2 sm:shrink-0 sm:max-w-[520px]">
          <NuxtLink to="/" class="flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--proto-teal)] focus:ring-offset-2 focus:ring-offset-transparent rounded">
            <img
              src="/TDLR%20GUIDE%20LOGO%20(altcolor).png"
              alt="TDLR Guide logo"
              class="h-8 w-auto object-contain drop-shadow-md sm:h-9"
            />
          </NuxtLink>
          <span
            class="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style="background: rgba(13,148,136,0.2); border: 1px solid rgba(13,148,136,0.3); color: var(--proto-teal-text);"
          >
            BETA
          </span>
          <p
            class="m-0 hidden text-[11px] font-medium leading-tight sm:block sm:text-[12px]"
            style="color: var(--proto-header-subtitle);"
          >
            Don't overpay for your ticket dismissal. Compare Texas' top-rated driver safety courses.
          </p>
        </div>

        <!-- Desktop: nav links -->
        <div class="hidden min-h-[36px] flex-wrap items-center justify-end gap-1.5 sm:flex sm:gap-2">
          <NuxtLink
            v-if="!isCourtsPage"
            to="/courts"
            class="inline-flex shrink-0 items-center rounded px-2 py-1 text-[11px] font-medium transition-colors hover:opacity-90 sm:text-[12px]"
            style="color: #fff;"
          >
            Court Lookup
          </NuxtLink>
          <NuxtLink
            v-if="!isTicketCalculatorPage"
            to="/ticket-calculator"
            class="inline-flex shrink-0 items-center rounded px-2 py-1 text-[11px] font-medium transition-colors hover:opacity-90 sm:text-[12px]"
            style="color: #fff;"
          >
            Ticket Calculator
          </NuxtLink>
          <NuxtLink
            v-if="!isEligibilityPage"
            to="/eligibility-checker"
            class="inline-flex shrink-0 items-center rounded px-2 py-1 text-[11px] font-medium transition-colors hover:opacity-90 sm:text-[12px]"
            style="color: #fff;"
          >
            Eligibility Checker
          </NuxtLink>
          <NuxtLink
            v-if="!isPricingPage"
            to="/pricing"
            class="inline-flex shrink-0 items-center rounded px-2 py-1 text-[11px] font-medium transition-colors hover:opacity-90 sm:text-[12px]"
            style="color: #fff;"
          >
            How Texas Defensive Driving Pricing Really Works
          </NuxtLink>
          <NuxtLink
            v-if="!isSubmitReviewPage"
            to="/submit-review"
            target="_blank"
            rel="noopener noreferrer"
            class="shrink-0 rounded px-3 py-1.5 text-center text-[11px] font-semibold text-white transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[var(--proto-header-from)] sm:px-4 sm:text-[12px]"
            style="background: #0F766E; border: 1px solid rgba(255,255,255,0.15);"
          >
            Submit Review
          </NuxtLink>
        </div>

        <!-- Mobile: hamburger button -->
        <button
          type="button"
          class="flex min-h-[36px] items-center justify-center rounded p-2 text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--proto-teal)] focus:ring-offset-2 focus:ring-offset-transparent sm:hidden"
          aria-label="Open menu"
          :aria-expanded="mobileMenuOpen"
          @click="toggleMobileMenu"
        >
          <span class="sr-only">{{ mobileMenuOpen ? 'Close menu' : 'Open menu' }}</span>
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </header>

    <!-- Mobile menu panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-show="mobileMenuOpen"
        class="absolute left-0 right-0 z-50 sm:hidden"
        style="background: linear-gradient(180deg, var(--proto-header-to), var(--proto-header-from)); box-shadow: 0 10px 25px rgba(0,0,0,0.2);"
      >
        <nav class="border-t border-white/10 px-3 py-3" aria-label="Mobile navigation">
          <div class="flex flex-col gap-0.5">
            <NuxtLink
              v-if="!isCourtsPage"
              to="/courts"
              class="rounded px-3 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
              @click="closeMobileMenu"
            >
              Court Lookup
            </NuxtLink>
            <NuxtLink
              v-if="!isTicketCalculatorPage"
              to="/ticket-calculator"
              class="rounded px-3 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
              @click="closeMobileMenu"
            >
              Ticket Calculator
            </NuxtLink>
            <NuxtLink
              v-if="!isEligibilityPage"
              to="/eligibility-checker"
              class="rounded px-3 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
              @click="closeMobileMenu"
            >
              Eligibility Checker
            </NuxtLink>
            <NuxtLink
              v-if="!isPricingPage"
              to="/pricing"
              class="rounded px-3 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
              @click="closeMobileMenu"
            >
              How Texas Defensive Driving Pricing Really Works
            </NuxtLink>
            <NuxtLink
              v-if="!isSubmitReviewPage"
              to="/submit-review"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded px-3 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
              style="background: #0F766E;"
              @click="closeMobileMenu"
            >
              Submit Review
            </NuxtLink>
          </div>
        </nav>
      </div>
    </Transition>
  </div>
</template>
