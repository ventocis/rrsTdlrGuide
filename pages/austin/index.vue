<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl as string) || 'https://tdlrguide.com'

const selectedOption = ref<'dsc' | 'def' | null>(null)

function selectOption(which: 'dsc' | 'def') {
  selectedOption.value = which
}

const pageTitle = 'Austin Traffic Ticket Guide: DSC & Deferred Disposition | TDLRguide'
const pageDescription = 'Got an Austin traffic ticket? Learn how to dismiss it with a Driver Safety Course or Deferred Disposition. Plain-English guide with fees, forms, and step-by-step instructions from Austin Municipal Court.'
const pageUrl = `${siteUrl}/austin`

useSiteSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: pageUrl,
  ogType: 'article',
  ogSiteName: 'TDLRguide',
  twitterCard: 'summary',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})

useSiteCanonical(pageUrl, pageUrl)

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  datePublished: '2026-03-25',
  dateModified: '2026-03-25',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I dismiss a traffic ticket in Austin Texas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Austin Municipal Court offers two options: a Driver Safety Course (DSC) or a Deferral. For DSC, you plead no contest, submit the combined DSC Request and Affidavit form before your appearance date, pay $144 court costs, and complete a TDLR-approved 6-hour course within 90 days. You then submit your certificate, driving record, and the completed form to the court by mail, fax, email, or in person.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does a Driver Safety Course cost in Austin?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Austin Municipal Court fee is $144 for standard violations, or $169 for violations in a school zone. You also pay at least $25 for the course itself. The court fee must be submitted with your DSC request form before your appearance date.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I email my DSC certificate to Austin Municipal Court?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Austin Municipal Court is one of the few Texas courts that accepts certificate submission by email. You can submit your completed documents by mail, fax, email to court@austintexas.gov, or in person at either courthouse location.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is a Deferral at Austin Municipal Court?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A deferral is a postponement of judgment. You plead guilty or no contest and pay associated court fees. The court gives you a window of time to complete certain conditions. If you successfully complete all terms of the deferral, the case is dismissed. If you do not, the deferral is revoked and a conviction is entered. The exact cost varies by violation and is shown in the online case portal after your request is processed. The court considers the type of offense, the facts of your case, and your criminal history when deciding whether to grant a deferral.'
      }
    },
    {
      '@type': 'Question',
      name: 'Where is Austin Municipal Court located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Austin Municipal Court has two locations. Main Courthouse: 6800 Burleson Road, Building 310, Suite 175, Austin TX 78744. North Customer Service Center: 2121 West Parmer Lane, Suite 116, Austin TX 78727. Phone: (512) 974-4800. Email: court@austintexas.gov. Hours: Monday–Friday 8am–5pm, excluding holidays.'
      }
    }
  ]
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Dismiss an Austin Traffic Ticket with a Driver Safety Course',
  datePublished: '2026-03-25',
  dateModified: '2026-03-25',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Check eligibility and get your case information',
      text: 'Look up your case at austintexas.gov/amcpublicinquiry. Confirm you meet eligibility: citation date is before your appearance date, no DSC in past 12 months, no CDL, not cited for 95+ mph or 25+ mph over limit, have valid insurance and a Texas driver\'s license.'
    },
    {
      '@type': 'HowToStep',
      name: 'Submit the DSC Request form before your appearance date',
      text: 'Download and complete the combined Driver Safety Course Request and Affidavit form. The form includes the affidavit — it must be notarized or brought to a courthouse location for a clerk to certify. Submit it with your valid non-commercial Texas driver\'s license, proof of current auto insurance, and payment of $144 (or $169 school zone) by mail, email, fax, or in person.'
    },
    {
      '@type': 'HowToStep',
      name: 'Wait for the court to process your request',
      text: 'Check the status of your request at austintexas.gov/amcpublicinquiry approximately one week after submitting. Your 90-day window to complete the course starts from when the court processes your request — not when you submitted it. Do not take the course before submitting your form.'
    },
    {
      '@type': 'HowToStep',
      name: 'Complete a TDLR-approved 6-hour defensive driving course',
      text: 'Take any TDLR-approved driving safety course within your 90-day window. The certificate must indicate it is for Austin Municipal Court.'
    },
    {
      '@type': 'HowToStep',
      name: 'Submit your certificate and driving record within 90 days',
      text: 'Submit your certificate of completion and a copy of your driving record (version 3 or 3A) to Austin Municipal Court by mail, fax, email to court@austintexas.gov, or in person at either courthouse location.'
    }
  ]
}

useHead({
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(faqSchema) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(howToSchema) }
  ],
  __dangerouslyDisableSanitizers: ['script']
})
</script>

