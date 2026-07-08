# Shortlist Price Index (open data)

Monthly tracked entry prices for software and services in ten categories: cloud backup, web hosting, SEO tools, website builders, antivirus software, newsletter tools, password managers, VPN services, learning platforms and travel eSIMs. Published as open data by [Orai Media](https://www.linkedin.com/company/orai-media), the independent publisher behind the Shortlist comparison guides.

The index answers one simple question per category, every month: what does the cheapest paid plan of each provider cost right now? That makes it a longitudinal record of software entry pricing, starting June 2026 and updated monthly. The travel eSIM category uses price per gigabyte instead of a monthly plan price, because that is how eSIM data plans are actually compared.

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

Each category folder contains:

- `monthly-index.csv`: one row per monthly snapshot with the average, median and cheapest entry price and the number of providers tracked.
- `providers-current.csv`: the current entry price per provider, with a source URL per provider (eSIM: reference plan price and price per GB).
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

The travel eSIM category replaces the three price columns with `average_price_per_gb_usd`, `median_price_per_gb_usd` and `cheapest_price_per_gb_usd`: the price of each provider's 5 GB / 30-day reference plan divided by 5. Unlimited plans are excluded.

## Methodology

Lowest paid monthly price per provider. Free tiers are excluded. Prices are guide prices in USD per month, verified and updated monthly. For travel eSIMs: USD per GB based on each provider's 5 GB / 30-day reference plan, unlimited plans excluded. Full methodology per category:

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

## Live data sources

Each dataset mirrors the machine readable Price Index that the source site publishes and refreshes monthly:

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

Questions or corrections: open an issue in this repository.
