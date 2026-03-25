<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl as string) || 'https://tdlrguide.com'

const pageTitle = 'Texas Defensive Driving FAQ: Every Question Answered | TDLRguide'
const pageDescription = 'Every question about Texas defensive driving courses answered in one place. Costs, eligibility, certificates, court rules, Spanish courses, and top provider comparisons — updated 2026.'
const pageUrl = `${siteUrl}/faq`

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

const navSections = [
  { id: 'cost',        label: 'Cost & Pricing' },
  { id: 'eligibility', label: 'Eligibility & Rules' },
  { id: 'process',     label: 'The Process' },
  { id: 'certificate', label: 'Certificates' },
  { id: 'format',      label: 'Format & Options' },
  { id: 'spanish',     label: 'Spanish Courses' },
  { id: 'providers',   label: 'Provider Comparisons' },
  { id: 'court',       label: 'Court Questions' },
  { id: 'insurance',   label: 'Insurance Discounts' },
]

const activeSection = ref('cost')

let observer: IntersectionObserver | null = null

onMounted(() => {
  const sectionEls = navSections
    .map(s => document.getElementById(s.id))
    .filter(Boolean) as HTMLElement[]

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      }
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  )

  sectionEls.forEach(el => observer!.observe(el))
})

onUnmounted(() => {
  observer?.disconnect()
})

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
    activeSection.value = id
  }
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  datePublished: '2026-03-25',
  dateModified: '2026-03-25',
  mainEntity: [
    // Cost & Pricing
    {
      '@type': 'Question',
      name: 'What is the cheapest Texas defensive driving course?',
      acceptedAnswer: { '@type': 'Answer', text: 'By law, all Texas driving safety courses must charge a minimum of $25. Several providers charge exactly $25 with no additional fee, making them the cheapest options available. The lowest all-in total cost options include Driver Training Associates ($25 total), Drivers Education of America ($25 total), WWW.CHEAPDRIVINGCOURSE.COM ($25 total, free instant certificate), Driving University ($25 total, free instant certificate), and Road Ready Safety ($28 total with free instant certificate download).' }
    },
    {
      '@type': 'Question',
      name: 'What is the minimum legal price for a Texas driving safety course?',
      acceptedAnswer: { '@type': 'Answer', text: '$25. Texas law sets the minimum course fee at $25. No TDLR-approved provider can legally charge less than this for the course itself. Some providers add a separate fee for certificate delivery which can bring the total above $25.' }
    },
    {
      '@type': 'Question',
      name: 'Why do all Texas defensive driving courses cost $25?',
      acceptedAnswer: { '@type': 'Answer', text: 'The Texas Legislature set a statutory minimum of $25 for driving safety courses. This applies to every TDLR-approved provider in the state — online or in-person. Courts also charge their own separate court fee (typically $144 in Houston and Dallas) which is paid to the court and is separate from the course fee.' }
    },
    {
      '@type': 'Question',
      name: 'What is the difference between the course fee and the certificate fee?',
      acceptedAnswer: { '@type': 'Answer', text: 'These are two separate charges. The course fee is what you pay the provider to take the 6-hour course — minimum $25 by law. The certificate fee is an optional add-on some providers charge for how they deliver your completion certificate. Options are: mail (often free or low cost), paid instant download, or free instant download. The total cost you should compare is course fee + certificate fee combined.' }
    },
    {
      '@type': 'Question',
      name: 'Which Texas defensive driving courses have no certificate fee?',
      acceptedAnswer: { '@type': 'Answer', text: 'Several TDLR-approved providers include a free certificate — either by mail at no extra charge or as a free instant download. Providers offering a free certificate option include: Driver Training Associates (free by mail), Drivers Education of America (free by mail), Road Ready Safety (free instant download), WWW.CHEAPDRIVINGCOURSE.COM (free instant download), Driving University (free instant download), Highway Traffic School (free instant download), I Drive Safely (free instant download), Sunny Day Defensive Driving (free instant download), and NobodyLikesTickets.com (free instant download).' }
    },
    {
      '@type': 'Question',
      name: 'Which courses have free instant certificate download?',
      acceptedAnswer: { '@type': 'Answer', text: 'Providers offering a free instant certificate download include: Road Ready Safety ($28 total), WWW.CHEAPDRIVINGCOURSE.COM ($25 total), Driving University ($25 total), Highway Traffic School ($25 total), I Drive Safely ($29 total), Sunny Day Defensive Driving ($29 total), NobodyLikesTickets.com ($28 total), and $25-FREE VIDEO COURSE-INSTANT CERTIFICATE DOWNLOAD ($25 total). Instant download means you receive your certificate immediately after completing the course.' }
    },
    {
      '@type': 'Question',
      name: 'Are there hidden fees in Texas defensive driving courses?',
      acceptedAnswer: { '@type': 'Answer', text: 'The most common unexpected charge is a certificate delivery fee. Some providers advertise "$25" but then charge extra for instant download. Always look at the total cost including the course and certificate. Other potential additions: some courts charge a convenience fee for online payment. The Type 3A driving record required by most courts is a separate $12 fee paid to DPS.' }
    },
    {
      '@type': 'Question',
      name: 'Does taking defensive driving for an insurance discount cost the same?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — the course itself costs the same $25 minimum regardless of whether you are taking it for ticket dismissal or insurance discount. However, when taking for insurance purposes only, you do not need to pay court costs or obtain a Type 3A driving record, so the total out-of-pocket is lower.' }
    },
    // Eligibility & Rules
    {
      '@type': 'Question',
      name: 'Am I eligible to take a defensive driving course to dismiss my ticket in Texas?',
      acceptedAnswer: { '@type': 'Answer', text: 'Generally yes, if you have a valid Texas Driver\'s License, current liability insurance, have not taken a court-ordered DSC in the past 12 months, do not hold a CDL, and your violation is not speeding 25+ mph over the limit, 95+ mph, passing a school bus, leaving the scene of an accident, an offense in a construction zone with workers present, or a serious traffic violation.' }
    },
    {
      '@type': 'Question',
      name: 'How many times can I take defensive driving in Texas?',
      acceptedAnswer: { '@type': 'Answer', text: 'You can take a driving safety course for ticket dismissal once every 12 months. If you took a court-ordered DSC within the 12 months before the date of your current offense, you are not eligible to use another DSC for that ticket. You can take the course voluntarily for an insurance discount at any time — taking it for insurance does not count against your 12-month court dismissal eligibility.' }
    },
    {
      '@type': 'Question',
      name: 'How long do I have to complete my Texas defensive driving course after my ticket?',
      acceptedAnswer: { '@type': 'Answer', text: 'You have 90 days from the date the court approves your request. You must request approval before your first court appearance date. Most courts do not grant extensions on the 90-day deadline.' }
    },
    {
      '@type': 'Question',
      name: 'Can I take defensive driving for a speeding ticket in Texas?',
      acceptedAnswer: { '@type': 'Answer', text: 'It depends on how fast you were going. You are eligible if you were speeding less than 25 mph over the posted speed limit AND going less than 95 mph. If your ticket is for going 25 mph or more over the limit, or going 95 mph or more regardless of the speed limit, you are NOT eligible for a DSC dismissal.' }
    },
    {
      '@type': 'Question',
      name: 'What tickets are NOT eligible for defensive driving dismissal in Texas?',
      acceptedAnswer: { '@type': 'Answer', text: 'You cannot use a driving safety course to dismiss a ticket for: speeding 25 mph or more over the posted speed limit, driving 95 mph or more, passing a school bus loading or unloading children, leaving the scene of an accident after causing damage, an offense in a construction or maintenance work zone when workers were present, a serious traffic violation, or any offense if you hold a Commercial Driver\'s License (CDL).' }
    },
    {
      '@type': 'Question',
      name: 'Does defensive driving remove points from my Texas driving record?',
      acceptedAnswer: { '@type': 'Answer', text: 'Completing a DSC for ticket dismissal means the charge is dismissed — no conviction is recorded, so no points are added. If you already have points from past convictions, completing a voluntary defensive driving course does not remove existing points from your record. The course prevents new points from being added by keeping the current ticket from being a conviction.' }
    },
    {
      '@type': 'Question',
      name: 'Can I take defensive driving if I have a CDL in Texas?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. If you hold a Commercial Driver\'s License at the time of your offense or at the time you make the request, you are not eligible for DSC dismissal — even if you were driving your personal vehicle at the time of the citation. This applies statewide across all Texas courts.' }
    },
    {
      '@type': 'Question',
      name: 'Can out-of-state drivers take a Texas defensive driving course?',
      acceptedAnswer: { '@type': 'Answer', text: 'If you received a citation in Texas and your case is before a Texas court, you generally need to follow Texas court procedures. Texas does not require the driver\'s license to be a Texas license. Active military members and their spouses and dependent children may use military ID and orders in place of a Texas license. Contact the specific court handling your citation to confirm requirements.' }
    },
    {
      '@type': 'Question',
      name: 'Do I need a Type 3A driving record to dismiss my ticket?',
      acceptedAnswer: { '@type': 'Answer', text: 'For most Texas courts, yes — the Type 3A driving record is required as part of your submission to confirm you have not taken a DSC in the past 12 months. Some courts obtain the record themselves for a $12 fee. You can order your Type 3A record online instantly at texas.gov or by mail using the DPS DR-1 form. Confirm with your specific court whether you need to provide it.' }
    },
    {
      '@type': 'Question',
      name: 'What is a Type 3A driving record and where do I get one?',
      acceptedAnswer: { '@type': 'Answer', text: 'A Type 3A is a certified copy of your Texas driving record issued by the Texas Department of Public Safety. It shows your license status, any violations, and course completions on file. Courts require it to verify you have not taken a DSC in the past 12 months. You can order it at texas.gov instantly online for $12, or by mailing the DPS DR-1 form to the Driver Records Bureau in Austin (allow 2-3 weeks for mail).' }
    },
    // The Process
    {
      '@type': 'Question',
      name: 'What is the order of steps to dismiss a ticket with defensive driving in Texas?',
      acceptedAnswer: { '@type': 'Answer', text: 'The required sequence is: 1. Confirm you are eligible. 2. Request approval from your court on or before your appearance date. 3. Wait for written confirmation from the court — do not take the course yet. 4. Take any TDLR-approved 6-hour driving safety course. 5. Order your Type 3A driving record from DPS (if required). 6. Have your affidavit notarized. 7. Submit your Certificate of Completion, driving record, and notarized affidavit to the court by the 90-day deadline. 8. Case dismissed. The most important rule: do not take the course before the court approves you.' }
    },
    {
      '@type': 'Question',
      name: 'Do I need to notify my court before taking defensive driving?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — always. You must request approval from your court before taking the course. This is required by every Texas court. Taking the course first and then asking the court is a common mistake that results in the court rejecting your certificate.' }
    },
    {
      '@type': 'Question',
      name: 'Can I take defensive driving before my court date?',
      acceptedAnswer: { '@type': 'Answer', text: 'You can take the course after your court approves your request, which typically must happen on or before your first court appearance date. You cannot take the course before approval. If you submit your request on your court date and get approved that day, you can start the course immediately after — but never before you receive written approval.' }
    },
    {
      '@type': 'Question',
      name: 'How long does a Texas defensive driving course take?',
      acceptedAnswer: { '@type': 'Answer', text: 'All Texas defensive driving courses are required by law to be 6 hours of instruction. Online courses include mandatory break periods within those 6 hours — you cannot complete a fully compliant online course in less time than the state requires. You can pause and return to an online course — most providers allow 90 days from enrollment to complete it.' }
    },
    {
      '@type': 'Question',
      name: 'What happens after I finish my defensive driving course?',
      acceptedAnswer: { '@type': 'Answer', text: 'Your course provider will issue a completion certificate — by mail (typically 5-15 business days) or as an instant download. You must then submit the signed Court Copy of the certificate, your Type 3A driving record (if required), and your notarized affidavit to the court — all by your 90-day deadline. Submission must be by mail or in person at most courts. After the court confirms, your case is dismissed.' }
    },
    {
      '@type': 'Question',
      name: 'What happens if I miss the court deadline for defensive driving?',
      acceptedAnswer: { '@type': 'Answer', text: 'The court will schedule a show cause hearing and mail a notice to your address on file. At the hearing you explain why you did not comply. If you fail to appear, fail to comply, or cannot give a satisfactory reason, a conviction is entered and you must pay the fine. Missing the show cause hearing itself is an additional offense punishable by up to $200. Some courts may grant extensions for good cause before the deadline passes.' }
    },
    {
      '@type': 'Question',
      name: 'Can I get an extension on my defensive driving deadline?',
      acceptedAnswer: { '@type': 'Answer', text: 'It depends on the court. Some courts have the discretion to extend your deadline for good cause. Dallas Municipal Court explicitly states no extensions are allowed. Houston Municipal Court does not publicize an extension option. If you need more time, contact your court before your 90-day deadline expires.' }
    },
    {
      '@type': 'Question',
      name: 'What if my course provider goes out of business before I finish?',
      acceptedAnswer: { '@type': 'Answer', text: 'Contact TDLR immediately at (800) 803-9202. TDLR regulates all course providers and maintains records of completions. Your court may also be able to verify enrollment through TDLR records. Contact the court directly and explain the situation. TDLR\'s database should have your enrollment on file.' }
    },
    {
      '@type': 'Question',
      name: 'Do all Texas courts accept the same defensive driving courses?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. All Texas counties and all municipal and JP courts must accept any course that is currently approved by the Texas Department of Licensing and Regulation (TDLR). A court cannot require you to use a specific course or provider. If a court is recommending one specific website or company, that is informal guidance — not a legal requirement.' }
    },
    {
      '@type': 'Question',
      name: 'How do I find out which court my ticket is in?',
      acceptedAnswer: { '@type': 'Answer', text: 'Your citation should list the court name, address, and your appearance date. If it is unclear, search for your case by citation number or name at the Harris County JP Courts portal (jp.hctx.net), the Dallas Municipal Court portal, or your specific city\'s court website.' }
    },
    {
      '@type': 'Question',
      name: 'What is deferred disposition in Texas?',
      acceptedAnswer: { '@type': 'Answer', text: 'Deferred disposition is an alternative to DSC. You plead guilty or no contest, pay court costs, and the court places your case on hold for a probation period (up to 180 days in most courts). If you comply with all court conditions during that period, the case is dismissed with no conviction. Unlike DSC, deferred disposition does not require you to take a driving course unless you are under 25. Deferred disposition is available at the court\'s discretion and is not a legal right like DSC.' }
    },
    // Certificates
    {
      '@type': 'Question',
      name: 'What is the difference between an instant certificate download and mail delivery?',
      acceptedAnswer: { '@type': 'Answer', text: 'Instant download means you can download and print your certificate immediately upon completing the course — no waiting. Mail delivery means the provider mails a physical certificate to your address, which typically takes 5-15 business days. For court submission, most courts accept either format as long as it is the signed Court Copy. If you have a tight deadline, choose a provider with instant download.' }
    },
    {
      '@type': 'Question',
      name: 'How long does it take to receive a Texas defensive driving certificate by mail?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most providers that mail certificates send them within 5-15 business days of course completion. Some take up to 3 weeks. Always account for mail time when planning around your 90-day court deadline — do not finish the course on day 88 expecting a mailed certificate to arrive in time.' }
    },
    {
      '@type': 'Question',
      name: 'Can I submit my certificate electronically to the court?',
      acceptedAnswer: { '@type': 'Answer', text: 'For most Texas courts, no. Houston Municipal Court explicitly states that certificates may NOT be emailed. Dallas Municipal Court states that fax, email, and live chat are not accepted for document submission. Check your specific court\'s requirements, but the standard across Texas courts is mail or in-person submission only.' }
    },
    {
      '@type': 'Question',
      name: 'What do I do if I lose my Texas defensive driving certificate?',
      acceptedAnswer: { '@type': 'Answer', text: 'Contact your course provider directly — they are required to keep records and can issue a duplicate certificate. Most providers charge a small fee (typically up to $10) for a duplicate. You will need your name, course completion date, and driver\'s license number to request a duplicate. If your provider has gone out of business, contact TDLR at (800) 803-9202.' }
    },
    {
      '@type': 'Question',
      name: 'What information is on a Texas driving safety certificate?',
      acceptedAnswer: { '@type': 'Answer', text: 'A TDLR-approved certificate of course completion includes: your full name, driver\'s license number, date of birth, the course name and provider\'s TDLR license number, the date you completed the course, and a certificate serial number issued by TDLR. It comes in multiple copies — a Court Copy, an insurance copy, and a student copy. You submit the signed Court Copy to your court.' }
    },
    {
      '@type': 'Question',
      name: 'Does taking a defensive driving course require a paid certificate to get an insurance discount?',
      acceptedAnswer: { '@type': 'Answer', text: 'No — for insurance purposes, you just need the insurance copy of your certificate, which all providers issue as part of the standard completion packet. You do not need to pay extra for a premium certificate to qualify for an insurance discount. Contact your insurance company before enrolling to confirm exactly what documentation they require.' }
    },
    // Format & Options
    {
      '@type': 'Question',
      name: 'What is the difference between online and in-person defensive driving in Texas?',
      acceptedAnswer: { '@type': 'Answer', text: 'Both formats deliver the same 6-hour TDLR-approved curriculum and produce the same certificate accepted by all Texas courts. Online courses let you complete from home at your own pace. In-person courses are held at a physical location on a scheduled date. For most people, online is more convenient. In-person may be preferable if you want a structured setting or need Spanish-language instruction with a live instructor.' }
    },
    {
      '@type': 'Question',
      name: 'Can I take my Texas defensive driving course on my phone?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Most online Texas defensive driving courses are mobile-friendly and can be completed on any smartphone or tablet with a browser and internet access. Some providers have dedicated mobile apps. You do not need to be on a desktop computer to complete an online course.' }
    },
    {
      '@type': 'Question',
      name: 'Which Texas driving safety courses are 100% online?',
      acceptedAnswer: { '@type': 'Answer', text: 'The majority of TDLR-approved providers offer fully online courses. Well-known online providers include: Road Ready Safety (free instant certificate), Driver Training Associates (certificate by mail), DefensiveDriving.com (certificate by mail), iDriveSafely (free instant certificate), Safe2Drive (certificate by mail), NobodyLikesTickets.com (free instant certificate), Driving University (free instant certificate), Highway Traffic School (free instant certificate), and Drivers Education of America (English and Spanish).' }
    },
    {
      '@type': 'Question',
      name: 'Can I pause and resume an online Texas defensive driving course?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. All online providers allow you to log out and return to where you left off. Most providers give you 90 days from enrollment to complete the course. The course cannot be completed faster than the state-required 6 hours — the platform enforces this with timers. You can split the course across multiple sessions.' }
    },
    // Spanish Courses
    {
      '@type': 'Question',
      name: 'Which Texas defensive driving courses are offered in Spanish?',
      acceptedAnswer: { '@type': 'Answer', text: 'Several TDLR-approved providers offer courses in Spanish or with Spanish-language options: Tu Escuelita de Manejo (Spanish, online), GetDefensive.com (English and Spanish, $30 total, online and in-person), Angelo Driving Inc. (English and Spanish, $30 total, online and in-person), Drivers Education of America (English and Spanish, $25 total, online), Ticket Eraser LLC (English and Spanish, $28 total, online and in-person), J&T Adult Driving School (English and Spanish, online and in-person), and Family Driving School (English and Spanish, in-person).' }
    },
    {
      '@type': 'Question',
      name: 'Are there in-person Texas defensive driving courses in Spanish?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. GetDefensive.com, Angelo Driving Inc., J&T Adult Driving School, and Family Driving School all offer in-person options with Spanish language instruction. Availability may vary by location — contact the provider directly to confirm in-person availability near you.' }
    },
    {
      '@type': 'Question',
      name: 'Which Spanish-language courses are highest rated?',
      acceptedAnswer: { '@type': 'Answer', text: 'Based on available data, GetDefensive.com (English/Spanish, online and in-person) and Drivers Education of America (English/Spanish, online) are among the more established bilingual providers. For the most current options, use the TDLRguide comparison tool filtered by language.' }
    },
    // Provider Comparisons
    {
      '@type': 'Question',
      name: 'Which Texas defensive driving course has the best reviews?',
      acceptedAnswer: { '@type': 'Answer', text: 'Based on available data, the highest-reviewed providers are: Road Ready Safety ($28 total, online, free instant certificate), Driver Training Associates ($25 total, online, certificate by mail), Aceable Defensive Driving ($49+ total, online, polished mobile experience), and iDriveSafely ($29 total, online, free instant certificate, large established provider).' }
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Road Ready Safety and iDriveSafely?',
      acceptedAnswer: { '@type': 'Answer', text: 'Road Ready Safety: $28 total ($25 + $3 cert fee), free instant certificate download, newer platform. iDriveSafely: $29 total, free instant certificate, long-established national provider with a large review base. Both are accepted by all Texas courts. Road Ready Safety is lower cost. iDriveSafely has a longer track record and more name recognition.' }
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Aceable and DefensiveDriving.com?',
      acceptedAnswer: { '@type': 'Answer', text: 'Aceable: $49+ total, online only, known for a high-quality mobile-first interface and polished video content. DefensiveDriving.com: $28 total, online, certificate by mail, well-established provider with a straightforward interface. If you want the best user experience and do not mind paying more, Aceable is a good choice. If you want a reliable course at the minimum cost, DefensiveDriving.com delivers.' }
    },
    {
      '@type': 'Question',
      name: 'What are the cheapest online courses with instant certificate?',
      acceptedAnswer: { '@type': 'Answer', text: 'The cheapest online courses with free instant certificate download are: WWW.CHEAPDRIVINGCOURSE.COM ($25 total), Driving University ($25 total), Highway Traffic School ($25 total), Road Ready Safety ($28 total), iDriveSafely ($29 total), and Sunny Day Defensive Driving ($29 total).' }
    },
    {
      '@type': 'Question',
      name: 'Which Texas defensive driving courses are easiest to complete?',
      acceptedAnswer: { '@type': 'Answer', text: 'Based on provider characteristics: Driver Training Associates (straightforward online format, low cost), Road Ready Safety (modern interface, free instant cert), iDriveSafely (established platform, clear section structure, video-based content), and Drivers Education of America (available in English and Spanish, straightforward format). All Texas courses must be 6 hours — none can legally be shorter.' }
    },
    {
      '@type': 'Question',
      name: 'What are the best courses for people who want to finish fast?',
      acceptedAnswer: { '@type': 'Answer', text: 'Every TDLR-approved course is required to be 6 hours — no course can legally be completed faster. That said, courses with efficient layouts, clear video content, and no confusing navigation feel faster. Top choices for a smooth experience: Road Ready Safety (clean modern interface, instant cert), Driver Training Associates (no-frills efficient format), Driving University ($25 total, free instant cert, streamlined online), and iDriveSafely (video-based, self-paced).' }
    },
    {
      '@type': 'Question',
      name: 'Is Comedy Defensive Driving worth it?',
      acceptedAnswer: { '@type': 'Answer', text: 'Comedy-format courses use humor to make the 6-hour requirement feel less tedious. TDLR-approved comedy options include Comedy Defensive Driving, Comedy Guys Defensive Driving, and CourtApprovedComedyDriving Safety.com. They deliver the same content and the same certificate as any other course — the difference is purely in presentation style. Prices start at $25 for some comedy providers.' }
    },
    // Court Questions
    {
      '@type': 'Question',
      name: 'Does my court accept online defensive driving certificates?',
      acceptedAnswer: { '@type': 'Answer', text: 'All Texas courts must accept certificates from any TDLR-approved provider regardless of whether the course was taken online or in-person. However, the method of submitting the certificate to the court is separate from how you took the course. Most courts require the certificate to be submitted by mail or in person — not emailed.' }
    },
    {
      '@type': 'Question',
      name: 'How do I submit my certificate to the court?',
      acceptedAnswer: { '@type': 'Answer', text: 'By mail or in person at your specific court — for most Texas courts this is the only accepted method. Do not email your certificate. Some courts (such as Houston Municipal Court) explicitly state that certificates may not be emailed. When mailing, certified mail is recommended so you have proof of delivery. Include your citation number on all paperwork.' }
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a municipal court and a JP court in Texas?',
      acceptedAnswer: { '@type': 'Answer', text: 'Municipal courts handle violations of city ordinances and state laws within a city\'s limits. Justice of the Peace (JP) courts handle violations in unincorporated county areas and smaller jurisdictions. Both accept TDLR-approved defensive driving courses. Your citation will show which court has your case. In Harris County for example, City of Houston tickets go to Houston Municipal Court, while tickets issued in unincorporated Harris County go to one of 16 Harris County JP Courts — these are separate systems with different processes.' }
    },
    // Insurance Discounts
    {
      '@type': 'Question',
      name: 'Can I take defensive driving to get a car insurance discount in Texas?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Texas law allows insurance companies to offer discounts to drivers who voluntarily complete an approved defensive driving course. Most major insurers offer a discount of up to 10% on applicable coverages. Taking a course for an insurance discount is completely separate from taking one for ticket dismissal — you can do both independently.' }
    },
    {
      '@type': 'Question',
      name: 'How much is the insurance discount for defensive driving in Texas?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most insurers offer up to 10% off applicable coverages (typically liability and collision). Common discount rates: GEICO up to 10%, State Farm approximately 5%, Nationwide approximately 5% (age 55+ requirement), AAA approximately 3%. Eligibility and discount amounts vary by company, your age, your driving record, and your zip code. Contact your insurance provider before enrolling to confirm the exact discount available to you.' }
    },
    {
      '@type': 'Question',
      name: 'How long does the insurance discount last?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most defensive driving insurance discounts in Texas are valid for three years from the date of course completion. After three years you can retake the course to renew the discount. There is no limit on how many times you can take the course for insurance purposes — only the once-per-12-months rule applies to court dismissals.' }
    },
    {
      '@type': 'Question',
      name: 'Does taking a court-ordered defensive driving course count for an insurance discount?',
      acceptedAnswer: { '@type': 'Answer', text: 'Not always. Many insurance companies (including GEICO) require that the course was taken voluntarily — not as the result of a court order — in order to qualify for the discount. Check with your specific insurer before assuming your court-ordered course will trigger a discount. Taking a separate voluntary course for insurance purposes is always an option.' }
    },
    {
      '@type': 'Question',
      name: 'How do I submit my certificate to my insurance company?',
      acceptedAnswer: { '@type': 'Answer', text: 'After completing your course, your provider will send you a certificate with an insurance copy. You can typically fax, mail, email, or hand-deliver the insurance copy to your insurance provider or agent. Unlike courts, insurance companies generally accept emailed or faxed copies. Contact your insurer for their specific submission process — some are fully digital, others require physical copies.' }
    }
  ]
}

