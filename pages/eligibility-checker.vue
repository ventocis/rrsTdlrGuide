<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl as string) || 'https://tdlrguide.com'

const seoTitle = 'Texas Ticket Dismissal Eligibility Checker | TDLR Guide'
const seoDescription = 'Find out if you can dismiss your Texas traffic ticket with defensive driving. Answer 5 quick questions to get your eligibility result and next steps. Free tool for Texas drivers.'

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: `${siteUrl}/eligibility-checker`,
  ogType: 'website',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  robots: 'index, follow'
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Texas Ticket Dismissal Eligibility Checker',
  description: seoDescription,
  url: `${siteUrl}/eligibility-checker`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: {
    '@type': 'Organization',
    name: 'TDLR Guide',
    url: siteUrl
  },
  mainEntity: {
    '@type': 'WebPage',
    name: seoTitle,
    description: seoDescription,
    primaryImageOfPage: { '@type': 'ImageObject', url: `${siteUrl}/favicon.png` }
  }
}

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/eligibility-checker` }],
  meta: [
    { property: 'og:url', content: `${siteUrl}/eligibility-checker` },
    { name: 'keywords', content: 'Texas ticket dismissal, defensive driving eligibility, TDLR, traffic ticket, defensive driving course Texas' }
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }
  ],
  __dangerouslyDisableSanitizers: ['script']
})

// State
const { allCourtsRows } = useCourts()
const state = reactive({
  violation: null as string | null,
  speedOver: null as number | null,
  cdl: null as boolean | null,
  priorDismissal: null as boolean | null,
  courtApproval: null as boolean | string | null,
  selectedCourt: null as import('~/composables/useCourts').CourtRecord | null
})

const STEPS = ['step1', 'step2', 'step3', 'step4', 'step5', 'resultCard']
const currentStep = ref('step1')

const progressBar = ref<HTMLElement | null>(null)
const progressLabel = ref<HTMLElement | null>(null)
const speedInput = ref<HTMLInputElement | null>(null)
const resultContent = ref<HTMLElement | null>(null)

// Step 5: three cascading dropdowns (County → Court Type → Court)
const selectedCounty = ref<string | null>(null)
const selectedCourtType = ref<string | null>(null)
const selectedCourtRecord = ref<import('~/composables/useCourts').CourtRecord | null>(null)

const countyOptions = computed(() => {
  const counties = [...new Set(allCourtsRows.map((r) => r.county))].filter(Boolean).sort()
  return counties.map((c) => ({ label: c, value: c }))
})

const courtTypeOptions = computed(() => {
  if (!selectedCounty.value) return []
  const types = [...new Set(
    allCourtsRows
      .filter((r) => r.county === selectedCounty.value)
      .map((r) => r.courtType)
  )].filter(Boolean).sort()
  return types.map((t) => ({ label: t, value: t }))
})

const courtNameOptions = computed(() => {
  if (!selectedCounty.value || !selectedCourtType.value) return []
  const rows = allCourtsRows.filter(
    (r) => r.county === selectedCounty.value && r.courtType === selectedCourtType.value
  )
  const seen = new Set<string>()
  const options: { label: string; value: import('~/composables/useCourts').CourtRecord }[] = []
  for (const row of rows) {
    if (seen.has(row.court)) continue
    seen.add(row.court)
    options.push({ label: row.court, value: row })
  }
  return options
})

// Navigation
function goTo(stepId: string) {
  const curr = document.getElementById(currentStep.value)
  const next = document.getElementById(stepId)
  if (curr) curr.classList.remove('active')
  if (next) next.classList.add('active')
  currentStep.value = stepId
  updateProgress()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function updateProgress() {
  const order = ['step1', 'step1b', 'step2', 'step3', 'step4', 'step5', 'resultCard']
  const stepNums: Record<string, number> = { step1: 1, step1b: 1, step2: 2, step3: 3, step4: 4, step5: 5, resultCard: 5 }
  const total = 5
  const step = currentStep.value
  const pct = step === 'resultCard' ? 100 : ((stepNums[step] - 1) / total) * 100
  if (progressBar.value) progressBar.value.style.width = pct + '%'
  if (progressLabel.value) {
    progressLabel.value.textContent = step === 'resultCard' ? 'Done!' : `Step ${stepNums[step]} of ${total}`
  }
}

// Step handlers
function selectViolation(type: string) {
  state.violation = type
  if (type === 'serious') {
    showResult()
    return
  }
  if (type === 'speeding') {
    goTo('step1b')
  } else {
    goTo('step2')
  }
}

function submitSpeed() {
  const el = speedInput.value
  const val = el ? parseInt(el.value, 10) : NaN
  state.speedOver = Number.isNaN(val) ? 0 : val
  goTo('step2')
}

function selectCDL(hasCDL: boolean) {
  state.cdl = hasCDL
  goTo('step3')
}

function selectPrior(hasPrior: boolean) {
  state.priorDismissal = hasPrior
  goTo('step4')
}

function selectCourtApproval(val: boolean | string) {
  state.courtApproval = val
  if (val === 'denied') {
    showResult()
    return
  }
  goTo('step5')
}

function selectCourt(court: import('~/composables/useCourts').CourtRecord) {
  state.selectedCourt = court
  showResult()
}
function buildCourtNote(selectedCourt: import('~/composables/useCourts').CourtRecord): string {
  const courtName = selectedCourt.court
  const url = selectedCourt.website && selectedCourt.website.trim() !== ''
    ? selectedCourt.website.trim()
    : null
  if (url) {
    return `⚠️ For <strong>${courtName}</strong>, see <a href="${url}" target="_blank" rel="noopener noreferrer">court website</a>. Confirm procedures and deadlines with the court.`
  }
  return `⚠️ For <strong>${courtName}</strong>, confirm procedures and deadlines directly with the court.`
}

function buildEligibleSteps(isPending: boolean, selectedCourt: import('~/composables/useCourts').CourtRecord | null): { text: string }[] {
  const steps: { text: string }[] = []
  if (isPending) {
    steps.push({ text: '<strong>Contact your court first</strong> and request permission to take a defensive driving course. You can usually do this in person, by mail, or sometimes online. Do not take the course before receiving approval.' })
  }
  steps.push({ text: "Pay the court's administrative fee to request dismissal. Some courts require this when you make your request." })
  if (selectedCourt) steps.push({ text: buildCourtNote(selectedCourt) })
  steps.push({ text: "Enroll in and complete a <strong>TDLR-approved Driving Safety Course</strong>. The course is 6 hours and must be completed within the court's deadline." })
  steps.push({ text: 'Obtain your <strong>Type 3A driving record</strong> from <a href="https://www.dps.texas.gov" target="_blank" rel="noopener noreferrer">dps.texas.gov</a> for $10 (if your court requires it). Do not buy it through the course provider — it costs more.' })
  steps.push({ text: "Submit your <strong>completion certificate</strong> and driving record to the court by the deadline. Confirm the court's preferred submission method (in person, mail, or online)." })
  return steps
}

interface EvalResult {
  status: string
  icon: string
  title: string
  reason: string
  steps: { text: string }[]
  course: { name: string; desc: string } | null
}

function evaluate(): EvalResult {
  if (state.violation === 'serious') {
    return {
      status: 'ineligible',
      icon: '🚫',
      title: 'Not Eligible for Defensive Driving Dismissal',
      reason: 'Serious and criminal traffic violations — including reckless driving, DWI, passing a school bus, construction zone violations (with workers present), and hit and run — cannot be dismissed through defensive driving under Texas law.',
      steps: [
        { text: 'Consider consulting a traffic attorney. Many offer free consultations for serious violations.' },
        { text: 'You may be able to negotiate a plea to a lesser offense. Contact the court clerk for options.' },
        { text: 'Review the Texas Transportation Code for your specific violation to understand all available options.' }
      ],
      course: null
    }
  }

  if (state.courtApproval === 'denied') {
    return {
      status: 'ineligible',
      icon: '🚫',
      title: 'Court Denied Your Request',
      reason: "Unfortunately, if the court has already denied your request to take a defensive driving course, you cannot take the course for dismissal purposes. The court has full discretion on these requests.",
      steps: [
        { text: 'You may be able to appeal the denial or ask again with more context. Contact the court clerk.' },
        { text: 'Consider consulting a traffic attorney to understand your remaining options.' },
        { text: "If the denial was due to a prior dismissal, you may be eligible once 12 months have passed from your previous dismissal date." }
      ],
      course: null
    }
  }

  if (state.cdl) {
    return {
      status: 'ineligible',
      icon: '🚛',
      title: 'CDL Holders Cannot Use Defensive Driving for Dismissal',
      reason: "Under Texas law, commercial driver's license holders are not eligible to dismiss traffic violations through a defensive driving course — even when driving a personal, non-commercial vehicle at the time of the ticket.",
      steps: [
        { text: "Contact your employer's safety department. Many carriers have resources or legal support for CDL drivers facing violations." },
        { text: 'Consult a traffic attorney experienced with commercial driving violations. CDL violations can impact your livelihood and need careful handling.' },
        { text: "Review the FMCSA's regulations on traffic violations for CDL holders to understand the impact on your record." }
      ],
      course: null
    }
  }

  if (state.priorDismissal) {
    return {
      status: 'ineligible',
      icon: '📅',
      title: 'Not Yet Eligible — 12-Month Window',
      reason: 'Texas law permits only one defensive driving dismissal per 12-month period. Because you used this option within the last 12 months, you are not currently eligible.',
      steps: [
        { text: 'Determine the exact date your last dismissal was granted. Your eligibility resets 12 months from that date.' },
        { text: 'Ask the court for a continuance (extension) to delay your deadline until your 12-month window reopens. Courts often grant this.' },
        { text: 'Contact the court clerk to discuss your options while you wait for eligibility to reset.' }
      ],
      course: null
    }
  }

  if (state.violation === 'speeding' && state.speedOver !== null && state.speedOver >= 25) {
    return {
      status: 'ineligible',
      icon: '💨',
      title: 'Speed Too High for Dismissal',
      reason: `You were cited for going ${state.speedOver} mph over the limit. Texas courts typically will not approve defensive driving dismissal for speeds 25 mph or more over the posted limit. The court has discretion, but approval is unlikely.`,
      steps: [
        { text: "You can still ask the court — approval is at the judge's discretion. Some courts may approve in unusual circumstances." },
        { text: 'Consider consulting a traffic attorney. For high-speed violations, an attorney may be able to negotiate a reduced charge that qualifies for dismissal.' },
        { text: "If the attorney cannot help, you may need to pay the fine. Ask whether a deferred adjudication option is available in your county." }
      ],
      course: null
    }
  }

  const isPending = state.courtApproval === 'pending'
  return {
    status: 'eligible',
    icon: '✅',
    title: isPending ? 'Likely Eligible — Request Court Approval First' : 'You Appear Eligible for Dismissal',
    reason: isPending
      ? "Based on your answers, you should qualify to have this ticket dismissed through a TDLR-approved defensive driving course. However, you must get court approval before signing up for the course. Taking the course before approval is granted is a common and costly mistake."
      : 'Based on your answers, you appear to qualify to dismiss this ticket through a TDLR-approved defensive driving course. Follow the steps below to complete the process.',
    steps: buildEligibleSteps(isPending, state.selectedCourt),
    course: {
      name: 'Any TDLR-Approved Driving Safety Course',
      desc: 'Look for a course at or near the $25 base price. Skip optional add-ons to minimize cost. Order your Type 3A driving record directly from dps.texas.gov for $10 instead of through the course provider.'
    }
  }
}

function showResult() {
  const result = evaluate()
  const statusClass = result.status
  const stepsHTML = result.steps.map((s, i) => `<li><div class="step-num">${i + 1}</div><div>${s.text}</div></li>`).join('')
  let courseHTML = ''
  if (result.course) {
    courseHTML = `
      <div class="course-rec">
        <div class="rec-label">Recommended Course</div>
        <div class="rec-name">${result.course.name}</div>
        <div class="rec-desc">${result.course.desc}</div>
      </div>
    `
  }
  let emailBlockHTML = ''
  if (result.status === 'eligible' && state.selectedCourt) {
    const court = state.selectedCourt
    const subject = 'Free resource for people with traffic tickets'
    const body = `Hello,