<template>
  <div class="austin-page">
    <SiteHeader />
    <main>
      <div class="page-wrap">

        <!-- Page header -->
        <div class="page-header">
          <div class="pg-label">Austin Municipal Court</div>
          <h1 class="page-h1">Got an Austin traffic ticket?</h1>
        <p class="page-sub">Here are your options.</p>
        <p class="page-lead">Most traffic tickets in Austin can be dismissed without paying the fine. Pick the option that fits your situation below.</p>
      </div>

      <h2 class="sh">Step 1 — Choose your path</h2>

      <!-- Option picker -->
      <div class="option-row">
        <button
          :class="['pick-btn', 'blue', { active: selectedOption === 'dsc' }]"
          @click="selectOption('dsc')"
        >
          <div class="pick-indicator" />
          <div class="pb-tag">Option A</div>
          <span class="pick-label">Driver Safety Course</span>
          <span class="pick-desc">Take a TDLR-approved 6-hour course. Court fee is $144. Submit your form before your appearance date.</span>
        </button>
        <button
          :class="['pick-btn', 'green', { active: selectedOption === 'def' }]"
          @click="selectOption('def')"
        >
          <div class="pick-indicator" />
          <div class="pb-tag">Option B</div>
          <span class="pick-label">Deferral</span>
          <span class="pick-desc">Court postpones judgment. Complete the terms — case dismissed. Cost varies by violation. Not guaranteed.</span>
        </button>
      </div>

      <!-- Comparison box (shown when nothing selected) -->
      <div v-if="!selectedOption" class="box neutral" style="margin-bottom:1.5rem">
        <p class="box-label">Not sure which to pick?</p>
        <div class="compare">
          <div class="comp-card dsc">
            <p class="comp-title">Driver Safety Course — Choose this if you…</p>
            <ul>
              <li>Have a valid Texas license (not CDL) and were not in a commercial vehicle</li>
              <li>Have not taken DSC in the past 12 months</li>
              <li>Are not charged with speeding 25+ mph over the limit or 95+ mph</li>
              <li>Want a fixed cost and a clear 90-day deadline</li>
            </ul>
          </div>
          <div class="comp-card def">
            <p class="comp-title">Deferral — Choose this if you…</p>
            <ul>
              <li>Do not want to take a driving course</li>
              <li>Have a violation type that qualifies for deferral</li>
              <li>Are 17 or older and do not hold a CDL</li>
              <li>Understand approval is at the court's discretion based on your case</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- ── DSC PANEL ── -->
      <section v-show="selectedOption === 'dsc'" aria-label="Driver Safety Course panel">

        <!-- Eligibility -->
        <h2 class="sh">Driver Safety Course — Am I eligible?</h2>
        <ul class="inel-list">
          <li class="inel-row"><span class="inel-icon">✗</span> You hold a commercial driver's license (CDL)</li>
          <li class="inel-row"><span class="inel-icon">✗</span> You were driving a commercial vehicle at the time of the citation</li>
          <li class="inel-row"><span class="inel-icon">✗</span> You have taken a driving safety course in the past 12 months</li>
          <li class="inel-row"><span class="inel-icon">✗</span> Your ticket is for speeding 95 mph or more</li>
          <li class="inel-row"><span class="inel-icon">✗</span> Your ticket is for speeding 25 mph or more over the posted speed limit</li>
          <li class="inel-row"><span class="inel-icon">✗</span> You do not have current, valid car insurance</li>
          <li class="inel-row"><span class="inel-icon">✗</span> You do not have a Texas driver's license (unless active military or military dependent living in Texas)</li>
        </ul>
        <p class="inel-note">If none of the above apply, you are likely eligible. Your request must be submitted before your appearance date — do not wait.</p>

        <!-- Austin email notice -->
        <div class="box success">
          <p class="box-label">Austin accepts email submissions</p>
          <p>Unlike most Texas courts, Austin Municipal Court accepts completed DSC documents by email at <strong>court@austintexas.gov</strong>. You can also submit by mail, fax, or in person.</p>
        </div>

        <!-- Fee section -->
        <h2 class="sh">Court fees</h2>
        <div class="box neutral">
          <table class="fee-table">
            <thead>
              <tr><th>Violation type</th><th>Court fee</th></tr>
            </thead>
            <tbody>
              <tr><td>Standard violation</td><td><strong>$144.00</strong></td></tr>
              <tr><td>School zone violation</td><td><strong>$169.00</strong></td></tr>
            </tbody>
          </table>
          <p class="fee-note">The court fee is paid when you submit your DSC request form — before your appearance date. The course itself costs a minimum of $25 separately, paid directly to the course provider.</p>
        </div>

        <!-- Important warning -->
        <div class="box warn">
          <p class="box-label">Important — submit your form before taking the course</p>
          <p>Do not take a driving safety course before submitting your DSC Request form to the court. Your 90-day window to complete the course begins from the date the court processes your request — not the date you submitted it. Check your case status online at <a href="https://www.austintexas.gov/amcpublicinquiry" target="_blank" rel="noopener noreferrer">austintexas.gov/amcpublicinquiry</a> about one week after submitting.</p>
        </div>

        <!-- Spanish form notice -->
        <div class="box info">
          <p class="box-label">Spanish language form available</p>
          <p>Austin Municipal Court offers a Spanish-language DSC request form (<em>Solicitud para tomar un curso de seguridad vial</em>). See the forms section below to download it.</p>
        </div>

        <!-- Steps -->
        <h2 class="sh">How to complete DSC — step by step</h2>
        <ol class="steps">
          <li class="step">
            <span class="step-dot">1</span>
            <div class="step-body">
              <p class="step-title">Look up your case and confirm your appearance date</p>
              <p class="step-detail">Find your case at the Austin Municipal Court online portal. Note your appearance date — your DSC request must be submitted before this date or you lose the right to request DSC.</p>
              <a href="https://www.austintexas.gov/amcpublicinquiry" target="_blank" rel="noopener noreferrer" class="step-link">Look up your case →</a>
            </div>
          </li>
          <li class="step">
            <span class="step-dot">2</span>
            <div class="step-body">
              <p class="step-title">Download and complete the DSC Request and Affidavit form</p>
              <p class="step-detail">The form combines the DSC request and the required affidavit in one document. Complete all fields. The affidavit must be notarized — either by a notary public before mailing, or by a court clerk when you appear in person. There is also a Spanish-language version of this form.</p>
            </div>
          </li>
          <li class="step">
            <span class="step-dot">3</span>
            <div class="step-body">
              <p class="step-title">Submit your form with your documents and payment before your appearance date</p>
              <p class="step-detail">Submit all of the following together: the completed and notarized DSC Request form, a copy of your valid non-commercial Texas driver's license (or military ID and orders), proof of current valid auto insurance with your name as insured, and payment of $144 (or $169 for school zone). You can submit by mail, email (<strong>court@austintexas.gov</strong>), fax (512) 974-4882, or in person at either courthouse location.</p>
            </div>
          </li>
          <li class="step">
            <span class="step-dot">4</span>
            <div class="step-body">
              <p class="step-title">Check your case status online one week after submitting</p>
              <p class="step-detail">Visit austintexas.gov/amcpublicinquiry to confirm the court has processed your request. Your 90-day clock to complete the course starts from the processing date.</p>
              <a href="https://www.austintexas.gov/amcpublicinquiry" target="_blank" rel="noopener noreferrer" class="step-link">Check case status →</a>
            </div>
          </li>
          <li class="step">
            <span class="step-dot">5</span>
            <div class="step-body">
              <p class="step-title">Take any TDLR-approved 6-hour defensive driving course</p>
              <p class="step-detail">Online or in-person — your choice. Any TDLR-approved course is accepted. The certificate must indicate it is for Austin Municipal Court. You have 90 days from the court's processing date to complete the course.</p>
            </div>
          </li>
          <li class="step">
            <span class="step-dot">6</span>
            <div class="step-body">
              <p class="step-title">Submit your certificate and driving record within 90 days</p>
              <p class="step-detail">Submit to Austin Municipal Court: a copy of your certificate of completion (must indicate it is for Austin Municipal Court), and a copy of your driving record version 3 or 3A from Texas DPS. You can submit by mail, email (<strong>court@austintexas.gov</strong>), fax (512) 974-4882, or in person.</p>
            </div>
          </li>
        </ol>

        <!-- Failure notice -->
        <div class="box warn">
          <p class="box-label">If you do not complete the DSC terms</p>
          <p>The court will send you a notice to appear and show cause why you did not complete the terms. If cause is not sufficient, the DSC will be revoked and you will be found guilty. A conviction will be reported to DPS and placed on your driving record.</p>
        </div>

        <!-- Forms and docs -->
        <h2 class="sh">Forms and documents to download</h2>
        <ul class="forms-list">
          <li class="form-item">
            <div class="form-info">
              <p class="form-name">DSC Request and Affidavit Form (English)</p>
              <p class="form-desc">Combined request and affidavit in one document. Must be completed and notarized (or brought to the court for a clerk to certify). Submit before your appearance date along with your license, insurance, and payment.</p>
            </div>
            <a href="https://austin.widen.net/view/pdf/dxifzuhcxd/Driver_Safety_Request_form.pdf?t.download=true" target="_blank" rel="noopener noreferrer" class="form-link">Download DSC Request Form (English) ↓</a>
          </li>
          <li class="form-item">
            <div class="form-info">
              <p class="form-name">DSC Request and Affidavit Form (Spanish)</p>
              <p class="form-desc">Spanish-language version of the same form (<em>Solicitud para tomar un curso de seguridad vial</em>). If the link below opens the English version, contact the court at court@austintexas.gov to request the Spanish version.</p>
            </div>
            <a href="https://austin.widen.net/view/pdf/dxifzuhcxd/Driver_Safety_Request_form.pdf?t.download=true" target="_blank" rel="noopener noreferrer" class="form-link">Descargar formulario en español ↓</a>
          </li>
          <li class="form-item">
            <div class="form-info">
              <p class="form-name">Certified Driving Record (version 3 or 3A)</p>
              <p class="form-desc">Required when submitting your completed DSC documents. Must be version 3 or 3A from Texas DPS.</p>
            </div>
            <div class="form-links-row">
              <a href="https://www.texas.gov" target="_blank" rel="noopener noreferrer" class="form-link">Order at texas.gov ↗</a>
              <a href="https://www.dps.texas.gov/internetforms/forms/dr-1.pdf" target="_blank" rel="noopener noreferrer" class="form-link">Mail-in order form (DR-1) ↓</a>
            </div>
          </li>
          <li class="form-item">
            <div class="form-info">
              <p class="form-name">Certificate of Completion</p>
              <p class="form-desc">Provided by your course provider after finishing. Must indicate it is for Austin Municipal Court. Submit with your driving record within 90 days.</p>
            </div>
            <span class="form-placeholder">Provided by your course provider</span>
          </li>
          <li class="form-item">
            <div class="form-info">
              <p class="form-name">Austin Municipal Court Fine Schedule</p>
              <p class="form-desc">Reference guide for fine amounts for all Austin Municipal Court violations. Useful for estimating what you owe.</p>
            </div>
            <NuxtLink to="/austin/fines" class="form-link">View Austin fine schedule →</NuxtLink>
          </li>
        </ul>

        <!-- Where to submit -->
        <h2 class="sh">How to submit your request and documents</h2>
        <div class="sub-methods sub-methods-4">
          <div class="sub-card">
            <p class="sub-method">By mail</p>
            <p>Austin Municipal Court<br>P.O. Box 2135<br>Austin, TX 78768</p>
            <p class="sub-note">Make checks payable to Austin Municipal Court.</p>
          </div>
          <div class="sub-card">
            <p class="sub-method">By email</p>
            <p><a href="mailto:court@austintexas.gov">court@austintexas.gov</a></p>
            <p class="sub-note">Austin accepts certificate submission by email — unlike most Texas courts.</p>
          </div>
          <div class="sub-card">
            <p class="sub-method">By fax</p>
            <p>(512) 974-4882</p>
          </div>
          <div class="sub-card">
            <p class="sub-method">In person</p>
            <p><strong>Main Courthouse</strong><br>6800 Burleson Road<br>Building 310, Suite 175<br>Austin, TX 78744</p>
            <p style="margin-top:.5rem;"><strong>North Customer Service Center</strong><br>2121 West Parmer Lane<br>Suite 116<br>Austin, TX 78727</p>
            <p class="sub-note">Mon–Fri, 8am–5pm, excluding city holidays.</p>
          </div>
        </div>
        <p class="sub-phone">Questions? Call Austin Municipal Court: <a href="tel:5129744800">(512) 974-4800</a></p>

      </section>

      <!-- ── DEFERRAL PANEL ── -->
      <section v-show="selectedOption === 'def'" aria-label="Deferral panel">

        <!-- What is it? -->
        <h2 class="sh">What is a Deferral?</h2>
        <div class="box neutral">
          <p class="box-label">Plain English explanation</p>
          <p>A deferral is a postponement of judgment. You plead guilty or no contest and pay associated court fees. The court gives you a window of time to complete certain conditions — for example, obtaining and maintaining insurance, or completing a driver safety course. If you successfully complete all terms of the deferral, the case is dismissed. If you do not, the deferral is revoked and a conviction is entered.</p>
        </div>

        <div class="box warn">
          <p class="box-label">Approval is not guaranteed</p>
          <p>The court considers the type of offense, the facts of your case, and your criminal history when deciding whether to grant a deferral. Submitting a request does not guarantee approval. If your request is denied, you can choose another option to handle your case.</p>
        </div>

        <!-- Under 25 info -->
        <div class="box info">
          <p class="box-label">If you are under 25</p>
          <p>If you are under 25 and charged with a moving traffic violation, the court is required by law to make you complete a Driver Safety Course as a condition of your deferral. You will effectively need to do both.</p>
        </div>

        <!-- Eligibility -->
        <h2 class="sh">Am I eligible for a Deferral?</h2>
        <ul class="inel-list">
          <li class="inel-row"><span class="inel-icon">✗</span> You hold a commercial driver's license (CDL), even if the violation occurred while driving a non-commercial vehicle</li>
          <li class="inel-row"><span class="inel-icon">✗</span> You are under 17 years of age</li>
        </ul>
        <p class="inel-note">For all other violations, you may request a deferral. Eligible violation types include moving violations, bicycle violations, no insurance, no license, disabled parking, and water violations. The court will review your specific case before granting approval.</p>

        <!-- Fee section -->
        <h2 class="sh">How much does a Deferral cost?</h2>
        <div class="box warn">
          <p class="box-label">Cost varies by violation</p>
          <p>Austin Municipal Court does not publish a fixed deferral fee. The exact cost depends on your specific violation and will be shown in the online case portal after your request is processed. Use the Austin fine schedule as an estimate, or look up your specific case in the court portal for the exact amount.</p>
          <div class="box-links">
            <a href="https://www.austintexas.gov/amcpublicinquiry" target="_blank" rel="noopener noreferrer" class="box-btn">Look up your case for exact costs →</a>
            <NuxtLink to="/austin/fines" class="box-btn">View Austin fine schedule →</NuxtLink>
          </div>
        </div>

        <!-- Steps -->
        <h2 class="sh">How to apply for a Deferral — step by step</h2>
        <ol class="steps">
          <li class="step">
            <span class="step-dot">1</span>
            <div class="step-body">
              <p class="step-title">Confirm your eligibility</p>
              <p class="step-detail">You must not hold a CDL and must be 17 or older. Check that your violation type qualifies using the Austin Municipal Court case portal or fine schedule.</p>
            </div>
          </li>
          <li class="step">
            <span class="step-dot">2</span>
            <div class="step-body">
              <p class="step-title">Apply for a deferral online, by email, or in person</p>
              <p class="step-detail">Submit your deferral application online through the Austin Municipal Court case portal, by email to court@austintexas.gov, or in person at either courthouse location. Your application must include a no-contest or guilty plea.</p>
              <a href="https://www.austintexas.gov/municipal-court/apply-municipal-court-deferral" target="_blank" rel="noopener noreferrer" class="step-link">Apply for a deferral online →</a>
            </div>
          </li>
          <li class="step">
            <span class="step-dot">3</span>
            <div class="step-body">
              <p class="step-title">Check your case status one week after applying</p>
              <p class="step-detail">Look up your case at austintexas.gov/amcpublicinquiry to see if your deferral was approved and to find the fee amount.</p>
            </div>
          </li>
          <li class="step">
            <span class="step-dot">4</span>
            <div class="step-body">
              <p class="step-title">Pay your court fees</p>
              <p class="step-detail">Pay by phone at (512) 974-4640 (Monday–Friday 8am–5pm), online through the case portal, by mail, or in person at either courthouse location.</p>
            </div>
          </li>
          <li class="step">
            <span class="step-dot">5</span>
            <div class="step-body">
              <p class="step-title">Complete the terms of your deferral and submit proof</p>
              <p class="step-detail">Complete all court-ordered conditions by your deadline. Submit proof to the court in person, by email (court@austintexas.gov), or by fax (512) 974-4882.</p>
            </div>
          </li>
        </ol>

        <!-- Failure notice -->
        <div class="box warn">
          <p class="box-label">If you do not complete the terms of your deferral</p>
          <p>Failure to meet the deferral terms results in a revocation hearing — your opportunity to explain to a judge why you did not comply. If you do not appear for the revocation hearing, a conviction will be entered, it will be placed on your record, and if you owe the court money, a warrant for your arrest will be issued. If you know you cannot complete the terms, you may opt out of the deferral and a conviction will be entered without a hearing.</p>
        </div>

        <!-- Forms and docs -->
        <h2 class="sh">Forms and documents</h2>
        <ul class="forms-list">
          <li class="form-item">
            <div class="form-info">
              <p class="form-name">Apply for a Deferral (online form)</p>
              <p class="form-desc">Austin Municipal Court accepts deferral applications online.</p>
            </div>
            <a href="https://www.austintexas.gov/municipal-court/apply-municipal-court-deferral" target="_blank" rel="noopener noreferrer" class="form-link">Apply for a deferral online →</a>
          </li>
          <li class="form-item">
            <div class="form-info">
              <p class="form-name">Austin Municipal Court Fine Schedule</p>
              <p class="form-desc">Reference guide to estimate the cost of your deferral.</p>
            </div>
            <NuxtLink to="/austin/fines" class="form-link">View Austin fine schedule →</NuxtLink>
          </li>
        </ul>

        <!-- Where to submit — same 4 cards -->
        <h2 class="sh">How to reach Austin Municipal Court</h2>
        <div class="sub-methods sub-methods-4">
          <div class="sub-card">
            <p class="sub-method">By mail</p>
            <p>Austin Municipal Court<br>P.O. Box 2135<br>Austin, TX 78768</p>
            <p class="sub-note">Make checks payable to Austin Municipal Court.</p>
          </div>
          <div class="sub-card">
            <p class="sub-method">By email</p>
            <p><a href="mailto:court@austintexas.gov">court@austintexas.gov</a></p>
          </div>
          <div class="sub-card">
            <p class="sub-method">By fax</p>
            <p>(512) 974-4882</p>
          </div>
          <div class="sub-card">
            <p class="sub-method">In person</p>
            <p><strong>Main Courthouse</strong><br>6800 Burleson Road<br>Building 310, Suite 175<br>Austin, TX 78744</p>
            <p style="margin-top:.5rem;"><strong>North Customer Service Center</strong><br>2121 West Parmer Lane<br>Suite 116<br>Austin, TX 78727</p>
            <p class="sub-note">Mon–Fri, 8am–5pm, excluding city holidays.</p>
          </div>
        </div>
        <p class="sub-phone">Questions? Call Austin Municipal Court: <a href="tel:5129744800">(512) 974-4800</a></p>

      </section>

      <!-- CTA Block -->
      <div class="cta-block">
        <p class="cta-head">Need to pick a defensive driving course?</p>
        <p class="cta-body">Compare all 133 TDLR-approved providers by price, format, and language — free, no signup.</p>
        <a href="https://tdlrguide.com" class="cta-btn">Compare courses on TDLRguide →</a>
      </div>

      <!-- Disclaimer -->
      <div class="disclaimer">
        <p class="disclaimer-label">Disclaimer and source verification</p>
        <p>This page is an independent summary created by TDLRguide for informational purposes only. TDLRguide is not affiliated with Austin Municipal Court, the City of Austin, or the Texas Department of Licensing and Regulation (TDLR). All information is sourced directly from official Austin Municipal Court pages and reflects content as of March 2026. Rules, fees, and procedures may change — always verify current requirements with the court before taking action. This is not legal advice. If you have questions specific to your case, contact the court directly or consult a licensed attorney.</p>
        <ul class="disclaimer-sources">
          <li><a href="https://www.austintexas.gov/municipal-court/request-driving-safety-course" target="_blank" rel="noopener noreferrer">Official DSC page</a></li>
          <li><a href="https://www.austintexas.gov/municipal-court/apply-municipal-court-deferral" target="_blank" rel="noopener noreferrer">Official Deferral page</a></li>
          <li><a href="https://www.austintexas.gov/services/handle-citation" target="_blank" rel="noopener noreferrer">Austin Municipal Court — Handle a Citation</a></li>
          <li><a href="https://www.tdlr.texas.gov/driver/safety/providers/search/" target="_blank" rel="noopener noreferrer">TDLR provider search</a></li>
        </ul>
      </div>

      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.austin-page {
  --blue: #2563eb;
  --green: #16a34a;
  --amber: #d97706;
  --red: #dc2626;
  --teal: #0d9488;
  font-family: var(--font-sans, system-ui, sans-serif);
}

