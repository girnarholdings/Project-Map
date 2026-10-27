// Refreshes the directory in place: re-captures every live card from the real
// deployed site, and re-reads the market tape off the BoltNews desk.
//
// This runs on a GitHub Actions runner, which — unlike the sandbox the page was
// originally built in — can reach *.github.io and news.bolt.ceo directly. So the
// snapshots here are of the live sites, not of locally rebuilt copies.
//
// Guiding rule: never replace good content with worse. A card that fails to load,
// or loads nearly empty, keeps the snapshot already committed. A tape that cannot
// be read keeps the figures already on the page. The run reports what it skipped
// instead of silently shipping a blank card.

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.join(ROOT, 'assets', 'shots');
const INDEX = path.join(ROOT, 'index.html');
const TMP = fs.mkdtempSync(path.join(process.env.RUNNER_TEMP || '/tmp', 'refresh-'));

const CARD_W = 1120, CARD_H = 700;
const BOLTNEWS = 'https://news.bolt.ceo/';

// Capture sizes are 16:10 so the card is a straight downscale and never a crop.
// Anything unusual about a site is noted on its row.
const CARDS = [
  { slug: 'boltnews',          url: BOLTNEWS,                                                        w: 1440, h: 900 },
  // follows the viewer's own colour scheme; shot dark so it sits in the room with the rest
  { slug: 'x-feed',            url: 'https://x.bolt.ceo/',                                           w: 1440, h: 900, scheme: 'dark' },
  // narrower: pushes the video grid (thumbnails from third-party hosts) below the fold
  { slug: 'yt-briefings',      url: 'https://girnarholdings.github.io/yt-briefing/',                 w: 860,  h: 538 },
  { slug: 'boltfactors',       url: 'https://girnarholdings.github.io/BoltFactors/',                 w: 1440, h: 900 },
  { slug: 'equity-screener',   url: 'https://girnarholdings.github.io/equity-screener/',             w: 1440, h: 900 },
  { slug: 'earnings-screener', url: 'https://girnarholdings.github.io/AI-Assisted-Earnings-Screener/', w: 1440, h: 900 },
  // opens on a splash screen; the floor behind it is the view worth showing
  { slug: 'grand-atlantic',    url: 'https://girnarholdings.github.io/GrandAtlanticLive/',           w: 1440, h: 900, click: true },
  { slug: 'agentswarm',        url: 'https://girnarholdings.github.io/AgentSwarm/',                  w: 1440, h: 900 },
  { slug: 'tridelphi',         url: 'https://girnarholdings.github.io/TriDelPhi/',                   w: 1440, h: 900 },
  // the floating set/protein readouts collide at narrower widths
  { slug: 'fitforge',          url: 'https://girnarholdings.github.io/FitForge/',                    w: 1280, h: 800 },
  { slug: 'vibenyc',           url: 'https://girnarholdings.github.io/VibeNYC/',                     w: 1440, h: 900 },
];

// The ten rows the tape shows, in tape order.
const TAPE_SYMBOLS = ['ES1', 'NQ1', 'RTY1', 'TU1', 'TY1', 'US1', 'CL1', 'NG1', 'GC1', 'VIX'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const log = [];
function note(ok, msg) {
  log.push(`${ok ? 'ok  ' : 'skip'} ${msg}`);
  console.log(`${ok ? 'ok  ' : 'skip'} ${msg}`);
}

export function etStamp(d = new Date()) {
  const date = d.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/New_York',
  });
  const time = d.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/New_York',
  });
  return { date, time };
}

// --- the index's replaceable regions ----------------------------------------

