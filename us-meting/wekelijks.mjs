#!/usr/bin/env node
/**
 * wekelijks.mjs - wekelijkse US-meting van de dollarprijzen op de .com-sites (2-10-2026).
 *
 * Waarom: sinds 1-10-2026 tonen de .com-sites alleen dollarprijzen. Vanaf een Nederlands IP tonen veel aanbieders
 * euro's, dus de prijswacht kan die prijzen niet herbevestigen. Deze runner staat in een Amerikaans datacenter
 * (GitHub Actions) en leest elke week de pagina's uit us-wekelijks.json (gemaakt door scripts/prijswacht/us-lijst.mjs
 * in het hoofdproject). De toets gebeurt NIET hier maar lokaal, met dezelfde code als de prijswacht
 * (scripts/prijswacht/us-bevestig.mjs); daarom haalt dit script de pagina precies zo op als
 * scripts/prijswacht/lib/ophalen.mjs: eerlijke user-agent, minstens drie seconden tussen verzoeken naar dezelfde host,
 * cookieknop wegklikken, klikroute volgen, doorgestreepte bedragen markeren met de berekende stijl, en dan de HTML.
 * robots.txt is al getoetst bij het maken van de lijst.
 *
 * Uitvoer: out/<datum>/<sleutel>.html en out/<datum>/index.json (geo-bewijs, per pagina status, eindurl, bytes,
 * fout en de ids uit de lijst). De map gaat als artifact naar GitHub, niet in de repo: de volledige paginatekst van
 * aanbieders hoort niet in een openbare dataset.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const HIER = dirname(fileURLToPath(import.meta.url))
const lijst = JSON.parse(readFileSync(join(HIER, 'us-wekelijks.json'), 'utf8'))
const datum = new Date().toISOString().slice(0, 10)
const UIT = join(HIER, '..', 'out', datum)
mkdirSync(UIT, { recursive: true })

// Moet gelijk blijven aan WAS_OPEN en WAS_DICHT in scripts/prijswacht/lib/toets.mjs van het hoofdproject.
const WAS_OPEN = '⟦was:'
const WAS_DICHT = '⟧'
const COOKIEKNOPPEN = ['Accept all', 'Accept All', 'Allow all', 'Accept', 'I agree', 'Got it', 'Alles accepteren', 'Alle cookies accepteren', 'Accepteren', 'Akkoord', 'Toestaan']
const PAUZE_MS = 3000
const laatstePerHost = new Map()
const slaap = (ms) => new Promise((r) => setTimeout(r, ms))

const index = { datum, gemeten_op: new Date().toISOString(), geo: null, lijst_gemaakt: lijst.gemaakt, paginas: [] }
try {
  const g = await (await fetch('http://ip-api.com/json/?fields=status,country,countryCode,as')).json()
  index.geo = { land: g.countryCode, as: g.as }
} catch (e) {
  index.geo = { land: 'ONBEKEND', fout: String(e.message).slice(0, 120) }
}
console.log(`geo ${index.geo.land}; ${lijst.paginas.length} pagina's`)

const browser = await chromium.launch({ headless: true })
for (const p of lijst.paginas) {
  const rij = { sleutel: p.sleutel, url: p.url, kliks: p.kliks ?? [], ids: p.ids ?? [], status: 0, eindurl: p.url, bytes: 0, fout: null, geklikt: [] }
  let ctx
  try {
    const host = new URL(p.url).host
    const wacht = (laatstePerHost.get(host) ?? 0) + PAUZE_MS - Date.now()
    if (wacht > 0) await slaap(wacht)
    laatstePerHost.set(host, Date.now())
    // Archiefkopie (6-10-2026): web.archive.org/web/2id_/<url> wijst naar de nieuwste kopie die de Wayback Machine
    // vanuit de VS maakte, als ruwe HTML. Statisch ophalen, zoals de statische stap van de prijswacht: in een browser
    // zou de ruwe pagina scripts van de aanbieder laden. De datum van de kopie staat in de eindurl; us-bevestig.mjs
    // weigert een kopie die ouder is dan een week. Voor aanbieders die de runner blokkeren (GoDaddy, Akamai-403).
    if (host === 'web.archive.org') {
      rij.methode = 'archief'
      const res = await fetch(p.url, { headers: { 'user-agent': lijst.ua }, redirect: 'follow', signal: AbortSignal.timeout(90000) })
      const html = await res.text()
      rij.status = res.status
      rij.eindurl = res.url || p.url
      if (res.ok) {
        writeFileSync(join(UIT, `${p.sleutel}.html`), html, 'utf8')
        rij.bytes = html.length
      }
      index.paginas.push(rij)
      console.log(`${String(rij.status).padEnd(4)} ${String(rij.bytes).padStart(8)} ${p.url} > ${rij.eindurl}`)
      continue
    }
    ctx = await browser.newContext({ userAgent: lijst.ua, locale: 'en-US', timezoneId: 'America/New_York' })
    const page = await ctx.newPage()
    const resp = await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch((e) => ((rij.fout = e.message.slice(0, 120)), null))
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
    for (const naam of COOKIEKNOPPEN) {
      const knop = page.getByRole('button', { name: naam, exact: true }).first()
      if (await knop.isVisible().catch(() => false)) {
        await knop.click({ timeout: 3000 }).catch(() => {})
        rij.geklikt.push(`cookie: ${naam}`)
        await page.waitForTimeout(1500)
        break
      }
    }
    let klikFout = null
    for (const tekst of rij.kliks) {
      const doel = page.getByRole('button', { name: tekst, exact: true }).or(page.getByRole('tab', { name: tekst, exact: true })).or(page.getByText(tekst, { exact: true })).first()
      const gelukt = await doel.click({ timeout: 5000 }).then(() => true, () => false)
      if (!gelukt) { klikFout = `klik "${tekst}" niet gevonden`; break }
      rij.geklikt.push(tekst)
      await page.waitForTimeout(2000)
    }
    if (klikFout) {
      rij.fout = klikFout
    } else {
      await page.waitForTimeout(2000)
      // zichtbaar (us-bronnen.json, 6-10-2026): alleen wat de bezoeker ziet. Ecwid zet de bedragen en munttekens
      // van alle landen in de HTML en verbergt de andere; zonder dit leest de toets een verborgen "€" naast "$29".
      if (p.zichtbaar) {
        rij.zichtbaar = await page.evaluate(() => {
          let n = 0
          for (const el of [...document.querySelectorAll('body *')]) {
            if (!el.isConnected || el.closest('script,style,noscript,template')) continue
            if (getComputedStyle(el).display === 'none') { el.remove(); n++ }
          }
          return n
        }).catch(() => null)
      }
      await page.evaluate(([open, dicht]) => {
        for (const el of document.querySelectorAll('body *')) {
          if (el.closest('script,style,noscript,svg')) continue
          if (getComputedStyle(el).textDecorationLine.includes('line-through')) {
            el.insertAdjacentText('afterbegin', ` ${open} `)
            el.insertAdjacentText('beforeend', dicht)
          }
        }
      }, [WAS_OPEN, WAS_DICHT]).catch(() => {})
      // tekst (us-bronnen.json, 6-10-2026): bewaar de zichtbare tekst (innerText) in plaats van de HTML. pCloud zet een
      // bedrag in losse elementen (<span>49</span><span>.99</span>); uit de HTML wordt dat "49 . 99", wat de toets niet
      // als bedrag leest. innerText laat ook alles met display:none weg. De doorstreepmarkering hierboven blijft erin.
      const html = p.tekst
        ? `<html><body><pre>${(await page.evaluate(() => document.body.innerText)).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre></body></html>`
        : await page.content()
      if (p.tekst) rij.tekst = true
      writeFileSync(join(UIT, `${p.sleutel}.html`), html, 'utf8')
      rij.bytes = html.length
    }
    rij.status = resp ? resp.status() : 0
    rij.eindurl = page.url()
  } catch (e) {
    rij.fout = String(e.message).slice(0, 160)
  } finally {
    if (ctx) await ctx.close().catch(() => {})
  }
  index.paginas.push(rij)
  console.log(`${String(rij.status).padEnd(4)} ${String(rij.bytes).padStart(8)} ${p.url}${rij.fout ? `  FOUT ${rij.fout}` : ''}`)
}
await browser.close()
writeFileSync(join(UIT, 'index.json'), JSON.stringify(index, null, 1) + '\n', 'utf8')
console.log(`klaar: ${index.paginas.filter((x) => x.bytes > 0).length} van ${index.paginas.length} pagina's gelezen`)
