<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl as string) || 'https://tdlrguide.com'

const pageTitle = 'Austin Traffic Ticket Fine Amounts — Complete Fine Schedule | TDLRguide'
const pageDescription = 'Complete fine schedule for Austin Municipal Court traffic citations. Look up exact fine amounts for speeding, parking, registration, equipment violations, and more. Source: Austin Municipal Court January 2026.'
const pageUrl = `${siteUrl}/austin/fines`

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
      name: 'How much is an Austin speeding ticket?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Austin speeding ticket fines vary by speed zone and how fast you were going over the limit. For a standard city street violation, the base early payment total starts at $150 and increases with speed. For Accelerating Through Intersection the early payment total is $200 and standard total is $233. Speeding in a school zone or work zone carries higher fines. Violations of 25+ mph over the limit or 95+ mph are ineligible for DSC dismissal.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much is an Austin parking ticket?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Austin parking fines start as low as $20 for basic parking violations and go up to $1,269 or more for disabled parking space violations (fifth offense). Standard metered parking violations start at $25 early payment. Disabled parking violations start at $519 (early payment) for a first offense. Transit priority lane parking is $350 early payment. Bus stop parking is $50 early payment.'
      }
    },
    {
      '@type': 'Question',
      name: 'Where can I look up my Austin traffic ticket fine amount?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can look up your exact fine at the Austin Municipal Court online case portal at austintexas.gov/amcpublicinquiry using your last name and date of birth or driver\'s license number. The fine schedule on this page provides reference amounts but actual amounts may vary based on your specific circumstances.'
      }
    }
  ]
}

useHead({
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(faqSchema) }
  ],
  __dangerouslyDisableSanitizers: ['script']
})

const searchQuery = ref('')

type Fine = { desc: string; early: string; standard: string; max: string }

