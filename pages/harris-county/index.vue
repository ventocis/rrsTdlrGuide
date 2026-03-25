<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl as string) || 'https://tdlrguide.com'

const selectedOption = ref<'dsc' | 'def' | null>(null)

function selectOption(which: 'dsc' | 'def') {
  selectedOption.value = which
}

const pageTitle = 'Harris County Traffic Ticket Guide: DSC & Deferred Disposition | TDLRguide'
const pageDescription = 'Got a Harris County traffic ticket from a JP Court? Learn how to dismiss it with a Driver Safety Course or Deferred Disposition. Plain-English guide with fees, forms, and step-by-step instructions from Harris County Justice of the Peace Courts.'
const pageUrl = `${siteUrl}/harris-county`

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
      name: 'Is this page for Houston Municipal Court or Harris County JP Courts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This page covers Harris County Justice of the Peace Courts only. These courts handle traffic citations issued in unincorporated Harris County and smaller cities within Harris County. If your citation was issued within the City of Houston, it is handled by Houston Municipal Court — see TDLRguide\'s Houston ticket guide instead.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I find which Harris County JP Court handles my case?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Harris County has 16 Justice of the Peace precincts. You can find your specific court by searching for your case at jp.hctx.net using the "Find My Case and Court Date" feature. Your citation may also show the precinct number.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I dismiss a Harris County traffic ticket with a Driver Safety Course?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'On or before your appearance date, plead guilty or no contest, waive a jury trial, submit a DSC Request Form, and pay court costs of $144 (for offenses on or after January 1, 2020). You then have 90 days to complete a TDLR-approved course and submit your certificate, driving record, and notarized affidavit. Do not take the course before receiving court approval.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is Deferred Disposition at Harris County JP Courts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Deferred Disposition (formally called Suspension of Sentence and Deferral of Final Disposition) is a discretionary option — the Justice of the Peace may grant it but is not required to. You plead guilty or no contest, pay court costs, and are placed on probation for up to 180 days with conditions. If you comply with all conditions, the case is dismissed with no conviction.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the Specialized DSC option in Harris County?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If your ticket is for transporting a child not secured in a child passenger safety seat or safety belt, you may be eligible for a Specialized Driving Safety Course dismissal. This involves a course focused on child passenger safety seat instruction. The fee is the same as standard DSC ($144 for offenses on or after January 1, 2020).'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does a Driver Safety Course cost in Harris County?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Harris County JP Court fee for a Driver Safety Course is $144 for offenses committed on or after January 1, 2020. If your offense was committed before that date, contact your specific precinct court for the applicable fee. You also pay at least $25 for the course itself.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does a Harris County JP Court traffic ticket cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fines vary by violation. Common fines include: Failure to Control Speed $190, Ran Stop Sign or Red Light $160, Unsafe Lane Change $165, Failure to Wear Safety Belt $125, and Passing a Stopped School Bus $1,085. Speeding fines range from $130 (1–10 mph over) to $275 (39+ mph over), plus additional amounts for school zones.'
      }
    }
  ]
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Dismiss a Harris County Traffic Ticket with a Driver Safety Course',
  datePublished: '2026-03-25',
  dateModified: '2026-03-25',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Find your Harris County JP Court precinct',
      text: 'Harris County has 16 JP Courts. Search for your case at jp.hctx.net to find your specific court, your appearance date, and the fine amount.'
    },
    {
      '@type': 'HowToStep',
      name: 'Submit your DSC request on or before your appearance date',
      text: 'Plead guilty or no contest, waive a jury trial, submit a DSC Request Form, and pay court costs of $144. Apply online at jp.hctx.net, by mail, or in person at your specific precinct court.'
    },
    {
      '@type': 'HowToStep',
      name: 'Wait for court approval before taking any course',
      text: 'Do not take the course until you receive an Order from the court approving your request. The court will defer judgment for 90 days.'
    },
    {
      '@type': 'HowToStep',
      name: 'Complete a TDLR-approved 6-hour defensive driving course',
      text: 'Complete any TDLR-approved driving safety course within 90 days of your approval date. Online and in-person options are available.'
    },
    {
      '@type': 'HowToStep',
      name: 'Submit your certificate, driving record, and affidavit',
      text: 'On or before the 90th day, submit to your precinct court: your signed certificate of completion (Court Copy), your Type 3A driving record showing no DSC in the past 12 months (unless the court already obtained it for the $12 fee), and your notarized DSC Affidavit.'
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
  <div class="harris-county-page">
    <SiteHeader />
    <main>
      <div class="wrap">

        <div class="pg-label">Harris County Justice of the Peace Courts</div>
        <h1>Got a Harris County traffic ticket?<br>Here are your options.</h1>
        <p class="lead">This guide covers Harris County Justice of the Peace Courts — not Houston Municipal Court. If your ticket was issued within the City of Houston, <NuxtLink to="/houston" style="color:var(--blue)">see our Houston ticket guide instead</NuxtLink>.</p>

        <!-- Notice box 1: Court distinction -->
        <div class="box danger" style="margin-bottom:.875rem">
          <div class="box-lbl">Houston Municipal Court vs. Harris County JP Courts — know the difference</div>
          <p>Harris County has two separate court systems. If your ticket was issued <strong>within City of Houston limits</strong>, it goes to Houston Municipal Court (different fees, different process). If your ticket was issued in <strong>unincorporated Harris County or a smaller Harris County city</strong>, it goes to a Harris County Justice of the Peace Court. This page covers Harris County JP Courts only.</p>
          <NuxtLink to="/houston" class="dl-link" style="margin-top:.625rem">Go to the Houston ticket guide</NuxtLink>
        </div>

        <!-- Notice box 2: Precinct finder -->
        <div class="box info" style="margin-bottom:1.5rem">
          <div class="box-lbl">Harris County has 16 JP Courts — find yours first</div>
          <p>Your specific precinct court handles your case. Before doing anything else, find your court and your appearance date using the Harris County JP Courts case search.</p>
          <a class="dl-link" href="https://jpwebsite.harriscountytx.gov/FindMyCase/search.jsp" target="_blank" rel="noopener noreferrer" style="margin-top:.625rem">Find my case and court date</a>
        </div>

        <h2 class="sh">Step 1 — Choose your path</h2>

        <div class="picker">
          <button
            :class="['pick-btn', 'blue', { active: selectedOption === 'dsc' }]"
            @click="selectOption('dsc')"
          >
            <div class="pick-indicator" />
            <div class="pb-tag">Option A</div>
            <h3>Driver Safety Course</h3>
            <p>Take a TDLR-approved defensive driving course. Court fee is $144. You have 90 days to complete it after court approval.</p>
          </button>
          <button
            :class="['pick-btn', 'green', { active: selectedOption === 'def' }]"
            @click="selectOption('def')"
          >
            <div class="pick-indicator" />
            <div class="pb-tag">Option B</div>
            <h3>Deferred Disposition (Probation)</h3>
            <p>The JP may place you on probation for up to 180 days. Comply with all conditions — case dismissed. This is discretionary — the judge decides.</p>
          </button>
        </div>

        <!-- Third option callout -->
        <div class="box neutral" style="margin-bottom:1.5rem">
          <div class="box-lbl">Special case: Child safety seat ticket?</div>
          <p>If your ticket is for transporting a child not secured in a child passenger safety seat or safety belt, you may qualify for a <strong>Specialized Driving Safety Course</strong> focused on child passenger safety. The requirements and fee are similar to standard DSC. See the Specialized DSC section inside the DSC panel below for details.</p>
        </div>

        <!-- Comparison box -->
        <div class="box info" style="margin-bottom:1.5rem">
          <div class="box-lbl">Not sure which to pick?</div>
          <div class="compare">
            <div class="comp-card dsc">
              <div class="ct">Driver Safety Course</div>
              <h4>Choose this if you...</h4>
              <ul>
                <li>Have a valid Texas license (not CDL)</li>
                <li>Have not taken DSC in the past 12 months for a citation dismissal</li>
                <li>Want a clear 90-day deadline with a fixed cost ($144)</li>
                <li>Your violation qualifies (not 25+ mph over, not school bus, etc.)</li>
              </ul>
            </div>
            <div class="comp-card def">
              <div class="ct">Deferred Disposition</div>
              <h4>Choose this if you...</h4>
              <ul>
                <li>Want to avoid taking a driving course (if over 25 and eligible)</li>
                <li>Understand this is at the judge's discretion — not guaranteed</li>
                <li>Are willing to comply with court conditions for up to 180 days</li>
                <li>Your violation is not in a construction zone and you don't hold a CDL</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Default: nothing selected -->
        <div v-show="selectedOption === null" style="margin-top:.5rem">
          <div class="box neutral">
            <div class="box-lbl">Select an option above</div>
            <p>Choose Option A or Option B to see detailed instructions, fees, and required documents for your situation.</p>
          </div>
        </div>

        <!-- ── DSC Panel ── -->
        <section v-show="selectedOption === 'dsc'" aria-label="Driver Safety Course option">

          <h2 class="sh">Step 0 — Find your Harris County JP Court</h2>

          <div class="box info">
            <div class="box-lbl">Harris County has 16 JP Court precincts</div>
            <p>All documents, applications, and completed course paperwork must go to your specific precinct court — not a central Harris County office.</p>
            <a class="dl-link" href="https://jpwebsite.harriscountytx.gov/FindMyCase/search.jsp" target="_blank" rel="noopener noreferrer" style="margin-top:.625rem">Search for your case and court</a>
          </div>

          <h2 class="sh">Driver Safety Course — Am I eligible?</h2>

          <div class="box danger">
            <div class="box-lbl">You are NOT eligible for DSC if any of these apply</div>
            <div class="inel-list">
              <div class="inel-row"><span class="inel-x">X</span><span class="inel-text">You hold a commercial driver's license, OR you held one when the offense occurred</span></div>
              <div class="inel-row"><span class="inel-x">X</span><span class="inel-text">You are currently taking a driving safety course</span></div>
              <div class="inel-row"><span class="inel-x">X</span><span class="inel-text">You completed a DSC within the 12 months before the date of your offense (to secure a citation dismissal)</span></div>
              <div class="inel-row"><span class="inel-x">X</span><span class="inel-text">Your ticket is for passing a school bus</span></div>
              <div class="inel-row"><span class="inel-x">X</span><span class="inel-text">Your ticket is for failing to stop and give information or render aid after an accident, or for striking an unattended vehicle or fixture</span></div>
              <div class="inel-row"><span class="inel-x">X</span><span class="inel-text">Your ticket is for an offense in a construction or maintenance work zone when workers were present</span></div>
              <div class="inel-row"><span class="inel-x">X</span><span class="inel-text">Your ticket is for driving 95 mph or more</span></div>
              <div class="inel-row"><span class="inel-x">X</span><span class="inel-text">Your ticket is for speeding 25 mph or more over the posted speed limit</span></div>
            </div>
          </div>

          <p style="font-size:14px;color:var(--tx2);margin:.875rem 0 .875rem;line-height:1.6">You must also have: a valid Texas Driver's License or permit (or active military duty status, or be the spouse or dependent child of an active duty member), <strong style="color:var(--tx)">AND</strong> proof of automobile liability insurance.</p>

          <h2 class="sh">How much does DSC cost?</h2>

          <div class="box neutral">
            <div class="box-lbl">Court fee</div>
            <table class="fee-table" style="margin-top:.25rem">
              <tbody>
                <tr><th>Applies to</th><th>Court fee</th></tr>
                <tr><td>Offenses committed on or after January 1, 2020</td><td>$144.00</td></tr>
              </tbody>
            </table>
            <div class="box warn" style="margin-top:.75rem;padding:.75rem 1rem;">
              <div class="box-lbl">If your offense predates January 1, 2020</div>
              <p style="font-size:13px">Contact your specific precinct court to confirm the applicable fee for your citation date.</p>
            </div>
            <p style="font-size:13px;color:var(--tx3);margin-top:.75rem">Starting January 1, 2008, the court may pay the $12 fee to obtain your driving record directly. If the court obtains your record and it shows you have not completed DSC in the past 12 months, you will be allowed to proceed. If the court obtains your record, you may not need to provide your own — confirm with your precinct court.</p>
          </div>

          <div class="box warn">
            <div class="box-lbl">Do not take the course before the court approves you</div>
            <p>You must receive a written Order from the court before enrolling in or completing any driving safety course. The court can revoke or deny your DSC option if you take the course before approval.</p>
          </div>

          <h2 class="sh">How to complete DSC — step by step</h2>

          <div class="steps">
            <div class="step">
              <div class="step-dot">1</div>
              <div class="step-body">
                <strong>Find your precinct court and your appearance date</strong>
                <p>Go to <a href="https://jp.hctx.net" target="_blank" rel="noopener noreferrer">jp.hctx.net</a> and use "Find My Case and Court Date" to locate your specific precinct court. Note your appearance date — all requests must be submitted on or before this date.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-dot">2</div>
              <div class="step-body">
                <strong>Submit your DSC request on or before your appearance date</strong>
                <p>You must: (1) enter a plea of guilty or no contest, (2) waive your right to a trial by jury, (3) submit a DSC Request Form, (4) show your valid Texas Driver's License or permit, and (5) provide proof of automobile liability insurance. Apply online at <a href="https://jp.hctx.net" target="_blank" rel="noopener noreferrer">jp.hctx.net</a>, by mail, or in person at your specific precinct court.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-dot">3</div>
              <div class="step-body">
                <strong>Pay the court fee</strong>
                <p>Pay <strong style="color:var(--tx)">$144</strong> (for offenses on or after January 1, 2020) at the time of your request. Online payments accepted at jp.hctx.net. In person: cash, cashier's check, money order, or credit card. By mail: cashier's check or money order payable to the Justice of the Peace — include your precinct and place number.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-dot">4</div>
              <div class="step-body">
                <strong>Wait for your court Order before taking any course</strong>
                <p>The court will defer judgment for 90 days after approving your request. Do not enroll in or take any course until you receive this Order.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-dot">5</div>
              <div class="step-body">
                <strong>Complete a TDLR-approved 6-hour defensive driving course</strong>
                <p>Any TDLR-approved course is accepted. Online and in-person options are available. You have <strong style="color:var(--tx)">90 days</strong> from your approval date to complete it.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-dot">6</div>
              <div class="step-body">
                <strong>Order your driving record (if required)</strong>
                <p>If the court did not obtain your driving record directly via the $12 fee, you must provide it yourself. Order a Type 3A certified driving record online instantly, or by mail using the DPS DR-1 form.</p>
                <a class="dl-link" href="https://www.texas.gov" target="_blank" rel="noopener noreferrer">Order online at texas.gov</a>
                <a class="dl-link" href="https://www.dps.texas.gov/internetforms/forms/dr-1.pdf" target="_blank" rel="noopener noreferrer" style="margin-left:.35rem">Mail-in order form (DR-1)</a>
              </div>
            </div>
            <div class="step">
              <div class="step-dot">7</div>
              <div class="step-body">
                <strong>Submit all documents to your precinct court within 90 days</strong>
                <p>On or before the 90th day, submit by mail or in person to your specific precinct court (not a central office): (1) signed Certificate of Completion — Court Copy, (2) your driving record showing no DSC in the past 12 months (unless the court already obtained it), and (3) your notarized DSC Affidavit. Fax and email are not listed as accepted methods — mail or in person only. Certified mail is recommended. Keep copies of everything.</p>
                <div class="box neutral" style="margin-top:.625rem;padding:.75rem 1rem;">
                  <div class="box-lbl">Active military — no Texas license?</div>
                  <p style="font-size:13px">You must instead submit a <strong>Military Affidavit</strong> (different form) stating you were not taking a course in another state at the time of your request and have not completed one in the past 12 months.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 class="sh">Specialized DSC — child safety seat violations</h2>

          <p style="font-size:14px;color:var(--tx2);margin-bottom:.875rem;line-height:1.6">If your ticket is specifically for transporting a child who was not secured in a child passenger safety seat system or not secured by a safety belt, you may qualify for a Specialized Driving Safety Course instead of (or in addition to) the standard DSC.</p>

          <div class="box info">
            <div class="box-lbl">Key differences from standard DSC</div>
            <ul>
              <li>You <strong>MAY</strong> take the Specialized DSC even if you are currently taking a standard DSC, or completed one in the past 12 months — as long as those courses did not include child safety seat instruction</li>
              <li>You are <strong>NOT</strong> eligible if you hold a CDL</li>
              <li>You are <strong>NOT</strong> eligible if the offense was in a construction zone with workers present</li>
              <li>The fee and 90-day completion deadline are the same as standard DSC ($144)</li>
              <li>You must submit a <strong>Specialized DSC Request Form</strong> (confirm which form applies with your court)</li>
              <li>Submit a <strong>Specialized DSC Affidavit</strong> upon completion</li>
              <li>Military members use a Specialized Military Affidavit</li>
            </ul>
          </div>

          <h2 class="sh">Forms and documents to download</h2>

          <div class="req-list">
            <div class="req-item">
              <div class="req-num">1</div>
              <div class="req-body">
                <strong>DSC Request Form</strong>
                <span>Required to request standard DSC. Submit on or before your appearance date with your plea, license, insurance, and fee.</span><br>
                <a class="dl-link" href="https://jp.hctx.net/traffic/DSC.pdf" target="_blank" rel="noopener noreferrer">Download DSC Request Form</a>
              </div>
            </div>
            <div class="req-item">
              <div class="req-num">2</div>
              <div class="req-body">
                <strong>DSC Affidavit</strong>
                <span>Required when submitting your completed DSC documents. Must be signed and notarized.</span><br>
                <a class="dl-link" href="https://jp.hctx.net/traffic/DSC-Aff.pdf" target="_blank" rel="noopener noreferrer">Download DSC Affidavit</a>
              </div>
            </div>
            <div class="req-item">
              <div class="req-num">3</div>
              <div class="req-body">
                <strong>DSC Affidavit — Military Members</strong>
                <span>For active military members (or their spouses/dependents) who do not have a valid Texas Driver's License.</span><br>
                <a class="dl-link" href="https://jp.hctx.net/traffic/DSC-Aff-Mil.pdf" target="_blank" rel="noopener noreferrer">Download Military DSC Affidavit</a>
              </div>
            </div>
            <div class="req-item">
              <div class="req-num">4</div>
              <div class="req-body">
                <strong>Specialized DSC Request Form (child safety seat cases)</strong>
                <span>Required if requesting a Specialized DSC for a child safety seat violation. Confirm with your court which form applies to your case.</span><br>
                <a class="dl-link" href="https://jp.hctx.net/traffic/DSC.pdf" target="_blank" rel="noopener noreferrer">Download Specialized DSC Request Form</a>
              </div>
            </div>
            <div class="req-item">
              <div class="req-num">5</div>
              <div class="req-body">
                <strong>Specialized DSC Affidavit</strong>
                <span>Required when submitting Specialized DSC completion documents.</span><br>
                <a class="dl-link" href="https://jp.hctx.net/traffic/Sp-DSC-Aff.pdf" target="_blank" rel="noopener noreferrer">Download Specialized DSC Affidavit</a>
              </div>
            </div>
            <div class="req-item">
              <div class="req-num">6</div>
              <div class="req-body">
                <strong>Specialized DSC Military Affidavit</strong>
                <span>For military members submitting Specialized DSC completion.</span><br>
                <a class="dl-link" href="https://jp.hctx.net/traffic/Sp-DSC-Aff-Mil.pdf" target="_blank" rel="noopener noreferrer">Download Specialized Military Affidavit</a>
              </div>
            </div>
            <div class="req-item">
              <div class="req-num">7</div>
              <div class="req-body">
                <strong>Traffic Ticket Reply Form</strong>
                <span>Used to pay a citation by mail or enter a not guilty plea without appearing in court.</span><br>
                <a class="dl-link" href="https://jp.hctx.net/traffic/TicketReply.pdf" target="_blank" rel="noopener noreferrer">Download Traffic Ticket Reply Form</a>
              </div>
            </div>
            <div class="req-item">
              <div class="req-num">8</div>
              <div class="req-body">
                <strong>All Harris County JP Court Forms</strong>
                <span>Full index of all court forms including appeal bonds and more.</span><br>
                <a class="dl-link" href="https://jp.hctx.net/forms/default.htm#TrafficForms" target="_blank" rel="noopener noreferrer">View all forms at jp.hctx.net</a>
              </div>
            </div>
            <div class="req-item">
              <div class="req-num">9</div>
              <div class="req-body">
                <strong>Type 3A Driving Record — order online</strong>
                <span>Required with completion documents (unless court obtained it). Must be "Type 3A" specifically.</span><br>
                <a class="dl-link" href="https://www.texas.gov" target="_blank" rel="noopener noreferrer">Order at texas.gov</a>
              </div>
            </div>
            <div class="req-item">
              <div class="req-num-wide">10</div>
              <div class="req-body">
                <strong>Driving Record — mail order form (DR-1)</strong>
                <span>Mail-in option for ordering your driving record from DPS.</span><br>
                <a class="dl-link" href="https://www.dps.texas.gov/internetforms/forms/dr-1.pdf" target="_blank" rel="noopener noreferrer">Download DR-1 form (PDF)</a>
              </div>
            </div>
          </div>

          <h2 class="sh">How to apply and where to submit</h2>

          <div class="sub-methods">
            <div class="sub-card">
              <div class="method">Online</div>
              <p>Apply for DSC and pay court costs online. Also use to find your case, court date, and fine amount.<br><br>
                <a class="dl-link" href="https://jpwebsite.harriscountytx.gov/FindMyCase/search.jsp" target="_blank" rel="noopener noreferrer">Apply online at jp.hctx.net</a>
                <br><br><span style="font-size:12px;color:var(--tx3)">American Express, Visa, Mastercard, Discover, and e-check accepted.</span>
              </p>
            </div>
            <div class="sub-card">
              <div class="method">By mail</div>
              <p>Mail DSC Request Form, documents, and cashier's check or money order payable to "Justice of the Peace." Write your precinct and place number on the payment. No cash by mail.<br><br><span style="font-size:12px;color:var(--tx3)">Mail to your specific precinct court — find the address at jp.hctx.net. Certified mail recommended.</span></p>
            </div>
            <div class="sub-card">
              <div class="method">In person</div>
              <p>Visit your specific precinct court. Cash, cashier's check, money order, debit card, and major credit cards accepted.<br><br>
                <a class="dl-link" href="https://jp.hctx.net" target="_blank" rel="noopener noreferrer">Find your precinct court location</a>
              </p>
            </div>
          </div>

          <div class="box warn" style="margin-top:1rem">
            <div class="box-lbl">Submit to your specific precinct court — no central office</div>
            <p>Completed documents (certificate, driving record, affidavit) must be submitted to your specific precinct court. There is no central Harris County submission office. If you are unsure which court, search your case at <a href="https://jp.hctx.net" target="_blank" rel="noopener noreferrer" style="color:var(--amber-tx);text-decoration:underline">jp.hctx.net</a>.</p>
          </div>

          <h2 class="sh">What happens if you miss your 90-day deadline</h2>

          <div class="box warn">
            <div class="box-lbl">Show cause hearing required</div>
            <p>The court will notify you by mail of a time and place to appear and show cause why the evidence was not submitted on time. Failure to appear, or failure to show good cause, results in the fine being imposed immediately. Failure to appear at the show cause hearing is a separate offense punishable by a fine up to $200. The court may, for good cause, extend the time to submit your certificate.</p>
          </div>

        </section><!-- /DSC Panel -->

        <!-- ── Deferred Disposition Panel ── -->
        <section v-show="selectedOption === 'def'" aria-label="Deferred Disposition option">

          <h2 class="sh">What is Deferred Disposition?</h2>

          <div class="box neutral">
            <div class="box-lbl">Plain English explanation</div>
            <p>Deferred Disposition (formally called Suspension of Sentence and Deferral of Final Disposition) is a probation-based option. You plead guilty or no contest and pay court costs. The Justice of the Peace places you on probation for a period not to exceed <strong>180 days</strong>, during which you must comply with specified conditions. If you comply with all conditions by the deadline, the case is dismissed with no conviction on your record. If you do not comply, the fine is imposed as a final conviction.</p>
          </div>

          <div class="box warn">
            <div class="box-lbl">This is discretionary — not a right</div>
            <p>Unlike DSC, Deferred Disposition is not something you can demand. The Justice of the Peace has the discretion to grant or deny it. You may request it, but approval is not guaranteed.</p>
          </div>

          <div class="box info">
            <div class="box-lbl">If you are under 25</div>
            <p>If you are under 25 years old and charged with a moving traffic violation, the judge is required by law to make you complete a Driver Safety Course as a condition of Deferred Disposition. Additionally, if you hold a provisional driver's license (typically drivers under 18), you must also take or retake the DPS driving examination to demonstrate ordinary and reasonable control of a vehicle. You must pay a <strong>$10 fee</strong> to DPS for this examination and submit proof of completion to the court.</p>
          </div>

          <h2 class="sh">Am I eligible for Deferred Disposition?</h2>

          <div class="box danger">
            <div class="box-lbl">You are NOT eligible if any of these apply</div>
            <div class="inel-list">
              <div class="inel-row"><span class="inel-x">X</span><span class="inel-text">You hold a commercial driver's license, OR you held one when the offense was committed</span></div>
              <div class="inel-row"><span class="inel-x">X</span><span class="inel-text">Your offense was committed in a construction or maintenance work zone when workers were present</span></div>
            </div>
          </div>

          <p style="font-size:14px;color:var(--tx2);margin:.875rem 0 .875rem;line-height:1.6">For all other traffic violations, you may request Deferred Disposition, but it is at the Justice of the Peace's discretion to grant it. Contact your specific precinct court to ask whether your citation is likely to qualify.</p>

          <h2 class="sh">How to request Deferred Disposition</h2>

          <div class="steps">
            <div class="step">
              <div class="step-dot">1</div>
              <div class="step-body">
                <strong>Find your precinct court</strong>
                <p>Use <a href="https://jp.hctx.net" target="_blank" rel="noopener noreferrer">jp.hctx.net</a> to find your specific precinct court and appearance date.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-dot">2</div>
              <div class="step-body">
                <strong>Request Deferred Disposition on or before your appearance date</strong>
                <p>Submit your request online at <a href="https://jp.hctx.net" target="_blank" rel="noopener noreferrer">jp.hctx.net</a>, by mail, or in person at your precinct court. You must plead guilty or no contest and pay all court costs at the time of the request.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-dot">3</div>
              <div class="step-body">
                <strong>Comply with all court-ordered probation conditions</strong>
                <p>The court will notify you of your specific conditions and the probation period (up to 180 days). Conditions may include completing a driving safety course if you are under 25, or other requirements set by the judge.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-dot">4</div>
              <div class="step-body">
                <strong>Submit proof of compliance by your deadline</strong>
                <p>Submit any required paperwork to your precinct court by mail or in person. Contact your court for specific submission requirements.</p>
              </div>
            </div>
          </div>

          <h2 class="sh">How much does Deferred Disposition cost?</h2>

          <div class="box warn">
            <div class="box-lbl">Fee amount set by the court</div>
            <p>The source document does not list specific Deferred Disposition fee amounts. You will pay court costs at the time of your request. You may also be required to pay a special expense fee not to exceed the maximum fine for your offense. Contact your specific precinct court or check your case online at <a href="https://jp.hctx.net" target="_blank" rel="noopener noreferrer" style="color:var(--amber-tx);text-decoration:underline">jp.hctx.net</a> for the amount that applies to your citation.</p>
          </div>

          <h2 class="sh">What if you fail to meet the conditions?</h2>

          <div class="box warn">
            <div class="box-lbl">Fine imposed as final conviction</div>
            <p>If you do not timely submit satisfactory evidence of compliance, the Justice of the Peace will impose the fine as a final conviction. You will be responsible for immediate payment of the fine assessed. A conviction is reported to the Department of Public Safety as required by law.</p>
          </div>

          <h2 class="sh">How to apply and where to submit</h2>

          <div class="sub-methods">
            <div class="sub-card">
              <div class="method">Online</div>
              <p>Apply for Deferred Disposition and pay court costs online. Also use to find your case, court date, and fine amount.<br><br>
                <a class="dl-link" href="https://jpwebsite.harriscountytx.gov/FindMyCase/search.jsp" target="_blank" rel="noopener noreferrer">Apply online at jp.hctx.net</a>
                <br><br><span style="font-size:12px;color:var(--tx3)">American Express, Visa, Mastercard, Discover, and e-check accepted.</span>
              </p>
            </div>
            <div class="sub-card">
              <div class="method">By mail</div>
              <p>Mail your request, documents, and cashier's check or money order payable to "Justice of the Peace." Write your precinct and place number on the payment. No cash by mail.<br><br><span style="font-size:12px;color:var(--tx3)">Mail to your specific precinct court — find the address at jp.hctx.net. Certified mail recommended.</span></p>
            </div>
            <div class="sub-card">
              <div class="method">In person</div>
              <p>Visit your specific precinct court. Cash, cashier's check, money order, debit card, and major credit cards accepted.<br><br>
                <a class="dl-link" href="https://jp.hctx.net" target="_blank" rel="noopener noreferrer">Find your precinct court location</a>
              </p>
            </div>
          </div>

          <div class="box warn" style="margin-top:1rem">
            <div class="box-lbl">Submit to your specific precinct court — no central office</div>
            <p>There is no central Harris County submission office. All requests and paperwork must go to your specific precinct court. Search your case at <a href="https://jp.hctx.net" target="_blank" rel="noopener noreferrer" style="color:var(--amber-tx);text-decoration:underline">jp.hctx.net</a> if you are unsure which court handles your citation.</p>
          </div>

        </section><!-- /Deferred Panel -->

        <!-- ── Fine Tables — always visible ── -->
        <h2 class="sh">Common Harris County traffic fines</h2>

        <p style="font-size:14px;color:var(--tx2);margin-bottom:1rem;line-height:1.6">These fine amounts include court costs for Harris County JP Courts. All fines are subject to change. Verify the exact amount for your specific citation at <a href="https://jp.hctx.net" target="_blank" rel="noopener noreferrer" style="color:var(--blue)">jp.hctx.net</a>.</p>

        <p style="font-size:13px;font-weight:600;color:var(--tx);margin-bottom:.5rem">Speeding fines</p>
        <div class="table-scroll">
          <table class="fee-table fee-table-3">
            <tbody>
              <tr><th>MPH Over Limit</th><th>Standard</th><th>School Zone</th></tr>
              <tr><td>1–10</td><td>$130</td><td>$155</td></tr>
              <tr><td>11</td><td>$135</td><td>$160</td></tr>
              <tr><td>12</td><td>$140</td><td>$165</td></tr>
              <tr><td>13</td><td>$145</td><td>$170</td></tr>
              <tr><td>14</td><td>$150</td><td>$175</td></tr>
              <tr><td>15</td><td>$155</td><td>$180</td></tr>
              <tr><td>16</td><td>$160</td><td>$185</td></tr>
              <tr><td>17</td><td>$165</td><td>$190</td></tr>
              <tr><td>18</td><td>$170</td><td>$195</td></tr>
              <tr><td>19</td><td>$175</td><td>$200</td></tr>
              <tr><td>20</td><td>$180</td><td>$205</td></tr>
              <tr><td>21</td><td>$185</td><td>$210</td></tr>
              <tr><td>22</td><td>$190</td><td>$215</td></tr>
              <tr><td>23</td><td>$195</td><td>$220</td></tr>
              <tr><td>24</td><td>$200</td><td>$225</td></tr>
              <tr><td>25</td><td>$205</td><td>$230</td></tr>
              <tr><td>26–39+</td><td>$210–$275</td><td>$235–$300</td></tr>
            </tbody>
          </table>
        </div>

        <p style="font-size:13px;font-weight:600;color:var(--tx);margin:1.25rem 0 .5rem">Common traffic violation fines</p>
        <div class="table-scroll">
          <table class="fee-table">
            <tbody>
              <tr><th>Violation</th><th>Fine</th></tr>
              <tr><td>Failure to Control Speed</td><td>$190</td></tr>
              <tr><td>Failure to Drive in Single Lane</td><td>$155</td></tr>
              <tr><td>Ran Stop Sign or Red Light</td><td>$160</td></tr>
              <tr><td>Unsafe Lane Change</td><td>$165</td></tr>
              <tr><td>Unsafe Speed</td><td>$140</td></tr>
              <tr><td>Failure to Wear Safety Belt</td><td>$125</td></tr>
              <tr><td>Unrestrained Child</td><td>$190</td></tr>
              <tr><td>Passing a Stopped School Bus</td><td>$1,085</td></tr>
              <tr><td>Failure to Maintain Financial Responsibility (No Insurance)</td><td>$315</td></tr>
              <tr><td>Expired Driver's License</td><td>$105</td></tr>
              <tr><td>No Texas Driver's License</td><td>$160</td></tr>
              <tr><td>Expired Inspection Certificate</td><td>$105</td></tr>
            </tbody>
          </table>
        </div>

        <p style="font-size:12px;color:var(--tx3);margin-top:.75rem;line-height:1.6">Expired driver's license and expired registration may be dismissed if remedied within 10–20 working days. A $10 administrative fee applies. Verify dismissal eligibility with your court.</p>

        <div class="div" />

        <div class="cta">
          <div>
            <strong>Need to pick a defensive driving course?</strong>
            <p style="font-size:14px;color:var(--tx2)">Compare all 133 TDLR-approved providers by price, format, and language — free, no signup.</p>
          </div>
          <a class="cta-btn" href="/" target="_blank" rel="noopener noreferrer">Compare courses on TDLRguide</a>
        </div>

        <div class="disc">
          <div class="dl">Disclaimer and source verification</div>
          <p>This page is an independent summary created by TDLRguide for informational purposes only. TDLRguide is not affiliated with Harris County Justice of the Peace Courts, Harris County, or the Texas Department of Licensing and Regulation (TDLR). The primary source document for this page (jp.hctx.net/traffic/Traffic.pdf) is dated September 2007. While fee amounts have been updated within that document, some procedures, amounts, and requirements may have changed since publication. Always verify current requirements directly with your specific precinct court before taking any action. This is not legal advice.</p>
          <div class="src-links">
            <a class="src-link" href="https://jp.hctx.net/traffic/Traffic.pdf" target="_blank" rel="noopener noreferrer">Official Harris County JP Courts traffic guide (PDF)</a>
            <a class="src-link" href="https://jp.hctx.net" target="_blank" rel="noopener noreferrer">Harris County JP Courts website</a>
            <a class="src-link" href="https://jpwebsite.harriscountytx.gov/FindMyCase/search.jsp" target="_blank" rel="noopener noreferrer">Find your case and court date</a>
            <a class="src-link" href="https://jp.hctx.net/forms/default.htm#TrafficForms" target="_blank" rel="noopener noreferrer">All court forms</a>
            <a class="src-link" href="https://www.tdlr.texas.gov/driver/safety/providers/search/" target="_blank" rel="noopener noreferrer">TDLR provider search</a>
          </div>
        </div>

      </div><!-- /wrap -->
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Literata:wght@400;500;600&display=swap');

.harris-county-page {
  --tx: #18181b;
  --tx2: #52525b;
  --tx3: #a1a1aa;
  --bg: #fff;
  --bg2: #fafaf9;
  --bg3: #f4f4f0;
  --bd: #e4e4e7;
  --bd2: #d4d4d8;
  --blue: #1d4ed8;
  --blue-bg: #eff6ff;
  --blue-bd: #bfdbfe;
  --blue-tx: #1e40af;
  --green: #15803d;
  --green-bg: #f0fdf4;
  --green-bd: #bbf7d0;
  --green-tx: #166534;
  --red: #b91c1c;
  --red-bg: #fef2f2;
  --red-bd: #fecaca;
  --red-tx: #991b1b;
  --amber: #92400e;
  --amber-bg: #fffbeb;
  --amber-bd: #fde68a;
  --amber-tx: #78350f;
  --sans: 'DM Sans', sans-serif;
  --serif: 'Literata', Georgia, serif;
  --r: 8px;
  --rl: 12px;
  font-family: var(--sans);
  color: var(--tx);
  background: var(--bg);
  font-size: 15px;
  line-height: 1.6;
  min-height: 100vh;
}
@media (prefers-color-scheme: dark) {
  .harris-county-page {
    --tx: #f4f4f5;
    --tx2: #a1a1aa;
    --tx3: #71717a;
    --bg: #18181b;
    --bg2: #1f1f23;
    --bg3: #27272a;
    --bd: #3f3f46;
    --bd2: #52525b;
    --blue: #60a5fa;
    --blue-bg: #1e3a5f;
    --blue-bd: #1d4ed8;
    --blue-tx: #93c5fd;
    --green: #4ade80;
    --green-bg: #14532d;
    --green-bd: #15803d;
    --green-tx: #86efac;
    --red: #f87171;
    --red-bg: #450a0a;
    --red-bd: #7f1d1d;
    --red-tx: #fca5a5;
    --amber: #fbbf24;
    --amber-bg: #1c1400;
    --amber-bd: #78350f;
    --amber-tx: #fcd34d;
  }
}

.wrap {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1.25rem 5rem;
}

.pg-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--tx3);
  margin-bottom: .5rem;
}
h1 {
  font-family: var(--serif);
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.25;
  margin-bottom: .75rem;
}
.lead {
  font-size: 15px;
  color: var(--tx2);
  line-height: 1.7;
  max-width: 580px;
  margin-bottom: 2rem;
}
h2.sh {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--tx3);
  margin: 2.25rem 0 .875rem;
  padding-bottom: .5rem;
  border-bottom: 1px solid var(--bd);
}