useHead({
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(faqSchema) }
  ],
  __dangerouslyDisableSanitizers: ['script']
})
</script>

<template>
  <div class="faq-page">
    <SiteHeader />

    <div class="faq-outer">
      <!-- Desktop jump nav sidebar -->
      <aside class="jump-nav" aria-label="Jump to section">
        <div class="jn-label">Contents</div>
        <nav>
          <button
            v-for="s in navSections"
            :key="s.id"
            :class="['jn-link', { active: activeSection === s.id }]"
            @click="scrollTo(s.id)"
          >{{ s.label }}</button>
        </nav>
      </aside>

      <main class="faq-main">
        <!-- Mobile pill nav -->
        <div class="pill-nav" role="navigation" aria-label="Jump to section">
          <button
            v-for="s in navSections"
            :key="s.id"
            :class="['pill', { active: activeSection === s.id }]"
            @click="scrollTo(s.id)"
          >{{ s.label }}</button>
        </div>

        <!-- Page header -->
        <div class="pg-label">Texas Defensive Driving</div>
        <h1>Every Question Answered</h1>
        <p class="lead">133 TDLR-approved courses, dozens of courts, one confusing process. Here are the answers to every question people ask about Texas defensive driving.</p>

        <!-- ── SECTION 1: Cost & Pricing ── -->
        <section id="cost">
          <h2 class="sh">Cost & Pricing</h2>

          <div class="qa">
            <h3>What is the cheapest Texas defensive driving course?</h3>
            <p>By law, all Texas driving safety courses must charge a minimum of $25. That means the absolute floor for any course is $25 before any certificate delivery fee. Several providers charge exactly $25 with no additional fee.</p>
            <p>The lowest all-in total cost options (course + certificate fee combined) from TDLR-approved providers include:</p>
            <ul>
              <li>Driver Training Associates — $25 total (certificate by mail, online)</li>
              <li>Drivers Education of America — $25 total (certificate by mail, online, English and Spanish)</li>
              <li>Comedy Defensive Driving — $25 total (certificate fee separate, online and in-person)</li>
              <li>WWW.CHEAPDRIVINGCOURSE.COM — $25 total (free instant certificate, online)</li>
              <li>Driving University — $25 total (free instant certificate, online)</li>
              <li>Road Ready Safety — $28 total ($25 course + $3 certificate fee, free instant certificate download, online)</li>
            </ul>
            <p class="note">Always check the total cost — course price plus any certificate delivery fee — before enrolling.</p>
            <NuxtLink to="/" class="int-link">Compare all providers by total cost</NuxtLink>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What is the minimum legal price for a Texas driving safety course?</h3>
            <p>$25. Texas law sets the minimum course fee at $25. No TDLR-approved provider can legally charge less than this for the course itself. Some providers add a separate fee on top for certificate delivery — either a mail fee or an instant download fee — which can bring the total above $25.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Why do all Texas defensive driving courses cost $25?</h3>
            <p>The Texas Legislature set a statutory minimum of $25 for driving safety courses. This applies to every TDLR-approved provider in the state — online or in-person. Courts also charge their own separate court fee (typically $144 in Houston and Dallas, for example) which is paid to the court and is completely separate from the course fee.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What is the difference between the course fee and the certificate fee?</h3>
            <p>These are two separate charges. The <strong>course fee</strong> is what you pay the provider to take the 6-hour course — minimum $25 by law. The <strong>certificate fee</strong> is an optional add-on that some providers charge for how they deliver your completion certificate. Options are: mail (often free or low cost), paid instant download, or free instant download. The total cost you should compare between providers is <strong>course fee + certificate fee combined</strong>.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Which Texas defensive driving courses have no certificate fee?</h3>
            <p>Several TDLR-approved providers include a free certificate — either by mail at no extra charge or as a free instant download:</p>
            <ul>
              <li>Driver Training Associates — free by mail</li>
              <li>Drivers Education of America — free by mail</li>
              <li>Road Ready Safety — free instant download</li>
              <li>WWW.CHEAPDRIVINGCOURSE.COM — free instant download</li>
              <li>Driving University — free instant download</li>
              <li>Highway Traffic School — free instant download</li>
              <li>I Drive Safely — free instant download</li>
              <li>Sunny Day Defensive Driving — free instant download</li>
              <li>NobodyLikesTickets.com — free instant download</li>
            </ul>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Which courses have free instant certificate download?</h3>
            <p>These providers offer a free instant certificate download — no waiting for mail, no extra fee:</p>
            <ul>
              <li>Road Ready Safety — $28 total (free instant download)</li>
              <li>WWW.CHEAPDRIVINGCOURSE.COM — $25 total (free instant download)</li>
              <li>Driving University — $25 total (free instant download)</li>
              <li>Highway Traffic School — $25 total (free instant download)</li>
              <li>I Drive Safely — $29 total (free instant download)</li>
              <li>Sunny Day Defensive Driving — $29 total (free instant download)</li>
              <li>NobodyLikesTickets.com — $28 total (free instant download)</li>
              <li>$25-FREE VIDEO COURSE-INSTANT CERTIFICATE DOWNLOAD — $25 total (free instant download)</li>
            </ul>
            <p class="note">Instant download means you receive your certificate immediately after completing the course — useful if you have a close court deadline.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Are there hidden fees in Texas defensive driving courses?</h3>
            <p>The most common unexpected charge is a <strong>certificate delivery fee</strong>. Some providers advertise "$25" but then charge extra for instant download. Always look at the total cost column when comparing — that is the all-in number including the course and certificate.</p>
            <p>Other potential additions: some courts charge a convenience fee for online payment (this goes to the court, not the course provider). The Type 3A driving record required by most courts is a separate $12 fee paid to DPS.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Does taking defensive driving for an insurance discount cost the same?</h3>
            <p>Yes — the course itself costs the same $25 minimum regardless of whether you are taking it for ticket dismissal or insurance discount. However, when taking for insurance purposes only, you do not need to pay court costs or obtain a Type 3A driving record, so the total out-of-pocket is lower. Contact your provider before enrolling to confirm the certificate type you will receive.</p>
          </div>
        </section>

        <!-- ── SECTION 2: Eligibility & Rules ── -->
        <section id="eligibility">
          <h2 class="sh">Eligibility & Rules</h2>

          <div class="qa">
            <h3>Am I eligible to take a defensive driving course to dismiss my ticket in Texas?</h3>
            <p>Generally yes, if all of the following are true:</p>
            <ul>
              <li>You have a valid Texas Driver's License (or active military status)</li>
              <li>You have current liability insurance</li>
              <li>You have not taken a court-ordered DSC in the past 12 months</li>
              <li>You do not hold a Commercial Driver's License (CDL)</li>
              <li>Your violation is not: speeding 25+ mph over the limit, speeding 95+ mph, passing a school bus, leaving the scene of an accident, an offense in a construction zone with workers present, or a serious traffic violation</li>
              <li>You are not a juvenile (under 17 must appear in person with a parent)</li>
            </ul>
            <p>You must still request approval from your specific court before taking the course.</p>
            <NuxtLink to="/eligibility-checker" class="int-link">Use the Eligibility Checker</NuxtLink>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>How many times can I take defensive driving in Texas?</h3>
            <p>You can take a driving safety course for <strong>ticket dismissal once every 12 months</strong>. If you took a court-ordered DSC within the 12 months before the date of your current offense, you are not eligible to use another DSC for that ticket.</p>
            <p>However, you can take the course voluntarily for an insurance discount at any time — taking it for insurance does not count against your 12-month court dismissal eligibility.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>How long do I have to complete my Texas defensive driving course after my ticket?</h3>
            <p>You have <strong>90 days</strong> from the date the court approves your request. You must request approval before your first court appearance date. Most courts do not grant extensions on the 90-day deadline, so do not wait until the last minute.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Can I take defensive driving for a speeding ticket in Texas?</h3>
            <p>It depends on how fast you were going. You are eligible if you were speeding <strong>less than 25 mph over the posted speed limit AND going less than 95 mph</strong>.</p>
            <p>If your ticket is for going 25 mph or more over the limit, or going 95 mph or more regardless of the speed limit, you are NOT eligible for a DSC dismissal.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What tickets are NOT eligible for defensive driving dismissal in Texas?</h3>
            <p>You cannot use a driving safety course to dismiss a ticket if it is for:</p>
            <ul>
              <li>Speeding 25 mph or more over the posted speed limit</li>
              <li>Driving 95 mph or more</li>
              <li>Passing a school bus loading or unloading children</li>
              <li>Leaving the scene of an accident after causing damage</li>
              <li>An offense in a construction or maintenance work zone when workers were present</li>
              <li>A serious traffic violation</li>
              <li>Any offense if you hold a Commercial Driver's License (CDL)</li>
            </ul>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Does defensive driving remove points from my Texas driving record?</h3>
            <p>Completing a DSC for ticket dismissal means the charge is dismissed — no conviction is recorded, so no points are added. If you already have points from past convictions, completing a voluntary defensive driving course (not for a ticket) does not remove existing points from your record. The course prevents new points from being added by keeping the current ticket from being a conviction.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Can I take defensive driving if I have a CDL in Texas?</h3>
            <p>No. If you hold a Commercial Driver's License at the time of your offense or at the time you make the request, you are not eligible for DSC dismissal — even if you were driving your personal vehicle at the time of the citation. This applies statewide across all Texas courts.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Can out-of-state drivers take a Texas defensive driving course?</h3>
            <p>If you received a citation in Texas and your case is before a Texas court, you generally need to follow Texas court procedures. You must have a valid driver's license or permit — Texas does not require it to be a Texas license. Active military members and their spouses and dependent children may use military ID and orders in place of a Texas license. Contact the specific court handling your citation to confirm requirements for your situation.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Do I need a Type 3A driving record to dismiss my ticket?</h3>
            <p>For most Texas courts, yes — the Type 3A driving record is required as part of your submission to confirm you have not taken a DSC in the past 12 months. Some courts obtain the record themselves for a $12 fee (such as Harris County JP Courts).</p>
            <p>You can order your Type 3A record online instantly at <a href="https://www.texas.gov" target="_blank" rel="noopener noreferrer">texas.gov</a> or by mail using the DPS DR-1 form (allow 2-3 weeks). It is a $12 fee from DPS. Confirm with your specific court whether you need to provide it or whether the court will obtain it.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What is a Type 3A driving record and where do I get one?</h3>
            <p>A Type 3A is a certified copy of your Texas driving record issued by the Texas Department of Public Safety. It shows your license status, any violations, and course completions on file. Courts require it to verify you have not taken a DSC in the past 12 months.</p>
            <p>You can order it at <a href="https://www.texas.gov" target="_blank" rel="noopener noreferrer">texas.gov</a> instantly online for $12, or by mailing the DPS DR-1 form to the Driver Records Bureau in Austin (allow 2-3 weeks for mail).</p>
          </div>
        </section>

        <!-- ── SECTION 3: The Process ── -->
        <section id="process">
          <h2 class="sh">The Process</h2>

          <div class="qa">
            <h3>What is the order of steps to dismiss a ticket with defensive driving in Texas?</h3>
            <p>The required sequence is:</p>
            <ol>
              <li>Confirm you are eligible (check eligibility rules above)</li>
              <li>Request approval from your court — on or before your appearance date</li>
              <li>Wait for written confirmation from the court (do not take the course yet)</li>
              <li>Take any TDLR-approved 6-hour driving safety course</li>
              <li>Order your Type 3A driving record from DPS (if required by your court)</li>
              <li>Have your affidavit notarized (required by most courts)</li>
              <li>Submit your Certificate of Completion (signed Court Copy), driving record, and notarized affidavit to the court — by the 90-day deadline</li>
              <li>Case dismissed</li>
            </ol>
            <p class="warn-inline">The most important rule: do not take the course before the court approves you. Courts can and do reject certificates submitted before approval was granted.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Do I need to notify my court before taking defensive driving?</h3>
            <p>Yes — always. You must request approval from your court before taking the course. This is required by every Texas court. Taking the course first and then asking the court is a common mistake that results in the court rejecting your certificate.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Can I take defensive driving before my court date?</h3>
            <p>You can take the course after your court approves your request, which typically must happen on or before your first court appearance date. You cannot take the course before approval. If you submit your request on your court date and get approved that day, you can start the course immediately after — but never before you receive written approval.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>How long does a Texas defensive driving course take?</h3>
            <p>All Texas defensive driving courses are required by law to be <strong>6 hours</strong> of instruction. Online courses include mandatory break periods within those 6 hours — you cannot complete a fully compliant online course in less time than the state requires. Some courses track time spent on each section to enforce this. You can pause and return to an online course — most providers allow 90 days from enrollment to complete it.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What happens after I finish my defensive driving course?</h3>
            <p>Your course provider will issue a completion certificate. Depending on the provider, this arrives by mail (typically 5-15 business days) or is available as an instant download. You must then submit the signed "Court Copy" of the certificate, your Type 3A driving record (if required), and your notarized affidavit to the court — all by your 90-day deadline. Submission must be by mail or in person at most courts (not email). After the court reviews and confirms, your case is dismissed.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What happens if I miss the court deadline for defensive driving?</h3>
            <p>The court will schedule a <strong>show cause hearing</strong> and mail a notice to your address on file. At the hearing you explain to the judge why you did not comply. If you fail to appear, fail to comply, or cannot give a satisfactory reason, a conviction is entered and you must pay the fine. Missing the show cause hearing itself is an additional offense punishable by up to $200.</p>
            <p>Some courts — but not all — may grant extensions for good cause before the deadline passes, so contact your court immediately if you think you will miss your deadline.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Can I get an extension on my defensive driving deadline?</h3>
            <p>It depends on the court. Some courts have the discretion to extend your deadline for good cause. Dallas Municipal Court explicitly states no extensions are allowed. Houston Municipal Court does not publicize an extension option. If you need more time, <strong>contact your court before your 90-day deadline expires</strong> — do not wait until after.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What if my course provider goes out of business before I finish?</h3>
            <p>Contact TDLR immediately at <strong>(800) 803-9202</strong>. TDLR regulates all course providers and maintains records of completions. Your court may also be able to verify enrollment through TDLR records. Do not simply abandon the process — contact the court directly and explain the situation. TDLR's database should have your enrollment on file.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Do all Texas courts accept the same defensive driving courses?</h3>
            <p>Yes. All 254 Texas counties and all municipal and JP courts must accept any course that is currently approved by the Texas Department of Licensing and Regulation (TDLR). A court cannot require you to use a specific course or a specific provider. If a court is recommending one specific website or company, that is informal guidance — not a legal requirement.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>How do I find out which court my ticket is in?</h3>
            <p>Your citation should list the court name, address, and your appearance date. If it is unclear, search for your case by citation number or name at the Harris County JP Courts portal (<a href="https://jp.hctx.net" target="_blank" rel="noopener noreferrer">jp.hctx.net</a>), the Dallas Municipal Court portal, or your specific city's court website.</p>
            <NuxtLink to="/courts" class="int-link">Court Lookup</NuxtLink>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What is deferred disposition in Texas?</h3>
            <p>Deferred disposition (also called probation or suspended sentence) is an alternative to DSC. You plead guilty or no contest, pay court costs, and the court places your case on hold for a probation period (up to 180 days in most courts). If you comply with all court conditions during that period, the case is dismissed with no conviction.</p>
            <p>Unlike DSC, deferred disposition does not require you to take a driving course (unless you are under 25, in which case the court is required by law to make you complete a DSC as a condition). Deferred disposition is available at the court's discretion and is not a legal right like DSC.</p>
          </div>
        </section>

        <!-- ── SECTION 4: Certificates ── -->
        <section id="certificate">
          <h2 class="sh">Certificates</h2>

          <div class="qa">
            <h3>What is the difference between an instant certificate download and mail delivery?</h3>
            <p>After completing your course, your certificate is delivered one of two ways. <strong>Instant download</strong> means you can download and print (or save) your certificate immediately upon completion — no waiting. <strong>Mail delivery</strong> means the provider mails a physical certificate to your address, which typically takes 5-15 business days.</p>
            <p>For court submission, most courts accept either format as long as it is the signed "Court Copy." If you have a tight deadline, choose a provider with free or paid instant download.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>How long does it take to receive a Texas defensive driving certificate by mail?</h3>
            <p>Most providers that mail certificates send them within 5-15 business days of course completion. Some take up to 3 weeks. Always account for mail time when planning around your 90-day court deadline — do not finish the course on day 88 expecting a mailed certificate to arrive in time.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Can I submit my certificate electronically to the court?</h3>
            <p>For most Texas courts, no. Houston Municipal Court explicitly states that certificates may NOT be emailed. Dallas Municipal Court states that fax, email, and live chat are not accepted for document submission. Check your specific court's requirements, but the standard across Texas courts is <strong>mail or in-person submission only</strong> for the completed certificate.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What do I do if I lose my Texas defensive driving certificate?</h3>
            <p>Contact your course provider directly — they are required to keep records and can issue a duplicate certificate. Most providers charge a small fee (typically up to $10) for a duplicate. You will need your name, course completion date, and ideally your driver's license number to request a duplicate. If your provider has gone out of business, contact TDLR at <strong>(800) 803-9202</strong>.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What information is on a Texas driving safety certificate?</h3>
            <p>A TDLR-approved certificate of course completion includes: your full name, driver's license number, date of birth, the course name and provider's TDLR license number, the date you completed the course, and a certificate serial number issued by TDLR. It comes in multiple copies — a Court Copy, an insurance copy, and a student copy. You submit the signed Court Copy to your court.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Does taking a defensive driving course require a paid certificate to get an insurance discount?</h3>
            <p>No — for insurance purposes, you just need the insurance copy of your certificate, which all providers issue as part of the standard completion packet. Some providers offer free email delivery of the insurance copy. You do not need to pay extra for a premium certificate to qualify for an insurance discount. Contact your insurance company before enrolling to confirm exactly what documentation they require.</p>
          </div>
        </section>

        <!-- ── SECTION 5: Format & Options ── -->
        <section id="format">
          <h2 class="sh">Format & Options</h2>

          <div class="qa">
            <h3>What is the difference between online and in-person defensive driving in Texas?</h3>
            <p>Both formats deliver the same 6-hour TDLR-approved curriculum and produce the same certificate accepted by all Texas courts. Online courses let you complete the course from home at your own pace — you can pause and return as needed. In-person courses are held at a physical location on a scheduled date and time.</p>
            <p>For most people, online is more convenient. In-person may be preferable if you want a structured setting, need Spanish-language instruction with a live instructor, or simply prefer not to work through material on a screen.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Can I take my Texas defensive driving course on my phone?</h3>
            <p>Yes. Most online Texas defensive driving courses are mobile-friendly and can be completed on any smartphone or tablet with a browser and internet access. Some providers have dedicated mobile apps. You do not need to be on a desktop computer to complete an online course.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Which Texas driving safety courses are 100% online?</h3>
            <p>The majority of TDLR-approved providers offer fully online courses. Well-known online providers include:</p>
            <ul>
              <li>Road Ready Safety — online, free instant certificate</li>
              <li>Driver Training Associates — online, certificate by mail</li>
              <li>DefensiveDriving.com — online, certificate by mail</li>
              <li>iDriveSafely — online, free instant certificate</li>
              <li>Safe2Drive — online, certificate by mail</li>
              <li>NobodyLikesTickets.com — online, free instant certificate</li>
              <li>Driving University — online, free instant certificate</li>
              <li>Highway Traffic School — online, free instant certificate</li>
              <li>Drivers Education of America — online, English and Spanish</li>
            </ul>
            <NuxtLink to="/" class="int-link">Filter online courses on TDLRguide</NuxtLink>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Can I pause and resume an online Texas defensive driving course?</h3>
            <p>Yes. All online providers allow you to log out and return to where you left off. Most providers give you 90 days from enrollment to complete the course. The course cannot be completed faster than the state-required 6 hours — the platform enforces this with timers. You can split the course across multiple sessions.</p>
          </div>
        </section>

        <!-- ── SECTION 6: Spanish Courses ── -->
        <section id="spanish">
          <h2 class="sh">Spanish Courses</h2>

          <div class="qa">
            <h3>Which Texas defensive driving courses are offered in Spanish?</h3>
            <p>Several TDLR-approved providers offer courses in Spanish or with Spanish-language options:</p>
            <ul>
              <li>Tu Escuelita de Manejo — Spanish language, online</li>
              <li>Maneja Seguro LLC — Spanish language (contact provider for pricing and format details)</li>
              <li>GetDefensive.com — English and Spanish, $30 total, online and in-person</li>
              <li>Angelo Driving, Inc. — English and Spanish, $30 total, online and in-person</li>
              <li>Drivers Education of America — English and Spanish, $25 total, online</li>
              <li>Ticket Eraser LLC — English and Spanish, $28 total, online and in-person</li>
              <li>J&amp;T Adult Driving School — English and Spanish, $29.99+, online and in-person</li>
              <li>Family Driving School — English and Spanish, in-person</li>
            </ul>
            <NuxtLink to="/" class="int-link">Filter Spanish courses on TDLRguide</NuxtLink>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Are there in-person Texas defensive driving courses in Spanish?</h3>
            <p>Yes. GetDefensive.com, Angelo Driving Inc., J&amp;T Adult Driving School, and Family Driving School all offer in-person options with Spanish language instruction. Availability may vary by location — contact the provider directly to confirm in-person availability near you.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Which Spanish-language courses are highest rated?</h3>
            <p>Based on available data, GetDefensive.com (English/Spanish, online and in-person) and Drivers Education of America (English/Spanish, online) are among the more established bilingual providers. For the most current options, use the TDLRguide comparison tool filtered by language.</p>
          </div>
        </section>

        <!-- ── SECTION 7: Provider Comparisons ── -->
        <section id="providers">
          <h2 class="sh">Provider Comparisons</h2>

          <div class="qa">
            <h3>Which Texas defensive driving course has the best reviews?</h3>
            <p>Based on available ratings data, the highest-rated providers are:</p>
            <ul>
              <li>Road Ready Safety — $28 total, online, free instant certificate</li>
              <li>Driver Training Associates — $25 total, online, certificate by mail</li>
              <li>Aceable Defensive Driving — $49+ total, online, known for polished mobile experience</li>
              <li>iDriveSafely — $29 total, online, free instant certificate, large established provider</li>
            </ul>
            <p class="note">Higher price does not always mean better experience — Road Ready Safety and Driver Training Associates both rank near the top while offering lower prices.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What is the difference between Road Ready Safety and iDriveSafely?</h3>
            <p>Both are fully online TDLR-approved courses. Key differences:</p>
            <ul>
              <li><strong>Road Ready Safety:</strong> $28 total ($25 + $3 cert fee), free instant certificate download, newer platform</li>
              <li><strong>iDriveSafely:</strong> $29 total, free instant certificate, long-established national provider with a large review base</li>
            </ul>
            <p>Both are accepted by all Texas courts. Road Ready Safety is higher rated and lower cost. iDriveSafely has a longer track record and more name recognition.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Aceable vs. DefensiveDriving.com — what is the difference?</h3>
            <ul>
              <li><strong>Aceable:</strong> $49+ total, online only, known for a high-quality mobile-first interface and polished video content. Higher cost than most competitors.</li>
              <li><strong>DefensiveDriving.com:</strong> $28 total, online, certificate by mail, well-established provider with a straightforward interface.</li>
            </ul>
            <p>If you want the best user experience and do not mind paying more, Aceable is a good choice. If you want a reliable course at the minimum cost, DefensiveDriving.com delivers.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What are the cheapest online courses with instant certificate?</h3>
            <p>These providers offer an online course with free instant certificate download at the lowest total cost:</p>
            <ul>
              <li>WWW.CHEAPDRIVINGCOURSE.COM — $25 total, free instant download</li>
              <li>Driving University — $25 total, free instant download</li>
              <li>Highway Traffic School — $25 total, free instant download</li>
              <li>Road Ready Safety — $28 total, free instant download</li>
              <li>iDriveSafely — $29 total, free instant download</li>
              <li>Sunny Day Defensive Driving — $29 total, free instant download</li>
            </ul>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Which Texas defensive driving courses are easiest to complete?</h3>
            <p>Based on ratings and provider characteristics:</p>
            <ul>
              <li>Driver Training Associates — straightforward online format, low cost</li>
              <li>Road Ready Safety — modern interface, free instant cert</li>
              <li>iDriveSafely — established platform, clear section structure, video-based content</li>
              <li>Drivers Education of America — available in English and Spanish, straightforward format</li>
            </ul>
            <p class="note">All Texas courses must be 6 hours — none can legally be shorter. "Easier" means better UX and less frustrating navigation, not a shorter course.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What are the best courses for people who want to finish fast?</h3>
            <p>Every TDLR-approved course is required to be 6 hours — no course can legally be completed faster. That said, courses with efficient layouts, clear video content, and no confusing navigation feel faster. Top choices for a smooth experience:</p>
            <ul>
              <li>Road Ready Safety — clean modern interface, instant cert</li>
              <li>Driver Training Associates — no-frills efficient format</li>
              <li>Driving University — $25 total, free instant cert, streamlined online</li>
              <li>iDriveSafely — video-based, self-paced, large established platform</li>
            </ul>
            <p class="note">For all of these, you can pause and return across multiple sessions within 90 days of enrollment.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Is Comedy Defensive Driving worth it?</h3>
            <p>Comedy-format courses use humor to make the 6-hour requirement feel less tedious. TDLR-approved comedy options include Comedy Defensive Driving, Comedy Guys Defensive Driving, and CourtApprovedComedyDriving Safety.com. They deliver the same content and the same certificate as any other course — the difference is purely in presentation style. Whether it is "worth it" depends on whether you find the format helps you stay engaged. Prices start at $25 with no certificate fee for some comedy providers.</p>
          </div>
        </section>

        <!-- ── SECTION 8: Court Questions ── -->
        <section id="court">
          <h2 class="sh">Court Questions</h2>

          <div class="qa">
            <h3>Does my court accept online defensive driving certificates?</h3>
            <p>All Texas courts must accept certificates from any TDLR-approved provider regardless of whether the course was taken online or in-person. However, the method of submitting the certificate to the court (online vs. mail vs. in-person) is separate from how you took the course. Most courts require the certificate to be submitted by mail or in person — not emailed. Check your specific court's submission requirements.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>How do I submit my certificate to the court?</h3>
            <p>By mail or in person at your specific court — for most Texas courts this is the only accepted method. Do not email your certificate. Some courts (such as Houston Municipal Court) explicitly state that certificates may not be emailed. When mailing, certified mail is recommended so you have proof of delivery. Include your citation number on all paperwork.</p>
            <p>TDLRguide's city guides have court-specific submission instructions:</p>
            <div class="link-row">
              <NuxtLink to="/houston" class="int-link">Houston guide</NuxtLink>
              <NuxtLink to="/dallas" class="int-link">Dallas guide</NuxtLink>
              <NuxtLink to="/san-antonio" class="int-link">San Antonio guide</NuxtLink>
              <NuxtLink to="/harris-county" class="int-link">Harris County guide</NuxtLink>
            </div>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>What is the difference between a municipal court and a JP court in Texas?</h3>
            <p>Municipal courts handle violations of city ordinances and state laws within a city's limits. Justice of the Peace (JP) courts handle violations in unincorporated county areas and smaller jurisdictions. Both accept TDLR-approved defensive driving courses. Your citation will show which court has your case.</p>
            <p>In Harris County for example, City of Houston tickets go to Houston Municipal Court, while tickets issued in unincorporated Harris County go to one of 16 Harris County JP Courts — these are separate systems with different processes and addresses.</p>
          </div>
        </section>

        <!-- ── SECTION 9: Insurance Discounts ── -->
        <section id="insurance">
          <h2 class="sh">Insurance Discounts</h2>

          <div class="qa">
            <h3>Can I take defensive driving to get a car insurance discount in Texas?</h3>
            <p>Yes. Texas law allows insurance companies to offer discounts to drivers who voluntarily complete an approved defensive driving course. Most major insurers offer a discount of up to 10% on applicable coverages. Taking a course for an insurance discount is completely separate from taking one for ticket dismissal — you can do both independently.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>How much is the insurance discount for defensive driving in Texas?</h3>
            <p>Most insurers offer up to 10% off applicable coverages (typically liability and collision). Common discount rates:</p>
            <ul>
              <li>GEICO — up to 10%</li>
              <li>State Farm — approximately 5%</li>
              <li>Nationwide — approximately 5% (age 55+ requirement)</li>
              <li>AAA — approximately 3%</li>
            </ul>
            <p>Eligibility and discount amounts vary by company, your age, your driving record, and your zip code. Contact your insurance provider before enrolling to confirm the exact discount available to you.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>How long does the insurance discount last?</h3>
            <p>Most defensive driving insurance discounts in Texas are valid for <strong>three years</strong> from the date of course completion. After three years you can retake the course to renew the discount. There is no limit on how many times you can take the course for insurance purposes — only the once-per-12-months rule applies to court dismissals.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>Does taking a court-ordered defensive driving course count for an insurance discount?</h3>
            <p>Not always. Many insurance companies (including GEICO) require that the course was taken voluntarily — not as the result of a court order — in order to qualify for the discount. Check with your specific insurer before assuming your court-ordered course will trigger a discount. Taking a separate voluntary course for insurance purposes is always an option.</p>
          </div>
          <div class="qa-div" />

          <div class="qa">
            <h3>How do I submit my certificate to my insurance company?</h3>
            <p>After completing your course, your provider will send you a certificate with an insurance copy. You can typically fax, mail, email, or hand-deliver the insurance copy to your insurance provider or agent. Unlike courts, insurance companies generally accept emailed or faxed copies. Contact your insurer for their specific submission process — some are fully digital, others require physical copies.</p>
          </div>
        </section>

        <!-- Related resources -->
        <div class="related">
          <div class="related-lbl">Related resources</div>
          <div class="related-grid">
            <NuxtLink to="/" class="rel-link">Compare all 133 TDLR-approved courses</NuxtLink>
            <NuxtLink to="/eligibility-checker" class="rel-link">Check your eligibility</NuxtLink>
            <NuxtLink to="/courts" class="rel-link">Look up your court</NuxtLink>
            <NuxtLink to="/pricing" class="rel-link">How Texas defensive driving pricing works</NuxtLink>
            <NuxtLink to="/houston" class="rel-link">Houston ticket guide</NuxtLink>
            <NuxtLink to="/dallas" class="rel-link">Dallas ticket guide</NuxtLink>
            <NuxtLink to="/san-antonio" class="rel-link">San Antonio ticket guide</NuxtLink>
            <NuxtLink to="/harris-county" class="rel-link">Harris County ticket guide</NuxtLink>
            <NuxtLink to="/ticket-calculator" class="rel-link">Ticket calculator</NuxtLink>
          </div>
        </div>

        <!-- Disclaimer -->
        <p class="disclaimer">Information on this page reflects Texas laws and court procedures current as of March 2026. Laws and court fees change — always verify requirements with your specific court before taking action. This is not legal advice.</p>

      </main>
    </div>

    <SiteFooter />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Literata:wght@400;500;600&display=swap');

