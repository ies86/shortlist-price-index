# Changelog

All notable changes to the Shortlist Price Index dataset. Snapshots are taken monthly; each entry lists the snapshot date and what changed.

## 2026-08-02 (later the same day): price changes are stated in the vendor's own currency

- **16 of the 19 published price-change events have been WITHDRAWN.** They were not price changes.
  Whether a price had changed was decided on the USD figure, and 40 percent of the amounts in this
  index are not quoted in USD, so that figure moved with the exchange rate every month. The withdrawn
  events reported "changes" of 0.1 to 0.9 percent for vendors whose own price card was untouched:
  pCloud, Dropbox, iCloud, MEGA and Tresorit (cloud backup), DreamHost and SiteGround (web hosting),
  Sitebulb, SE Ranking, Surfer, Peec AI and Ahrefs (SEO tools), CyberGhost, NordVPN, Mozilla VPN and
  Mullvad (VPN). **Any of those figures published or quoted before this date should not be cited.**
- They are not deleted. Each sits in an `ingetrokken` list in its category's `change-events.json`
  with the reason and the amount that did not move, so the record of what was published and taken
  back stays intact.
- **The three real events have been recomputed in the vendor's own currency** and were each
  overstated by roughly half a percentage point: Screaming Frog 5.7 to 5.03 percent, Surfshark 9.2 to
  8.73, ExpressVPN 33.9 to 33.44. The citation lines changed with them. Screaming Frog's used to read
  "$18.93 to $20 per month"; the vendor charges €199 and €209 per year, and that is what it now says.
- New fields in the event files: `currency`, `old_own`, `new_own`, `delta_pct_own` and
  `delta_pct_usd`. `data/wire-events.json` also carries `lijstprijs` (the amount and term as the
  vendor lists them) and `fx_naar_usd` (the rate used per month), so the USD figures can be checked
  rather than trusted.
- **The `reason` column of every observation now records the basis of the comparison**, for example
  `vergeleken in EUR: 87.2 -> 87.2 per maand; de dollarwaarde ging wel 99.56 -> 100.15 en dat is
  wisselkoers, geen prijs`. Where the vendor's own currency could not be established for both months,
  the row says so and falls back to USD, rather than leaving that difference invisible.
- **Peec AI is withdrawn from `data/seo/history-archive.csv`** for the same root cause. The
  calibration gate compared the archived amount in the page's currency against a measurement in USD:
  EUR 89 against USD 80.40 looked like 11 percent, while EUR 89 against a measured EUR 70 is 27
  percent, outside the tolerance. Its three rows stay in the file with `withdrawn` in the new `status`
  column and the reason, so the contradiction they document remains visible. Archive coverage for SEO
  tools is therefore 3 of 15 vendors, 20 percent, not 4 of 15.
- **Enforcement.** A gate (`geld-poort`) recomputes every published percentage from the raw
  observations in the vendor's own currency, recomputes the archive calibration, and refuses any
  comparison where the currency, the period or the exchange-rate date is not established: the answer
  is then "undetermined" rather than a number. It runs before publication and weekly. Exchange rates
  come from the European Central Bank and are stored per date, because converting a 2019 euro price
  at a 2026 rate is a second error on top of the first.

## 2026-08-02: web hosting, August aggregate withheld

- One of the thirteen readings that month was not a plan price: Hetzner returned €1.09, which its
  page describes as the charge per GB per month for storage above the plan allowance. Same class of
  error as the three cloud backup readings withdrawn on 1 August; the rule that catches it had never
  been re-applied to this category. Removing it left coverage below the floor required to publish a
  citable average, so the August aggregate is withheld. The raw observations, including the rejected
  row and its reason, remain published. July is unaffected.

## 2026-08-02: archive-based price history for SEO tools, published as a separate series

- **New file: `data/seo/history-archive.csv`.** Thirteen rows covering the calendar years 2019 to
  2026 for four SEO vendors (Frase, Peec AI, Semrush, Serpstat), reconstructed from the Internet
  Archive. Every row carries a public `web.archive.org` link to a snapshot it rests on, so any figure
  in it can be re-checked by anyone without our cooperation.
- **It is a separate series and must not be merged with `monthly-index.csv`.** Different method,
  different reliability. The monthly index reads live vendor pages with a versioned scraper; this
  file reads whatever the archive happened to save. A difference between the two is not a price
  movement.