.picker {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
@media (max-width: 500px) {
  .picker { grid-template-columns: 1fr; }
}
.pick-btn {
  border: 1.5px solid var(--bd);
  border-radius: var(--rl);
  padding: 1.125rem 1.25rem;
  cursor: pointer;
  background: var(--bg2);
  text-align: left;
  font-family: var(--sans);
  transition: all .15s;
  position: relative;
}
.pick-btn:hover { border-color: var(--bd2); background: var(--bg3); }
.pick-btn.active.blue { border-color: var(--blue); background: var(--blue-bg); }
.pick-btn.active.green { border-color: var(--green); background: var(--green-bg); }
.pick-btn .pb-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  margin-bottom: .35rem;
}
.pick-btn.active.blue .pb-tag { color: var(--blue-tx); }
.pick-btn.active.green .pb-tag { color: var(--green-tx); }
.pick-btn:not(.active) .pb-tag { color: var(--tx3); }
.pick-btn h3 { font-size: 15px; font-weight: 600; color: var(--tx); margin-bottom: .3rem; }
.pick-btn p { font-size: 13px; color: var(--tx2); line-height: 1.5; }
.pick-indicator {
  position: absolute;
  top: .875rem;
  right: .875rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid var(--bd2);
  background: var(--bg);
  transition: all .15s;
}
.pick-btn.active.blue .pick-indicator { background: var(--blue); border-color: var(--blue); }
.pick-btn.active.green .pick-indicator { background: var(--green); border-color: var(--green); }
.pick-btn.active .pick-indicator::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: #fff;
}