.faq-page {
  --tx:  #18181b;
  --tx2: #52525b;
  --tx3: #a1a1aa;
  --bg:  #fff;
  --bg2: #fafaf9;
  --bg3: #f4f4f0;
  --bd:  #e4e4e7;
  --bd2: #d4d4d8;
  --blue: #1d4ed8;
  --blue-bg: #eff6ff;
  --blue-bd: #bfdbfe;
  --blue-tx: #1e40af;
  --amber-bg: #fffbeb;
  --amber-bd: #fde68a;
  --amber-tx: #78350f;
  --sans: 'DM Sans', sans-serif;
  --serif: 'Literata', Georgia, serif;
  --r: 8px;
  font-family: var(--sans);
  color: var(--tx);
  background: var(--bg);
  font-size: 15px;
  line-height: 1.65;
  min-height: 100vh;
}
@media (prefers-color-scheme: dark) {
  .faq-page {
    --tx:  #f4f4f5;
    --tx2: #a1a1aa;
    --tx3: #71717a;
    --bg:  #18181b;
    --bg2: #1f1f23;
    --bg3: #27272a;
    --bd:  #3f3f46;
    --bd2: #52525b;
    --blue: #60a5fa;
    --blue-bg: #1e3a5f;
    --blue-bd: #1d4ed8;
    --blue-tx: #93c5fd;
    --amber-bg: #1c1400;
    --amber-bd: #78350f;
    --amber-tx: #fcd34d;
  }
}