.page-wrap {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1.25rem 5rem;
}

/* Header */
.page-header { margin-bottom: 2rem; }
.pg-label {
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--fg2);
  margin-bottom: .5rem;
}
.page-h1 {
  font-family: var(--serif);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: var(--fg);
  margin: 0 0 .25rem;
  line-height: 1.2;
}
.page-sub {
  font-size: 1.15rem;
  color: var(--fg2);
  margin: 0 0 .75rem;
  font-weight: 500;
}
.page-lead {
  font-size: .975rem;
  color: var(--fg2);
  margin: 0;
  line-height: 1.6;
}

/* Option picker */
.option-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .75rem;
  margin-bottom: 1.5rem;
}
@media (max-width: 520px) { .option-row { grid-template-columns: 1fr; } }

.pick-btn {
  display: flex;
  flex-direction: column;
  gap: .35rem;
  padding: 1.125rem 1.25rem;
  border: 1px solid var(--bd);
  border-radius: var(--rl, 8px);
  background: var(--bg);
  cursor: pointer;
  text-align: left;
  font-family: var(--sans);
  transition: all .15s;
  position: relative;
}
.pick-btn:hover { background: var(--bg2); }
.pick-btn.active.blue {
  border: 1.5px solid var(--blue);
  background: transparent;
}
.pick-btn.active.green {
  border: 1.5px solid var(--green);
  background: transparent;
}
.pb-tag {
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  margin-bottom: .2rem;
  color: var(--fg2);
}
.pick-btn.active.blue .pb-tag { color: var(--blue); }
.pick-btn.active.green .pb-tag { color: var(--green); }
.pick-indicator {
  position: absolute;
  top: .875rem;
  right: .875rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid var(--bd);
  background: var(--bg);
  transition: all .15s;
}
.pick-btn.active.blue .pick-indicator {
  background: var(--blue);
  border-color: var(--blue);
}
.pick-btn.active.green .pick-indicator {
  background: var(--green);
  border-color: var(--green);
}
.pick-btn.active .pick-indicator::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: #fff;
}
.pick-label {
  font-size: .9rem;
  font-weight: 650;
  color: var(--fg);
}
.pick-desc {
  font-size: .82rem;
  color: var(--fg2);
  line-height: 1.45;
}

