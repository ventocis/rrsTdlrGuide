<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl as string) || 'https://tdlrguide.com'

const seoTitle =
  'Texas Speeding Ticket Cost Calculator — See What It Really Costs You | TDLR Guide'
const seoDescription =
  'Find out the true 3-year cost of a Texas speeding ticket including insurance rate increases — and how a $25 Driver Safety Course changes the math. Free calculator.'

const ogTitle = 'Texas Ticket Cost Calculator — See the Real 3-Year Price'
const ogDescription =
  'A $200 speeding ticket can cost $1,700+ in insurance increases. See your numbers and find out if a $25 course changes the math.'

useSiteSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle,
  ogDescription,
  ogUrl: `${siteUrl}/ticket-calculator`,
  ogType: 'website',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  robots: 'index, follow'
})

const jsonLdSoftware = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Texas Speeding Ticket Insurance Cost Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Free calculator showing the true 3-year cost of a Texas speeding ticket including insurance rate increases, and how a Driver Safety Course changes the outcome.',
  url: `${siteUrl}/ticket-calculator`,
  publisher: { '@type': 'Organization', name: 'TDLR Guide', url: siteUrl }
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a speeding ticket raise insurance in Texas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A speeding ticket raises Texas car insurance premiums by an average of 22%, based on industry data. The increase typically lasts 3 years. On a $2,600 annual premium, that\'s roughly $572 in extra insurance costs per year, or over $1,700 over 3 years — on top of the ticket fine itself.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can a defensive driving course prevent a Texas insurance rate increase?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. If you are eligible and get court approval to take a Texas Driver Safety Course (DSC) before your appearance date, the ticket is dismissed with no conviction on your record. With no conviction, your insurance company has no grounds to raise your rate.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does defensive driving lower insurance rates in Texas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, for eligible policyholders. GEICO Texas offers up to 10% off for drivers who voluntarily complete an approved defensive driving course. Most carriers offer 3–10% discounts lasting up to 3 years, which is renewable. On a $2,600 annual premium, a 5% discount saves about $390 over 3 years.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is it worth taking a defensive driving course in Texas just for the insurance discount?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For most drivers, yes. A TDLR-approved course costs $25–$35. At a 5% discount on a $2,600 annual premium, you save $130 per year — meaning the course pays for itself in about 10 weeks, and saves roughly $365 net over 3 years. At a 10% discount the savings double.'
      }
    },
    {
      '@type': 'Question',
      name: 'How long does a speeding ticket affect insurance in Texas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Typically 3 years in Texas, though some carriers look back 5 years for serious violations. The surcharge usually applies at the next policy renewal after the conviction date and runs for 3 renewal cycles.'
      }
    }
  ]
}

useSiteCanonical(`${siteUrl}/ticket-calculator`, `${siteUrl}/ticket-calculator`)

useHead({
  meta: [
    {
      name: 'keywords',
      content:
        'speeding ticket cost calculator, Texas ticket cost, driver safety course savings, ticket vs DSC cost, Texas insurance increase'
    }
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLdSoftware) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLdFaq) }
  ],
  __dangerouslyDisableSanitizers: ['script']
})