.box {
  border-radius: var(--rl);
  padding: 1.125rem 1.375rem;
  margin-bottom: 1rem;
}
.box.warn    { background: var(--amber-bg); border: 1px solid var(--amber-bd); }
.box.danger  { background: var(--red-bg);   border: 1px solid var(--red-bd); }
.box.info    { background: var(--blue-bg);  border: 1px solid var(--blue-bd); }
.box.success { background: var(--green-bg); border: 1px solid var(--green-bd); }
.box.neutral { background: var(--bg2);      border: 1px solid var(--bd); }
.box-lbl {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .09em;
  text-transform: uppercase;
  margin-bottom: .45rem;
}
.box.warn    .box-lbl { color: var(--amber-tx); }
.box.danger  .box-lbl { color: var(--red-tx); }
.box.info    .box-lbl { color: var(--blue-tx); }
.box.success .box-lbl { color: var(--green-tx); }
.box.neutral .box-lbl { color: var(--tx3); }
.box p, .box li { font-size: 14px; color: var(--tx2); line-height: 1.6; }
.box strong { color: var(--tx); font-weight: 600; }
.box ul { padding-left: 1rem; margin-top: .4rem; display: flex; flex-direction: column; gap: .3rem; }

.inel-list { display: flex; flex-direction: column; gap: .35rem; margin-top: .6rem; }
.inel-row {
  display: flex;
  gap: .75rem;
  align-items: flex-start;
  padding: .55rem .875rem;
  background: var(--red-bg);
  border: 1px solid var(--red-bd);
  border-radius: var(--r);
}
.inel-x { font-size: 11px; font-weight: 700; color: var(--red-tx); flex-shrink: 0; padding-top: 2px; }
.inel-text { font-size: 13px; color: var(--tx2); line-height: 1.45; }