/* Notice boxes */
.box {
  border-radius: var(--rl, 8px);
  padding: 1rem 1.125rem;
  margin-bottom: 1.25rem;
}
.box.neutral { background: var(--bg2); border: 1px solid var(--bd); }
.box.info    { background: transparent; border: 1px solid #2563eb55; border-left: 3px solid var(--blue); }
.box.success { background: transparent; border: 1px solid #16a34a55; border-left: 3px solid var(--green); }
.box.warn    { background: transparent; border: 1px solid #d9770655; border-left: 3px solid var(--amber); }
.box.danger  { background: transparent; border: 1px solid #dc262655; border-left: 3px solid var(--red); }

.box-label {
  font-size: .82rem;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--fg2);
  margin: 0 0 .5rem;
}
.box p { margin: 0 0 .5rem; font-size: .9rem; line-height: 1.6; color: var(--fg); }
.box p:last-child { margin-bottom: 0; }

/* Comparison cards */
.compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .75rem;
  margin-top: .25rem;
}
@media (max-width: 520px) { .compare { grid-template-columns: 1fr; } }
.comp-card {
  border-radius: 6px;
  padding: .75rem .875rem;
  background: var(--bg);
}
.comp-card.dsc { border-top: 2px solid var(--blue); }
.comp-card.def { border-top: 2px solid var(--green); }
.comp-title { font-size: .82rem; font-weight: 650; color: var(--fg); margin: 0 0 .5rem; }
.comp-card ul { margin: 0; padding-left: 1.2rem; }
.comp-card li { font-size: .82rem; color: var(--fg2); margin-bottom: .3rem; line-height: 1.45; }

/* h2 headings */
h2.sh {
  font-size: 1.05rem;
  font-weight: 650;
  color: var(--fg);
  margin: 2.75rem 0 1rem;
  padding-bottom: .375rem;
  border-bottom: 1px solid var(--bd);
}

/* Ineligibility list */
.inel-list {
  list-style: none;
  margin: 0 0 .75rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: .25rem;
}
.inel-row {
  display: flex;
  align-items: flex-start;
  gap: .6rem;
  font-size: .875rem;
  color: var(--fg);
  padding: .45rem .5rem;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--bd);
  border-radius: 4px;
  line-height: 1.45;
}
.inel-row:last-child { border-bottom: none; }
.inel-icon { color: var(--red); font-weight: 700; flex-shrink: 0; margin-top: .05rem; }
.inel-note { font-size: .85rem; color: var(--fg2); margin: .5rem 0 0; line-height: 1.5; }

/* Fee table */
.fee-table { width: 100%; border-collapse: collapse; font-size: .875rem; }
.fee-table th, .fee-table td { padding: .5rem .625rem; text-align: left; border-bottom: 1px solid var(--bd); }
.fee-table thead th { font-weight: 650; color: var(--fg2); font-size: .8rem; text-transform: uppercase; letter-spacing: .03em; }
.fee-table tbody tr:last-child td { border-bottom: none; }
.fee-note { font-size: .825rem; color: var(--fg2); margin: .75rem 0 0; line-height: 1.5; }

/* Steps */
.steps {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  position: relative;
}
.steps::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 26px;
  bottom: 26px;
  width: 2px;
  background: var(--bd);
  opacity: 0.6;
}
.step {
  display: flex;
  gap: .875rem;
  align-items: flex-start;
  padding: .75rem 0;
  position: relative;
}
.step-dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--teal, #0d9488);
  color: #fff;
  font-size: .75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.step-body { flex: 1; }