/* ── Layout ── */
.faq-outer {
  display: flex;
  align-items: flex-start;
  max-width: 980px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 5rem;
  gap: 2.5rem;
}

/* ── Desktop jump nav ── */
.jump-nav {
  display: none;
}
@media (min-width: 900px) {
  .jump-nav {
    display: block;
    width: 180px;
    flex-shrink: 0;
    position: sticky;
    top: 2rem;
    align-self: flex-start;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
  }
}
.jn-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--tx3);
  margin-bottom: .625rem;
  padding-left: .625rem;
}
.jn-link {
  display: block;
  width: 100%;
  text-align: left;
  padding: .4rem .625rem;
  font-size: 13px;
  font-weight: 500;
  color: var(--tx2);
  background: transparent;
  border: none;
  border-left: 2px solid transparent;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: all .1s;
  line-height: 1.4;
}
.jn-link:hover { color: var(--tx); background: var(--bg2); }
.jn-link.active {
  color: var(--blue);
  border-left-color: var(--blue);
  background: var(--blue-bg);
  font-weight: 600;
}

/* ── Main content ── */
.faq-main {
  flex: 1;
  min-width: 0;
  max-width: 720px;
}

/* ── Mobile pill nav ── */
.pill-nav {
  display: flex;
  gap: .375rem;
  overflow-x: auto;
  padding-bottom: .5rem;
  margin-bottom: 1.75rem;
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg);
  padding-top: .625rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.pill-nav::-webkit-scrollbar { display: none; }