I got a traffic ticket and used a free website called TDLR Guide (tdlrguide.com/eligibility-checker) to check if I could use defensive driving to dismiss it.

It answered my questions before I had to call the court. I wanted to pass it along in case it helps other people who come to your court with the same questions.

Thank you!`
    const rawEmail = court.email && String(court.email).trim()
    const encodedTo = rawEmail && rawEmail !== ''
      ? encodeURIComponent(rawEmail)
      : ''
    const encodedSubject = encodeURIComponent(subject)
    const encodedBody = encodeURIComponent(body)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`
    const outlookUrl = `https://outlook.live.com/mail/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`
    const courtEmail = court.email && String(court.email).trim() !== '' ? court.email.trim() : ''
    emailBlockHTML = `
      <div class="email-court-section">
        <h3>📬 One last thing — we built this for free</h3>
        <p class="email-court-desc">This tool is free and took a lot of work to build. If it helped you, there's one small way to pay it back: email your court and let them know it exists. Your email client will open with everything already written. Just hit send. That's it.</p>
        <div class="email-court-actions">
          <div class="email-court-row">
            <a class="email-court-btn email-court-btn-gmail" href="${gmailUrl}" target="_blank" rel="noopener noreferrer">Open in Gmail</a>
            <a class="email-court-btn email-court-btn-outlook" href="${outlookUrl}" target="_blank" rel="noopener noreferrer">Open in Outlook</a>
          </div>
          <button type="button" class="email-court-copy-body" data-body="${encodeURIComponent(body)}" data-original-label="Copy message">Copy message</button>
        </div>
        ${courtEmail ? `<p class="email-court-fallback">If your email client didn't open, copy the address and paste it into your email app: <button type="button" class="email-court-copy" data-email="${courtEmail.replace(/"/g, '&quot;')}">${courtEmail}</button></p>` : ''}
      </div>
    `
  }
  if (resultContent.value) {
    resultContent.value.innerHTML = `
      <div class="result-banner ${statusClass}">
        <div class="result-icon">${result.icon}</div>
        <div>
          <div class="result-title">${result.title}</div>
          <div class="result-reason">${result.reason}</div>
        </div>
      </div>
      <div class="steps-section">
        <h3>${result.status === 'eligible' ? 'Your Next Steps' : 'What You Can Do'}</h3>
        <ul class="steps-list">${stepsHTML}</ul>
      </div>
      ${courseHTML}
      ${emailBlockHTML}
    `
  }
  goTo('resultCard')
}

function restart() {
  state.violation = null
  state.speedOver = null
  state.cdl = null
  state.priorDismissal = null
  state.courtApproval = null
  state.selectedCourt = null
  selectedCounty.value = null
  selectedCourtType.value = null
  selectedCourtRecord.value = null
  if (speedInput.value) speedInput.value.value = ''
  goTo('step1')
}

onMounted(() => {
  updateProgress()
  resultContent.value?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const emailBtn = target.closest('.email-court-copy') as HTMLElement | null
    if (emailBtn && emailBtn.dataset.email) {
      navigator.clipboard.writeText(emailBtn.dataset.email).catch(() => {})
      return
    }
    const bodyBtn = target.closest('.email-court-copy-body') as HTMLElement | null
    if (bodyBtn && bodyBtn.dataset.body) {
      const raw = bodyBtn.dataset.body
      const text = raw ? decodeURIComponent(raw) : ''
      navigator.clipboard.writeText(text).then(() => {
        const original = bodyBtn.dataset.originalLabel || bodyBtn.textContent || 'Copy message'
        bodyBtn.textContent = 'Copied ✓'
        setTimeout(() => {
          bodyBtn.textContent = original
        }, 2000)
      }).catch(() => {})
    }
  })
})
</script>

<template>
  <div class="eligibility-checker-page min-h-screen font-['DM_Sans',system-ui,sans-serif]">
    <SiteHeader />

    <!-- Hero -->
    <main class="eligibility-checker-content" role="main" aria-label="Eligibility checker content">
    <div class="hero">
      <h1>Can I Dismiss My<br>Texas Traffic Ticket?</h1>
      <p>Answer 5 quick questions. Get your eligibility result and exact next steps in under a minute.</p>
    </div>

    <!-- Progress -->
    <div class="progress-wrap">
      <div class="progress-bar-track">
        <div ref="progressBar" class="progress-bar-fill" id="progressBar" />
      </div>
      <div class="progress-labels">
        <span>Start</span>
        <span ref="progressLabel" id="progressLabel">Step 1 of 5</span>
        <span>Result</span>
      </div>
    </div>

    <!-- Cards -->
    <div class="card-wrap">
      <div class="step-card active" id="step1">
        <div class="step-number">Question 1 of 5</div>
        <h2>What type of violation are you dealing with?</h2>
        <p class="sub">Select the closest match to the charge on your ticket.</p>
        <div class="options">
          <button type="button" class="opt-btn" @click="selectViolation('speeding')">
            <div class="icon">🚗</div>
            <div class="label">Speeding <small>Going faster than the posted speed limit</small></div>
            <div class="arrow">›</div>
          </button>
          <button type="button" class="opt-btn" @click="selectViolation('running_light')">
            <div class="icon">🚦</div>
            <div class="label">Red Light / Stop Sign <small>Failure to stop or yield</small></div>
            <div class="arrow">›</div>
          </button>
          <button type="button" class="opt-btn" @click="selectViolation('no_insurance')">
            <div class="icon">📄</div>
            <div class="label">No Proof of Insurance <small>Failure to maintain financial responsibility</small></div>
            <div class="arrow">›</div>
          </button>
          <button type="button" class="opt-btn" @click="selectViolation('cell_phone')">
            <div class="icon">📱</div>
            <div class="label">Cell Phone / Texting While Driving</div>
            <div class="arrow">›</div>
          </button>
          <button type="button" class="opt-btn" @click="selectViolation('other_minor')">
            <div class="icon">⚠️</div>
            <div class="label">Other Minor Traffic Violation <small>Lane change, following too close, seat belt, etc.</small></div>
            <div class="arrow">›</div>
          </button>
          <button type="button" class="opt-btn" @click="selectViolation('serious')">
            <div class="icon">🚨</div>
            <div class="label">Serious or Criminal Violation <small>Reckless driving, DWI, passing school bus, construction zone with workers, hit and run</small></div>
            <div class="arrow">›</div>
          </button>
        </div>
      </div>

      <div class="step-card" id="step1b">
        <div class="step-number">Question 1b of 5</div>
        <h2>How many mph over the speed limit were you cited?</h2>
        <p class="sub">This matters — Texas courts typically deny dismissal for excessive speed. Enter 0 if unknown.</p>
        <div class="speed-input-wrap">
          <label>Miles per hour over the posted limit</label>
          <div class="speed-row">
            <input ref="speedInput" type="number" class="speed-input" id="speedInput" min="0" max="100" placeholder="e.g. 12" />
            <span class="speed-unit">mph over</span>
          </div>
        </div>
        <button type="button" class="speed-continue-btn" @click="submitSpeed">Continue →</button>
        <p class="speed-note">Note: Courts generally will not approve dismissal for speeds 25 mph or more over the limit.</p>
      </div>

      <div class="step-card" id="step2">
        <div class="step-number">Question 2 of 5</div>
        <h2>Do you hold a Commercial Driver's License (CDL)?</h2>
        <p class="sub">This includes any Class A, B, or C commercial license — even if you were not driving a commercial vehicle when ticketed.</p>
        <div class="options two-col">
          <button type="button" class="opt-btn" @click="selectCDL(true)">
            <div class="icon">🚛</div>
            <div class="label">Yes, I have a CDL</div>
          </button>
          <button type="button" class="opt-btn" @click="selectCDL(false)">
            <div class="icon">🚙</div>
            <div class="label">No, standard license</div>
          </button>
        </div>
      </div>

      <div class="step-card" id="step3">
        <div class="step-number">Question 3 of 5</div>
        <h2>Have you used defensive driving to dismiss a Texas ticket in the last 12 months?</h2>
        <p class="sub">Texas law allows only one defensive driving dismissal per 12-month period. This resets based on the date you completed — not the ticket date.</p>
        <div class="options two-col">
          <button type="button" class="opt-btn" @click="selectPrior(true)">
            <div class="icon">✅</div>
            <div class="label">Yes, within the last 12 months</div>
          </button>
          <button type="button" class="opt-btn" @click="selectPrior(false)">
            <div class="icon">❌</div>
            <div class="label">No / Not sure</div>
          </button>
        </div>
      </div>

      <div class="step-card" id="step4">
        <div class="step-number">Question 4 of 5</div>
        <h2>Have you already requested permission from the court to take defensive driving?</h2>
        <p class="sub">In Texas, you must get court approval <em>before</em> taking the course — the court does not have to grant it. This is a common step people miss.</p>
        <div class="options two-col">
          <button type="button" class="opt-btn" @click="selectCourtApproval(true)">
            <div class="icon">🏛️</div>
            <div class="label">Yes, court approved it</div>
          </button>
          <button type="button" class="opt-btn" @click="selectCourtApproval('pending')">
            <div class="icon">⏳</div>
            <div class="label">Not yet — haven't asked</div>
          </button>
          <button type="button" class="opt-btn court-denied-btn" @click="selectCourtApproval('denied')">
            <div class="icon">🚫</div>
            <div class="label">Court denied my request</div>
          </button>
        </div>
      </div>

      <div class="step-card" id="step5">
        <div class="step-number">Question 5 of 5</div>
        <h2>Which court is handling your ticket?</h2>
        <p class="sub">Select your county, then court type, then the specific court.</p>
        <div v-if="countyOptions.length === 0" class="court-empty-state">
          No court data is loaded. Place <strong>Courts Directory By County (1).xlsx</strong> in the project root and run <code>npm run build:courts</code> to populate the list.
        </div>
        <div v-else class="court-dropdowns">
          <div class="court-dropdown-field">
            <label class="court-dropdown-label">County</label>
            <USelectMenu
              v-model="selectedCounty"
              :items="countyOptions"
              value-key="value"
              placeholder="Select county"
              class="court-select-menu"
              @update:model-value="selectedCourtType = null; selectedCourtRecord = null"
            />
          </div>
          <div class="court-dropdown-field">
            <label class="court-dropdown-label">Court Type</label>
            <USelectMenu
              v-model="selectedCourtType"
              :items="courtTypeOptions"
              value-key="value"
              placeholder="Select court type"
              class="court-select-menu"
              :disabled="!selectedCounty"
              @update:model-value="selectedCourtRecord = null"
            />
          </div>
          <div class="court-dropdown-field">
            <label class="court-dropdown-label">Court</label>
            <USelectMenu
              v-model="selectedCourtRecord"
              :items="courtNameOptions"
              value-key="value"
              placeholder="Select court"
              class="court-select-menu"
              :disabled="!selectedCounty || !selectedCourtType"
              @update:model-value="(court: import('~/composables/useCourts').CourtRecord) => { if (court) { state.selectedCourt = court; showResult(); } }"
            />
          </div>
        </div>
      </div>

      <div class="step-card" id="resultCard">
        <div ref="resultContent" id="resultContent" />
        <button type="button" class="restart-btn" @click="restart">↩ Start Over</button>
      </div>
    </div>

    <p class="disclaimer">
      This tool provides general guidance only and is not legal advice. Court decisions on dismissal requests are at the judge's discretion. Always confirm requirements directly with your court. Eligibility rules are based on Texas Transportation Code §543.101–543.112 and TDLR regulations.
    </p>
    </main>
  </div>
</template>

<style>
/* Match site colors/font minimally — override checker vars for this page */
.eligibility-checker-page {
  --navy: var(--proto-header-from);
  --navy-mid: var(--proto-header-to);
  --amber: var(--proto-teal);
  --amber-light: var(--proto-teal-bg);
  --gray: var(--proto-page-bg);
  --text: var(--proto-text);
  --muted: var(--proto-text-muted);
  background: var(--proto-page-bg);
}

.eligibility-checker-page .hero {
  background: var(--proto-page-bg);
}
.eligibility-checker-page .hero::before {
  background: none;
}
.eligibility-checker-page .progress-bar-fill {
  background: linear-gradient(90deg, var(--proto-teal), #14B8A6);
}
.eligibility-checker-page .opt-btn:hover .icon { background: var(--proto-teal-bg); }
.eligibility-checker-page .opt-btn:hover { border-color: var(--proto-header-to); }
.eligibility-checker-page .speed-continue-btn { background: var(--proto-header-from); }
.eligibility-checker-page .speed-continue-btn:hover { background: var(--proto-header-to); }
.eligibility-checker-page .step-num { background: var(--proto-header-from); }
.eligibility-checker-page .steps-list li a { color: var(--proto-teal-dark); }

/* Step 4 third button full width */
.eligibility-checker-page #step4 .court-denied-btn { grid-column: 1 / -1; flex-direction: row; text-align: left; gap: 14px; }

/* ─── Checker layout & components (unchanged structure) ───────── */
/* Only reset margin/padding inside checker content so header is untouched */
.eligibility-checker-page .eligibility-checker-content * { box-sizing: border-box; margin: 0; padding: 0; }
.eligibility-checker-page main.eligibility-checker-content { margin: 0; padding: 0; }
.eligibility-checker-page .hero {
  padding: 48px 24px 72px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.eligibility-checker-page .hero::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.eligibility-checker-page .hero h1 {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 700;
  color: var(--proto-text);
  line-height: 1.2;
  margin-bottom: 14px;
  position: relative;
}
.eligibility-checker-page .hero p {
  color: var(--proto-text-muted);
  font-size: 1rem;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
  position: relative;
}
.eligibility-checker-page .progress-wrap {
  max-width: 640px;
  margin: -28px auto 0;
  padding: 0 16px;
  position: relative;
  z-index: 10;
}
.eligibility-checker-page .progress-bar-track {
  background: var(--proto-card-border);
  border-radius: 100px;
  height: 6px;
  overflow: hidden;
}
.eligibility-checker-page .progress-bar-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
  width: 0%;
}
.eligibility-checker-page .progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.72rem;
  color: var(--proto-text-muted);
  font-weight: 500;
}
.eligibility-checker-page .card-wrap {
  max-width: 640px;
  margin: 32px auto 60px;
  padding: 0 16px;
}
.eligibility-checker-page .step-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(15,31,56,0.1), 0 1px 4px rgba(15,31,56,0.06);
  padding: 36px 40px;
  display: none;
  animation: eligibilitySlideIn 0.35s ease;
}
.eligibility-checker-page .step-card.active { display: block; }
@keyframes eligibilitySlideIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
.eligibility-checker-page .step-number {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}
.eligibility-checker-page .step-card h2 {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--navy);
  line-height: 1.3;
  margin-bottom: 6px;
}
.eligibility-checker-page .step-card .sub {
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 28px;
  line-height: 1.5;
}
.eligibility-checker-page .options { display: flex; flex-direction: column; gap: 10px; }
.eligibility-checker-page .opt-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border: 2px solid var(--proto-card-border);
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text);
  transition: all 0.18s ease;
  position: relative;
}
.eligibility-checker-page .opt-btn:hover {
  background: var(--proto-hover-bg);
  transform: translateX(3px);
}
.eligibility-checker-page .opt-btn .icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  transition: background 0.18s;
}
.eligibility-checker-page .opt-btn .label { flex: 1; }
.eligibility-checker-page .opt-btn .label small {
  display: block;
  font-size: 0.78rem;
  color: var(--muted);
  font-weight: 400;
  margin-top: 2px;
}
.eligibility-checker-page .opt-btn .arrow {
  color: var(--proto-card-border);
  font-size: 1rem;
  transition: color 0.18s;
}
.eligibility-checker-page .opt-btn:hover .arrow { color: var(--navy); }
.eligibility-checker-page .options.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.eligibility-checker-page .options.two-col .opt-btn {
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 20px 16px;
}
.eligibility-checker-page .options.two-col .opt-btn .icon {
  width: 44px;
  height: 44px;
  font-size: 1.3rem;
}
.eligibility-checker-page .options.two-col .opt-btn .arrow { display: none; }
.eligibility-checker-page .speed-input-wrap { margin: 8px 0 20px; }
.eligibility-checker-page .speed-input-wrap label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 8px;
}
.eligibility-checker-page .speed-row { display: flex; gap: 12px; align-items: center; }
.eligibility-checker-page .speed-input {
  width: 120px;
  padding: 12px 16px;
  border: 2px solid var(--proto-card-border);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--navy);
  outline: none;
  transition: border-color 0.18s;
  text-align: center;
}
.eligibility-checker-page .speed-input:focus { border-color: var(--navy-mid); }
.eligibility-checker-page .speed-unit { color: var(--muted); font-size: 0.9rem; }
.eligibility-checker-page .speed-continue-btn {
  margin-top: 16px;
  padding: 13px 28px;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, transform 0.1s;
}
.eligibility-checker-page .speed-continue-btn:hover { transform: translateY(-1px); }
.eligibility-checker-page .speed-note { margin-top: 10px; font-size: 0.8rem; color: var(--muted); }
.eligibility-checker-page .result-banner {
  border-radius: 12px;
  padding: 24px 28px;
  margin-bottom: 28px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.eligibility-checker-page .result-banner.eligible {
  background: var(--pill-cert-free-bg);
  border: 2px solid var(--pill-cert-free-border);
}
.eligibility-checker-page .result-banner.ineligible {
  background: var(--pill-cert-paid-bg);
  border: 2px solid var(--pill-cert-paid-border);
}
.eligibility-checker-page .result-banner.maybe {
  background: var(--color-rui-warning-50);
  border: 2px solid var(--color-rui-warning-200);
}
.eligibility-checker-page .result-banner .result-icon { font-size: 2rem; line-height: 1; flex-shrink: 0; }
.eligibility-checker-page .result-banner .result-title {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: 4px;
}
.eligibility-checker-page .result-banner.eligible .result-title { color: var(--color-rui-success-700); }
.eligibility-checker-page .result-banner.ineligible .result-title { color: var(--color-rui-error-600); }
.eligibility-checker-page .result-banner.maybe .result-title { color: var(--color-rui-warning-800); }
.eligibility-checker-page .result-banner .result-reason {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text);
  opacity: 0.85;
}
.eligibility-checker-page .steps-section h3 {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--navy);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--proto-card-border);
}
.eligibility-checker-page .steps-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
}
.eligibility-checker-page .steps-list li {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  font-size: 0.92rem;
  line-height: 1.55;
}
.eligibility-checker-page .step-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.eligibility-checker-page .course-rec {
  background: var(--gray);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
}
.eligibility-checker-page .course-rec .rec-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}
.eligibility-checker-page .course-rec .rec-name {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--navy);
  margin-bottom: 4px;
}
.eligibility-checker-page .course-rec .rec-desc {
  font-size: 0.85rem;
  color: var(--muted);
  line-height: 1.5;
}
.eligibility-checker-page .restart-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px 22px;
  background: transparent;
  border: 2px solid var(--proto-card-border);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.18s;
}
.eligibility-checker-page .restart-btn:hover {
  border-color: var(--navy);
  color: var(--navy);
}
.eligibility-checker-page .disclaimer {
  max-width: 640px;
  margin: 0 auto 40px;
  padding: 0 16px;
  font-size: 0.78rem;
  color: var(--muted);
  line-height: 1.6;
  text-align: center;
}

/* Step 5 court dropdowns */
.eligibility-checker-page .court-dropdowns {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
}
.eligibility-checker-page .court-dropdown-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.eligibility-checker-page .court-dropdown-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--navy);
}
/* Match step card / speed input: border, radius, font */
.eligibility-checker-page .court-dropdowns button.court-select-menu {
  width: 100% !important;
  padding: 12px 16px !important;
  border: 2px solid var(--proto-card-border) !important;
  border-radius: 10px !important;
  font-family: 'DM Sans', system-ui, sans-serif !important;
  font-size: 0.95rem !important;
  font-weight: 500 !important;
  color: var(--navy) !important;
  background: #fff !important;
  box-shadow: none !important;
}
.eligibility-checker-page .court-dropdowns button.court-select-menu[data-state="open"],
.eligibility-checker-page .court-dropdowns button.court-select-menu:focus-visible {
  border-color: var(--navy-mid) !important;
  outline: none !important;
}
.eligibility-checker-page .court-empty-state {
  margin-top: 12px;
  padding: 14px 18px;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--muted);
  background: var(--proto-hover-bg);
  border-radius: 10px;
  border: 1px solid var(--proto-card-border);
}
.eligibility-checker-page .court-empty-state code {
  font-size: 0.85em;
  padding: 2px 6px;
  background: var(--proto-card-border);
  border-radius: 4px;
}

/* Result card – Email your court block (injected HTML) */
.eligibility-checker-page .email-court-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--proto-card-border);
}
.eligibility-checker-page .email-court-section h3 {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--navy);
  margin-bottom: 10px;
}
.eligibility-checker-page .email-court-desc {
  font-size: 0.9rem;
  color: var(--muted);
  line-height: 1.55;
  margin-bottom: 14px;
}
.eligibility-checker-page .email-court-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.eligibility-checker-page .email-court-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.eligibility-checker-page .email-court-fallback {
  font-size: 0.85rem;
  color: var(--muted);
  margin-top: 14px;
  line-height: 1.5;
}
.eligibility-checker-page .email-court-copy {
  display: inline-block;
  margin-top: 6px;
  padding: 8px 12px;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.85rem;
  color: var(--proto-teal-dark);
  background: var(--proto-teal-bg);
  border: 1px solid var(--proto-teal-border);
  border-radius: 8px;
  cursor: pointer;
  word-break: break-all;
  text-align: left;
  transition: background 0.18s, border-color 0.18s;
}
.eligibility-checker-page .email-court-copy:hover {
  background: var(--proto-teal-border);
  border-color: var(--proto-teal);
}
.eligibility-checker-page .email-court-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 22px;
  color: #fff;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.18s, transform 0.1s;
}
.eligibility-checker-page .email-court-btn-gmail {
  background: #DC2626;
}
.eligibility-checker-page .email-court-btn-gmail:hover {
  background: #B91C1C;
  transform: translateY(-1px);
}
.eligibility-checker-page .email-court-btn-outlook {
  background: #2563EB;
}
.eligibility-checker-page .email-court-btn-outlook:hover {
  background: #1D4ED8;
  transform: translateY(-1px);
}
.eligibility-checker-page .email-court-copy-body {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: 12px 22px;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  background: #F3F4F6;
  color: var(--proto-text);
  border: 1px solid var(--proto-card-border);
  transition: background 0.18s, border-color 0.18s, transform 0.1s;
}
.eligibility-checker-page .email-court-copy-body:hover {
  background: #E5E7EB;
  border-color: var(--proto-row-border);
  transform: translateY(-1px);
}

@media (max-width: 500px) {
  .eligibility-checker-page .step-card { padding: 28px 24px; }
  .eligibility-checker-page .hero { padding: 40px 20px 68px; }
}
</style>