.step-title { font-size: .9rem; font-weight: 650; color: var(--fg); margin: .1rem 0 .35rem; }
.step-detail { font-size: .85rem; color: var(--fg2); margin: 0 0 .5rem; line-height: 1.55; }
.step-link {
  display: inline-block;
  font-size: .82rem;
  color: var(--teal, #0d9488);
  text-decoration: none;
  font-weight: 600;
}
.step-link:hover { text-decoration: underline; }

/* Forms list */
.forms-list { list-style: none; padding: 0; margin: 0 0 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.form-item {
  padding: .875rem 1rem;
  background: var(--bg2);
  border: 1px solid var(--bd);
  border-radius: var(--rl, 8px);
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
.form-name { font-size: .875rem; font-weight: 650; color: var(--fg); margin: 0; }
.form-desc { font-size: .82rem; color: var(--fg2); margin: .2rem 0 0; line-height: 1.5; }
.form-info { flex: 1; }
.form-link {
  display: inline-block;
  font-size: .82rem;
  color: var(--teal, #0d9488);
  text-decoration: none;
  font-weight: 600;
  padding: .35rem .625rem;
  border: 1px solid var(--bd);
  border-radius: 5px;
  background: var(--bg);
  transition: background .15s;
  align-self: flex-start;
}
.form-link:hover { background: var(--bg2); }
.form-links-row { display: flex; gap: .5rem; flex-wrap: wrap; }
.form-placeholder {
  font-size: .82rem;
  color: var(--fg2);
  font-style: italic;
  padding: .35rem .625rem;
  border: 1px dashed var(--bd);
  border-radius: 5px;
  align-self: flex-start;
}

/* Submission cards */
.sub-methods {
  display: grid;
  gap: .75rem;
  margin-bottom: .75rem;
}
.sub-methods-4 { grid-template-columns: repeat(2, 1fr); }
@media (max-width: 480px) { .sub-methods-4 { grid-template-columns: 1fr; } }

.sub-card {
  background: var(--bg);
  border: 1px solid var(--bd);
  border-radius: var(--rl, 8px);
  padding: .875rem 1rem;
}
.sub-method {
  font-size: .8rem;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--fg2);
  margin: 0 0 .4rem;
}
.sub-card p { font-size: .875rem; color: var(--fg); margin: 0; line-height: 1.55; }
.sub-card a { color: var(--teal, #0d9488); }
.sub-note { font-size: .8rem; color: var(--fg2); margin-top: .4rem !important; font-style: italic; }
.sub-phone { font-size: .875rem; color: var(--fg2); margin: .25rem 0 1.5rem; }
.sub-phone a { color: var(--teal, #0d9488); }

/* Box links/buttons */
.box-links { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .75rem; }
.box-btn {
  display: inline-block;
  font-size: .82rem;
  color: var(--teal, #0d9488);
  text-decoration: none;
  font-weight: 600;
  padding: .35rem .625rem;
  border: 1px solid var(--bd);
  border-radius: 5px;
  background: var(--bg);
  transition: background .15s;
}
.box-btn:hover { background: var(--bg2); }

/* CTA block */
.cta-block {
  background: var(--bg2);
  border: 1px solid var(--bd);
  border-radius: var(--rl, 8px);
  padding: 1.5rem 1.25rem;
  text-align: center;
  margin: 2.5rem 0 2rem;
}
.cta-head { font-size: 1.05rem; font-weight: 700; color: var(--fg); margin: 0 0 .5rem; }
.cta-body { font-size: .9rem; color: var(--fg2); margin: 0 0 1rem; line-height: 1.5; }
.cta-btn {
  display: inline-block;
  background: var(--teal, #0d9488);
  color: #fff;
  text-decoration: none;
  padding: .6rem 1.25rem;
  border-radius: 6px;
  font-size: .9rem;
  font-weight: 650;
  transition: opacity .15s;
}
.cta-btn:hover { opacity: .88; }

/* Disclaimer */
.disclaimer {
  border-top: 1px solid var(--bd);
  padding-top: 1.25rem;
  margin-top: 2rem;
}
.disclaimer-label {
  font-size: .8rem;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--fg2);
  margin: 0 0 .5rem;
}
.disclaimer p { font-size: .8rem; color: var(--fg2); margin: 0; line-height: 1.6; }
.disclaimer-sources {
  list-style: none;
  padding: 0;
  margin: .625rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: .35rem .875rem;
}
.disclaimer-sources li { font-size: .8rem; }
.disclaimer-sources a { color: var(--teal, #0d9488); }

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .pick-btn.active.blue { border-color: #60a5fa; }
  .pick-btn.active.blue .pick-indicator { background: #60a5fa; border-color: #60a5fa; }
  .pick-btn.active.blue .pb-tag { color: #60a5fa; }
  .pick-btn.active.green { border-color: #4ade80; }
  .pick-btn.active.green .pick-indicator { background: #4ade80; border-color: #4ade80; }
  .pick-btn.active.green .pb-tag { color: #4ade80; }
  .box.info { border-color: #3b82f633; border-left-color: #60a5fa; }
  .box.success { border-color: #22c55e33; border-left-color: #4ade80; }
  .box.warn { border-color: #f59e0b33; border-left-color: #fbbf24; }
  .box.danger { border-color: #ef444433; border-left-color: #f87171; }
  .comp-card.dsc { border-top-color: #60a5fa; }
  .comp-card.def { border-top-color: #4ade80; }
  .step-dot { background: #0f766e; }
}
</style>
