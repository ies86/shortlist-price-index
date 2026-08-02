# Shortlist Price Index (open data)

Curated entry prices for software and services in eleven categories: cloud backup, web hosting, SEO tools, website builders, antivirus software, newsletter tools, password managers, VPN services, learning platforms, travel eSIMs and recruitment software. A Dutch mirror covers five categories in EUR. Published as open data by [Orai Media](https://www.linkedin.com/company/orai-media), the independent publisher behind the Shortlist comparison guides.

The index answers one simple question per category: what does the cheapest paid plan of each provider cost? It was first compiled in June 2026. An automated measurement pipeline (which reads each vendor's live pricing page and keeps an archived copy of the source) is being rolled out category by category; until a category is explicitly marked as measured, treat its figures as curated guide prices, not automated observations. The travel eSIM category uses price per gigabyte instead of a monthly plan price, because that is how eSIM data plans are actually compared.

## Which categories are measured (status on 1 August 2026)

A category is listed as measured only when its monthly run passed the validation gate for that month (enough providers actually observed to publish a citable aggregate). The gate is recorded per month in `data/<category>/observations/<month>.validation.json`, so this table can be checked against the data rather than taken on trust.

| Category | Measured months | Status |
|---|---|---|
| Web hosting | 2026-07, 2026-08 | measured |
| VPN services | 2026-07, 2026-08 | measured |
| Cloud backup | 2026-07, 2026-08 | measured; **August aggregate withheld** (three readings rejected on review, see note below) |
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

**Note on cloud backup, August 2026.** Three of the thirteen readings that month were rejected on review because the amount did not come from a subscription price at all: pCloud returned a one-off lifetime payment, MEGA an excess-storage charge per TB, and Filen a fragment of page furniture rather than a price. Removing them left coverage below the floor required to publish a citable average, so the August aggregate is withheld. The raw observations, including the rejected rows and the reason for each, remain published. July is unaffected.

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

`data/seo/` holds one file more: `history-archive.csv`, a separate archive-based series that is not part of the monthly index. See the section on it below before using it.

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

**Three columns were added on 1 August 2026: `basis`, `n_missing` and `n_under_review`.**

`basis` is `curated` or `measured` and it is the most important column in the file. Every category's first row (June 2026) is a hand-compiled baseline; later rows for measured categories come from the automated pipeline. Those two are not comparable, and until now nothing in the file said so. **Do not read a difference between a `curated` row and a `measured` row as a price movement.** It is a change of method.

`basis` also disambiguates `providers_tracked`, which does not mean the same thing in every row. For a `curated` month it is the number of providers in the index. For a `measured` month it is the number whose price was actually observed, which is lower, because providers that could not be read are reported as gaps rather than guessed. Web hosting shows 13 for June (curated), then 10 and 9 for July and August (measured). A drop in that column is therefore not evidence that a category shrank.

`n_missing` and `n_under_review` are filled for measured rows only: how many providers could not be read that month, and how many were held back for a manual check. The averages are computed over the observed set alone.

The figures in a `measured` row come from `observations/`, not from the comparison site: this was verified on 1 August 2026 by recomputing all ten published measured rows from the raw observations, and every one matched. An earlier version of this README described an extended column set (`n_observed`, renewal columns) that no category actually used; that claim has been removed and replaced by the three columns above, which are really there.

The travel eSIM category replaces the three price columns with `average_price_per_gb_usd`, `median_price_per_gb_usd` and `cheapest_price_per_gb_usd`: the price of each provider's 5 GB / 30-day reference plan divided by 5. Unlimited plans are excluded. Dutch mirror categories use `_eur` columns. The recruitment software category adds `pricing_basis` (flat or per_user) and `billing` (monthly or annual) columns to `providers-current.csv`.

## A separate archive-based price history (SEO tools only)

`data/seo/history-archive.csv` holds a second, older price series for SEO tools, reconstructed from
the Internet Archive. It is **a separate series and it must never be merged with the monthly
index.**

The monthly index reads each vendor's own live pricing page on a fixed date with a versioned
scraper and records what could and could not be read. This file reads pages that the Wayback
Machine happened to save, years after the fact, with a reader that has no vendor-specific
configuration to fall back on. Different method, different reliability. A figure from this file and
a figure from `monthly-index.csv` are not two points on one line: do not compute a change between
them, do not append these rows to that file, and do not average them together. The monthly series
for SEO tools starts in June 2026; this one covers the calendar years 2019 to 2026, in 13 rows, for
four vendors.

### Where the values come from, and how to check them

Every value here comes from the Internet Archive. For each vendor the archived snapshots from 2019
onward are listed through the Wayback CDX API and spread evenly over the whole period, then fetched
with the `id_` form of the archive URL so the reader sees the page's original bytes rather than the
archive's own rendering of it. Readings are aggregated per calendar year with a median, because a
single snapshot captures whatever promotion happened to run on the day the crawler visited.

Every row carries an `archive_example` URL. It is an ordinary `web.archive.org` link, and opening it
shows the vendor's pricing page as it stood on that date. That is why this file is worth publishing
at all: unlike a live measurement, which is gone the moment the vendor edits the page, every figure
here can be re-checked by anyone at any time, without our cooperation. All 13 rows carry such a
link.

Amounts are stated in the currency the archived page showed, in the `currency` column, and are not
converted. The archive stores whatever the crawler was served, which for some vendors was a
localized page, so a change of currency between rows is not by itself a price change.

### Coverage: 4 of 15 vendors, 27 percent

This index tracks 15 SEO vendors. **Four of them appear in this file** (Frase, Peec AI, Semrush and
Serpstat), so the archive series covers 4 of 15, which is 27 percent. It is not a picture of the SEO
tool market and must not be read as one.

The other eleven were dropped by a calibration gate, and the reasoning behind that gate is the most
important thing on this page. We already measure every month what each of these vendors charges
today. So the harvester is pointed at the most recent archived snapshot it can read for that vendor
and asked to reproduce that known current price, within 25 percent. Where it cannot, it is reading
that vendor's pages wrongly, and there is then no reason to trust its readings from 2019 either.

**A vendor whose own current price the harvester cannot reproduce does not get to supply its
historical prices.** The whole vendor is dropped, not just the snapshot that failed.

Re-checked on 2 August 2026, the eleven absent vendors break down as follows.

| Why the vendor is absent | Count |
|---|---|
| The harvester read an amount, but not the current one, so its readings of that vendor are not trusted | 6 |
| No archived snapshot yielded any amount at all, out of 40 tried per vendor | 3 |
| Our own current measurement for that vendor is itself under review, so there is nothing to calibrate against | 2 |
| The vendor's pricing page has no archived snapshots at all | 1 |

That gate is not a formality; it is the difference between a usable file and a harmful one. Without
it the harvester produced $16.50 for Ahrefs in 2019 and $0.01 in 2026, where the real figures were
roughly $99 and $31. Numbers like that sit comfortably inside any plausible price range for the
category, which is exactly what makes them dangerous. A price history full of credible wrong numbers
is worse than no price history at all. The usual cause is mundane: JavaScript builds the pricing
table, and the archive saved the page before it was filled in, so the stored HTML holds no price.

### What the `confidence` column means

The `confidence` column is written by the harvester and its values are in Dutch. It says how a row
was aggregated, and whether the row may be used in a series at all.

| Value | Meaning |
|---|---|
| `mediaan van 3+` | Median over three or more archived snapshots in that year. The strongest rows in this file. |
| `mediaan van 2` | Median over two snapshots, so the midpoint of two readings. |
| `enkele opname` | A single snapshot. One reading is an observation, not a median: it carries whatever promotion ran on that one day. |
| `TEGENSPRAAK: ...` | Contradiction. Another row exists for the same vendor and the same year in a different currency, so the two cannot both be the entry price. **Not to be used as a series.** |

`n_snapshots` gives the number of readings behind the median and `spread` the difference between the
highest and the lowest of them, so the weight of a row can be judged from the data and not from the
label alone.

**Two rows are marked `TEGENSPRAAK`, and they stay published.** For 2025, Peec AI appears twice: once
at USD 29 over two snapshots, and once at EUR 89 over three. No 2025 exchange rate turns EUR 89 into
USD 29, so these are not the same price in two currencies. One of the two is wrong and the archive
alone cannot say which. Both rows are therefore kept and both are flagged, rather than quietly
picking the one that draws a nicer line. Anyone building a series from this file should skip every
row whose `confidence` begins with `TEGENSPRAAK`.

### Two limits of the calibration gate, measured

Both were found by re-running the gate on 2 August 2026 and are stated here because they affect how
much weight the four surviving vendors carry.

- **The comparison is not currency-safe.** The gate compares the archived amount in its original
  currency against the current measurement expressed in USD. Peec AI passed on that basis, at EUR 89
  against USD 80.40, a gap of 11 percent. Converted at the same rate the index itself uses, EUR 89 is
  about USD 102, a gap of 27 percent, which is outside the tolerance. Peec AI's rows should be read
  with that in mind.
- **Which snapshot counts as "the most recent readable one" varies by the day.** The gate calibrated
  Frase on a snapshot from 3 February 2026 that reads $39, exactly the measured current price. A
  re-check on 2 August 2026 reached a newer snapshot showing $49, the month-to-month price of the
  same plan, which is 26 percent away and would have failed. The published rows are unaffected, but
  the gate's verdict is not perfectly reproducible for a vendor that prices two ways on one page.

### Columns in `history-archive.csv`

| Column | Meaning |
|---|---|
| `provider_slug` | Vendor, using the same slug as everywhere else in this repository |
| `plan_id` | Plan the price refers to, the same identifier as in the monthly index |
| `quarter` | Period of the row. Aggregation is annual by default, so this holds a year (`2019`) rather than a quarter, despite the column name |
| `currency` | Currency as shown on the archived page. Not converted |
| `median_amount` | Median of the readings for that vendor, plan, year and currency |
| `n_snapshots` | Number of archived snapshots behind that median |
| `spread` | Difference between the highest and the lowest reading in that group |
| `confidence` | How the row was aggregated, and whether it may be used in a series. See above |
| `archive_example` | Public `web.archive.org` link to one of the snapshots the row rests on |

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
