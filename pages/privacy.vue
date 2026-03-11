<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy — TDLR Guide',
  description: 'Privacy policy for TDLR Guide. How we collect, use, and protect your information when you use our Texas defensive driving comparison site.'
})
</script>

<template>
  <div
    class="min-h-screen font-['DM_Sans',system-ui,sans-serif]"
    style="background-color: var(--proto-page-bg);"
  >
    <SiteHeader />
    <main class="mx-auto w-full max-w-[720px] px-4 py-10 sm:px-6">
      <h1 class="mb-2 text-2xl font-bold" style="color: var(--proto-text);">
        Privacy Policy
      </h1>
      <p class="mb-8 text-[14px]" style="color: var(--proto-text-muted);">
        Last updated: March 2025
      </p>

      <div class="prose prose-sm max-w-none space-y-6 text-[14px] leading-relaxed" style="color: var(--proto-text);">
        <section>
          <h2 class="mb-2 text-lg font-semibold" style="color: var(--proto-text);">Overview</h2>
          <p>
            TDLR Guide (“we,” “our,” or “the site”) is an independent comparison guide for TDLR-approved defensive driving courses in Texas. This privacy policy describes how we handle information when you use this website.
          </p>
        </section>

        <section>
          <h2 class="mb-2 text-lg font-semibold" style="color: var(--proto-text);">Information We Collect</h2>
          <p>
            When you submit a review or correction through our form, we collect the information you provide (such as name, course name, rating, price paid, and comments). Form submissions are processed by Formspree, a third-party service. Formspree’s privacy practices apply to data they process on our behalf. We do not collect account or payment information on this site.
          </p>
          <p>
            We may collect basic usage data (e.g., pages visited) through standard web server logs or analytics if we use such tools. We do not sell your personal information.
          </p>
        </section>

        <section>
          <h2 class="mb-2 text-lg font-semibold" style="color: var(--proto-text);">How We Use Your Information</h2>
          <p>
            We use submitted reviews and corrections to improve and update the guide (e.g., displaying aggregated student feedback and course information). We may display non-identifying or partially identifying information (e.g., first name and initial) in connection with reviews, as described on the site.
          </p>
        </section>

        <section>
          <h2 class="mb-2 text-lg font-semibold" style="color: var(--proto-text);">Cookies and Tracking</h2>
          <p>
            This site may use minimal cookies or similar technologies for essential functionality. If we add analytics or advertising in the future, we will update this policy and, where required, obtain consent.
          </p>
        </section>

        <section>
          <h2 class="mb-2 text-lg font-semibold" style="color: var(--proto-text);">Third-Party Services</h2>
          <p>
            We use Formspree for form handling. Their privacy policy applies to data processed by them. We may link to external sites (e.g., course providers); those sites have their own privacy practices.
          </p>
        </section>

        <section>
          <h2 class="mb-2 text-lg font-semibold" style="color: var(--proto-text);">Data Retention and Security</h2>
          <p>
            We retain form submissions as needed to operate the guide and improve content. We take reasonable steps to protect data under our control but cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 class="mb-2 text-lg font-semibold" style="color: var(--proto-text);">Your Rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, or delete your personal information. To request changes or removal of data you submitted, contact us using the information below.
          </p>
        </section>

        <section>
          <h2 class="mb-2 text-lg font-semibold" style="color: var(--proto-text);">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. The “Last updated” date at the top will reflect the most recent version. Continued use of the site after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 class="mb-2 text-lg font-semibold" style="color: var(--proto-text);">Contact</h2>
          <p>
            For privacy-related questions or requests, contact us through the form on the site or at the contact method listed in the footer.
          </p>
        </section>
      </div>

      <p class="mt-10">
        <NuxtLink to="/" class="text-[14px] font-semibold" style="color: var(--proto-teal);">
          ← Back to guide
        </NuxtLink>
      </p>
    </main>
    <SiteFooter />
  </div>
</template>
