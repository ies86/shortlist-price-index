# Changelog

All notable changes to the Shortlist Price Index dataset. Snapshots are taken monthly; each entry lists the snapshot date and what changed.

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
