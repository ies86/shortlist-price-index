#!/usr/bin/env node
/**
 * dump.mjs - eenmalige US-paginadump op een GitHub Actions-runner (1-10-2026).
 *
 * Waarom: de .com-sites tonen sinds de regel van Ries (1-10-2026) alleen dollarprijzen. Een deel van de
 * aanbieders toont vanaf een Nederlands IP alleen euro's. Deze dump leest de pagina's vanaf een
 * Amerikaans meetpunt en bewaart per pagina de zichtbare tekst en een schermafdruk als bewijs; de
 * prijs wordt daarna lokaal met de hand uit de tekst gelezen. Toont een pagina ook vanuit de VS
 * euro's, dan verkoopt de aanbieder alleen in euro's.
 *
 * Invoer us-dump.json: { pagina's: [{ slug, url }] }. Uitvoer data/us-dump/<datum>/<slug>.txt en .png,
 * plus index.json met het geo-bewijs, de HTTP-status en de eindurl per pagina.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const HIER = dirname(fileURLToPath(import.meta.url))
const cfg = JSON.parse(readFileSync(join(HIER, 'us-dump.json'), 'utf8'))
const datum = new Date().toISOString().slice(0, 10)
const UIT = join(HIER, '..', 'data', 'us-dump', datum)
mkdirSync(UIT, { recursive: true })

const index = { datum, gemeten_op: new Date().toISOString(), geo: null, paginas: [] }
try {
  const g = await (await fetch('http://ip-api.com/json/?fields=status,country,countryCode,as')).json()
  index.geo = { land: g.countryCode, as: g.as }
} catch (e) {
  index.geo = { land: 'ONBEKEND', fout: String(e.message).slice(0, 120) }
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ locale: 'en-US', timezoneId: 'America/New_York', viewport: { width: 1366, height: 900 } })
for (const p of cfg.paginas) {
  const page = await ctx.newPage()
  const rij = { slug: p.slug, url: p.url }
  try {
    const antwoord = await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(6000)
    rij.http = antwoord?.status() ?? 0
    rij.eindurl = page.url()
    const tekst = await page.evaluate(() => document.body.innerText)
    writeFileSync(join(UIT, `${p.slug}.txt`), `${p.url}\n${page.url()}\n${new Date().toISOString()}\n\n${tekst}`, 'utf8')
    await page.screenshot({ path: join(UIT, `${p.slug}.png`), fullPage: true, timeout: 30000 }).catch(() => {})
    rij.dollar = (tekst.match(/\$\s?\d/g) || []).length
    rij.euro = (tekst.match(/€\s?\d|\d\s?€/g) || []).length
  } catch (e) {
    rij.fout = String(e.message).slice(0, 200)
  }
  index.paginas.push(rij)
  console.log(JSON.stringify(rij))
  await page.close()
}
await browser.close()
writeFileSync(join(UIT, 'index.json'), JSON.stringify(index, null, 2) + '\n', 'utf8')
console.log(`geo ${index.geo?.land}; ${index.paginas.length} pagina's`)
