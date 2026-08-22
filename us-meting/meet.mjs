#!/usr/bin/env node
/**
 * meet.mjs - US-meting op een GitHub Actions-runner (gratis Amerikaans meetpunt).
 *
 * Waarom dit bestaat (22-8-2026): een deel van de aanbieders toont vanaf een Nederlands
 * IP alleen euro- of pondprijzen (DreamHost, SiteGround, Sitebulb, SE Ranking, Ahrefs,
 * Mangools, Surfer). De Amerikaanse prijs is bij zulke aanbieders een ANDER getal dan de
 * omgerekende Europese, dus omrekenen is verboden. GitHub-hosted runners staan in
 * Amerikaanse datacenters; dit script meet daar en legt het GEO-BEWIJS vast in de
 * uitvoer. De lokale pijplijn (scripts/prijsmeter/us-meting-ophalen.mjs in het
 * hoofdproject) weigert elke run waarvan het land niet US is.
 *
 * Leus van de hele pijplijn: liever een zichtbaar gat dan een geraden getal. Elk bedrag
 * draagt zijn letterlijke tekstsnipper; wat niet leesbaar is wordt een fout-record.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HIER = dirname(fileURLToPath(import.meta.url))
const cfg = JSON.parse(readFileSync(join(HIER, 'us-vendors.json'), 'utf8'))
const maand = new Date().toISOString().slice(0, 7)

const uit = { maand, gemeten_op: new Date().toISOString(), geo: null, gemeten: [], fouten: [] }

// ---- geo-bewijs: zonder US-bevestiging is de hele run onbruikbaar (en dat mag hij weten)
try {
  const g = await (await fetch('http://ip-api.com/json/?fields=status,country,countryCode,as')).json()
  uit.geo = { land: g.countryCode, as: g.as }
} catch (e) {
  uit.geo = { land: 'ONBEKEND', fout: String(e.message).slice(0, 120) }
}

function zichtbareTekst(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/\s+/g, ' ')
}

async function haalPagina(vendor) {
  if (!vendor.render) {
    const res = await fetch(vendor.url, { headers: { 'user-agent': 'Mozilla/5.0 (US price check; open dataset github.com/ies86/shortlist-price-index)' } })
    const html = await res.text()
    return { http: res.status, html, tekst: zichtbareTekst(html) }
  }
  const { chromium } = await import('playwright')
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    const antwoord = await page.goto(vendor.url, { waitUntil: 'networkidle', timeout: 60000 })
    const html = await page.content()
    const tekst = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '))
    return { http: antwoord?.status() ?? 0, html, tekst }
  } finally {
    await browser.close()
  }
}

/** Dominante valuta in een tekstregio; alleen USD is bruikbaar voor de sites. */
function valutaVan(regio) {
  const d = (regio.match(/\$/g) || []).length
  const e = (regio.match(/€/g) || []).length
  const p = (regio.match(/£/g) || []).length
  if (d > e && d > p) return 'USD'
  if (e >= d && e > p) return 'EUR'
  if (p > 0) return 'GBP'
  return 'ONBEKEND'
}

/**
 * Generieke extractie rond de plannaam: de regio na de plannaam, daaruit de eerste
 * dollarbedragen plus (indien aanwezig) het verlengbedrag na een renew-woord.
 * JSON-LD (offers.price) gaat voor als de pagina dat aanbiedt in dollars.
 */
function extraheer(vendor, html, tekst) {
  const record = { intro: null, renewal: null, valuta: null, methode: null, snippet: '' }

  const ld = [...html.matchAll(/"price"\s*:\s*"?([\d.]+)"?[\s\S]{0,120}?"priceCurrency"\s*:\s*"([A-Z]{3})"/g)]
    .concat([...html.matchAll(/"priceCurrency"\s*:\s*"([A-Z]{3})"[\s\S]{0,120}?"price"\s*:\s*"?([\d.]+)"?/g)]
      .map(m => [m[0], m[2], m[1]]))
  const ldUsd = ld.find(m => m[2] === 'USD')
  if (ldUsd) {
    record.intro = Number(ldUsd[1])
    record.valuta = 'USD'
    record.methode = 'json_ld'
    record.snippet = ldUsd[0].slice(0, 160)
  }

  // Het venster begint een stuk VOOR de plannaam: Screaming Frog zet het bedrag ervoor
  // ("€245 Per Year"), de meeste anderen erna. Gevonden in de rooktest van 22-8.
  const i = tekst.search(new RegExp(vendor.plan_tekst.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))
  const regio = i >= 0 ? tekst.slice(Math.max(0, i - 120), i + (vendor.regio_lengte ?? 400)) : ''
  record.plan_regio = regio.slice(0, 400)
  if (!record.valuta && regio) record.valuta = valutaVan(regio)

  // Ook EUR/GBP-bedragen REGISTREREN (met hun symbool): op de US-runner hoort hier een
  // dollarteken te staan; staat er toch een euroteken, dan is dat zelf een bevinding
  // (aanbieder toont ook Amerikanen EUR). De lokale validatie accepteert alleen USD.
  if (record.intro == null && regio) {
    const m = regio.match(/([$€£])\s?([\d]{1,4}(?:[.,]\d{1,2})?)/)
    if (m) {
      record.intro = Number(m[2].replace(',', '.'))
      record.valuta = { $: 'USD', '€': 'EUR', '£': 'GBP' }[m[1]]
      record.methode = 'tekst_bij_plannaam'
      record.snippet = regio.slice(Math.max(0, regio.indexOf(m[0]) - 60), regio.indexOf(m[0]) + 100)
    }
  }
  if (regio) {
    const r = regio.match(/renew(?:s|al|ed)?[^$€£]{0,80}[$€£]\s?([\d]{1,4}(?:[.,]\d{1,2})?)/i)
    if (r) record.renewal = Number(r[1].replace(',', '.'))
  }
  return record
}

for (const vendor of cfg.vendors) {
  try {
    const { http, html, tekst } = await haalPagina(vendor)
    if (http >= 400 || !tekst || tekst.length < 500) {
      uit.fouten.push({ vendor: vendor.slug, http, reden: `pagina niet leesbaar (${tekst?.length ?? 0} tekens)` })
      continue
    }
    const r = extraheer(vendor, html, tekst)
    uit.gemeten.push({ vendor: vendor.slug, niche: vendor.niche, url: vendor.url, http, ...r })
  } catch (e) {
    uit.fouten.push({ vendor: vendor.slug, reden: String(e.message).slice(0, 160) })
  }
}

const uitPad = join(HIER, '..', 'data', 'us', `${maand}.json`)
mkdirSync(dirname(uitPad), { recursive: true })
writeFileSync(uitPad, JSON.stringify(uit, null, 1) + '\n', 'utf8')
console.log(`US-meting ${maand}: geo=${uit.geo?.land}, ${uit.gemeten.length} gemeten, ${uit.fouten.length} fouten -> ${uitPad}`)
for (const g of uit.gemeten) console.log(`  ${g.vendor.padEnd(14)} ${g.valuta ?? '?'} intro=${g.intro ?? '-'} renewal=${g.renewal ?? '-'} (${g.methode ?? 'geen'})`)
for (const f of uit.fouten) console.log(`  FOUT ${f.vendor}: ${f.reden}`)
