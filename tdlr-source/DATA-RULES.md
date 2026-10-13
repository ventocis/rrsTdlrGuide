# What the numbers on txcourseguide.com mean

Written 2026-10-13 while cleaning the directory. These are the rules
`npm run check:data` enforces and the ones a research chunk must follow.

## Listing

A provider is listed because TDLR licenses it, not because it asked. The
defensive-driving directory requires a **current `CP` licence** (driving safety
provider). A `C` licence is driver education — a different product — and belongs
on `/drivers-ed` instead. Holding one never implies the other.

Removed 2026-10-13: eleven rows and one duplicate brand whose licences had
expired or vanished from TDLR's file, plus `CP999 TDLR RESERVED ACCOUNT` — a
placeholder in TDLR's own system, carrying TDLR's headquarters address, TDLR's
phone number and an expiry of 2050. Not a business a student can buy from.

Kept, despite looking odd: `CP1190 SW TOWING CE LLC` and
`CP1195 S & R TRUCK DRIVING INSTITUTE`. Both hold current driving safety
licences and are real companies. Dropping a licensed provider because its name
reads strangely would contradict the rule above.

## `price`

What the provider advertises for the course itself.

## `stateFee`

A **mandatory** charge the provider adds on top of the course price.

The $3 fee that used to be required of every provider was repealed by HB 3012
effective 2025-09-01, so `0` is now both accurate and legal. Several rows still
carry `3` from the pre-repeal spreadsheet and have not been re-checked — Road
Ready Safety's own row was one of them, and it was wrong.

Never put an optional charge here.

## `totalCost`

**The least a student can pay to finish the course and get the certificate in
hand.** Not the most, and not a basket of everything on offer.

Optional extras are excluded: a certified driving record, a video upgrade,
express delivery, a retake package. Three rows were understating their
competitors by including a ~$24.95 driving record in the total — a $25 course
appeared as $50 next to rivals shown at $25. Fixed 2026-10-13 after checking
each provider's own page.

If a total genuinely exceeds `price + stateFee` because a charge is unavoidable,
set `totalIncludesExtras: true` **and** record what the charge is. Do not set
that flag to silence the validator; an error there means the row has not been
checked at a real checkout.

Eight rows still fail this test and are listed in `reports/data-issues.md`. They
keep their current numbers until someone verifies them — a stale number a
shopper can still act on beats a guess.

## `lastVerified`

ISO date, and only ever the date a human or a script actually looked at the
provider's live page. Never the date a file was edited.