// --- Formatting ---
function fmt(n: number): string {
  const v = Math.round(n)
  return v.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

// --- Mode ---
type Mode = 'ticket' | 'insurance'
const mode = ref<Mode>('ticket')

// --- Tab A: I got a ticket ---
const premium = ref(2600)
const fine = ref(200)
const rateLevel = ref<'low' | 'average' | 'high'>('average')
const courseFee = ref(29)
const includeDiscount = ref(true)

const COURT_FEE = 144
const RATE_MAP = { low: 0.13, average: 0.22, high: 0.35 }
const DISCOUNT_PCT = 0.05

const rateMultiplier = computed(() => 1 + RATE_MAP[rateLevel.value])
const increasePerYear = computed(
  () => premium.value * (rateMultiplier.value - 1)
)

const ticketYear0 = computed(() => fine.value)
const ticketYear1 = computed(() => increasePerYear.value)
const ticketYear2 = computed(() => increasePerYear.value)
const ticketYear3 = computed(() => increasePerYear.value)
const ticketTotal = computed(
  () =>
    ticketYear0.value +
    ticketYear1.value +
    ticketYear2.value +
    ticketYear3.value
)

const dscOutOfPocket = computed(() => courseFee.value + COURT_FEE)
const dscDiscountTotal = computed(() =>
  includeDiscount.value ? 3 * premium.value * DISCOUNT_PCT : 0
)
const dscNetCost = computed(() => dscOutOfPocket.value - dscDiscountTotal.value)
const savingsDifference = computed(() =>
  Math.max(0, ticketTotal.value - dscNetCost.value)
)

// --- Tab B: Save on insurance ---
const discountLevel = ref<'low' | 'mid' | 'high'>('mid')
const renewal = ref(true)
const insuranceCourseFee = ref(29)

const DISCOUNT_RATE_MAP = { low: 0.03, mid: 0.05, high: 0.1 }
const discountRate = computed(() => DISCOUNT_RATE_MAP[discountLevel.value])
const annualSavings = computed(() => premium.value * discountRate.value)

const insuranceYears = computed(() => (renewal.value ? 6 : 3))
const insuranceTotalSavings = computed(
  () => insuranceYears.value * annualSavings.value
)
const insuranceCourseCost = computed(() =>
  renewal.value ? insuranceCourseFee.value * 2 : insuranceCourseFee.value
)
const insuranceNetSavings = computed(
  () => insuranceTotalSavings.value - insuranceCourseCost.value
)
const paybackWeeks = computed(() => {
  const perWeek = annualSavings.value / 52
  if (perWeek <= 0) return 0
  return Math.ceil(insuranceCourseFee.value / perWeek)
})
const paybackLabel = computed(() =>
  paybackWeeks.value >= 4
    ? `${Math.floor(paybackWeeks.value / 4)} months`
    : `${paybackWeeks.value} weeks`
)

// --- Assumptions collapse ---
const assumptionsOpen = ref(false)
</script>

<template>
  <div
    class="ticket-calculator-page min-h-screen font-['DM_Sans',system-ui,sans-serif]"
    style="background-color: var(--proto-page-bg);"
  >
    <SiteHeader />

    <main
      class="mx-auto w-full max-w-[900px] px-4 py-8 sm:px-6"
      role="main"
      aria-label="Speeding ticket cost calculator"
    >
      <!-- Hero -->
      <section class="mb-8">
        <h1
          class="mb-3 text-2xl font-bold leading-tight sm:text-3xl"
          style="color: var(--proto-text);"
        >
          See What a Speeding Ticket in Texas Really Costs You
        </h1>
        <p
          class="max-w-[640px] text-[14px] leading-relaxed"
          style="color: var(--proto-text-muted);"
        >
          It's not just the fine. Enter your numbers and see how much a ticket
          — and a $25 course — affects your wallet over the next 3 years.
        </p>
      </section>

      <!-- Mode selector -->
      <div
        class="mb-6 flex rounded-xl border bg-white p-1"
        style="border-color: var(--proto-card-border);"
      >
        <button
          type="button"
          class="flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-colors"
          :class="
            mode === 'ticket'
              ? 'text-white'
              : 'text-[var(--proto-text-muted)] hover:bg-[var(--proto-hover-bg)]'
          "
          :style="
            mode === 'ticket'
              ? { background: 'var(--proto-header-from)' }
              : {}
          "
          @click="mode = 'ticket'"
        >
          I got a ticket
        </button>
        <button
          type="button"
          class="flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-colors"
          :class="
            mode === 'insurance'
              ? 'text-white'
              : 'text-[var(--proto-text-muted)] hover:bg-[var(--proto-hover-bg)]'
          "
          :style="
            mode === 'insurance'
              ? { background: 'var(--proto-header-from)' }
              : {}
          "
          @click="mode = 'insurance'"
        >
          I just want to save on insurance
        </button>
      </div>

      <!-- Tab A: I got a ticket -->
      <section
        v-show="mode === 'ticket'"
        class="space-y-6"
      >
        <div
          class="rounded-2xl border bg-white p-4 sm:p-6"
          style="border-color: var(--proto-card-border);"
        >
          <h2
            class="mb-4 text-base font-semibold"
            style="color: var(--proto-text);"
          >
            Your numbers
          </h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-[13px] font-medium" style="color: var(--proto-text);">
                My current annual premium
              </label>
              <input
                v-model.number="premium"
                type="number"
                min="800"
                max="6000"
                step="50"
                class="w-full rounded-lg border px-3 py-2 text-[14px]"
                style="border-color: var(--proto-card-border); color: var(--proto-text);"
              >
              <p class="mt-1 text-[11px]" style="color: var(--proto-text-muted);">
                $800 – $6,000 (or your monthly payment × 12)
              </p>
            </div>
            <div>
              <label class="mb-1 block text-[13px] font-medium" style="color: var(--proto-text);">
                Estimated ticket fine
              </label>
              <input
                v-model.number="fine"
                type="number"
                min="50"
                max="500"
                step="10"
                class="w-full rounded-lg border px-3 py-2 text-[14px]"
                style="border-color: var(--proto-card-border); color: var(--proto-text);"
              >
              <p class="mt-1 text-[11px]" style="color: var(--proto-text-muted);">
                $50 – $500 (the “amount due” written on your citation)
              </p>
            </div>
          </div>
          <div class="mt-4">
            <label class="mb-2 block text-[13px] font-medium" style="color: var(--proto-text);">
              How much will your insurer raise your rate?
            </label>
            <div class="flex gap-2">
              <button
                v-for="opt in [
                  { k: 'low', label: 'Low (13%)' },
                  { k: 'average', label: 'Average (22%)' },
                  { k: 'high', label: 'High (35%)' }
                ]"
                :key="opt.k"
                type="button"
                class="rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors"
                :class="rateLevel === opt.k ? 'border-[var(--proto-teal)] text-[var(--proto-teal)]' : 'border-[var(--proto-card-border)] text-[var(--proto-text-muted)] hover:bg-[var(--proto-hover-bg)]'"
                @click="rateLevel = opt.k as 'low' | 'average' | 'high'"
              >
                {{ opt.label }}
              </button>
            </div>
            <p class="mt-1 text-[11px]" style="color: var(--proto-text-muted);">
              Varies by carrier. Average Texas increase is 22%.
            </p>
          </div>
        </div>

        <!-- Two columns: Pay ticket vs DSC -->
        <div class="grid gap-4 lg:grid-cols-2">
          <div
            class="rounded-2xl border p-4 sm:p-5"
            style="border-color: var(--color-rui-warning-200); background: var(--color-rui-warning-50);"
          >
            <h3 class="mb-3 text-[15px] font-semibold" style="color: var(--proto-text);">
              I just pay the ticket
            </h3>
            <ul class="space-y-2 text-[14px]">
              <li class="flex justify-between">
                <span style="color: var(--proto-text);">Year 0 (now)</span>
                <span class="font-semibold" style="color: var(--color-rui-error-700);">
                  ${{ fmt(ticketYear0) }}
                </span>
              </li>
              <li class="flex justify-between">
                <span style="color: var(--proto-text);">Year 1</span>
                <span class="font-semibold" style="color: var(--color-rui-error-700);">
                  ${{ fmt(ticketYear1) }} more
                </span>
              </li>
              <li class="flex justify-between">
                <span style="color: var(--proto-text);">Year 2</span>
                <span class="font-semibold" style="color: var(--color-rui-error-700);">
                  ${{ fmt(ticketYear2) }} more
                </span>
              </li>
              <li class="flex justify-between">
                <span style="color: var(--proto-text);">Year 3</span>
                <span class="font-semibold" style="color: var(--color-rui-error-700);">
                  ${{ fmt(ticketYear3) }} more
                </span>
              </li>
            </ul>
            <p class="mt-3 border-t pt-3 text-[15px] font-bold" style="border-color: var(--proto-row-border); color: var(--proto-text);">
              Total 3-year cost: ${{ fmt(ticketTotal) }}
            </p>
          </div>

          <div
            class="rounded-2xl border p-4 sm:p-5"
            style="border-color: var(--proto-teal-border); background: var(--proto-teal-bg);"
          >
            <h3 class="mb-3 text-[15px] font-semibold" style="color: var(--proto-text);">
              I take a Driver Safety Course
            </h3>
            <div class="mb-2 flex items-center justify-between gap-2">
              <span style="color: var(--proto-text);">DSC course fee</span>
              <select
                v-model.number="courseFee"
                class="rounded border px-2 py-1 text-[13px]"
                style="border-color: var(--proto-card-border); color: var(--proto-text);"
              >
                <option :value="25">$25</option>
                <option :value="29">$29</option>
                <option :value="35">$35</option>
              </select>
            </div>
            <p class="mb-2 flex justify-between text-[14px]" style="color: var(--proto-text);">
              <span>Court admin fee (typical Texas)</span>
              <span>${{ fmt(COURT_FEE) }}</span>
            </p>
            <p class="mb-2 flex justify-between text-[14px] font-medium" style="color: var(--color-rui-success-700);">
              <span>Fine</span>
              <span>Waived</span>
            </p>
            <p class="mb-2 flex justify-between text-[14px]" style="color: var(--proto-text);">
              <span>Insurance surcharge (years 1–3)</span>
              <span>$0</span>
            </p>
            <div class="mb-2 flex items-center justify-between">
              <span style="color: var(--proto-text);">Insurance discount (years 1–3)</span>
              <label class="flex items-center gap-2">
                <input
                  v-model="includeDiscount"
                  type="checkbox"
                  class="h-4 w-4 rounded border-[var(--proto-card-border)]"
                >
                <span class="text-[12px]">Include discount</span>
              </label>
            </div>
            <p v-if="includeDiscount" class="mb-2 text-[12px]" style="color: var(--proto-text-muted);">
              {{ (DISCOUNT_PCT * 100) }}% savings per year — if your carrier offers it (varies).
            </p>
            <p class="mt-3 border-t pt-3 text-[15px] font-bold" style="border-color: var(--proto-row-border); color: var(--proto-text);">
              Total 3-year cost: ${{ fmt(dscOutOfPocket) }}
              <span v-if="includeDiscount && dscDiscountTotal > 0" class="block text-[13px] font-normal" style="color: var(--color-rui-success-700);">
                minus ${{ fmt(dscDiscountTotal) }} discount = ${{ fmt(dscNetCost) }} net
              </span>
            </p>
          </div>
        </div>

        <!-- Savings callout -->
        <div
          class="rounded-2xl border-2 px-4 py-5 sm:px-6 sm:py-6"
          style="border-color: var(--proto-teal); background: var(--proto-teal-bg);"
        >
          <p class="m-0 text-center text-lg font-bold sm:text-xl" style="color: var(--proto-text);">
            By taking a ${{ courseFee }} Driver Safety Course, you could save
            <span class="block mt-1 text-2xl sm:text-3xl" style="color: var(--color-rui-success-700);">
              ${{ fmt(savingsDifference) }}
            </span>
            over 3 years.
          </p>
        </div>
      </section>

      <!-- Tab B: Save on insurance -->
      <section
        v-show="mode === 'insurance'"
        class="space-y-6"
      >
        <div
          class="rounded-2xl border bg-white p-4 sm:p-6"
          style="border-color: var(--proto-card-border);"
        >
          <h2 class="mb-4 text-base font-semibold" style="color: var(--proto-text);">
            Your numbers
          </h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-[13px] font-medium" style="color: var(--proto-text);">
                My current annual premium
              </label>
              <input
                v-model.number="premium"
                type="number"
                min="800"
                max="6000"
                step="50"
                class="w-full rounded-lg border px-3 py-2 text-[14px]"
                style="border-color: var(--proto-card-border); color: var(--proto-text);"
              >
              <p class="mt-1 text-[11px]" style="color: var(--proto-text-muted);">
                $800 – $6,000 (or your monthly payment × 12)
              </p>
            </div>
            <div>
              <label class="mb-2 block text-[13px] font-medium" style="color: var(--proto-text);">
                Discount rate
              </label>
              <div class="flex gap-2">
                <button
                  v-for="opt in [
                    { k: 'low', label: 'Low (3%)' },
                    { k: 'mid', label: 'Mid (5%)' },
                    { k: 'high', label: 'High (10%)' }
                  ]"
                  :key="opt.k"
                  type="button"
                  class="rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors"
                  :class="discountLevel === opt.k ? 'border-[var(--proto-teal)] text-[var(--proto-teal)]' : 'border-[var(--proto-card-border)] text-[var(--proto-text-muted)] hover:bg-[var(--proto-hover-bg)]'"
                  @click="discountLevel = opt.k as 'low' | 'mid' | 'high'"
                >
                  {{ opt.label }}
                </button>
              </div>
              <p class="mt-1 text-[11px]" style="color: var(--proto-text-muted);">
                GEICO Texas offers up to 10%. Most carriers offer 3–10%.
              </p>
            </div>
          </div>
          <div class="mt-4">
            <label class="flex cursor-pointer items-center gap-2 text-[13px] font-medium" style="color: var(--proto-text);">
              <input v-model="renewal" type="checkbox" class="h-4 w-4 rounded border-[var(--proto-card-border)]">
              Would you retake the course in 3 years?
            </label>
          </div>
          <div class="mt-3">
            <label class="mb-1 block text-[13px] font-medium" style="color: var(--proto-text);">
              Course cost today
            </label>
            <select
              v-model.number="insuranceCourseFee"
              class="rounded-lg border px-3 py-2 text-[14px]"
              style="border-color: var(--proto-card-border); color: var(--proto-text);"
            >
              <option :value="25">$25</option>
              <option :value="29">$29</option>
              <option :value="35">$35</option>
            </select>
          </div>
        </div>

        <div
          class="rounded-2xl border bg-white p-4 sm:p-6"
          style="border-color: var(--proto-card-border);"
        >
          <h3 class="mb-4 text-[15px] font-semibold" style="color: var(--proto-text);">
            Savings over time
          </h3>
          <ul class="space-y-2 text-[14px]">
            <li class="flex justify-between" style="color: var(--proto-text);">
              <span>Course cost today</span>
              <span>${{ fmt(insuranceCourseFee) }}</span>
            </li>
            <li class="flex justify-between" style="color: var(--color-rui-success-700);">
              <span>Year 1 savings</span>
              <span>${{ fmt(annualSavings) }}</span>
            </li>
            <li class="flex justify-between" style="color: var(--color-rui-success-700);">
              <span>Year 2 savings</span>
              <span>${{ fmt(annualSavings) }}</span>
            </li>
            <li class="flex justify-between" style="color: var(--color-rui-success-700);">
              <span>Year 3 savings</span>
              <span>${{ fmt(annualSavings) }}</span>
            </li>
            <template v-if="renewal">
              <li class="flex justify-between text-[13px]" style="color: var(--proto-text-muted);">
                <span>Another course in year 3</span>
                <span>−${{ fmt(insuranceCourseFee) }}</span>
              </li>
              <li class="flex justify-between" style="color: var(--color-rui-success-700);">
                <span>Year 4–6 savings</span>
                <span>${{ fmt(annualSavings * 3) }}</span>
              </li>
            </template>
          </ul>
          <p class="mt-3 border-t pt-3 font-semibold" style="border-color: var(--proto-row-border); color: var(--proto-text);">
            Total savings over {{ insuranceYears }} years: ${{ fmt(insuranceTotalSavings) }}
          </p>
          <p class="mt-1 font-semibold" style="color: var(--color-rui-success-700);">
            Net savings after course cost: ${{ fmt(insuranceNetSavings) }}
          </p>
          <p class="mt-1 text-[14px]" style="color: var(--proto-text);">
            Payback period: Your course pays for itself in {{ paybackLabel }}.
          </p>
        </div>

        <div
          class="rounded-2xl border-2 px-4 py-5 sm:px-6 sm:py-6"
          style="border-color: var(--proto-teal); background: var(--proto-teal-bg);"
        >
          <p class="m-0 text-center text-lg font-bold sm:text-xl" style="color: var(--proto-text);">
            For a ${{ insuranceCourseFee }} course, you'd break even after just
            <span style="color: var(--color-rui-success-700);">{{ paybackLabel }}</span>
            — then save
            <span style="color: var(--color-rui-success-700);">${{ fmt(annualSavings) }}</span>
            every year after that.
          </p>
        </div>
      </section>

      <!-- Assumptions (collapsible) -->
      <section class="mt-8">
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-[13px] font-medium transition-colors"
          style="border-color: var(--proto-card-border); color: var(--proto-text-muted);"
          @click="assumptionsOpen = !assumptionsOpen"
        >
          How we calculated this
          <span class="text-[10px]">{{ assumptionsOpen ? '▴' : '▾' }}</span>
        </button>
        <div
          v-show="assumptionsOpen"
          class="mt-2 rounded-lg border border-t-0 px-3 py-3 text-[12px] leading-relaxed"
          style="border-color: var(--proto-card-border); color: var(--proto-text-muted);"
        >
          Insurance increase estimates are based on Texas average data. Actual
          increases vary significantly by carrier, driving history, age, and
          location. The average Texas speeding ticket raises premiums by 13–35%,
          with 22% being a commonly cited midpoint. Insurance discounts vary by
          carrier — GEICO Texas offers up to 10% for eligible policyholders. Not
          all carriers offer a defensive driving discount, and eligibility
          requirements vary. Course fees are estimates. Court admin fees (~$144)
          are typical for Texas but vary by court. This calculator is for
          educational purposes only and is not financial or legal advice. Always
          confirm your carrier's discount policy before enrolling in a course.
        </div>
      </section>

      <!-- How this works (static copy for SEO / AI indexing) -->
      <section
        class="mt-6 rounded-2xl border bg-white p-4 sm:p-5"
        style="border-color: var(--proto-card-border);"
      >
        <h2 class="mb-3 text-base font-semibold" style="color: var(--proto-text);">
          How this calculator works
        </h2>
        <ul class="space-y-2 text-[13px] leading-relaxed" style="color: var(--proto-text-muted);">
          <li>Texas speeding ticket average insurance increase: 22% for 3 years.</li>
          <li>GEICO Texas defensive driving discount: up to 10% for eligible policyholders.</li>
          <li>Average Texas full coverage premium: approximately $2,600 per year.</li>
          <li>TDLR-approved defensive driving course cost: $25–$35.</li>
          <li>Typical Texas DSC court admin fee: approximately $144.</li>
          <li>Ticket fine waived when DSC is completed and approved by court.</li>
        </ul>
        <p class="mt-3 text-[13px] leading-relaxed" style="color: var(--proto-text);">
          Check
          <NuxtLink to="/eligibility-checker" class="font-medium underline" style="color: var(--proto-teal);">
            Driver Safety Course eligibility requirements
          </NuxtLink>
          before enrolling.
          <NuxtLink to="/courts" class="font-medium underline" style="color: var(--proto-teal);">
            Find your court
          </NuxtLink>
          to request approval. Confirm with your insurance carrier whether they offer a defensive driving discount before enrolling.
        </p>
      </section>

      <!-- CTA -->
      <section class="mt-8 rounded-2xl border bg-white p-4 sm:p-6" style="border-color: var(--proto-card-border);">
        <p class="mb-3 text-base font-semibold" style="color: var(--proto-text);">
          Ready to take the course?
        </p>
        <NuxtLink
          to="/courts"
          class="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white transition-colors"
          style="background: var(--proto-header-from);"
        >
          Find your court first →
        </NuxtLink>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