- **Coverage is 4 of the 15 tracked SEO vendors, which is 27 percent**, and the README states that as
  a number rather than as an impression. The other eleven were dropped by a calibration gate: the
  harvester is asked to reproduce each vendor's known current price from that vendor's most recent
  readable archived snapshot, within 25 percent, and a vendor whose own current price it cannot
  reproduce does not get to supply its historical prices. The whole vendor is dropped, not just the
  failing snapshot. Re-checked on 2 August 2026 the eleven split into six that read a wrong amount,
  three where no snapshot yielded any amount, two whose own current measurement is under review, and
  one with no archived snapshots at all.
- **Two contradictory rows are published on purpose and flagged, not removed.** For 2025 Peec AI
  appears both at USD 29 and at EUR 89, and no exchange rate reconciles those, so both rows carry a
  `TEGENSPRAAK` (contradiction) label in `confidence` instead of one being quietly chosen.
- Two measured limits of the calibration gate are documented in the README as well: the comparison is
  made in the archived page's own currency against a current measurement in USD, which is how Peec AI
  passed at a nominal 11 percent where the converted gap is 27 percent; and which snapshot counts as
  the most recent readable one varies by the day, which puts Frase at the edge of the tolerance on a
  re-check even though the snapshot it was calibrated on matches the measured price exactly.

## 2026-08-01 (later the same day): event feed REBUILT on measurement, plus two README corrections

- **The event feed is back, rebuilt on the basis promised in the withdrawal note above.** An event
  is now generated only from `data/<category>/observations/`, and only when all of the following
  hold: both months are measured for that category, the months are consecutive, the record is for
  the *same* `provider_slug` **and** `plan_id`, and both observations have an `observed_*` status.
  A basket change can therefore no longer become an event, because a different plan simply does not
  join. Each event carries both run IDs and the vendor source URL.
- **Currency gate added.** A vendor that prices in euros and left its euro figure untouched has not
  changed its price, even though the USD value moves with the exchange rate. Events are now dropped
  when the amount in the original currency is unchanged. This removed two of five candidates for
  August: SE Ranking (EUR 87.20 in both months) and Surfer (EUR 120.00 in both months), where the
  only thing that moved was the rate, from 1.1418 to 1.1485.
- Three events survived for August 2026, each verifiable on the vendor's own pricing page for the
  same plan: Screaming Frog SEO Spider (EUR 199 to EUR 209 per year), Surfshark Starter (EUR 2.29 to
  EUR 2.49 per month) and ExpressVPN Advanced (EUR 2.99 to EUR 3.99 per month).
- **README correction 1.** The README described web hosting, VPN services and cloud backup as the
  measured categories. Seven categories are measured and pass the validation gate: those three plus
  SEO tools, newsletter tools, password managers and website builders. Three further categories
  (antivirus software, learning platforms, travel eSIMs) are measured but have their aggregate
  withheld because too few providers were verified. A status table has been added, and
  `scripts/price-index-statuscheck.mjs` now fails if that table drifts from the validation files.
- **README correction 2.** The README stated that measured categories use an extended, more
  transparent schema in `monthly-index.csv` (`n_observed`, `n_missing`, `n_under_review` and
  renewal columns). No category used that schema; the column headers were and are the simple set.
  The claim has been removed, and the differing meaning of `providers_tracked` between curated and
  measured months is now documented explicitly, because that column silently changes definition.
- **Antivirus comparability note.** Until 21 July 2026 this category tracked each vendor's premium
  suite; it was then corrected to the entry-level plan to match the measurand (lowest paid
  individual plan). July and August therefore describe different products and must not be compared.
  Comparable antivirus series begin with the September 2026 run.

## 2026-08-01: price-change event feed WITHDRAWN

- **`data/wire-events.json` and `data/change-ledger.json` have been emptied and are withdrawn.**
  Any price-change figure published in those two files before this date should not be cited.
  Full explanation in `data/WITHDRAWN-price-change-events.md`.
- Reason: the generator did not measure vendors. It compared this project's own published index
  between two months, read from our own site endpoints, so a correction to our own data was
  recorded and quoted as a price change by the vendor. For the same plan in the same two months,
  the independent measurements are flat where the feed claimed moves of -73% (Ahrefs), +98.5%
  (SE Ranking), +50% (WP Engine) and -45.6% (Hetzner).