.req-list { display: flex; flex-direction: column; gap: .5rem; margin-top: .75rem; }
.req-item {
  display: flex;
  gap: .75rem;
  align-items: flex-start;
  padding: .75rem 1rem;
  background: var(--bg2);
  border: 1px solid var(--bd);
  border-radius: var(--r);
}
.req-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--bd2);
  font-size: 11px;
  font-weight: 700;
  color: var(--tx2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.req-num-wide {
  min-width: 22px;
  height: 22px;
  padding: 0 4px;
  border-radius: 11px;
  background: var(--bd2);
  font-size: 10px;
  font-weight: 700;
  color: var(--tx2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.req-body { flex: 1; }
.req-body strong { font-size: 14px; font-weight: 600; color: var(--tx); display: block; margin-bottom: .15rem; }
.req-body span { font-size: 13px; color: var(--tx2); line-height: 1.5; }
.dl-link {
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  margin-top: .4rem;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
  text-decoration: none;
  padding: .25rem .65rem;
  background: var(--blue-bg);
  border: 1px solid var(--blue-bd);
  border-radius: 4px;
}
.dl-link:hover { opacity: .8; }
.ph-link {
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  margin-top: .4rem;
  font-size: 12px;
  font-weight: 600;
  color: var(--tx3);
  padding: .25rem .65rem;
  background: var(--bg3);
  border: 1px dashed var(--bd2);
  border-radius: 4px;
}

.fee-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.fee-table th {
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--tx3);
  padding: .5rem .75rem;
  border-bottom: 1px solid var(--bd);
}
.fee-table td {
  padding: .5rem .75rem;
  border-bottom: 1px solid var(--bd);
  color: var(--tx2);
}
.fee-table td:last-child { font-weight: 600; color: var(--tx); text-align: right; }
.fee-table tr:last-child td { border-bottom: none; }
.fee-table-3 th:nth-child(2),
.fee-table-3 th:nth-child(3) { text-align: right; }
.fee-table-3 td:nth-child(2),
.fee-table-3 td:nth-child(3) { font-weight: 600; color: var(--tx); text-align: right; }
.table-scroll { overflow-x: auto; }

.steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  margin-top: .75rem;
}
.steps::before {
  content: '';
  position: absolute;
  left: 13px;
  top: 28px;
  bottom: 28px;
  width: 1px;
  background: var(--bd);
}
.step { display: flex; gap: 1rem; padding: .75rem 0; }
.step-dot {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  border: 1.5px solid var(--bd2);
  background: var(--bg);
  font-size: 12px;
  font-weight: 700;
  color: var(--tx2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}
.step-body { padding-top: 3px; }
.step-body strong { font-size: 14px; font-weight: 600; color: var(--tx); display: block; margin-bottom: .2rem; }
.step-body p { font-size: 13px; color: var(--tx2); line-height: 1.55; }
.step-body a { color: var(--blue); text-decoration: none; }
.step-body a:hover { text-decoration: underline; }

.sub-methods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .75rem;
  margin-top: .75rem;
}
@media (max-width: 520px) {
  .sub-methods { grid-template-columns: 1fr; }
}
.sub-card {
  border: 1px solid var(--bd);
  border-radius: var(--r);
  padding: .875rem 1rem;
  background: var(--bg2);
}
.sub-card .method {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--tx3);
  margin-bottom: .4rem;
}
.sub-card p { font-size: 13px; color: var(--tx2); line-height: 1.5; }
.sub-card a { color: var(--blue); text-decoration: none; }

.compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .875rem;
  margin-top: .75rem;
}
@media (max-width: 480px) {
  .compare { grid-template-columns: 1fr; }
}
.comp-card { border-radius: var(--r); padding: .875rem 1rem; border: 1px solid var(--bd); }
.comp-card.dsc { background: var(--blue-bg); border-color: var(--blue-bd); }
.comp-card.def { background: var(--green-bg); border-color: var(--green-bd); }
.comp-card .ct {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  margin-bottom: .35rem;
}
.comp-card.dsc .ct { color: var(--blue-tx); }
.comp-card.def .ct { color: var(--green-tx); }
.comp-card h4 { font-size: 14px; font-weight: 600; color: var(--tx); margin-bottom: .35rem; }
.comp-card ul { list-style: none; display: flex; flex-direction: column; gap: .3rem; }
.comp-card li { font-size: 13px; color: var(--tx2); line-height: 1.4; display: flex; gap: .5rem; }
.comp-card li::before { content: '–'; color: var(--tx3); flex-shrink: 0; }

.div { height: 1px; background: var(--bd); margin: 2rem 0; }

.cta {
  border: 1px solid var(--bd);
  border-radius: var(--rl);
  padding: 1.375rem 1.5rem;
  background: var(--bg2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}
.cta p { font-size: 14px; color: var(--tx2); flex: 1; }
.cta strong { color: var(--tx); font-weight: 600; display: block; margin-bottom: .2rem; }
.cta-btn {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  padding: .625rem 1.125rem;
  background: var(--tx);
  color: var(--bg);
  border: none;
  border-radius: var(--r);
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  flex-shrink: 0;
}

.disc {
  margin-top: 2.5rem;
  padding: 1.125rem 1.375rem;
  background: var(--bg2);
  border: 1px solid var(--bd);
  border-radius: var(--rl);
}
.disc .dl {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--tx3);
  margin-bottom: .5rem;
}
.disc p { font-size: 12px; color: var(--tx3); line-height: 1.65; }
.disc a { color: var(--blue); text-decoration: none; }
.src-links { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .75rem; }
.src-link {
  font-size: 11px;
  font-weight: 600;
  padding: .25rem .6rem;
  background: var(--bg);
  border: 1px solid var(--bd);
  border-radius: 4px;
  color: var(--blue);
  text-decoration: none;
}
</style>
