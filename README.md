# Shortlist Price Index (open data)

Monthly tracked entry prices for software and services in four categories: cloud backup, web hosting, SEO tools and website builders. Published as open data by [Orai Media](https://www.linkedin.com/company/orai-media), the independent publisher behind the Shortlist comparison guides.

The index answers one simple question per category, every month: what does the cheapest paid plan of each provider cost right now? That makes it a longitudinal record of software entry pricing, starting June 2026 and updated monthly.

## What is in this repository

| Category | Providers tracked | Files |
|---|---|---|
| Cloud backup | 17 | [`data/backup/`](data/backup/) |
| Web hosting | 13 | [`data/hosting/`](data/hosting/) |
| SEO tools | 15 | [`data/seo/`](data/seo/) |
| Website builders | 18 | [`data/website-builders/`](data/website-builders/) |

Each category folder contains:

- `monthly-index.csv`: one row per monthly snapshot with the average, median and cheapest entry price and the number of providers tracked.
- `providers-current.csv`: the current entry price per provider, with a source URL per provider.
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

## Methodology

Lowest paid monthly price per provider. Free tiers are excluded. Prices are guide prices in USD per month, verified and updated monthly. Full methodology per category:

- Cloud backup: https://backupshortlist.com/methodology
- Web hosting: https://hostingshortlist.com/methodology
- SEO tools: https://seoshortlist.com/methodology
- Website builders: https://websiteshortlist.com/methodology

## Live data sources

Each dataset mirrors the machine readable Price Index that the source site publishes and refreshes monthly:

- https://backupshortlist.com/data/price-index.json
- https://hostingshortlist.com/data/price-index.json
- https://seoshortlist.com/data/price-index.json
- https://websiteshortlist.com/data/price-index.json

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

Questions or corrections: open an issue in this repository.