- A second defect compounded it: in six of the ten categories the comparison month had never been
  measured, so the delta compared a hand-compiled estimate against a measured value. That is a
  change of method, not of price.
- **The monthly snapshots are unaffected and remain valid.** `monthly-index.csv`,
  `price-index-current.json` and `providers-current.csv` are unchanged. They are documented as
  compiled from public vendor pricing pages, with four categories additionally verified by direct
  measurement; this withdrawal concerns only the derived claim that a vendor *changed* its price.
- The feed returns only when an event is generated from `data/<category>/observations/` for the
  same `provider_slug` and the same `plan_id` in both months, carrying both source URLs.

## 2026-08 (snapshot taken 2026-08-01)

- Monthly snapshot for all categories. Ten categories were measured directly this month
  (median of three runs per vendor): hosting, VPN, backup, SEO, password managers, website
  builders, newsletter tools, eSIM, learning platforms and antivirus. Six of those are measured
  here for the first time, so they have no comparable prior month.
- Out-of-band and disputed readings were held back by the validation gate rather than published
  (for example Mangools $519.58 and Keeper $0.36, both flagged and excluded).

## 2026-07-08 (later the same day): recruitment software + Dutch mirror

- Added an eleventh category: **recruitment software (ATS)**, maintained directly in this repository. July 2026 baseline: $109.54 average / $87 median / $15 cheapest entry price across 8 vendors with public USD pricing (Manatal, Jobsoid, JazzHR, Crelate, CATS, VivaHR, Breezy HR, Workable). Extra columns record pricing basis (flat vs per user) and billing (monthly vs annual). Vendors without public USD pricing are excluded by methodology.
- Added a **Dutch mirror** (`data-nl/`, EUR): VPN-diensten (15), webhosting (13), leerplatformen (11), wachtwoordmanagers (9) and nieuwsbrieftools (10), sourced from the Dutch Kies sites, history back to June 2026.

## 2026-07-08: dataset expanded from four to ten categories

- Added six categories, each with full history back to June 2026: antivirus software, newsletter tools, password managers, VPN services, learning platforms and travel eSIMs.
- Baseline entry prices for the new categories (average / median / cheapest, USD per month, July 2026):
  - Antivirus software: $4.44 / $4.17 / $2.42 (18 providers)
  - Newsletter tools: $17.41 / $15.00 / $9.00 (11 providers)
  - Password managers: $2.58 / $1.99 / $0.83 (9 providers)
  - VPN services: $3.55 / $2.99 / $1.99 (15 providers)
  - Learning platforms: $38.22 / $19.00 / $7.99 (11 providers)
  - Travel eSIMs (USD per GB, 5 GB reference plan): $3.83 / $3.80 / $1.80 (11 providers)
- The travel eSIM category uses price per gigabyte instead of a monthly plan price; its `monthly-index.csv` carries per-GB columns.
- Total: 138 providers tracked across ten categories.
- Current payloads (`price-index-current.json`) now mirror the live endpoints directly, so their `updated` field reflects the latest live verification date.

## 2026-07 (snapshot taken 2026-07-02)

- Added the July 2026 snapshot for all four categories: cloud backup, web hosting, SEO tools and website builders.
- 63 providers tracked in total: 17 cloud backup, 13 web hosting, 15 SEO tools, 18 website builders.
- No entry-price changes versus June 2026: average, median and cheapest entry price unchanged in all four categories (backup avg $8.25, hosting avg $7.19, SEO tools avg $65.69, website builders avg $13.13).

## 2026-06 (snapshot taken 2026-06-16)

- First public snapshot and start of the index.
- Baseline entry prices per category (average / median / cheapest, USD per month):
  - Cloud backup: $8.25 / $8.99 / $4.17 (17 providers)
  - Web hosting: $7.19 / $2.99 / $1.00 (13 providers)
  - SEO tools: $65.69 / $52.00 / $2.25 (15 providers)
  - Website builders: $13.13 / $12.40 / $1.58 (18 providers)
- Repository structure established: per category a `monthly-index.csv`, `providers-current.csv` and `price-index-current.json`, published under CC BY 4.0.