const allFines: { category: string; rows: Fine[] }[] = [
  {
    category: 'Moving Violations — General',
    rows: [
      { desc: 'Other Traffic Violation', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Other Criminal Violation', early: '$81', standard: '$181', max: '$500' },
      { desc: 'Violation of Promise to Appear', early: '$209', standard: '$209', max: '$200' },
      { desc: 'Permitting Illegal Operation Of Vehicle', early: '$196', standard: '$227', max: '$200' },
      { desc: 'Failed To Control Speed - Urban', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Control Speed - Posted', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Ran Non-Operational Traffic Signal', early: '$234', standard: '$284', max: '$200' },
      { desc: 'Imprudent Speed', early: '$246', standard: '$302', max: '$200' },
      { desc: 'CMV - Speed Over 15 Mph Over Speed Limit', early: '$334', standard: '$334', max: '$200' },
      { desc: 'Impeding Traffic', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield - Intersection (No Device)', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield - T-Intersection', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield - Crossover', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield - Intersection (With Device)', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield - U-Turn', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield - Right Turn On Red', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield - Stop Sign', early: '$284', standard: '$334', max: '$200' },
      { desc: 'Bodily Injury - Failed to Yield - Stop Sign', early: '$1,134', standard: '$1,634', max: '$2,000' },
      { desc: 'Serious Bodily Injury - Failed to Yield - Stop Sign', early: '$2,134', standard: '$3,134', max: '$4,000' },
      { desc: 'Failed To Yield - Left Turn Intersection', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Turn and Move Only in Safety', early: '$234', standard: '$284', max: '$200' },
      { desc: 'Failed To Yield - Flashing Red Light', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield From Private Drive Or Alley', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield - Yield Sign', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield Into Private Drive', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield When Moving Right', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failure To Yield To Emergency Vehicle', early: '$250', standard: '$308', max: '$200' },
      { desc: 'Passing Authorized Emergency Vehicle', early: '$634', standard: '$884', max: '$1,250' },
      { desc: 'Ran Stop Sign', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Ran Stop Sign - No Intersecting Street', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Stop At Designated Point - Stop Sign', early: '$180', standard: '$203', max: '$200' },
      { desc: 'Ran Flashing Red Light', early: '$250', standard: '$308', max: '$200' },
      { desc: 'Failed To Stop - Inoperable Light', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Ran Red Light', early: '$250', standard: '$308', max: '$200' },
      { desc: 'Ran Red Light At Midblock', early: '$250', standard: '$308', max: '$200' },
      { desc: 'Failed To Stop At Proper Place - Light/Intersection', early: '$250', standard: '$308', max: '$200' },
      { desc: 'Ran Red Light - Not An Intersection', early: '$250', standard: '$308', max: '$200' },
      { desc: 'Posted Sign - No Right/Left On Red Light', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Ran Red Light - At Private Drive', early: '$250', standard: '$308', max: '$200' },
      { desc: 'Disregarded Flashing Yellow Light', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Unsafe Lane Change', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Drive In Marked Lanes', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Lane Splitting', early: '$284', standard: '$334', max: '$200' },
      { desc: 'Deprive Motorcycle Full Use of Lane', early: '$284', standard: '$334', max: '$200' },
      { desc: 'Driving In Bicycle Lane', early: '$127', standard: '$150', max: '$500' },
      { desc: 'Electronic Device Use While Driving', early: '$231', standard: '$306', max: '$500' },
      { desc: 'Electronic Messaging While Driving', early: '$209', standard: '$233', max: '$99' },
      { desc: 'Improper Left Turn - Approach', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Improper Left Turn - Exit', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Improper Right/Left Turn - Posted Hours', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Improper Turn - Unsafe', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Improper Right Turn - Approach', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Improper Right Turn - Exit', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Improper Right Turn - Wide Right', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Posted Sign - Do Not Enter Intersection', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Posted Sign - Do Not Enter', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Posted Sign - Exit Only', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Posted Sign - Keep Off Median', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Unsafe Movement Left/Right', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Posted Sign - Road Closed', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Posted Sign - No Left Turn', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Posted Sign - One Way', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Following Too Closely - Collision', early: '$310', standard: '$334', max: '$200' },
      { desc: 'Following Too Closely - Non-Collision', early: '$200', standard: '$224', max: '$200' },
      { desc: 'Passing On Left', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Passing In No Passing Zone', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Passing In Left Turn Or Center Lane', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Passing A School Bus', early: '$636', standard: '$887', max: '$1,250' },
      { desc: 'Cut In After Passing', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Passing Vulnerable Road User', early: '$256', standard: '$343.50', max: '$500' },
      { desc: 'Failed To Signal Intent To Turn', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Wrong Signal Of Intent', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Signal Intent To Change Lanes', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield - Pedestrian In Crosswalk', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Yield - Pedestrian With Walk Signal', early: '$284', standard: '$334', max: '$200' },
      { desc: 'Wrong Side Of Road - Not Passing', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Wrong Side Of Road - Highway', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Disregarded Railroad Crossing Device Or Signal', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failure To Proceed Safely At RR Crossing', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failure To Stop 15 Feet From RR Crossing', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Stopping On Railroad Track', early: '$200', standard: '$233', max: '$200' },
      { desc: 'No Seat Belt - Driver', early: '$184', standard: '$184', max: '$50' },
      { desc: 'No Seat Belt - Passenger', early: '$184', standard: '$184', max: '$50' },
      { desc: 'No Seat Belt - Child Under 8', early: '$185', standard: '$210.50', max: '$250' },
      { desc: 'No Seat Belt - Child 8-16 Years Old', early: '$234', standard: '$284', max: '$200' },
      { desc: 'Open Container Motor Vehicle - Driver', early: '$211', standard: '$276', max: '$500' },
      { desc: 'Open Container Motor Vehicle - Passenger', early: '$211', standard: '$276', max: '$500' },
      { desc: 'Failed To Maintain Financial Responsibility (No Insurance)', early: '$265', standard: '$357', max: '$350' },
      { desc: 'Failed To Maintain Financial Responsibility (Prior Conviction)', early: '$485', standard: '$687', max: '$1,000' },
      { desc: 'School Zone - Wireless Device Use', early: '$284', standard: '$334', max: '$200' },
      { desc: 'Accelerating Through Intersection', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Disregarded Barricade - Motorized Vehicle', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Disregard Barricade - Workers Present', early: '$200', standard: '$233', max: '$400' },
      { desc: 'Driving On Improved Right Shoulder', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Driving On Improved Left Shoulder', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Driving On Unimproved Shoulder', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Drove Truck In Restricted Lane', early: '$334', standard: '$334', max: '$200' },
      { desc: 'Striking Structure, Fixture, Landscaping', early: '$284', standard: '$334', max: '$200' },
      { desc: 'Illegal Load Extension - Overheight', early: '$171', standard: '$191', max: '$200' },
      { desc: 'Illegal Load Extension - Overwidth', early: '$171', standard: '$191', max: '$200' },
      { desc: 'Leaving Scene Of Collision', early: '$310', standard: '$398', max: '$500' },
      { desc: 'Failure To Report Accident', early: '$230', standard: '$278', max: '$200' },
      { desc: 'Illegal Backing', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Illegal Backing Into Intersection', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Following Emergency Vehicle', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Driving Over Firehose', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Blocking Crosswalk - Traffic', early: '$204', standard: '$239', max: '$200' },
      { desc: 'Child In Vehicle - Unattended', early: '$325', standard: '$447', max: '$500' },
      { desc: 'Failed To Remove Vehicle From Roadway', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Failed To Secure Load - No Tarp', early: '$204', standard: '$239', max: '$200' },
      { desc: 'Improper Load - Unsecured Trailer', early: '$204', standard: '$239', max: '$200' },
      { desc: 'Improper Load - Loose Material', early: '$281', standard: '$381', max: '$500' },
      { desc: 'Driving Motor Vehicle On Sidewalk', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Crossing Property To Turn Right Or Left', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Crossing Property Without Stopping', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Posted Sign - No U Turn', early: '$200', standard: '$233', max: '$200' },
      { desc: 'U-Turn Not In Safety', early: '$147', standard: '$180', max: '$200' },
      { desc: 'Entering Blocked Intersection', early: '$180', standard: '$229.50', max: '$200' },
      { desc: 'Golf Cart On Public Street', early: '$234', standard: '$284', max: '$200' },
      { desc: 'Passing In Center Lane', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Misuse Of Center Lane', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Interfering With Funeral Procession', early: '$165', standard: '$207', max: '$200' },
      { desc: 'Slower Vehicle Failed To Keep Right', early: '$200', standard: '$233', max: '$200' },
    ]
  },
  {
    category: 'Speeding Violations',
    rows: [
      { desc: 'Speeding - 30 MPH Zone (base)', early: '$203', standard: '$237.50', max: '$200' },
      { desc: 'Speeding - 30 MPH Zone (11 mph over)', early: '$245', standard: '$208+', max: '$200' },
      { desc: 'Speeding - 30 MPH Zone (15 mph over)', early: '$275', standard: '$228+', max: '$200' },
      { desc: 'Speeding - 30 MPH Zone (19+ mph over)', early: '$334', standard: '$334', max: '$200' },
      { desc: 'Speeding - Posted City Street (base)', early: '$150', standard: '$184.50', max: '$200' },
      { desc: 'Speeding - Posted City Street (11 mph over)', early: '$192', standard: '$155+', max: '$200' },
      { desc: 'Speeding - Posted City Street (15 mph over)', early: '$222', standard: '$175+', max: '$200' },
      { desc: 'Speeding - Posted City Street (19+ mph over)', early: '$281', standard: '$281', max: '$200' },
      { desc: 'Speeding - School Zone (base)', early: '$150', standard: '$184.50', max: '$200' },
      { desc: 'Speeding - School Zone (11 mph over)', early: '$192', standard: '$155+', max: '$200' },
      { desc: 'Speeding - School Zone (19+ mph over)', early: '$281', standard: '$281', max: '$200' },
      { desc: 'Speeding - State Highway (base)', early: '$203', standard: '$238', max: '$200' },
      { desc: 'Speeding - State Highway (19+ mph over)', early: '$334', standard: '$334', max: '$200' },
      { desc: 'Speeding - City Work Zone - No Workers (base)', early: '$150', standard: '$184.50', max: '$200' },
      { desc: 'Speeding - City Work Zone - Workers Present (base)', early: '$150', standard: '$184.50', max: '$400' },
      { desc: 'Speeding - City Work Zone - Workers (19+ mph over)', early: '$381', standard: '$281', max: '$400' },
      { desc: 'Speeding - State Work Zone - No Workers (base)', early: '$203', standard: '$237.50', max: '$200' },
      { desc: 'Speeding - State Work Zone - Workers Present (base)', early: '$203', standard: '$237.50', max: '$400' },
      { desc: 'Speeding - State Work Zone - Workers (19+ mph over)', early: '$434', standard: '$334', max: '$400' },
      { desc: 'Speeding - Pedestrian Zone (base)', early: '$150', standard: '$184.50', max: '$200' },
      { desc: 'Speeding - Airport (base)', early: '$150', standard: '$184.50', max: '$200' },
      { desc: 'Speeding - State Highway (Less Than 10% Over, base)', early: '$203', standard: '$237.50', max: '$200' },
      { desc: 'Speeding - Posted City Street (Less Than 10% Over, base)', early: '$150', standard: '$184.50', max: '$200' },
    ]
  },
  {
    category: 'Driver License Violations',
    rows: [
      { desc: 'No Drivers License', early: '$151', standard: '$186', max: '$200' },
      { desc: 'No Driver License - 2nd Offense', early: '$195', standard: '$253', max: '$200' },
      { desc: 'Driving While License Invalid - Suspended', early: '$231', standard: '$281', max: '$200' },
      { desc: 'Driving While License Invalid - Prohibition Order', early: '$231', standard: '$281', max: '$200' },
      { desc: 'Driver License - Wrong Class', early: '$151', standard: '$186', max: '$200' },
      { desc: 'Driver License - Deceptively Similar', early: '$181', standard: '$231', max: '$200' },
      { desc: 'Failed To Obtain TX Drivers License', early: '$181', standard: '$231', max: '$200' },
      { desc: 'Driver License Restriction - Interlock Device Required', early: '$231', standard: '$281', max: '$200' },
      { desc: 'Driver License Restriction - No Glasses (A)', early: '$151', standard: '$186', max: '$200' },
      { desc: 'Driver License Restriction - Permit Only Without Adult (B)', early: '$151', standard: '$186', max: '$200' },
      { desc: 'Driver License Restriction G - Time Of Day', early: '$204', standard: '$234', max: '$200' },
      { desc: 'Driver License Rest. - Driver Under 18', early: '$181', standard: '$231', max: '$200' },
      { desc: 'Use Wireless Device While Driving - Under 18', early: '$204', standard: '$239', max: '$200' },
      { desc: 'Counterfeit Instrument', early: '$261', standard: '$281', max: '$200' },
      { desc: 'Possess Fictitious Document Under 21', early: '$261', standard: '$351', max: '$500' },
      { desc: 'No Driver License - Motorcycle', early: '$151', standard: '$186', max: '$200' },
      { desc: 'No Driver License - Motorcycle - 2nd Offense', early: '$201', standard: '$261', max: '$200' },
      { desc: 'Expired Driver License - Non-Commercial', early: '$151', standard: '$186', max: '$200' },
      { desc: 'Expired Driver License - Commercial', early: '$151', standard: '$186', max: '$200' },
      { desc: 'Failed To Display Driver License', early: '$151', standard: '$186', max: '$200' },
      { desc: 'Failed To Change Name/Address On DL', early: '$151', standard: '$186', max: '$200' },
      { desc: 'Allow Unlicensed Driver To Drive', early: '$151', standard: '$186', max: '$200' },
      { desc: 'Permitting Unauthorized Person To Drive', early: '$151', standard: '$186', max: '$200' },
    ]
  },
  {
    category: 'Vehicle Equipment Violations',
    rows: [
      { desc: 'Obstructed View', early: '$117', standard: '$135', max: '$200' },
      { desc: 'Obstructed Drivers View - Passengers', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Obstructed Drivers View - Sunscreen', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Obstructed Drivers View - Affixed Material', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Defective Turn Signal', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Defective Clearance Lamps', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Defective Brakes', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Defective Emergency Brakes', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Defective Headlights', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Improper Color Headlamp', early: '$209', standard: '$246.50', max: '$250' },
      { desc: 'No Headlights', early: '$170', standard: '$188', max: '$200' },
      { desc: 'No Taillights', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Illegal Color Light To Rear', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Illegal Colored Lights', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Improper Use Of Lights', early: '$117', standard: '$135', max: '$200' },
      { desc: 'Driving Without Lights', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Failed To Dim Headlights', early: '$170', standard: '$188', max: '$200' },
      { desc: 'No Brake Lights Violation', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Defective License Plate Light', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Unnecessary Use Of Horn', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Unreasonably Loud Warning Device', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Stereo Amplification - Vehicle', early: '$147', standard: '$180', max: '$500' },
      { desc: 'Inspection Sticker - Expired', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Inspection Sticker - Fail To Display', early: '$117', standard: '$135', max: '$200' },
      { desc: 'No Rearview Mirror', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Motorcycle - No/Unapproved Helmet', early: '$121', standard: '$131', max: '$50' },
      { desc: 'Motorcycle - No/Unapproved Passenger Helmet', early: '$121', standard: '$131', max: '$50' },
      { desc: 'Child In Open Truck Bed', early: '$196', standard: '$227', max: '$500' },
      { desc: 'Trailer - No Safety Chains', early: '$170', standard: '$188', max: '$200' },
      { desc: 'TV In View Of Driver', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Defective Muffler - Excessive Noise', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Excessive Smoke From Exhaust', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Defective Tires', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Glass Coating Material Unapproved', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Windshield Tinting Beyond Five Inches', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Window Obstruction', early: '$174', standard: '$194', max: '$200' },
      { desc: 'No Slow Moving Vehicle Emblem', early: '$296', standard: '$334', max: '$200' },
      { desc: 'Operated Or Moved Unsafe Vehicle', early: '$200', standard: '$233', max: '$200' },
    ]
  },
  {
    category: 'Registration and License Plate Violations',
    rows: [
      { desc: 'Unregistered Motor Vehicle', early: '$121', standard: '$141', max: '$200' },
      { desc: 'Expired Registration', early: '$121', standard: '$141', max: '$200' },
      { desc: 'No Motor Carrier Registration', early: '$121', standard: '$141', max: '$200' },
      { desc: 'Unregistered Vehicle - Trailer/Motorcycle', early: '$121', standard: '$141', max: '$200' },
      { desc: 'Expired Buyers Plate', early: '$121', standard: '$141', max: '$200' },
      { desc: 'Unregistered Motor Vehicle - Out of State', early: '$121', standard: '$141', max: '$200' },
      { desc: 'Failure To Obtain Texas Title', early: '$121', standard: '$141', max: '$200' },
      { desc: 'License Plate - No Front/Rear Plate', early: '$125', standard: '$147', max: '$200' },
      { desc: 'License Plate For Different Vehicle', early: '$201', standard: '$261', max: '$200' },
      { desc: 'Wrong License Plate Or Registration', early: '$197', standard: '$255', max: '$200' },
      { desc: 'License Plate Covering - Visibility/State', early: '$205', standard: '$267', max: '$300' },
      { desc: 'License Plate Covering - Letters/Numbers/Color', early: '$255', standard: '$342', max: '$300' },
      { desc: 'Improper Placement of Vehicle Insignia', early: '$281', standard: '$281', max: '$200' },
      { desc: 'Failed to Display Registration Sticker', early: '$181', standard: '$231', max: '$200' },
      { desc: 'Obscured License Plate', early: '$125', standard: '$147', max: '$200' },
      { desc: 'License Plate - Illegal Illuminated Device', early: '$125', standard: '$147', max: '$200' },
      { desc: 'Misuse Dealer Plate', early: '$125', standard: '$147', max: '$200' },
      { desc: 'Driver Misuse Of Dealer Plate', early: '$121', standard: '$141', max: '$200' },
      { desc: 'Updated/Altered Buyers Plates', early: '$205', standard: '$267', max: '$200' },
      { desc: 'Deceptively Similar License Plate', early: '$151', standard: '$186', max: '$200' },
      { desc: 'Unauthorized Removal - Immobilization Device', early: '$355', standard: '$492', max: '$500' },
      { desc: 'Unlawful Removal Of Impounded Vehicle', early: '$535', standard: '$581', max: '$500' },
      { desc: 'Misuse Of Farm Plates', early: '$125', standard: '$147', max: '$200' },
      { desc: 'Misuse Of Combination Plate', early: '$185', standard: '$237', max: '$200' },
    ]
  },
  {
    category: 'Parking Violations',
    rows: [
      { desc: 'Parking - Not Within Lines (Metered)', early: '$25', standard: '$40', max: '$35' },
      { desc: 'Parking - Parked Facing Traffic', early: '$25', standard: '$40', max: '$35' },
      { desc: 'Parking - Over Stall Line (Unmetered)', early: '$25', standard: '$40', max: '$35' },
      { desc: 'Parking - Time Zone', early: '$20', standard: '$30', max: '$25' },
      { desc: 'Parking - No Payment For Use of Metered Space', early: '$50', standard: '$75', max: '$70' },
      { desc: 'Parking - Extending Time Beyond Limit', early: '$25', standard: '$40', max: '$35' },
      { desc: 'Parking - Within An Intersection', early: '$50', standard: '$75', max: '$70' },
      { desc: 'Parking - On Sidewalk Area', early: '$50', standard: '$75', max: '$75' },
      { desc: 'Parking - No Parking Area', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - Blocking Crosswalk', early: '$50', standard: '$75', max: '$70' },
      { desc: 'Parking - Within 20\' Of Crosswalk', early: '$50', standard: '$75', max: '$70' },
      { desc: 'Parking - Within 30\' Of A Stop Sign', early: '$50', standard: '$75', max: '$70' },
      { desc: 'Parking - Within 30\' Of A Yield Sign', early: '$50', standard: '$75', max: '$70' },
      { desc: 'Parking - Within 15\' Of A Fire Hydrant', early: '$50', standard: '$75', max: '$70' },
      { desc: 'Parking - In A Fire Zone', early: '$50', standard: '$75', max: '$70' },
      { desc: 'Parking - Bus Stop', early: '$50', standard: '$75', max: '$70' },
      { desc: 'Parking - Commercial Service Zone', early: '$50', standard: '$75', max: '$70' },
      { desc: 'Parking - In Customer Service Zone', early: '$50', standard: '$75', max: '$70' },
      { desc: 'Parking - Double Parked', early: '$40', standard: '$70', max: '$65' },
      { desc: 'Parking - Over 18 Inches From Curb', early: '$50', standard: '$75', max: '$70' },
      { desc: 'Parking - Loading Zone', early: '$25', standard: '$40', max: '$35' },
      { desc: 'Parking - Left Wheel To Curb', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - Tow Away Zone', early: '$75', standard: '$100', max: '$95' },
      { desc: 'Parking - In Public Park', early: '$30', standard: '$50', max: '$45' },
      { desc: 'Parking - Public Recreation Area (Special Event)', early: '$125', standard: '$250', max: '$245' },
      { desc: 'Parking - Blocking Alley', early: '$25', standard: '$40', max: '$40' },
      { desc: 'Parking - Blocking Driveway', early: '$25', standard: '$40', max: '$35' },
      { desc: 'Parking - Other - U.S. Gov\'t Vehicle Zone', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - Other - Resident Only Zone', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - Other - Law Enforcement Zone', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - Other - Emergency Room Service Zone', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - Other - Motor Home (72 Cont. Hrs.)', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - Taxi Stand', early: '$25', standard: '$40', max: '$35' },
      { desc: 'Parking - Motorcycle Only', early: '$25', standard: '$40', max: '$35' },
      { desc: 'Parking - Parallel Only', early: '$25', standard: '$40', max: '$35' },
      { desc: 'Parking - Passenger Zone', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - City Facility', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - In Right Of Way', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - Police Complex', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - Restricted Area', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - To Sell, Wash, or Repair Vehicle', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - Front/Side Yard (1st Offense)', early: '$25', standard: '$40', max: '$35' },
      { desc: 'Parking - Front/Side Yard (2nd in 24 Mo.)', early: '$50', standard: '$50', max: '$45' },
      { desc: 'Parking - Front/Side Yard (3rd in 24 Mo.)', early: '$60', standard: '$60', max: '$55' },
      { desc: 'Parking Electric Vehicle Charging Station', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - Back-In Angle Only', early: '$35', standard: '$50', max: '$45' },
      { desc: 'Parking - Obstruct Traffic Next To Construction Site', early: '$25', standard: '$40', max: '$35' },
      { desc: 'Parking - Blocking Signed or Marked Bike Lane', early: '$50', standard: '$70', max: '$70' },
      { desc: 'Parking - Transit Priority Lane', early: '$350', standard: '$500', max: '$495' },
      { desc: 'Parking - Comm. Veh. Load/Unload Single Travel Lane', early: '$150', standard: '$300', max: '$295' },
      { desc: 'Parking - Comm. Veh. Load/Unload Bike Lane Obstruction', early: '$150', standard: '$300', max: '$295' },
      { desc: 'Parking - Comm. Veh. Load/Unload Without Permit', early: '$250', standard: '$500', max: '$495' },
      { desc: 'Illegally Parked Motor Home', early: '$131', standard: '$156', max: '$500' },
      { desc: 'Stop, Stand, Or Park In An Intersection', early: '$234', standard: '$284', max: '$250' },
      { desc: 'Hazardous Stopping, Standing Or Parking', early: '$234', standard: '$284', max: '$200' },
      { desc: 'Standing Or Parking In Prohibited Place', early: '$234', standard: '$284', max: '$200' },
      { desc: 'Standing or Parking in Front of Driveway', early: '$200', standard: '$233', max: '$200' },
    ]
  },
  {
    category: 'Disabled Parking Violations',
    rows: [
      { desc: 'Parking In Disabled Space (1st Offense)', early: '$519', standard: '$769', max: '$750' },
      { desc: 'Parking In Disabled Space (2nd Offense)', early: '$519', standard: '$769', max: '$800' },
      { desc: 'Parking In Disabled Space (3rd Offense)', early: '$569', standard: '$819', max: '$800' },
      { desc: 'Parking In Disabled Space (4th Offense)', early: '$819', standard: '$1,119', max: '$1,100' },
      { desc: 'Parking In Disabled Space (5th Offense)', early: '$1,269', standard: '$1,269', max: '$1,250' },
      { desc: 'Expired Disabled Parking Placard', early: '$519', standard: '$519', max: '$500' },
      { desc: 'Blocking A Disabled Access Ramp (1st Offense)', early: '$519', standard: '$769', max: '$750' },
      { desc: 'Blocking A Disabled Access Ramp (2nd Offense)', early: '$519', standard: '$769', max: '$800' },
      { desc: 'Blocking A Disabled Access Ramp (3rd Offense)', early: '$569', standard: '$819', max: '$800' },
      { desc: 'Blocking A Disabled Access Ramp (4th Offense)', early: '$819', standard: '$1,119', max: '$1,100' },
      { desc: 'Blocking A Disabled Access Ramp (5th Offense)', early: '$1,269', standard: '$1,269', max: '$1,250' },
      { desc: 'Lending A Disabled Parking Placard (1st Offense)', early: '$519', standard: '$769', max: '$750' },
      { desc: 'Lending A Disabled Parking Placard (2nd Offense)', early: '$519', standard: '$769', max: '$800' },
      { desc: 'Lending A Disabled Parking Placard (3rd Offense)', early: '$569', standard: '$819', max: '$800' },
      { desc: 'Illegal Use Of Disabled Card (1st Offense)', early: '$519', standard: '$769', max: '$750' },
      { desc: 'Illegal Use Of Disabled Card (2nd Offense)', early: '$519', standard: '$769', max: '$800' },
      { desc: 'Illegal Disabled Placard At Meter (1st Offense)', early: '$519', standard: '$769', max: '$750' },
    ]
  },
  {
    category: 'Pedestrian and Bicycle Violations',
    rows: [
      { desc: 'Pedestrian Crossing Roadway (City Ord.)', early: '$193', standard: '$280', max: '$500' },
      { desc: 'Pedestrian On Wrong Side Of Roadway', early: '$172', standard: '$222', max: '$200' },
      { desc: 'Pedestrian In Roadway (City Ord.)', early: '$235', standard: '$312', max: '$500' },
      { desc: 'Pedestrian Walking Against Light', early: '$120', standard: '$144', max: '$500' },
      { desc: 'Pedestrian Crossing Midblock', early: '$176', standard: '$228', max: '$200' },
      { desc: 'Use of a Sidewalk (improper)', early: '$226', standard: '$303', max: '$500' },
      { desc: 'Pedestrian Failed To Yield Row', early: '$176', standard: '$228', max: '$200' },
      { desc: 'Disregarded Order Of School Crossing Guard', early: '$200', standard: '$233', max: '$500' },
      { desc: 'NMV - Ran Stop Sign (Bicycle)', early: '$200', standard: '$233', max: '$200' },
      { desc: 'NMV - Ran Red Light (Bicycle)', early: '$250', standard: '$308', max: '$200' },
      { desc: 'NMV - Failed To Ride Bicycle In Lane', early: '$180', standard: '$203', max: '$200' },
      { desc: 'NMV - Bicycle Failed To Ride To Right Side', early: '$180', standard: '$203', max: '$200' },
      { desc: 'NMV - Riding More Than Two Abreast', early: '$180', standard: '$203', max: '$200' },
      { desc: 'NMV - Failure To Signal Intent (Bicycle)', early: '$180', standard: '$203', max: '$200' },
      { desc: 'NMV - Operate Bicycle Without Lights', early: '$170', standard: '$188', max: '$200' },
      { desc: 'NMV - Operate NMV With No Brake', early: '$200', standard: '$233', max: '$200' },
      { desc: 'NMV - Ride Bicycle On Sidewalk/Prohibited', early: '$159', standard: '$198', max: '$500' },
      { desc: 'NMV - Operate On Sidewalk', early: '$200', standard: '$233', max: '$200' },
      { desc: 'NMV - No Helmet While On Bicycle', early: '$129', standard: '$153', max: '$200' },
      { desc: 'NMV - Failure To Yield To Emergency Vehicle', early: '$234', standard: '$284', max: '$200' },
      { desc: 'NMV - Failure To Yield - Left Turn', early: '$200', standard: '$233', max: '$200' },
      { desc: 'NMV - Failure To Yield Intersection', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Parking A Bicycle To Obstruct', early: '$181', standard: '$231', max: '$500' },
      { desc: 'NMV - Riding Bicycle Between Vehicles', early: '$181', standard: '$231', max: '$500' },
      { desc: 'Skates, Skateboard On Sidewalk', early: '$131', standard: '$156', max: '$500' },
      { desc: 'Pocket Bike On Roadway, Sidewalk', early: '$193', standard: '$222.50', max: '$200' },
      { desc: 'Illegally Pulled By A Vehicle', early: '$203', standard: '$237.50', max: '$200' },
    ]
  },
  {
    category: 'Motorcycle Violations',
    rows: [
      { desc: 'Motorcycle - Too Many Riders/Passenger', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Motorcycle - Carrying Child Under 5', early: '$234', standard: '$284', max: '$200' },
      { desc: 'Motorcycle - Improper Riding', early: '$200', standard: '$233', max: '$200' },
      { desc: 'Motorcycle - No Front Turn Indicators', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Motorcycle - No Rear Turn Indicators', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Motorcycle - Defective Brakes', early: '$170', standard: '$188', max: '$200' },
      { desc: 'Motorcycle - Mirror Violation', early: '$170', standard: '$188', max: '$200' },
      { desc: 'No Driver License - Motorcycle', early: '$151', standard: '$186', max: '$200' },
    ]
  },
  {
    category: 'Watercraft (WSA) Violations',
    rows: [
      { desc: 'WSA - Unregistered/Expired Registration', early: '$281', standard: '$381', max: '$500' },
      { desc: 'WSA - No Life Preserver (Under Age 13)', early: '$181', standard: '$231', max: '$500' },
      { desc: 'WSA - Child Not Wearing PFD On Motorboat', early: '$331', standard: '$456', max: '$500' },
      { desc: 'WSA - No Fire Extinguisher', early: '$181', standard: '$231', max: '$500' },
      { desc: 'WSA - Reckless Or Negligent Operation', early: '$331', standard: '$456', max: '$500' },
      { desc: 'WSA - Hazardous Wake Or Wash', early: '$381', standard: '$531', max: '$500' },
      { desc: 'WSA - Personal Watercraft Violation', early: '$331', standard: '$456', max: '$500' },
      { desc: 'WSA - Underage Operation Of Motorboat', early: '$231', standard: '$306', max: '$500' },
      { desc: 'WSA - Operating Boats In Restricted Area', early: '$331', standard: '$456', max: '$500' },
      { desc: 'WSA - Water Ski During Prohibited Hours', early: '$331', standard: '$456', max: '$500' },
      { desc: 'WSA - Failed Engine Cutoff Greater Than Headway Speed', early: '$231', standard: '$281', max: '$200' },
      { desc: 'WSA - No Boater Education Course', early: '$181', standard: '$231', max: '$500' },
      { desc: 'WSA - Fail To Exchange Required Information', early: '$331', standard: '$456', max: '$500' },
      { desc: 'WSA - Fail to Render Aid', early: '$331', standard: '$456', max: '$500' },
      { desc: 'Boat - No Wake', early: '$207', standard: '$224', max: '$500' },
      { desc: 'Boat - Flooding Ban Violation', early: '$181', standard: '$231', max: '$2,000' },
      { desc: 'Prohibited Use Of PWC On Lake Austin', early: '$181', standard: '$231', max: '$500' },
    ]
  },
  {
    category: 'Open Container, Alcohol & Public Order',
    rows: [
      { desc: 'Public Intoxication', early: '$255', standard: '$342', max: '$500' },
      { desc: 'Alcohol - Minor In Possession', early: '$211', standard: '$276', max: '$500' },
      { desc: 'Alcohol - Minor In Possession (2nd Offense)', early: '$265', standard: '$357', max: '$500' },
      { desc: 'Alcohol - Minor Driving Under Influence', early: '$235', standard: '$312', max: '$500' },
      { desc: 'Alcohol - Minor Consuming', early: '$211', standard: '$276', max: '$500' },
      { desc: 'Misrepresentation of Age By Minor', early: '$261', standard: '$351', max: '$500' },
      { desc: 'Attempt To Purchase Alcohol By Minor', early: '$211', standard: '$276', max: '$500' },
      { desc: 'Alcohol - Possession During Prohibited Hours', early: '$235', standard: '$312', max: '$500' },
      { desc: 'Alcohol Consumption After Curfew', early: '$191', standard: '$246', max: '$500' },
      { desc: 'Alcohol Prohibited In City Areas', early: '$235', standard: '$312', max: '$500' },
      { desc: 'Drinking After Curfew - Sunday', early: '$191', standard: '$246', max: '$500' },
      { desc: 'Disorderly Conduct - Abusive Language', early: '$205', standard: '$267', max: '$500' },
      { desc: 'Disorderly Conduct - Excess Noise - Private', early: '$201', standard: '$261', max: '$500' },
      { desc: 'Disorderly Conduct - Noise', early: '$205', standard: '$267', max: '$500' },
      { desc: 'Disorderly Conduct - Fighting', early: '$305', standard: '$417', max: '$500' },
      { desc: 'Disorderly Conduct - Exposure', early: '$221', standard: '$291', max: '$500' },
      { desc: 'Simple Assault By Contact', early: '$341', standard: '$471', max: '$500' },
      { desc: 'Simple Assault By Contact - Family', early: '$491', standard: '$581', max: '$500' },
      { desc: 'Possession Of Drug Paraphernalia', early: '$260', standard: '$349.50', max: '$500' },
      { desc: 'Failed or Refused To Identify', early: '$211', standard: '$276', max: '$500' },
      { desc: 'Disregard Order Of Peace Officer', early: '$381', standard: '$531', max: '$500' },
      { desc: 'Camping - State Law', early: '$235', standard: '$312', max: '$500' },
      { desc: 'Sitting, Lying Down, Sleeping Outdoors', early: '$235', standard: '$312', max: '$500' },
      { desc: 'Camping in a Public Area', early: '$235', standard: '$285', max: '$500' },
      { desc: 'Solicitation In A Motor Vehicle', early: '$211', standard: '$276', max: '$500' },
    ]
  },
  {
    category: 'Parks Violations',
    rows: [
      { desc: 'Parks - Unapproved Motor Vehicle or Device', early: '$217', standard: '$267', max: '$500' },
      { desc: 'Parks - Fail to Comply/Display Approval', early: '$231', standard: '$306', max: '$500' },
      { desc: 'Parks - Failure to Pay Fee/Charge', early: '$231', standard: '$306', max: '$500' },
      { desc: 'Parks - Unapproved Special Event', early: '$431', standard: '$581', max: '$500' },
      { desc: 'Parks - Animal At Public Recreation Area', early: '$231', standard: '$306', max: '$500' },
      { desc: 'Parks - Sound Equipment - Sound Level', early: '$231', standard: '$306', max: '$500' },
      { desc: 'Parks - Disrupted Activity', early: '$191', standard: '$246', max: '$500' },
      { desc: 'Park Curfew Violation', early: '$191', standard: '$246', max: '$500' },
      { desc: 'Bow Fishing Prohibited', early: '$281', standard: '$381', max: '$500' },
      { desc: 'Fishing in Lady Bird Lake Prohibited', early: '$281', standard: '$381', max: '$500' },
      { desc: 'Swimming In Barton Creek', early: '$131', standard: '$156', max: '$500' },
      { desc: 'Swimming In Lady Bird Lake', early: '$131', standard: '$156', max: '$500' },
      { desc: 'Houseboat Or Motorboat on Lady Bird Lake', early: '$181', standard: '$231', max: '$500' },
      { desc: 'Burn Restriction Violation', early: '$581', standard: '$831', max: '$2,000' },
      { desc: 'Tampering with Barrier Prohibited', early: '$281', standard: '$381', max: '$500' },
    ]
  },
  {
    category: 'Litter and Environmental Violations',
    rows: [
      { desc: 'Litter In Street, Park, Etc. (City Ord.)', early: '$211', standard: '$276', max: '$500' },
      { desc: 'Littering 5 Pounds/5 Gallons or Less', early: '$331', standard: '$456', max: '$500' },
      { desc: 'Litter: Dumping At Unapproved Site', early: '$123', standard: '$144', max: '$500' },
      { desc: 'Illegal Dumping', early: '$981', standard: '$1,431', max: '$2,000' },
      { desc: 'Removal Of Protected Tree', early: '$1,081', standard: '$1,581', max: '$2,000' },
      { desc: 'Removal Of Heritage Tree', early: '$1,581', standard: '$2,081', max: '$2,000' },
      { desc: 'Removal Or Damage To Public Tree', early: '$161', standard: '$181', max: '$100' },
      { desc: 'Failed To Obtain Tree Permit', early: '$1,081', standard: '$1,581', max: '$2,000' },
      { desc: 'Coal Tar - Use By Paver', early: '$481', standard: '$581', max: '$500' },
      { desc: 'Coal Tar - Use With Criminal Negligence', early: '$1,521', standard: '$2,081', max: '$2,000' },
    ]
  },
  {
    category: 'Animal Violations',
    rows: [
      { desc: 'Animal - Dog/Cat Defecation', early: '$101', standard: '$111', max: '$500' },
      { desc: 'Animal - At Large', early: '$175', standard: '$222', max: '$500' },
      { desc: 'Animal - Dog Unrestrained', early: '$175', standard: '$222', max: '$500' },
      { desc: 'Animal - Barking Dog (Citizen)', early: '$195', standard: '$252', max: '$500' },
      { desc: 'Animal - No Current Rabies Vaccination', early: '$175', standard: '$222', max: '$500' },
      { desc: 'Animal - Vicious Dog', early: '$281', standard: '$381', max: '$500' },
      { desc: 'Animal - Failed To Quarantine', early: '$381', standard: '$531', max: '$500' },
      { desc: 'Animal - Improper Restraint', early: '$170', standard: '$214.50', max: '$500' },
      { desc: 'Unlawful Restraint Of Dog - Length', early: '$256', standard: '$344', max: '$500' },
      { desc: 'Unlawful Restraint Of Dog - Chain', early: '$256', standard: '$344', max: '$500' },
      { desc: 'Animal - Enclosure Violation', early: '$581', standard: '$831', max: '$2,000' },
      { desc: 'Animal - Interference With Impoundment', early: '$201', standard: '$261', max: '$500' },
      { desc: 'Animal - Keeping Animal In Enclosed Vehicle', early: '$281', standard: '$381', max: '$500' },
      { desc: 'Animal - Fail To Register Dangerous Dog', early: '$295', standard: '$402', max: '$500' },
      { desc: 'Animal - Attack By Dangerous Dog', early: '$481', standard: '$581', max: '$500' },
    ]
  },
  {
    category: 'Noise Violations',
    rows: [
      { desc: 'Noise - Decibel Level At Business', early: '$331', standard: '$456', max: '$500' },
      { desc: 'Noise - Outside of Permitted Time', early: '$316', standard: '$434', max: '$500' },
      { desc: 'Noise - Over the Permitted DB Limit', early: '$316', standard: '$434', max: '$500' },
      { desc: 'Noise - After 10:30pm', early: '$239', standard: '$318', max: '$500' },
      { desc: 'Noise - After 2:00am', early: '$239', standard: '$318', max: '$500' },
      { desc: 'Sound Equipment In Residential Area', early: '$240', standard: '$319', max: '$500' },
      { desc: 'Stereo Amplification - Vehicle', early: '$147', standard: '$180', max: '$500' },
      { desc: 'STR - Noise (Decibels)', early: '$431', standard: '$581', max: '$500' },
      { desc: 'STR - Operated Without License', early: '$431', standard: '$581', max: '$500' },
      { desc: 'STR - Advertising Without License', early: '$431', standard: '$581', max: '$500' },
      { desc: 'Noise - No Live Music Permit', early: '$241', standard: '$321', max: '$500' },
    ]
  },
  {
    category: 'Smoking Violations',
    rows: [
      { desc: 'Smoking - Public Place', early: '$581', standard: '$581', max: '$500' },
      { desc: 'Smoking - Within 15 Feet Of Public Entrance', early: '$313', standard: '$429', max: '$500' },
      { desc: 'Smoking Prohibited In Park', early: '$181', standard: '$231', max: '$2,000' },
      { desc: 'Smoking - Taxicab', early: '$581', standard: '$581', max: '$500' },
      { desc: 'Smoking - Smoke-Free Workplace', early: '$371', standard: '$516', max: '$500' },
      { desc: 'Smoking - Tobacco Sale To Minor', early: '$281', standard: '$381', max: '$500' },
      { desc: 'Possession Of Tobacco (Minor)', early: '$131', standard: '$156', max: '$100' },
      { desc: 'Smoking in Airport', early: '$331', standard: '$456', max: '$500' },
    ]
  },
  {
    category: 'Water Conservation Violations',
    rows: [
      { desc: 'Water - Conservation Stage - Irrigation Day', early: '$331', standard: '$456', max: '$2,000' },
      { desc: 'Water - Stage 1 - Irrigation Day', early: '$393', standard: '$549', max: '$2,000' },
      { desc: 'Water - Stage 1 - Commercial Patio Mister', early: '$493', standard: '$699', max: '$2,000' },
      { desc: 'Water - Stage 2 - Irrigation Day', early: '$493', standard: '$699', max: '$2,000' },
      { desc: 'Water - Stage 2 - Ornamental Fountain', early: '$493', standard: '$699', max: '$2,000' },
      { desc: 'Water - Stage 3 - Irrigation Day', early: '$1,081', standard: '$1,581', max: '$2,000' },
      { desc: 'Water - Stage 3 - Commercial Patio Mister', early: '$1,081', standard: '$1,581', max: '$2,000' },
      { desc: 'Water - Stage 4 - Irrigation', early: '$1,281', standard: '$1,881', max: '$2,000' },
      { desc: 'Water - Stage 4 - Outdoor Vegetation', early: '$1,281', standard: '$1,881', max: '$2,000' },
      { desc: 'Water - Water Waste - Broken Head', early: '$393', standard: '$549', max: '$2,000' },
      { desc: 'Water - Water Waste - Runoff', early: '$393', standard: '$549', max: '$2,000' },
      { desc: 'WWW - Year Round - Failed To Repair Leak', early: '$247', standard: '$330', max: '$2,000' },
    ]
  },
  {
    category: 'Health and Sanitation Violations',
    rows: [
      { desc: 'Health - Sanitation Ordinance', early: '$547', standard: '$780', max: '$2,000' },
      { desc: 'Health - Unsafe Food', early: '$1,043', standard: '$1,524', max: '$2,000' },
      { desc: 'Health - No Food Permit', early: '$547', standard: '$780', max: '$2,000' },
      { desc: 'Health - No Food Service Permit', early: '$547', standard: '$780', max: '$2,000' },
      { desc: 'Health - Food Service Violation', early: '$547', standard: '$780', max: '$2,000' },
      { desc: 'Health - No Food Managers Certificate', early: '$547', standard: '$780', max: '$2,000' },
      { desc: 'Health - Food From Unapproved Source', early: '$1,081', standard: '$1,581', max: '$2,000' },
      { desc: 'Health - Public Pool Gate', early: '$1,581', standard: '$2,081', max: '$2,000' },
      { desc: 'Health - Mosquito Harborage', early: '$1,047', standard: '$1,530', max: '$2,000' },
      { desc: 'Health - Illegal Dumping', early: '$981', standard: '$1,431', max: '$2,000' },
      { desc: 'Health - Other Health Violation', early: '$1,081', standard: '$1,581', max: '$2,000' },
    ]
  },
  {
    category: 'Fire Code Violations',
    rows: [
      { desc: 'Fire - Fireworks Possession Or Use', early: '$415', standard: '$582', max: '$2,000' },
      { desc: 'Fire - Obstructed Exit Door', early: '$543', standard: '$774', max: '$2,000' },
      { desc: 'Fire - Locked Exit', early: '$543', standard: '$774', max: '$2,000' },
      { desc: 'Fire - Fire Hydrant Violation', early: '$543', standard: '$774', max: '$2,000' },
      { desc: 'Fire - Overcrowded Premises', early: '$543', standard: '$774', max: '$2,000' },
      { desc: 'Fire - No Automatic Sprinkler System', early: '$1,043', standard: '$1,524', max: '$2,000' },
      { desc: 'Fire - No Exit Sign', early: '$543', standard: '$774', max: '$2,000' },
      { desc: 'Fire - No Portable Fire Extinguisher', early: '$243', standard: '$324', max: '$2,000' },
      { desc: 'Fire - Unauthorized Burning', early: '$543', standard: '$774', max: '$2,000' },
      { desc: 'Fire - Refused Inspection', early: '$681', standard: '$981', max: '$2,000' },
      { desc: 'Fire - False Alarm', early: '$243', standard: '$324', max: '$2,000' },
      { desc: 'Fire - Mobile Food Mechanical Heating', early: '$681', standard: '$981', max: '$2,000' },
      { desc: 'Fire - Mobile Food Pressurized Fuel', early: '$681', standard: '$981', max: '$2,000' },
      { desc: 'Fire - Occupy Before Approval', early: '$681', standard: '$981', max: '$2,000' },
    ]
  },
  {
    category: 'Building and Zoning Violations',
    rows: [
      { desc: 'Building Code - No Building Permit', early: '$581', standard: '$831', max: '$2,000' },
      { desc: 'Building Code - No Residential Permit', early: '$547', standard: '$780', max: '$2,000' },
      { desc: 'Building Code - No Electric Permit', early: '$547', standard: '$780', max: '$2,000' },
      { desc: 'Building Code - No Plumbing Permit', early: '$547', standard: '$780', max: '$2,000' },
      { desc: 'Building Code - Stop Work Order Violated', early: '$851', standard: '$1,236', max: '$2,000' },
      { desc: 'Building Code - No Demolition Permit', early: '$2,081', standard: '$2,081', max: '$2,000' },
      { desc: 'Other Zoning Violation', early: '$1,081', standard: '$1,581', max: '$2,000' },
      { desc: 'Zoning - Prohibited Use', early: '$1,081', standard: '$1,581', max: '$2,000' },
      { desc: 'Zoning - No Certificate Of Occupancy', early: '$592', standard: '$847.50', max: '$2,000' },
      { desc: 'Zoning - No Swimming Pool Permit', early: '$247', standard: '$330', max: '$2,000' },
      { desc: 'Zoning - No Swimming Pool Fence', early: '$547', standard: '$780', max: '$2,000' },
      { desc: 'Zoning - Fence Height Violation', early: '$297', standard: '$405', max: '$2,000' },
      { desc: 'Zoning - Prohibited Flashing Sign', early: '$481', standard: '$581', max: '$500' },
      { desc: 'Zoning - Prohibited Sign On Vehicle', early: '$481', standard: '$581', max: '$500' },
      { desc: 'Zoning - No Sign Permit', early: '$592', standard: '$847.50', max: '$2,000' },
      { desc: 'Zoning - Impervious Cover', early: '$347', standard: '$480', max: '$2,000' },
      { desc: 'Deviation From Approved Plans', early: '$1,081', standard: '$1,581', max: '$2,000' },
      { desc: 'Failed To Register Rental Property', early: '$1,081', standard: '$1,581', max: '$2,000' },
    ]
  },
  {
    category: 'Hazmat Violations',
    rows: [
      { desc: 'Hazmat - No Storage Permit', early: '$1,533', standard: '$2,081', max: '$2,000' },
      { desc: 'Hazmat - Flammable Liquids', early: '$1,043', standard: '$1,524', max: '$2,000' },
      { desc: 'Hazmat - Exceeded Maximum Quantity', early: '$1,043', standard: '$1,524', max: '$2,000' },
      { desc: 'Hazmat - Insufficient Signage', early: '$1,043', standard: '$1,524', max: '$2,000' },
      { desc: 'Hazmat - Defective Containers', early: '$1,043', standard: '$1,524', max: '$2,000' },
      { desc: 'Hazmat - Failed To Report Discharge', early: '$1,043', standard: '$1,524', max: '$2,000' },
      { desc: 'Hazmat - Labeling Not Visible/Marked', early: '$161', standard: '$201', max: '$200' },
      { desc: 'CMV - Hazmat - No Placard', early: '$165', standard: '$207', max: '$200' },
      { desc: 'CMV - No Haz Mat Shipping Paper', early: '$265', standard: '$281', max: '$200' },
      { desc: 'CMV - No Hazardous Material Endorsement', early: '$165', standard: '$207', max: '$200' },
    ]
  },
  {
    category: 'Commercial Vehicle (CMV) Violations',
    rows: [
      { desc: 'CMV - Motor Carrier Safety Regulation', early: '$135', standard: '$162', max: '$200' },
      { desc: 'CMV - Use of Hand-held Mobile Telephone', early: '$331', standard: '$431', max: '$500' },
      { desc: 'CMV - No Seat Belt', early: '$217', standard: '$281', max: '$200' },
      { desc: 'CMV - Vehicle Out Of Service', early: '$265', standard: '$281', max: '$200' },
      { desc: 'CMV - Oversized Vehicle Without Permit', early: '$215', standard: '$281', max: '$200' },
      { desc: 'CMV - Defective Brakes', early: '$135', standard: '$162', max: '$200' },
      { desc: 'CMV - Defective Headlights', early: '$135', standard: '$162', max: '$200' },
      { desc: 'CMV - Defective Tires', early: '$241', standard: '$281', max: '$200' },
      { desc: 'CMV - No Air Reservoir System', early: '$281', standard: '$381', max: '$500' },
      { desc: 'CDL - No Medical Certificate', early: '$165', standard: '$207', max: '$200' },
      { desc: 'CDL - Driver Out Of Service', early: '$265', standard: '$281', max: '$200' },
      { desc: 'CDL - False Log/No Log', early: '$195', standard: '$252', max: '$200' },
      { desc: 'CDL - No Valid CDL', early: '$165', standard: '$207', max: '$200' },
      { desc: 'CMV - Weight - Over Gross Weight 80,000 Lbs', early: '$165', standard: '$207', max: '$200' },
      { desc: 'CMV - Weight - Gross Weight (5,001–10,000 Lbs over)', early: '$1,081', standard: '$1,581', max: '$2,500' },
      { desc: 'CMV - Weight - Gross Weight (20,001–40,000 Lbs over)', early: '$5,081', standard: '$7,081', max: '$7,000' },
      { desc: 'CMV - Weight - Gross Weight (More Than 40,000 Lbs over)', early: '$7,081', standard: '$7,331', max: '$10,000' },
      { desc: 'Excessive Idling - GVW > 14,000 Lbs', early: '$581', standard: '$831', max: '$2,000' },
    ]
  },
  {
    category: 'Ground Transportation Violations',
    rows: [
      { desc: 'Wrecker - Illegal Tow (Obstruction/No Notice)', early: '$1,081', standard: '$1,581', max: '$1,500' },
      { desc: 'Wrecker - Illegal Tow From Public Road', early: '$1,081', standard: '$1,581', max: '$1,500' },
      { desc: 'Wrecker - Failure To Release Vehicle', early: '$365', standard: '$507', max: '$500' },
      { desc: 'Wrecker - Not Accepting Credit Cards', early: '$365', standard: '$507', max: '$500' },
      { desc: 'Wrecker - Exceeded 20 Minutes', early: '$211', standard: '$276', max: '$500' },
      { desc: 'Wrecker - No Cab Card', early: '$581', standard: '$831', max: '$1,500' },
      { desc: 'GT - No Valid City Chauffeurs Permit', early: '$581', standard: '$581', max: '$500' },
      { desc: 'GT - No/Expired Permit Displayed', early: '$177', standard: '$225', max: '$500' },
      { desc: 'GT - Loading And Unloading Passengers', early: '$321', standard: '$441', max: '$500' },
      { desc: 'GT - Insurance Required (Pedicab)', early: '$265', standard: '$357', max: '$500' },
      { desc: 'GT - Pedicab On 35+ MPH Roadway', early: '$256', standard: '$344', max: '$500' },
      { desc: 'GT - Pedicab Failed to Comply With Traffic Law', early: '$281', standard: '$381', max: '$500' },
      { desc: 'GT - Pedicab On Sidewalk', early: '$256', standard: '$344', max: '$500' },
    ]
  },
  {
    category: 'Court and Miscellaneous Violations',
    rows: [
      { desc: 'Failure To Appear', early: '$156', standard: '$156', max: '$500' },
      { desc: 'Failure To Appear - Collision', early: '$190', standard: '$244.50', max: '$500' },
      { desc: 'Contempt Of Court - Direct', early: '$100', standard: '$100', max: '$100' },
      { desc: 'Contempt Of Court - Juror', early: '$100', standard: '$100', max: '$100' },
      { desc: 'Contempt Of Court - Peace Officer', early: '$100', standard: '$100', max: '$200' },
      { desc: 'Abusive/Silent Calls To 911', early: '$81', standard: '$81', max: '' },
      { desc: 'Out of County Class C Violation', early: '$81', standard: '$81', max: '' },
      { desc: 'Criminal Mischief - Destruction Of Property', early: '$211', standard: '$276', max: '$500' },
      { desc: 'Theft C - Less Than $100', early: '$235', standard: '$312', max: '$500' },
      { desc: 'Theft Of Service', early: '$211', standard: '$276', max: '$500' },
      { desc: 'Firearm Accessible To Child', early: '$265', standard: '$357', max: '$500' },
      { desc: 'Discharge Firearms In City', early: '$441', standard: '$581', max: '$500' },
      { desc: 'Discharging Pellet Gun In City', early: '$161', standard: '$201', max: '$500' },
      { desc: 'Hunting Wild Game Within City Limits', early: '$578', standard: '$581', max: '$500' },
    ]
  }
]

const flatFines = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return allFines
  return allFines
    .map(section => ({
      category: section.category,
      rows: section.rows.filter(r => r.desc.toLowerCase().includes(q))
    }))
    .filter(s => s.rows.length > 0)
})

const totalMatchCount = computed(() =>
  flatFines.value.reduce((acc, s) => acc + s.rows.length, 0)
)
</script>

<template>
  <div class="fines-page">
    <main class="page-wrap">

      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/austin">Austin Ticket Guide</NuxtLink>
        <span class="bc-sep">›</span>
        <span>Fine Schedule</span>
      </nav>

      <!-- Page header -->
      <h1 class="page-h1">Austin Municipal Court — Traffic Fine Schedule</h1>
      <p class="page-lead">Reference amounts for fines, court costs, and fees for traffic citations handled by Austin Municipal Court. Amounts shown are approximate. Your actual fine may vary if your offense involved a collision, occurred in a school zone, or was issued by a law enforcement officer. Always verify your exact amount in the court's online case portal.</p>

      <!-- CTA buttons -->
      <div class="cta-row">
        <a href="https://www.austintexas.gov/amcpublicinquiry" target="_blank" rel="noopener noreferrer" class="cta-btn">Look up your exact fine →</a>
        <a href="https://austin.widen.net/view/pdf/v64neidhuo/ActiveStatuteFee_02032026.pdf?t.download=true" target="_blank" rel="noopener noreferrer" class="cta-btn cta-btn-outline">Download official fine schedule PDF ↓</a>
      </div>

      <!-- Explanation box -->
      <div class="box neutral">
        <p class="box-label">How to read this table</p>
        <p>Each fine has two amounts: <strong>Early Payment</strong> (paid before your appearance date) and <strong>Standard</strong> (paid on or after your appearance date). The Max Fine column shows the statutory maximum. Total amounts include court costs.</p>
      </div>

      <!-- Search -->
      <div class="search-wrap">
        <label for="fineSearch" class="search-label">Search violations</label>
        <input
          id="fineSearch"
          v-model="searchQuery"
          type="search"
          class="search-input"
          placeholder="Type to filter by violation name…"
          autocomplete="off"
        />
        <span v-if="searchQuery" class="search-count">{{ totalMatchCount }} result{{ totalMatchCount !== 1 ? 's' : '' }}</span>
      </div>

      <!-- Fine tables -->
      <template v-if="flatFines.length > 0">
        <section
          v-for="section in flatFines"
          :key="section.category"
          class="fine-section"
        >
          <h2 class="sh">{{ section.category }}</h2>
          <div class="table-wrap">
            <table class="fine-table">
              <thead>
                <tr>
                  <th>Violation</th>
                  <th>Early Payment</th>
                  <th>Standard</th>
                  <th>Max Fine</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in section.rows" :key="row.desc">
                  <td>{{ row.desc }}</td>
                  <td class="amt">{{ row.early }}</td>
                  <td class="amt">{{ row.standard }}</td>
                  <td class="amt muted">{{ row.max || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
      <div v-else class="no-results">
        <p>No violations found matching "<strong>{{ searchQuery }}</strong>". Try a different search term.</p>
      </div>

      <!-- Source and disclaimer -->
      <div class="disclaimer">
        <p class="disclaimer-label">Source and disclaimer</p>
        <p>This fine schedule reflects the Austin Municipal Court Active Statute Fee schedule dated January 4, 2026. Fine amounts are approximate and may vary based on specific circumstances including whether the offense involved a collision, occurred in a school zone, or was issued by a law enforcement officer. This schedule does not include arrest warrant fees, collection agency fees, or time payment fees. For the exact amount applicable to your case, use the Austin Municipal Court online case portal or contact the court directly.</p>
        <ul class="disclaimer-sources">
          <li><a href="https://austin.widen.net/view/pdf/v64neidhuo/ActiveStatuteFee_02032026.pdf?t.download=true" target="_blank" rel="noopener noreferrer">Official Austin fine schedule PDF (January 2026)</a></li>
          <li><a href="https://www.austintexas.gov/amcpublicinquiry" target="_blank" rel="noopener noreferrer">Austin Municipal Court case portal</a></li>
          <li><a href="https://www.austintexas.gov/municipal-court" target="_blank" rel="noopener noreferrer">Austin Municipal Court</a></li>
        </ul>
        <p style="margin-top:1rem;"><NuxtLink to="/austin">← Back to Austin ticket guide</NuxtLink></p>
      </div>

    </main>
  </div>
</template>

<style scoped>
.fines-page {
  --teal: #0d9488;
  font-family: var(--font-sans, system-ui, sans-serif);
}

.page-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

/* Breadcrumb */
.breadcrumb {
  font-size: .82rem;
  color: var(--fg2);
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: .35rem;
  flex-wrap: wrap;
}
.breadcrumb a { color: var(--teal); text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }
.bc-sep { color: var(--fg2); }

.page-h1 {
  font-size: clamp(1.35rem, 3.5vw, 1.75rem);
  font-weight: 700;
  color: var(--fg);
  margin: 0 0 .75rem;
  line-height: 1.25;
}
.page-lead {
  font-size: .92rem;
  color: var(--fg2);
  margin: 0 0 1.25rem;
  line-height: 1.65;
}

/* CTA row */
.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
  margin-bottom: 1.5rem;
}
.cta-btn {
  display: inline-block;
  padding: .55rem 1.1rem;
  background: var(--teal);
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  font-size: .875rem;
  font-weight: 650;
  transition: opacity .15s;
  border: 1px solid transparent;
}
.cta-btn:hover { opacity: .88; }
.cta-btn-outline {
  background: transparent;
  color: var(--teal);
  border-color: var(--teal);
}
.cta-btn-outline:hover { background: var(--bg2); opacity: 1; }

/* Notice box */
.box { border-radius: 8px; padding: .875rem 1rem; margin-bottom: 1.25rem; }
.box.neutral { background: var(--bg2); border: 1px solid var(--bd); }
.box-label { font-size: .79rem; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--fg2); margin: 0 0 .4rem; }
.box p { font-size: .875rem; color: var(--fg); margin: 0; line-height: 1.6; }

/* Search */
.search-wrap {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: .75rem;
  flex-wrap: wrap;
}
.search-label {
  font-size: .82rem;
  font-weight: 600;
  color: var(--fg2);
  white-space: nowrap;
}
.search-input {
  flex: 1;
  min-width: 200px;
  padding: .5rem .75rem;
  border: 1px solid var(--bd);
  border-radius: 6px;
  background: var(--bg);
  color: var(--fg);
  font-size: .9rem;
  outline: none;
  transition: border-color .15s;
}
.search-input:focus { border-color: var(--teal); }
.search-count {
  font-size: .82rem;
  color: var(--fg2);
  white-space: nowrap;
}

/* h2 */
h2.sh {
  font-size: 1rem;
  font-weight: 650;
  color: var(--fg);
  margin: 2.5rem 0 .75rem;
  padding-bottom: .35rem;
  border-bottom: 1px solid var(--bd);
}

/* Fine section */
.fine-section { margin-bottom: 1rem; }

/* Table */
.table-wrap { overflow-x: auto; }
.fine-table {
  width: 100%;
  border-collapse: collapse;
  font-size: .84rem;
}
.fine-table th {
  text-align: left;
  padding: .45rem .625rem;
  font-size: .76rem;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: .03em;
  color: var(--fg2);
  background: var(--bg2);
  border-bottom: 2px solid var(--bd);
  white-space: nowrap;
}
.fine-table td {
  padding: .4rem .625rem;
  border-bottom: 1px solid var(--bd);
  vertical-align: top;
  color: var(--fg);
  line-height: 1.45;
}
.fine-table tr:last-child td { border-bottom: none; }
.fine-table tr:hover td { background: var(--bg2); }
.amt {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  font-size: .83rem;
}
.muted { color: var(--fg2); font-size: .8rem; }

/* No results */
.no-results {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--fg2);
  font-size: .9rem;
}

/* Disclaimer */
.disclaimer {
  border-top: 1px solid var(--bd);
  padding-top: 1.25rem;
  margin-top: 2.5rem;
}
.disclaimer-label {
  font-size: .79rem;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--fg2);
  margin: 0 0 .5rem;
}
.disclaimer p { font-size: .8rem; color: var(--fg2); margin: 0; line-height: 1.65; }
.disclaimer-sources {
  list-style: none;
  padding: 0;
  margin: .625rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: .35rem .875rem;
}
.disclaimer-sources li { font-size: .8rem; }
.disclaimer-sources a { color: var(--teal); }
.disclaimer a { color: var(--teal); }

@media (max-width: 520px) {
  .fine-table th:last-child,
  .fine-table td:last-child { display: none; }
}
</style>
