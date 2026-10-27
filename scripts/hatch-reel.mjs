// Renders assets/video/hatch-tour.mp4 — a 1080×1920 vertical tour of the Hatch deck.
//
// The clip is built from the deck itself, so it can never drift from the page: this
// lifts the page's stylesheet and the deck markup out of index.html, lays each slide out
// in a phone-shaped frame, takes a still of each, and has ffmpeg ease between them with
// a crossfade. Run it after editing the deck:
//
//   cd scripts && npm install && node hatch-reel.mjs        (needs ffmpeg with libx264)

import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'video');
const TMP = fs.mkdtempSync(path.join(process.env.RUNNER_TEMP || '/tmp', 'reel-'));
const HOLD = 4.2, FADE = 0.6, FPS = 30;

const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const style = index.match(/<style>[\s\S]*?<\/style>/)[0];
const deck = index.match(/<div class="deck[\s\S]*?<div class="dk-slides"[^>]*>([\s\S]*?)\n        <\/div>\n      <\/div>/)[1];

const reel = `<!doctype html><html lang="en"><head><meta charset="utf-8"><base href="file://${ROOT}/">
${style}
<style>
  html, body { width: 540px; height: 960px; overflow: hidden; }
  body { display: flex; flex-direction: column; padding: 30px 26px 26px; }
  .r-top { display: flex; align-items: center; gap: 10px; }
  .r-top img { width: 30px; height: 30px; border-radius: 50%; }
  .r-top span { font-family: var(--serif); font-size: 21px; }
  .r-top i { margin-left: auto; font-style: normal; font-family: var(--mono); font-size: 11px; letter-spacing: .14em;
    text-transform: uppercase; color: #FFB454; }
  .hatch.r-frame { flex: 1; min-height: 0; margin-top: 20px; padding: 0; display: flex; overflow: hidden; }
  .deck { margin: 0; flex: 1; min-height: 0; display: flex; }
  .deck.reveal { opacity: 1; }
  .dk-slides { flex: 1; }
  .dk-slide { padding: 26px 22px; align-content: start; gap: 22px; transition: none; transform: none; }
  .dk-copy h3 { font-size: 40px; margin: 12px 0; }
  .dk-copy p { font-size: 15.5px; margin-bottom: 9px; }
  .dk-reach dd { font-size: 14px; } .dk-reach div { padding-top: 6px; }
  .dk-stats b { font-size: 44px; }
  .dk-phone { width: 230px; } .dk-screen { height: 400px; }
  .r-foot { margin-top: 16px; display: flex; align-items: center; gap: 12px; font-family: var(--mono); font-size: 11px; color: var(--text-3); }
  .r-bar { flex: 1; height: 3px; border-radius: 2px; background: #232A2F; overflow: hidden; }
  .r-bar b { display: block; height: 100%; background: #FFB454; }
  .r-title { flex: 1; display: grid; align-content: center; gap: 18px; }
  .r-title h1 { margin: 0; font-family: var(--serif); font-weight: 400; font-size: 64px; line-height: .98; }
  .r-title h1 em { font-style: italic; color: #FFB454; }
  .r-title p { margin: 0; color: var(--text-2); font-size: 18px; }
  .r-title .k { font-family: var(--mono); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: #FFB454; }
</style></head><body>
<div class="r-top"><img src="assets/favicon-64.png" alt=""><span>Girnar Holdings</span><i>Hatch · the core</i></div>
<div id="stage" class="hatch r-frame"><div class="deck"><div class="dk-slides">${deck}</div></div></div>
<div class="r-foot"><div class="r-bar"><b id="bar"></b></div><span id="n"></span></div>
</body></html>`;
const reelFile = path.join(TMP, 'reel.html');
fs.writeFileSync(reelFile, reel);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
await page.goto('file://' + reelFile, { waitUntil: 'load' });
await page.waitForTimeout(800);
const total = await page.$$eval('.dk-slide', s => s.length);
const frames = [];

async function title(kicker, h1, sub, name) {
  await page.evaluate(({ kicker, h1, sub }) => {
    document.getElementById('stage').innerHTML =
      `<div class="r-title"><p class="k">${kicker}</p><h1>${h1}</h1><p>${sub}</p></div>`;
    document.getElementById('bar').style.width = '0'; document.getElementById('n').textContent = '';
  }, { kicker, h1, sub });
  const f = path.join(TMP, name + '.png');
  await page.screenshot({ path: f }); frames.push(f);
}

for (let k = 0; k < total; k++) {
  await page.evaluate(k => {
    document.querySelectorAll('.dk-slide').forEach((s, j) => s.classList.toggle('is-active', j === k));
    document.getElementById('bar').style.width = ((k + 1) / document.querySelectorAll('.dk-slide').length * 100) + '%';
    document.getElementById('n').textContent = String(k + 1).padStart(2, '0') + ' / ' + document.querySelectorAll('.dk-slide').length;
    // a slide taller than the frame is scaled down to fit rather than cropped
    const s = document.querySelectorAll('.dk-slide')[k], box = document.getElementById('stage');
    s.style.zoom = '';
    const ratio = box.clientHeight / s.scrollHeight;
    if (ratio < 1) s.style.zoom = String(Math.floor(ratio * 100) / 100);
  }, k);
  await page.waitForTimeout(150);
  const f = path.join(TMP, `s${String(k + 1).padStart(2, '0')}.png`);
  await page.screenshot({ path: f }); frames.push(f);
}
await title('The fleet’s always-on mind', 'Hatch<br><em>runs the desk.</em>',
  'The orchestrator behind every engine: it reads, remembers, answers — and acts with your say-so.', 'z_outro');
const outro = frames.pop();
await title('Girnar Holdings · Hatch', 'One mind,<br><em>the whole loop.</em>',
  'From the overnight sweep to the question you ask on your phone.', 'a_intro');
frames.unshift(frames.pop()); frames.push(outro);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', frames[1], '-vf', 'scale=720:1280', '-q:v', '4',
  path.join(OUT, 'hatch-tour-poster.jpg')]);
await browser.close();

// ffmpeg: each still holds HOLD seconds, chained with crossfades. Static holds keep the
// file small enough to ship with the page; a push-in would make every frame unique.
const inputs = [], filters = [];
const D = HOLD + FADE;
frames.forEach((f, k) => {
  inputs.push('-loop', '1', '-t', String(D), '-i', f);
  filters.push(`[${k}:v]scale=1080:1920,fps=${FPS},setsar=1,format=yuv420p[v${k}]`);
});
let last = 'v0';
for (let k = 1; k < frames.length; k++) {
  const out = k === frames.length - 1 ? 'vout' : `x${k}`;
  filters.push(`[${last}][v${k}]xfade=transition=fade:duration=${FADE}:offset=${(k * HOLD).toFixed(2)}[${out}]`);
  last = out;
}
const mp4 = path.join(OUT, 'hatch-tour.mp4');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filters.join(';'),
  '-map', '[vout]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-tune', 'stillimage', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', mp4], { stdio: 'inherit' });
console.log('wrote', mp4, (fs.statSync(mp4).size / 1e6).toFixed(2) + ' MB,', frames.length, 'cards');