export function replaceBetween(html, name, body, { all = false } = {}) {
  const start = `<!--${name}:start-->`, end = `<!--${name}:end-->`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`, all ? 'g' : '');
  if (!re.test(html)) throw new Error(`markers missing: ${name}`);
  return html.replace(re, () => start + body + end);
}

// --- snapshots ---------------------------------------------------------------

async function capture(browser, card) {
  const page = await browser.newPage({
    viewport: { width: card.w, height: card.h },
    deviceScaleFactor: 2,
    colorScheme: card.scheme || 'light',
  });
  try {
    const res = await page.goto(card.url, { waitUntil: 'load', timeout: 45000 });
    if (!res || !res.ok()) {
      note(false, `${card.slug}: HTTP ${res ? res.status() : 'no response'} — keeping committed snapshot`);
      return false;
    }
    await page.waitForTimeout(2500);
    if (card.click) {
      await page.mouse.click(Math.round(card.w / 2), Math.round(card.h / 2));
      await page.waitForTimeout(2500);
    }

    // A page that renders almost nothing usually means the site is mid-deploy or
    // broken. Shipping that as a card would misrepresent a working product.
    const textLen = await page.evaluate(() => document.body.innerText.trim().length);
    if (textLen < 150) {
      note(false, `${card.slug}: only ${textLen} chars of text — keeping committed snapshot`);
      return false;
    }

    // Hide images that failed to load rather than shipping broken-image glyphs.
    await page.evaluate(() => {
      document.querySelectorAll('img').forEach(i => {
        if (!i.complete || i.naturalWidth === 0) i.style.visibility = 'hidden';
      });
    });
    await page.waitForTimeout(250);

    const raw = path.join(TMP, `${card.slug}.png`);
    await page.screenshot({ path: raw });
    return raw;
  } catch (err) {
    note(false, `${card.slug}: ${err.message.split('\n')[0]} — keeping committed snapshot`);
    return false;
  } finally {
    await page.close();
  }
}

async function downscale(browser, raw, slug) {
  const page = await browser.newPage({ viewport: { width: CARD_W, height: CARD_H }, deviceScaleFactor: 1 });
  const holder = path.join(TMP, `${slug}.html`);
  fs.writeFileSync(holder, `<!doctype html><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;width:${CARD_W}px;height:${CARD_H}px;overflow:hidden;background:#0b0c0f}
    .f{width:${CARD_W}px;height:${CARD_H}px;background-image:url("file://${raw}");
       background-size:cover;background-position:top;background-repeat:no-repeat}
  </style><div class="f"></div>`);
  await page.goto('file://' + holder, { waitUntil: 'load' });
  await page.waitForTimeout(200);
  const dest = path.join(SHOTS, `${slug}.jpg`);
  await page.screenshot({ path: dest, type: 'jpeg', quality: 88 });
  await page.close();
  return dest;
}

// --- market tape -------------------------------------------------------------

// BoltNews renders its market table semantically, which is what makes this safe
// to read: one <tr> per instrument, the ticker in th > .mt-code, the price in
// td.mt-last, and the one-day change in the FIRST td.mt-val (the columns after it
// are week, month, quarter and year to date, which the tape does not show).
//
// Do not go back to scraping innerText. The ticker and its label render with no
// space between them ("ES1S&P 500", "TU12Y Note"), so a text scan reads the 500
// out of "S&P 500" as the price.
export function readDesk(page) {
  return page.evaluate(() => {
    const rows = {};
    document.querySelectorAll('table.market-table tr').forEach(tr => {
      const code = tr.querySelector('th .mt-code');
      const last = tr.querySelector('td.mt-last');
      const val = tr.querySelector('td.mt-val');
      if (!code || !last || !val) return; // section heading row
      rows[code.textContent.trim()] = {
        value: last.textContent.trim(),
        // "+0.0bp 1d" and "-0.98% day" carry a period suffix; the figure is the first token
        change: val.textContent.trim().split(/\s+/)[0],
      };
    });
    const dateline = (document.querySelector('.dateline')?.textContent || '').replace(/\s+/g, ' ').trim();
    const edition = (
      document.querySelector('.dateline-edition-label') || document.querySelector('.dateline-edition')
    )?.textContent.trim() || '';
    return { rows, dateline, edition };
  });
}

export function tapeRows(rows) {
  const out = [];
  for (const sym of TAPE_SYMBOLS) {
    const r = rows[sym];
    if (!r) return null; // a missing row means the table changed shape; do not guess
    if (!/^[\d,]+(\.\d+)?%?$/.test(r.value)) return null;
    if (!/^[+\-−][\d.]+(%|bp)$/.test(r.change)) return null;
    const change = r.change.replace('-', '−');
    // Coloured by the sign of the figure shown, not by BoltNews' own tone classes.
    // BoltNews paints a rising yield red and a falling VIX green, which is the right
    // call in a briefing that explains itself. On a bare one-line ticker it just
    // reads as a mistake, so here green means the number went up.
    const flat = /^[+−]?0(\.0+)?(%|bp)$/.test(change);
    out.push({ sym, value: r.value, change, dir: flat ? 'flat' : (change.startsWith('−') ? 'down' : 'up') });
  }
  return out;
}

// Two identical groups: the second is aria-hidden and exists only so the marquee
// wraps without a visible gap.
export function renderTape(rows) {
  const group = hidden =>
    `    <div class="tape-group"${hidden ? ' aria-hidden="true"' : ''}>\n` +
    rows.map(r =>
      `      <span class="tape-item"><span class="sym">${r.sym}</span>` +
      `<span class="px">${r.value}</span><span class="${r.dir}">${r.change}</span></span>`
    ).join('\n') +
    `\n    </div>`;
  return group(false) + '\n' + group(true);
}

// "Pre-Market Edition · 2026-10-26 · 115 sources · 8 categories Updated 06:20 ET"
export function readDateline(dateline, edition) {
  const iso = dateline.match(/(\d{4})-(\d{2})-(\d{2})/);
  const clock = dateline.match(/(\d{1,2}:\d{2})\s*ET/i);
  const sources = dateline.match(/(\d+)\s*sources/i);
  const label = edition.replace(/\s*edition\s*$/i, '').trim().toLowerCase();
  return {
    date: iso ? `${Number(iso[3])} ${MONTHS[Number(iso[2]) - 1]} ${iso[1]}` : null,
    time: clock ? clock[1] : null,
    edition: label || null,
    sources: sources ? sources[1] : null,
  };
}

async function refreshTape(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    const res = await page.goto(BOLTNEWS, { waitUntil: 'load', timeout: 45000 });
    if (!res || !res.ok()) {
      note(false, `tape: HTTP ${res ? res.status() : 'no response'} — keeping committed figures`);
      return false;
    }
    await page.waitForTimeout(2500);

    const desk = await readDesk(page);
    const rows = tapeRows(desk.rows);
    if (!rows) {
      note(false, `tape: read ${Object.keys(desk.rows).length} rows but could not match all ` +
                  `${TAPE_SYMBOLS.length} symbols cleanly — keeping committed figures`);
      return false;
    }

    const meta = readDateline(desk.dateline, desk.edition);
    const fallback = etStamp();
    const date = meta.date || fallback.date;
    const time = meta.time || fallback.time;
    // Name the edition the figures actually came from, so the header cannot claim
    // a post-market tape when the run picked up a pre-market one.
    const stamp = meta.edition
      ? `BoltNews ${meta.edition} edition · ${date}, ${time} ET`
      : `captured from BoltNews · ${date}, ${time} ET`;

    let html = fs.readFileSync(INDEX, 'utf8');
    html = replaceBetween(html, 'tape', '\n' + renderTape(rows) + '\n    ');
    html = replaceBetween(html, 'tape-asof', stamp);
    if (meta.sources) html = replaceBetween(html, 'sources', meta.sources, { all: true });
    fs.writeFileSync(INDEX, html);

    note(true, `tape: ${rows.length} symbols · ${stamp}${meta.sources ? ` · ${meta.sources} sources` : ''}`);
    return true;
  } catch (err) {
    note(false, `tape: ${err.message.split('\n')[0]} — keeping committed figures`);
    return false;
  } finally {
    await page.close();
  }
}

// --- main --------------------------------------------------------------------

// Guarded so the module can be imported and its readers exercised against a
// saved copy of a BoltNews edition without launching anything.
const invokedDirectly = process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {

const browser = await chromium.launch();
let shots = 0;
for (const card of CARDS) {
  const raw = await capture(browser, card);
  if (!raw) continue;
  const dest = await downscale(browser, raw, card.slug);
  note(true, `${card.slug}: ${(fs.statSync(dest).size / 1024).toFixed(0)}KB`);
  shots++;
}

const tapeOk = await refreshTape(browser);

if (shots > 0) {
  const { date } = etStamp();
  let html = fs.readFileSync(INDEX, 'utf8');
  html = replaceBetween(html, 'shots-asof', `captured ${date}`);
  fs.writeFileSync(INDEX, html);
}

await browser.close();

const summary = `refreshed ${shots}/${CARDS.length} snapshots; tape ${tapeOk ? 'updated' : 'unchanged'}`;
console.log('\n' + summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    `### Directory refresh\n\n${summary}\n\n\`\`\`\n${log.join('\n')}\n\`\`\`\n`);
}

// Nothing refreshed at all means the run is not doing its job — fail loudly so the
// scheduled job goes red rather than quietly succeeding forever.
if (shots === 0 && !tapeOk) {
  console.error('nothing could be refreshed');
  process.exit(1);
}

}