@media (min-width: 900px) {
  .pill-nav { display: none; }
}
.pill {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: .3rem .75rem;
  font-size: 12px;
  font-weight: 500;
  border-radius: 999px;
  border: 1px solid var(--bd);
  background: var(--bg2);
  color: var(--tx2);
  cursor: pointer;
  transition: all .1s;
  flex-shrink: 0;
}
.pill:hover { border-color: var(--bd2); color: var(--tx); }
.pill.active {
  background: var(--blue-bg);
  border-color: var(--blue-bd);
  color: var(--blue-tx);
  font-weight: 600;
}

/* ── Page header ── */
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
  margin-bottom: 2.5rem;
}

/* ── Section headings ── */
h2.sh {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--tx3);
  margin: 2.5rem 0 1.25rem;
  padding-bottom: .5rem;
  border-bottom: 1px solid var(--bd);
}
section:first-of-type h2.sh { margin-top: 0; }

/* ── Q&A ── */
.qa {
  padding: 1rem 0 .875rem;
}
.qa h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--tx);
  line-height: 1.35;
  margin-bottom: .625rem;
}
.qa p {
  font-size: 14px;
  color: var(--tx2);
  line-height: 1.7;
  margin-bottom: .625rem;
}
.qa p:last-child { margin-bottom: 0; }
.qa ul, .qa ol {
  font-size: 14px;
  color: var(--tx2);
  padding-left: 1.375rem;
  margin: .375rem 0 .625rem;
  display: flex;
  flex-direction: column;
  gap: .3rem;
}
.qa li { line-height: 1.55; }
.qa strong { color: var(--tx); font-weight: 600; }
.qa a { color: var(--blue); text-decoration: none; }
.qa a:hover { text-decoration: underline; }
.qa-div {
  height: 1px;
  background: var(--bd);
}

