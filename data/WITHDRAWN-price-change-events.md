# Withdrawn: the price-change event feed (`wire-events.json`, `change-ledger.json`)

**Status: withdrawn on 2026-08-01. Both files are now empty arrays. Do not cite any figure
that was published in them before that date.**

## What was wrong

These two files claimed to list dated price changes by vendors, with ready-to-quote sentences
such as *"Ahrefs lowered its entry price from $108 to $29 per month (-73.1%) in 2026-08
(Shortlist Price Index)"*.

They did not measure vendors. They compared **this project's own published index between two
months**, fetched from our own site endpoints (`<site>/data/price-index.json`). When we corrected
an entry in our own dataset, the generator recorded that correction as a price move by the vendor.

The independent measurement pipeline in `data/<category>/observations/` shows the difference
plainly. For the same plan, in the same two months:

| Vendor | Plan | Measured 2026-07 | Measured 2026-08 | Claimed in the feed |
|---|---|---|---|---|
| Ahrefs | starter | $30.83 | $31.01 | $108 → $29 (-73.1%) |
| SE Ranking | core | $99.56 | $100.15 | $52 → $103.20 (+98.5%) |
| WP Engine | startup | $27.00 | $27.00 | $20 → $30 (+50%) |
| Hetzner | level 1 | $1.25 | $1.25 | $7.99 → $4.35 (-45.6%) |

The measurements are flat. The feed reported large moves. The feed was wrong.

A second, independent defect made it worse: for six of the ten categories the comparison month
had never been measured at all (first measurement is 2026-08), so those deltas compared a
hand-compiled estimate against a measured value. That is a change of method, not a change of price.
Of 37 events published on 2026-08-01, 11 survived that check and none survived the provenance
check above.

## What is NOT affected

The monthly snapshots (`monthly-index.csv`, `price-index-current.json`, `providers-current.csv`)
are unchanged and remain valid on their own terms. They are, and have always been, documented as
compiled from public vendor pricing pages, with four categories additionally verified by direct
measurement. Nothing in this withdrawal implies those figures are wrong; it concerns only the
derived claim that a vendor *changed* its price.

## What has to be true before the feed returns

An event may only be generated when both months come from `data/<category>/observations/`, for the
same `provider_slug` **and the same `plan_id`**, with the source URL and archive URL of both
observations carried in the event itself. Until that is built, there is no event feed.
