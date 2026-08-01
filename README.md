# Shortlist Price Index (open data)

Curated entry prices for software and services in eleven categories: cloud backup, web hosting, SEO tools, website builders, antivirus software, newsletter tools, password managers, VPN services, learning platforms, travel eSIMs and recruitment software. A Dutch mirror covers five categories in EUR. Published as open data by [Orai Media](https://www.linkedin.com/company/orai-media), the independent publisher behind the Shortlist comparison guides.

The index answers one simple question per category: what does the cheapest paid plan of each provider cost? It was first compiled in June 2026. An automated measurement pipeline (which reads each vendor's live pricing page and keeps an archived copy of the source) is being rolled out category by category; until a category is explicitly marked as measured, treat its figures as curated guide prices, not automated observations. The travel eSIM category uses price per gigabyte instead of a monthly plan price, because that is how eSIM data plans are actually compared.

## Which categories are measured (status on 1 August 2026)

A category is listed as measured only when its monthly run passed the validation gate for that month (enough providers actually observed to publish a citable aggregate). The gate is recorded per month in `data/<category>/observations/<month>.validation.json`, so this table can be checked against the data rather than taken on trust.

| Category | Measured months | Status |
|---|---|---|
| Web hosting | 2026-07, 2026-08 | measured |
| VPN services | 2026-07, 2026-08 | measured |
| Cloud backup | 2026-07, 2026-08 | measured |
| SEO tools | 2026-07, 2026-08 | measured |
| Newsletter tools | 2026-08 | measured |
| Password managers | 2026-08 | measured |
| Website builders | 2026-08 | measured |
| Antivirus software | 2026-07, 2026-08 | measured, **aggregate withheld** (too few providers verified; see note below) |
| Learning platforms | 2026-08 | measured, **aggregate withheld** (too few providers verified) |
| Travel eSIMs | 2026-08 | measured, **aggregate withheld** (too few providers verified) |
| Recruitment software | none | curated guide prices |

For a measured category, `monthly-index.csv` reports how many providers were actually observed versus missing that month, so the coverage is transparent. Where the aggregate is withheld, the raw observations are still published: they are the honest record of what could and could not be read, and withholding the average is the point of the gate rather than a gap in the data.

**Archived copies are partial, and the `archive_url` column says which.** The pipeline submits each vendor pricing page to the Wayback Machine so a reader can check the figure against the page as it stood on the measurement date. Not every vendor allows this: some block the archiving crawler outright, and the archive itself rate-limits. For August 2026 the coverage is 39 of 71 published observations. It is lowest for VPN services (2 of 10), where most vendors refuse the crawler. An observation without an `archive_url` is still a real measurement, with its `source_url` and timestamp recorded, but it cannot be independently re-checked once the vendor changes the page. Price-change events in `data/wire-events.json` carry an explicit flag for this.

**Note on antivirus software.** The set of plans tracked in this category changed between the July and August runs. Until 21 July the list pointed at each vendor's premium suite (for example Bitdefender Total Security, Norton 360 Deluxe, Kaspersky Premium); it was then corrected to the entry-level plan, because the measurand for this index is the lowest paid individual plan. The correction was necessary, but it means the July and August observations for this category describe different products and must not be compared with each other as a price movement. Comparable series for antivirus start with the September 2026 run.

## What is in this repository

| Category | Providers tracked | Unit | Files |
|---|---|---|---|
| Cloud backup | 17 | USD/month | [`data/backup/`](data/backup/) |
| Web hosting | 13 | USD/month | [`data/hosting/`](data/hosting/) |
| SEO tools | 15 | USD/month | [`data/seo/`](data/seo/) |
| Website builders | 18 | USD/month | [`data/website-builders/`](data/website-builders/) |
| Antivirus software | 18 | USD/month | [`data/antivirus/`](data/antivirus/) |
| Newsletter tools | 11 | USD/month | [`data/newsletter-tools/`](data/newsletter-tools/) |
| Password managers | 9 | USD/month | [`data/password-managers/`](data/password-managers/) |
| VPN services | 15 | USD/month | [`data/vpn/`](data/vpn/) |
| Learning platforms | 11 | USD/month | [`data/learning-platforms/`](data/learning-platforms/) |
| Travel eSIMs | 11 | USD/GB | [`data/esim/`](data/esim/) |
| Recruitment software (ATS) | 8 | USD/month | [`data/recruitment-software/`](data/recruitment-software/) |

### Dutch mirror (EUR)

Five categories are also tracked for the Dutch market, in euros, sourced from the Dutch Kies comparison sites:

| Category | Providers tracked | Unit | Files |
|---|---|---|---|
| VPN-diensten | 15 | EUR/maand | [`data-nl/vpn/`](data-nl/vpn/) |
| Webhosting | 13 | EUR/maand | [`data-nl/hosting/`](data-nl/hosting/) |
| Leerplatformen | 11 | EUR/maand | [`data-nl/leerplatformen/`](data-nl/leerplatformen/) |
| Wachtwoordmanagers | 9 | EUR/maand | [`data-nl/wachtwoordmanagers/`](data-nl/wachtwoordmanagers/) |
| Nieuwsbrieftools | 10 | EUR/maand | [`data-nl/nieuwsbrieftools/`](data-nl/nieuwsbrieftools/) |

Each category folder contains:

- `monthly-index.csv`: one row per monthly snapshot with the average, median and cheapest entry price and the number of providers tracked.
- `providers-current.csv`: the current entry price per provider, with a source URL per provider (eSIM: reference plan price and price per GB). Note: the `source_url` currently links to our own comparison page for that provider; a migration to link the provider's own pricing page (with an archived copy) is part of the automated measurement rollout.
- `price-index-current.json`: the full current payload as published live by the source site, including methodology and per-provider detail.

### Columns in `monthly-index.csv`

| Column | Meaning |
|---|---|
| `site` | Source site of the data |
| `niche` | Category slug |
| `month` | Snapshot month (YYYY-MM) |
| `snapshot_date` | Exact date the snapshot was taken |
| `average_price_usd` | Average entry price across all tracked providers, USD per month |
| `median_price_usd` | Median entry price, USD per month |
| `cheapest_price_usd` | Cheapest entry price in the category, USD per month |
| `providers_tracked` | Number of providers in the index that month |

**Important caveat on `providers_tracked` (corrected 1 August 2026).** This column does not mean the same thing in every row. For a curated month it is the number of providers in the index. For a measured month it is the number of providers whose price was actually *observed* that month, which is lower, because providers that could not be read are reported as gaps rather than guessed. Web hosting, for example, shows 13 for June (curated), then 10 and 9 for July and August (observed). A drop in this column is therefore not evidence that a category shrank, and the difference between two months' averages is not a price movement unless both months are measured and cover the same set of plans.

An extended per-month schema (`n_observed`, `n_missing`, `n_under_review`, renewal columns and a comparability flag) is designed and is what the per-month `observations/<month>.validation.json` files already record; it has not yet been written into `monthly-index.csv` for any category. Until it is, use the validation files for coverage detail. An earlier version of this README stated that web hosting already used that extended schema in `monthly-index.csv`. That was not the case for any category, and the sentence has been removed.

The travel eSIM category replaces the three price columns with `average_price_per_gb_usd`, `median_price_per_gb_usd` and `cheapest_price_per_gb_usd`: the price of each provider's 5 GB / 30-day reference plan divided by 5. Unlimited plans are excluded. Dutch mirror categories use `_eur` columns. The recruitment software category adds `pricing_basis` (flat or per_user) and `billing` (monthly or annual) columns to `providers-current.csv`.

## Spotlight: recruitment software entry prices span a factor of 20

The July 2026 baseline for recruitment software (applicant tracking systems) shows the widest entry-price spread of any category in this index: getting started costs anywhere from $15 per user per month (Manatal) to $299 per month (Workable), a 20x difference for the same starting point of "one recruiter, first paid plan". The category average is $109.54, the median $87. Half the tracked vendors price per user, half per account, which is exactly why entry-level comparisons are rarely published; this index records both the price and the pricing basis. Vendors that only quote custom or region-localized prices (Greenhouse, Lever, SmartRecruiters, Teamtailor, Zoho Recruit, Recruitee and others) are excluded by methodology, so the real market spread is wider still. This category is maintained directly in this repository and compiled from the providers' public pricing pages at the dates shown.

## Methodology

Lowest paid monthly price per provider. Free tiers are excluded. Prices are guide prices in USD per month, hand-curated from each provider's public pricing page at compile time. An automated monthly measurement pipeline, which reads each vendor's live pricing page and archives the source, is being introduced category by category; see the per-category status. For travel eSIMs: USD per GB based on each provider's 5 GB / 30-day reference plan, unlimited plans excluded. Full methodology per category:

- Cloud backup: https://backupshortlist.com/methodology
- Web hosting: https://hostingshortlist.com/methodology
- SEO tools: https://seoshortlist.com/methodology
- Website builders: https://websiteshortlist.com/methodology
- Antivirus software: https://antivirusshortlist.com/methodology
- Newsletter tools: https://mailshortlist.com/methodology
- Password managers: https://passwordshortlist.com/methodology
- VPN services: https://vpnshortlist.com/methodology
- Learning platforms: https://courseshortlist.com/methodology
- Travel eSIMs: https://esimshortlist.com/methodology
- Recruitment software: maintained in this repository, see the methodology field in [`data/recruitment-software/price-index-current.json`](data/recruitment-software/price-index-current.json)
- Dutch mirror (EUR): kiesvpn.nl, kieshosting.nl, leerplatformkiezer.nl, wachtwoordkiezer.nl and nieuwsbriefkiezer.nl, each at `/methodology`

## Live data sources

Each dataset mirrors the machine readable Price Index that the source site publishes. Figures are updated when the catalogue is revised; a fixed monthly measurement cadence applies only once a category's automated pipeline is live.

- https://backupshortlist.com/data/price-index.json
- https://hostingshortlist.com/data/price-index.json
- https://seoshortlist.com/data/price-index.json
- https://websiteshortlist.com/data/price-index.json
- https://antivirusshortlist.com/data/price-index.json
- https://mailshortlist.com/data/price-index.json
- https://passwordshortlist.com/data/price-index.json
- https://vpnshortlist.com/data/price-index.json
- https://courseshortlist.com/data/price-index.json
- https://esimshortlist.com/data/esim-price-index.json
- https://kiesvpn.nl/data/price-index.json (EUR)
- https://kieshosting.nl/data/price-index.json (EUR)
- https://leerplatformkiezer.nl/data/price-index.json (EUR)
- https://wachtwoordkiezer.nl/data/price-index.json (EUR)
- https://nieuwsbriefkiezer.nl/data/price-index.json (EUR)

Recruitment software has no external live endpoint; [`data/recruitment-software/price-index-current.json`](data/recruitment-software/price-index-current.json) in this repository is the canonical source.

## For AI agents (MCP)

This index is also available as an MCP server, so AI agents can query current prices directly (tools: `list_categories`, `get_price_index`, `get_cheapest`):

- Endpoint: `https://shortlist-mcp.vercel.app/mcp` (streamable HTTP, no auth)
- Server code and setup instructions: https://github.com/ies86/shortlist-mcp

## License

[Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE). You are free to share and adapt this data, including commercially, under one condition: give credit to the source site and link to it.

## Cite this data

When you reuse a figure, please attribute the source site of that category and link to it, for example:

> Source: [BackupShortlist Price Index](https://backupshortlist.com/data/price-index), July 2026, CC BY 4.0.

Attribution per category:

- Cloud backup figures: "BackupShortlist Price Index" with a link to https://backupshortlist.com/data/price-index
- Web hosting figures: "HostingShortlist Price Index" with a link to https://hostingshortlist.com/data/price-index
- SEO tool figures: "SEOShortlist Price Index" with a link to https://seoshortlist.com/data/price-index
- Website builder figures: "WebsiteShortlist Price Index" with a link to https://websiteshortlist.com/data/price-index
- Antivirus figures: "AntivirusShortlist Price Index" with a link to https://antivirusshortlist.com/data/price-index
- Newsletter tool figures: "MailShortlist Price Index" with a link to https://mailshortlist.com/data/price-index
- Password manager figures: "PasswordShortlist Price Index" with a link to https://passwordshortlist.com/data/price-index
- VPN figures: "VPNShortlist Price Index" with a link to https://vpnshortlist.com/data/price-index
- Learning platform figures: "CourseShortlist Price Index" with a link to https://courseshortlist.com/data/price-index
- Travel eSIM figures: "eSIMShortlist Price Index" with a link to https://esimshortlist.com/data/esim-price-index
- Recruitment software figures: "Shortlist Price Index, Orai Media" with a link to https://github.com/ies86/shortlist-price-index
- Dutch (EUR) figures: the Kies site of that category (e.g. "KiesVPN Prijsindex" with a link to https://kiesvpn.nl/data/price-index)

Questions or corrections: open an issue in this repository.
