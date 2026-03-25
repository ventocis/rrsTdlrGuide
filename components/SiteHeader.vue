<script setup lang="ts">
const route = useRoute()
const isPricingPage = route.path === '/pricing'
const isEligibilityPage = route.path === '/eligibility-checker'
const isCourtsPage = route.path === '/courts'
const isTicketCalculatorPage = route.path === '/ticket-calculator'
const isFaqPage = route.path === '/faq'

const mobileMenuOpen = ref(false)
const cityGuidesDesktopOpen = ref(false)
const cityGuidesMobileOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
function closeMobileMenu() {
  mobileMenuOpen.value = false
  cityGuidesMobileOpen.value = false
}

// Close menus on route change
watch(() => route.path, closeMobileMenu)
</script>

<template>
  <div class="relative">
    <header
      class="relative px-3 py-1.5 sm:px-4 sm:py-2"
      style="background: linear-gradient(135deg, var(--proto-header-from), var(--proto-header-to));"
    >
      <div
        class="pointer-events-none absolute inset-0 opacity-100"
        style="background: radial-gradient(ellipse at 30% 50%, rgba(13,148,136,0.12) 0%, transparent 60%);"
      />
      <div class="relative mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-2 py-0 sm:gap-4">
        <!-- Left: logo + tagline -->
        <div class="flex min-h-[36px] flex-wrap items-center gap-1.5 sm:gap-2 sm:shrink-0 sm:max-w-[520px]">
          <NuxtLink to="/" class="flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--proto-teal)] focus:ring-offset-2 focus:ring-offset-transparent rounded">
            <img
              src="/TDLR%20GUIDE%20LOGO%20(altcolor).png"
              alt="TDLR Guide logo"
              class="h-8 w-auto object-contain drop-shadow-md sm:h-9"
            />
          </NuxtLink>
          <p
            class="m-0 hidden text-[11px] font-medium leading-tight sm:block sm:text-[12px]"
            style="color: var(--proto-header-subtitle);"
          >
            Free tools to compare, dismiss, and understand Texas traffic tickets.
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
            v-if="!isFaqPage"
            to="/faq"
            class="inline-flex shrink-0 items-center rounded px-2 py-1 text-[11px] font-medium transition-colors hover:opacity-90 sm:text-[12px]"
            style="color: #fff;"
          >
            FAQ
          </NuxtLink>

          <!-- City Guides dropdown -->
          <div
            class="city-dropdown-wrapper"
            @mouseenter="cityGuidesDesktopOpen = true"
            @mouseleave="cityGuidesDesktopOpen = false"
          >
            <button
              class="inline-flex shrink-0 items-center rounded px-2 py-1 text-[11px] font-medium transition-colors hover:opacity-90 sm:text-[12px]"
              style="color: #fff; background: transparent; border: none; cursor: pointer;"
              :aria-expanded="cityGuidesDesktopOpen"
              aria-haspopup="true"
              @click="cityGuidesDesktopOpen = !cityGuidesDesktopOpen"
              @keydown.escape="cityGuidesDesktopOpen = false"
              @keydown.space.prevent="cityGuidesDesktopOpen = !cityGuidesDesktopOpen"
              @keydown.enter.prevent="cityGuidesDesktopOpen = !cityGuidesDesktopOpen"
            >
              City Guides <span class="chevron">▾</span>
            </button>
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-show="cityGuidesDesktopOpen" class="city-dropdown-menu">
                <NuxtLink
                  to="/houston"
                  class="city-dropdown-item"
                  @click="cityGuidesDesktopOpen = false"
                >
                  Houston
                </NuxtLink>
                <NuxtLink
                  to="/dallas"
                  class="city-dropdown-item"
                  @click="cityGuidesDesktopOpen = false"
                >
                  Dallas
                </NuxtLink>
                <NuxtLink
                  to="/san-antonio"
                  class="city-dropdown-item"
                  @click="cityGuidesDesktopOpen = false"
                >
                  San Antonio
                </NuxtLink>
                <NuxtLink
                  to="/harris-county"
                  class="city-dropdown-item"
                  @click="cityGuidesDesktopOpen = false"
                >
                  Harris County JP Courts
                </NuxtLink>
              </div>
            </Transition>
          </div>

          <NuxtLink
            v-if="!isPricingPage"
            to="/pricing"
            class="inline-flex shrink-0 items-center rounded px-2 py-1 text-[11px] font-medium transition-colors hover:opacity-90 sm:text-[12px]"
            style="color: #fff;"
          >
            Pricing Guide
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
              v-if="!isFaqPage"
              to="/faq"
              class="rounded px-3 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
              @click="closeMobileMenu"
            >
              FAQ
            </NuxtLink>

            <!-- City Guides expandable (mobile) -->
            <div>
              <button
                class="w-full rounded px-3 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/10 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-white/30"
                :aria-expanded="cityGuidesMobileOpen"
                aria-haspopup="true"
                @click="cityGuidesMobileOpen = !cityGuidesMobileOpen"
                @keydown.escape="cityGuidesMobileOpen = false"
              >
                <span>City Guides</span>
                <span
                  class="text-[10px] transition-transform duration-150"
                  :style="cityGuidesMobileOpen ? 'display:inline-block;transform:rotate(180deg)' : 'display:inline-block'"
                >▾</span>
              </button>
              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
              >
                <div v-show="cityGuidesMobileOpen" class="pl-3 pt-0.5 flex flex-col gap-0.5">
                  <NuxtLink
                    to="/houston"
                    class="rounded px-3 py-2 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/10"
                    @click="closeMobileMenu"
                  >
                    Houston
                  </NuxtLink>
                  <NuxtLink
                    to="/dallas"
                    class="rounded px-3 py-2 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/10"
                    @click="closeMobileMenu"
                  >
                    Dallas
                  </NuxtLink>
                  <NuxtLink
                    to="/san-antonio"
                    class="rounded px-3 py-2 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/10"
                    @click="closeMobileMenu"
                  >
                    San Antonio
                  </NuxtLink>
                  <NuxtLink
                    to="/harris-county"
                    class="rounded px-3 py-2 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/10"
                    @click="closeMobileMenu"
                  >
                    Harris County JP Courts
                  </NuxtLink>
                </div>
              </Transition>
            </div>

            <NuxtLink
              v-if="!isPricingPage"
              to="/pricing"
              class="rounded px-3 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
              @click="closeMobileMenu"
            >
              Pricing Guide
            </NuxtLink>
          </div>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.city-dropdown-wrapper {
  position: relative;
}
.chevron {
  margin-left: 3px;
  font-size: 9px;
  line-height: 1;
}
.city-dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 130px;
  background: linear-gradient(180deg, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 50;
  padding: 4px;
}
.city-dropdown-item {
  display: block;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.1s;
}
.city-dropdown-item:hover,
.city-dropdown-item:focus {
  background: rgba(255, 255, 255, 0.1);
  outline: none;
}
.city-dropdown-item:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.4);
  outline-offset: 1px;
}
</style>
