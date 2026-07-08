# Changelog

All notable changes to the Shortlist Price Index dataset. Snapshots are taken monthly; each entry lists the snapshot date and what changed.

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