.note {
  font-size: 13px !important;
  color: var(--tx3) !important;
  font-style: italic;
}
.warn-inline {
  font-size: 13px !important;
  background: var(--amber-bg);
  border: 1px solid var(--amber-bd);
  color: var(--amber-tx) !important;
  border-radius: var(--r);
  padding: .625rem .875rem;
  line-height: 1.55;
  margin-top: .375rem;
}

.int-link {
  display: inline-flex;
  align-items: center;
  gap: .25rem;
  margin-top: .5rem;
  font-size: 13px;
  font-weight: 600;
  color: var(--blue);
  text-decoration: none;
  padding: .25rem .65rem;
  background: var(--blue-bg);
  border: 1px solid var(--blue-bd);
  border-radius: 4px;
}
.int-link:hover { opacity: .8; }

.link-row {
  display: flex;
  flex-wrap: wrap;
  gap: .375rem;
  margin-top: .5rem;
}

/* ── Related resources ── */
.related {
  margin-top: 3rem;
  padding: 1.25rem 1.5rem;
  background: var(--bg2);
  border: 1px solid var(--bd);
  border-radius: 12px;
}
.related-lbl {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--tx3);
  margin-bottom: .75rem;
}
.related-grid {
  display: flex;
  flex-wrap: wrap;
  gap: .375rem;
}
.rel-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--blue);
  text-decoration: none;
  padding: .3rem .75rem;
  background: var(--bg);
  border: 1px solid var(--blue-bd);
  border-radius: 999px;
}
.rel-link:hover { opacity: .8; }

/* ── Disclaimer ── */
.disclaimer {
  font-size: 12px;
  color: var(--tx3);
  line-height: 1.65;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--bd);
}
</style>
