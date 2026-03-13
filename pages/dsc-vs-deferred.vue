<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl as string) || 'https://tdlrguide.com'

const seoTitle =
  'Driver Safety Course vs Deferred Disposition in Texas — TDLR Guide'
const seoDescription =
  'Plain-English guide to the difference between taking a Driver Safety Course (DSC) and getting Deferred Disposition for a Texas traffic ticket.'

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: `${siteUrl}/dsc-vs-deferred`,
  ogType: 'article',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  robots: 'index, follow'
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Driver Safety Course vs. Deferred Disposition — What\'s the Difference?',
  description: seoDescription,
  url: `${siteUrl}/dsc-vs-deferred`,
  author: {
    '@type': 'Organization',
    name: 'TDLR Guide',
    url: siteUrl
  },
  publisher: {
    '@type': 'Organization',
    name: 'TDLR Guide',
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.png` }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${siteUrl}/dsc-vs-deferred`
  }
}

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'TDLR Guide', item: siteUrl },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Driver Safety Course vs Deferred Disposition',
      item: `${siteUrl}/dsc-vs-deferred`
    }
  ]
}

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/dsc-vs-deferred` }],
  meta: [
    { property: 'og:url', content: `${siteUrl}/dsc-vs-deferred` },
    {
      name: 'keywords',
      content:
        'driver safety course vs deferred disposition, DSC vs deferred, Texas traffic ticket options, keep ticket off record, defensive driving Texas'
    }
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLdBreadcrumb) }
  ],
  __dangerouslyDisableSanitizers: ['script']
})
</script>

<template>
  <div
    class="min-h-screen font-['DM_Sans',system-ui,sans-serif]"
    style="background-color: var(--proto-page-bg);"
  >
    <SiteHeader />

    <main
      class="mx-auto w-full max-w-[900px] px-4 py-8 sm:px-6"
      role="main"
      aria-label="Driver Safety Course vs Deferred Disposition in Texas"
    >
      <!-- Hero -->
      <section class="mb-8">
        <p
          class="mb-2 inline-flex rounded-full bg-[var(--proto-teal-bg)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
          style="color: var(--proto-teal-text);"
        >
          Texas Ticket Guide
        </p>
        <h1
          class="mb-3 text-2xl font-bold leading-tight sm:text-3xl"
          style="color: var(--proto-text);"
        >
          Driver Safety Course vs. Deferred Disposition — What's the Difference?
        </h1>
        <p
          class="max-w-[640px] text-[14px] leading-relaxed"
          style="color: var(--proto-text-muted);"
        >
          Got a traffic ticket in Texas? You might have two options to keep it
          off your record. Here's what each one means in plain English.
        </p>
      </section>

      <!-- Two definition cards -->
      <section
        class="mb-10 grid gap-4 md:grid-cols-2"
        aria-label="Plain-English definitions"
      >
        <article
          class="rounded-2xl border bg-white p-4 sm:p-5"
          style="border-color: var(--proto-card-border);"
        >
          <h2
            class="mb-2 text-base font-semibold"
            style="color: var(--proto-text);"
          >
            Driver Safety Course (DSC)
          </h2>
          <p class="text-[14px] leading-relaxed" style="color: var(--proto-text);">
            You take an online defensive driving class (usually 6 hours, about
            $25–$35). When you finish, the ticket gets dismissed and wiped from
            your record. You may also get a discount on your car insurance.
          </p>
        </article>

        <article
          class="rounded-2xl border bg-white p-4 sm:p-5"
          style="border-color: var(--proto-card-border);"
        >
          <h2
            class="mb-2 text-base font-semibold"
            style="color: var(--proto-text);"
          >
            Deferred Disposition
          </h2>
          <p class="text-[14px] leading-relaxed" style="color: var(--proto-text);">
            You plead guilty and the court puts your ticket on hold for
            90–180 days. If you don't get another ticket during that time, the
            case gets dismissed and no conviction goes on your record. No class
            required — but no insurance discount either.
          </p>
        </article>
      </section>

      <!-- Comparison table -->
      <section class="mb-10" aria-label="Head-to-head comparison">
        <h2
          class="mb-3 text-lg font-semibold"
          style="color: var(--proto-text);"
        >
          Head-to-Head: Driver Safety Course vs. Deferred Disposition
        </h2>
        <div
          class="overflow-x-auto rounded-2xl border bg-white"
          style="border-color: var(--proto-card-border);"
        >
          <table class="min-w-full border-collapse text-[13px]">
            <thead>
              <tr class="text-left" style="background: var(--proto-text); color: #fff;">
                <th class="px-3 py-2 font-semibold">Factor</th>
                <th class="px-3 py-2 font-semibold">Driver Safety Course</th>
                <th class="px-3 py-2 font-semibold">Deferred Disposition</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t" style="border-color: var(--proto-row-border);">
                <td class="px-3 py-2 font-medium" style="color: var(--proto-text);">
                  Do I have to take a class?
                </td>
                <td class="px-3 py-2 align-top">
                  <div class="flex flex-col gap-1">
                    <span style="color: var(--proto-text);">
                      Yes — 6-hour online course
                    </span>
                    <span
                      class="inline-flex w-fit rounded-full bg-[var(--pill-cert-free-bg)] px-2 py-0.5 text-[11px] font-semibold"
                      style="color: var(--color-rui-success-700);"
                    >
                      Better choice here
                    </span>
                  </div>
                </td>
                <td class="px-3 py-2" style="color: var(--proto-text);">
                  No class required
                </td>
              </tr>

              <tr class="border-t" style="border-color: var(--proto-row-border);">
                <td class="px-3 py-2 font-medium" style="color: var(--proto-text);">
                  How long does it take?
                </td>
                <td class="px-3 py-2" style="color: var(--proto-text);">
                  Usually 1–2 days at your own pace
                </td>
                <td class="px-3 py-2 align-top">
                  <div class="flex flex-col gap-1">
                    <span style="color: var(--proto-text);">
                      90–180 days of probation
                    </span>
                    <span
                      class="inline-flex w-fit rounded-full bg-[var(--color-rui-warning-50)] px-2 py-0.5 text-[11px] font-semibold"
                      style="color: var(--color-rui-warning-800);"
                    >
                      Better choice here
                    </span>
                  </div>
                </td>
              </tr>

              <tr class="border-t" style="border-color: var(--proto-row-border);">
                <td class="px-3 py-2 font-medium" style="color: var(--proto-text);">
                  Will it lower my insurance?
                </td>
                <td class="px-3 py-2 align-top">
                  <div class="flex flex-col gap-1">
                    <span style="color: var(--proto-text);">
                      Yes — up to 10% discount for 3 years
                    </span>
                    <span
                      class="inline-flex w-fit rounded-full bg-[var(--pill-cert-free-bg)] px-2 py-0.5 text-[11px] font-semibold"
                      style="color: var(--color-rui-success-700);"
                    >
                      Better choice here
                    </span>
                  </div>
                </td>
                <td class="px-3 py-2" style="color: var(--proto-text);">
                  Generally no
                </td>
              </tr>

              <tr class="border-t" style="border-color: var(--proto-row-border);">
                <td class="px-3 py-2 font-medium" style="color: var(--proto-text);">
                  What if I get another ticket?
                </td>
                <td class="px-3 py-2 align-top">
                  <div class="flex flex-col gap-1">
                    <span style="color: var(--proto-text);">
                      Doesn't matter — your ticket is already dismissed
                    </span>
                    <span
                      class="inline-flex w-fit rounded-full bg-[var(--pill-cert-free-bg)] px-2 py-0.5 text-[11px] font-semibold"
                      style="color: var(--color-rui-success-700);"
                    >
                      Better choice here
                    </span>
                  </div>
                </td>
                <td class="px-3 py-2" style="color: var(--proto-text);">
                  Your original ticket becomes a conviction on the spot
                </td>
              </tr>

              <tr class="border-t" style="border-color: var(--proto-row-border);">
                <td class="px-3 py-2 font-medium" style="color: var(--proto-text);">
                  What does it cost?
                </td>
                <td class="px-3 py-2" style="color: var(--proto-text);">
                  ~$25–35 for the course + ~$144 court fee
                </td>
                <td class="px-3 py-2" style="color: var(--proto-text);">
                  $100–$310+ depending on your court (no course fee)
                </td>
              </tr>

              <tr class="border-t" style="border-color: var(--proto-row-border);">
                <td class="px-3 py-2 font-medium" style="color: var(--proto-text);">
                  Does it work the same at every court?
                </td>
                <td class="px-3 py-2 align-top">
                  <div class="flex flex-col gap-1">
                    <span style="color: var(--proto-text);">
                      Yes — same 12-month eligibility rule statewide
                    </span>
                    <span
                      class="inline-flex w-fit rounded-full bg-[var(--pill-cert-free-bg)] px-2 py-0.5 text-[11px] font-semibold"
                      style="color: var(--color-rui-success-700);"
                    >
                      Better choice here
                    </span>
                  </div>
                </td>
                <td class="px-3 py-2" style="color: var(--proto-text);">
                  No — each court sets its own terms and waiting period
                </td>
              </tr>

              <tr class="border-t" style="border-color: var(--proto-row-border);">
                <td class="px-3 py-2 font-medium" style="color: var(--proto-text);">
                  What happens to my record?
                </td>
                <td class="px-3 py-2 align-top">
                  <div class="flex flex-col gap-1">
                    <span style="color: var(--proto-text);">
                      Ticket dismissed, no guilty plea, no conviction ever
                      recorded
                    </span>
                    <span
                      class="inline-flex w-fit rounded-full bg-[var(--pill-cert-free-bg)] px-2 py-0.5 text-[11px] font-semibold"
                      style="color: var(--color-rui-success-700);"
                    >
                      Better choice here
                    </span>
                  </div>
                </td>
                <td class="px-3 py-2" style="color: var(--proto-text);">
                  Ticket dismissed if you complete it — but you already pleaded
                  guilty upfront. One more ticket during probation and the
                  original conviction locks in permanently.
                </td>
              </tr>

              <tr class="border-t" style="border-color: var(--proto-row-border);">
                <td class="px-3 py-2 font-medium" style="color: var(--proto-text);">
                  Under 25 years old?
                </td>
                <td class="px-3 py-2 align-top">
                  <div class="flex flex-col gap-1">
                    <span style="color: var(--proto-text);">
                      Your best option
                    </span>
                    <span
                      class="inline-flex w-fit rounded-full bg-[var(--pill-cert-free-bg)] px-2 py-0.5 text-[11px] font-semibold"
                      style="color: var(--color-rui-success-700);"
                    >
                      Better choice here
                    </span>
                  </div>
                </td>
                <td class="px-3 py-2" style="color: var(--proto-text);">
                  Texas law requires the judge to make you take DSC anyway — so
                  you're likely doing it either way
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Under-25 callout -->
      <section
        class="mb-10 rounded-2xl border px-4 py-4 sm:px-5 sm:py-5"
        style="background: var(--proto-header-from); border-color: var(--proto-header-to);"
      >
        <h2
          class="mb-2 text-base font-semibold sm:text-lg"
          style="color: #fff;"
        >
          Under 25? The Choice May Already Be Made For You.
        </h2>
        <p
          class="m-0 text-[14px] leading-relaxed"
          style="color: rgba(255,255,255,0.9);"
        >
          Texas law requires judges to make drivers under 25 complete a Driver
          Safety Course if they're placed on Deferred Disposition for a moving
          violation. So if you're under 25, you're likely taking a DSC either
          way — you might as well get the insurance discount too.
        </p>
      </section>

      <!-- Scenario cards -->
      <section class="mb-10" aria-label="Which option fits you?">
        <h2
          class="mb-3 text-lg font-semibold"
          style="color: var(--proto-text);"
        >
          Which One Is Right for Me?
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <article
            class="rounded-2xl border bg-white p-4 sm:p-5"
            style="border-color: var(--proto-card-border);"
          >
            <div class="mb-2 text-xl">🚗</div>
            <h3
              class="mb-1 text-[15px] font-semibold"
              style="color: var(--proto-text);"
            >
              I want this completely done and off my record ASAP
            </h3>
            <span
              class="mb-2 inline-flex rounded-full bg-[var(--pill-cert-free-bg)] px-2 py-0.5 text-[11px] font-semibold"
              style="color: var(--color-rui-success-700);"
            >
              Best fit: Driver Safety Course
            </span>
            <p
              class="m-0 text-[14px] leading-relaxed"
              style="color: var(--proto-text);"
            >
              Once you finish the class and submit your certificate, it's over.
              No waiting period, no probation, no guilty plea on the books.
            </p>
          </article>

          <article
            class="rounded-2xl border bg-white p-4 sm:p-5"
            style="border-color: var(--proto-card-border);"
          >
            <div class="mb-2 text-xl">📅</div>
            <h3
              class="mb-1 text-[15px] font-semibold"
              style="color: var(--proto-text);"
            >
              I'm really busy and can't take a class right now
            </h3>
            <span
              class="mb-2 inline-flex rounded-full bg-[var(--color-rui-warning-50)] px-2 py-0.5 text-[11px] font-semibold"
              style="color: var(--color-rui-warning-800);"
            >
              Possible fit: Deferred Disposition
            </span>
            <p
              class="m-0 text-[14px] leading-relaxed"
              style="color: var(--proto-text);"
            >
              You get 90–180 days. Just don't get another ticket during that
              time or the original conviction sticks.
            </p>
          </article>

          <article
            class="rounded-2xl border bg-white p-4 sm:p-5"
            style="border-color: var(--proto-card-border);"
          >
            <div class="mb-2 text-xl">💰</div>
            <h3
              class="mb-1 text-[15px] font-semibold"
              style="color: var(--proto-text);"
            >
              I want to save money on car insurance
            </h3>
            <span
              class="mb-2 inline-flex rounded-full bg-[var(--pill-cert-free-bg)] px-2 py-0.5 text-[11px] font-semibold"
              style="color: var(--color-rui-success-700);"
            >
              Best fit: Driver Safety Course
            </span>
            <p
              class="m-0 text-[14px] leading-relaxed"
              style="color: var(--proto-text);"
            >
              Deferred won't get you an insurance discount. DSC can save you
              hundreds over 3 years.
            </p>
          </article>

          <article
            class="rounded-2xl border bg-white p-4 sm:p-5"
            style="border-color: var(--proto-card-border);"
          >
            <div class="mb-2 text-xl">⚠️</div>
            <h3
              class="mb-1 text-[15px] font-semibold"
              style="color: var(--proto-text);"
            >
              I drive a lot for work or have a CDL
            </h3>
            <span
              class="mb-2 inline-flex rounded-full bg-[var(--color-rui-warning-50)] px-2 py-0.5 text-[11px] font-semibold"
              style="color: var(--color-rui-warning-800);"
            >
              Important: Talk to your court
            </span>
            <p
              class="m-0 text-[14px] leading-relaxed"
              style="color: var(--proto-text);"
            >
              Commercial driver's license holders have different rules. Check
              with your court before choosing either option.
            </p>
          </article>
        </div>
      </section>

      <!-- Important warning -->
      <section
        class="mb-8 rounded-2xl border bg-white px-4 py-4 sm:px-5 sm:py-5"
        style="border-color: var(--proto-card-border);"
      >
        <h2
          class="mb-2 text-base font-semibold sm:text-lg"
          style="color: var(--proto-text);"
        >
          You Must Ask the Court First
        </h2>
        <p
          class="mb-3 text-[14px] leading-relaxed"
          style="color: var(--proto-text);"
        >
          You can't just sign up for a defensive driving course and expect your
          ticket to go away. You have to request DSC approval from your court
          before your appearance date — and before you enroll. Check our court
          lookup tool to find your court's contact info.
        </p>
        <NuxtLink
          to="/courts"
          class="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white transition-colors"
          style="background: var(--proto-header-from);"
        >
          Find My Court →
        </NuxtLink>
      </section>

      <!-- Legal disclaimer -->
      <p
        class="mt-4 max-w-[720px] text-[11px] leading-relaxed"
        style="color: var(--proto-text-muted);"
      >
        This page is for general information only and is not legal advice. Court
        rules vary. Always confirm eligibility with your specific court before
        enrolling in a course.
      </p>
    </main>

    <SiteFooter />
  </div>
</template>

