# Project-Map

The Girnar Holdings site — **https://girnarholdings.github.io/Project-Map/** — published from
`index.html` by GitHub Pages.

It is a pitch, not a directory. Prospective clients land on it to decide whether to hire the
studio, so the page argues one thing from top to bottom: **every desk is a reading operation,
the reading outgrew the people, and we build the reader — around how your desk works.** The
projects are the proof. Each is shown twice over: what it does *today*, live, and what it
becomes when it is *built for you*.

## The pitch, section by section

| Section | Job it does |
|---|---|
| **Hero** — *"Your mandate, read overnight."* | The promise, with the core metaphor drawn live: eight kinds of source (a 10-K, the wires, FOMC minutes, the X timeline…) stream into one edition card, which prints line by line as they land. |
| **Tape** | Proof the engines run today: real figures off the BoltNews desk, rewritten each weekday. |
| **Premise** | The first-principles case in three steps — the reading outgrew the people; edge is knowing first *and* knowing it holds; so build the reader around the client. |
| **Configure your desk** | The centrepiece. The visitor picks a seat (rates & credit, equity long/short, macro, allocator, event-driven), what eats their morning, and where it should land — and a sample edition rebuilds itself for that desk. |
| **Engines** | The six market engines in a bento grid, each with **Today** (true, live, linked) and **Built for you** (the customised version we would build). A seventh tile — *"Engine 07: Yours."* — asks for the reading nobody covers. A second tab holds the eight agents and products. |
| **Process** | How an engagement runs, in four moves, and four outcomes it is built to deliver. |
| **Start a build** | The ask. |

### The configurator

`#configure` is what turns "a portfolio of tools" into "a tool for *you*". Its sample edition is
assembled in the browser from three things:

- **Today's real tape.** The "What moved" figures are read at runtime out of the tape markup
  that the refresh workflow rewrites each weekday, so every refresh updates every sample desk
  too. The one-line read under them ("The 10-year did the moving: +3.5bp. The 2-year didn't
  move.") is computed from those figures, so it is always true.
- **Sample lines per seat.** Thirty short lines (five seats × six engines) in the voice the
  engine would use for that desk. These are **illustrative**, and the page says so twice — a
  "sample lines" label inside the edition and a note under it.
- **A "Tuned:" line per engine** describing the customisation for that seat — the pitch, in a
  sentence each.

"Make it yours" on any engine card ticks that engine in the configurator and scrolls there.
"Build this desk" carries the visitor's choices into the enquiry (see *Contact* below).

### What is promised, and what is not

The brief was to pitch the tools as customisable and to describe optimistic outcomes even
where they are not built yet. The page does that, inside three rules that keep it from
misleading a client:

1. **"Today" is only ever true.** Everything under a *Today* label, every live badge and every
   screenshot is the real, running product.
2. **The future is written as an offer.** *Built for you*, *For you* and *Tuned* lines describe
   what an engagement would build. None of them claims to exist already.
3. **No invented evidence.** No testimonials, client names, logos, performance figures or
   delivery timelines appear anywhere — there are none to cite yet, and a client who asks
   about one should get a true answer. The four outcome statements under *Process*
   ("The reading is done before you sit down", "It gets sharper every week"…) are commitments
   the studio is making; keep them only while they are ones you are willing to be held to.

## Contact — set this before sending the link to anyone

Every "Start a build", "Build this desk", "Or just tell us" and "Ask for a walkthrough" control
is wired by one constant near the top of the page script:

```js
var CONTACT_EMAIL = '';
```

While it is empty, those controls open the GitHub profile — a working link, but not where a
client should land. Set it to a real address and they all become `mailto:` links; "Build this
desk" also pre-fills the subject and body with the visitor's seat, what eats their morning and
where it should land, so the first email arrives already scoped.

## Design

**Lapis and antique gold, sampled from the house mark** — navy `#071848`, gold `#D6B788`, cream
`#EAD7B4` — with the desk's amber `#F5B93B` and the tape's green and rose kept for data only.
The whole site is one dark room now rather than two; the trading-terminal DNA survives in the
mono labels, the tape, the figures in the configurator and the edition card.

**Type**, all SIL Open Font License and self-hosted from `assets/fonts/` as latin-subset woff2
(83 KB for all four): **Instrument Serif** (roman and italic) for display, **Geist** for running
text, **Geist Mono** for labels and figures. Nothing is fetched from a font CDN at runtime.

**Inspiration.** The brief pointed at mkdir.directory for references. It could not be reached
from the build sandbox — the network gateway refuses the connection and its DNS does not
resolve there — so the design draws instead on patterns that recur across the portfolio
galleries that *were* searchable (Perfolios, Typewolf, One Page Love, A1 Gallery and others):
bento grids with a cursor-tracked light on the card borders, a live "status" badge, a real
product in the hero rather than a stock image, and restrained motion. Fintech sites in 2026
skew towards calm over flash, and the page follows that — one accent, dense but quiet data,
effects that explain rather than decorate.

**Effects**, every one of them off under `prefers-reduced-motion`:

- **Source streams** (canvas) — particles leave the source chips and flow into the edition
  card; every few arrivals print a line of it in gold; when the edition is full it clears and
  starts again. The canvas pauses when the hero is off screen or the tab is hidden, and caps
  the device pixel ratio at 2.
- **Gold-leaf italics** — the italic halves of the headlines carry a slow sheen.
- **Cursor light** — on fine pointers, the engine and product cards pick up a soft gold
  highlight on their borders where the cursor is, plus a faint glow inside.
- **Scan line** — hovering a screenshot sweeps a reading line down it.
- **Reveal on scroll** — sections rise in with a short blur-to-sharp; this is applied only once
  JavaScript is known to be running, so nothing is ever stranded invisible without it.
- **Decode** — figures in the sample edition resolve digit by digit when it rebuilds.
- **Magnetic buttons, radar pings, counters** — small, and only where they earn a glance.

The page has no dependencies: one HTML file with its own CSS and JavaScript, as before.

The old deep links still work: `#desk` opens the engines, and `#floor` opens the *Agents &
products* tab.

### A note on imagery

There is **no stock photography on this page**. Two separate reasons, and both matter:

1. **Licensing.** Getty Images and similar libraries are licensed stock; republishing their
   work on a public Pages site would be copyright infringement regardless of how the file was
   obtained.
2. **The build environment cannot fetch images at all.** Unsplash, Pexels, Wikimedia, the Met,
   Smithsonian, Rijksmuseum, Library of Congress, Cleveland Museum and NGA were all tested and
   every one is refused at CONNECT by the network policy. `WebFetch` returns 403 and only ever
   yields text, never image bytes. Web *search* works, so images can be found and identified —
   they just cannot be downloaded.

If you want real photography here, the practical route is to commit the files to this repo
directly (or attach them in a session, which is how the house mark and the lobby reference
both arrived) and reference them from `assets/`. Anything added that way still needs a licence
permitting redistribution — public-domain or CC0 sources such as the Met's Open Access
collection are safe; Getty is not. Note that a heavily transformed derivative of a licensed
photograph is still a derivative, so confirm the rights on any reference before it ships.

Everything visual here is either the owner's own work or generated for this repo:

- `assets/shots/*.jpg` — real screenshots of the owner's own deployed products.
- `assets/floor-hall.jpg` — the vaulted hall that glows faintly behind the *Agents & products*
  tab (it was the backdrop of the old "floor" room), generated for this repo and rendered to a
  1600×900 JPEG in headless Chromium.

  It is a **remix of a supplied reference photograph of a gilded hotel lobby**, not a copy of
  it. The photograph is reduced to a 22×13 grid of average colours and smoothly upscaled, so
  all that survives is the *fall of light* in a grand hall — luminous crown, dark flanks, a
  pool underfoot. Those blocks are then recoloured by luminance into the house ramp (deep
  lapis in shadow, antique gold in the highlights). No edge, ornament or recognisable
  architecture from the original remains. The architecture you can actually see — the
  receding vaulted arcade, its coffer ribs, the chandelier points and the floor reflection —
  is drawn from scratch in SVG over the top.

  Two rendering traps were hit building it, both worth knowing:
  - Large CSS `blur()` radii on big elements seam visibly in Chromium (it tiles the filter).
    Downsample-then-upscale through a canvas instead.
  - A helper class setting `inset: 0` will silently pin a `bottom`-anchored band to the *top*,
    because `top` + `bottom` + `height` is over-constrained and `bottom` loses. The floor band
    now sets `top: auto` explicitly.
- `assets/girnar-logo.png` is the house mark as supplied; `girnar-mark.png` and the favicon /
  apple-touch / 512 icons are all cropped and masked from it to a clean disc.

## Card screenshots

Every image on the page is a **real screenshot of the actual deployed project**, not stylised
preview art. They live in `assets/shots/` (one JPEG per project, 1120×700).

They are now captured from the **live deployments** by the refresh workflow (see below).
Earlier passes had to render them from each project's committed build output instead — pulled
through the GitHub API and rendered in local headless Chromium — because the sandbox the page
was authored in refuses `*.github.io` at CONNECT. An Actions runner has no such restriction,
which is the whole reason the capture moved into CI.

Caveats worth knowing before regenerating them by hand:

- Capturing locally in the sandbox renders webfonts, video thumbnails and avatars in
  fallbacks, because those hosts are blocked there. Captures taken by the workflow do not
  have this problem, so prefer re-running the workflow over re-shooting by hand.
- YouTube Briefings embeds video thumbnails and channel avatars from `i.ytimg.com` and
  `yt3.googleusercontent.com`, both of which are blocked here. Those images load fine for real
  visitors. Rather than ship a card full of broken-image glyphs — which would misrepresent the
  live site as broken — the capture hides any image that failed to load and frames the card on
  the header, Creator Pulse and creator filters, which render completely. Narrowing the capture
  viewport to 860 px pushes the video grid below the fold and does this naturally.
- Grand Atlantic opens on a splash screen; its screenshot is taken after clicking through to
  the training floor, which is the view worth showing.
- AgentSwarm and TriDelPhi reference assets by absolute path (`/styles.css`), which resolves
  to the filesystem root under `file://` and renders an unstyled page. If you do capture
  locally, serve the directory over HTTP and shoot `127.0.0.1` instead.
- The screenshots are point-in-time. Dashboards that publish several times a day will have
  moved on between refreshes — the footer records the capture date so the page never implies
  the numbers are current.
- **CRE AI Agent is deliberately not screenshotted.** It is a private tool operating on live
  broker listings and underwriting, so publishing its dashboard here would leak proprietary
  deal data. Its card shows a "Private build" panel instead.

## Keeping itself current

The page used to go stale the moment it shipped: the snapshots were point-in-time and the tape
was a hand-typed capture. `.github/workflows/refresh.yml` now re-reads both on a schedule.

- **When.** `23:37 UTC` on weekdays, which lands after the BoltNews post-market edition has
  published, so the tape and the cards agree with each other. Also `workflow_dispatch` for an
  immediate run.
- **What it does.** `scripts/refresh.mjs` drives Playwright Chromium: it re-captures all
  eleven live cards, re-reads the ten futures/rates/commodity/volatility rows off the BoltNews market
  table along with that edition's dateline and source count, and rewrites the index in place.
  Then the workflow commits and pushes, and publishes.
- **Why it deploys itself.** A push made with `GITHUB_TOKEN` does not start another workflow,
  so `deploy.yml`'s push trigger never fires for the refresh commit. `refresh.yml` therefore
  carries its own `deploy` job, gated on something having actually changed.
- **Where it writes.** Four marker regions in `index.html`, which must not be removed:

  | Markers | Content |
  |---|---|
  | `<!--tape:start-->` / `<!--tape:end-->` | the two tape row groups (the second is the `aria-hidden` duplicate that makes the marquee seamless) |
  | `<!--tape-asof:start-->` / `<!--tape-asof:end-->` | the edition and timestamp in the tape header |
  | `<!--shots-asof:start-->` / `<!--shots-asof:end-->` | the capture date in the footer |
  | `<!--sources:start-->` / `<!--sources:end-->` (×2) | the BoltNews source count, in the hero's proof strip and on the BoltNews card |

**The rule the script is built around: never replace good content with worse.** A card that
404s, times out, or renders under 150 characters of text keeps the snapshot already committed,
and the run says it skipped it. A market table that does not parse cleanly into all ten
symbols leaves the committed figures alone rather than shipping a half-filled tape. Images
that fail to load are hidden before the shot so no card ships broken-image glyphs. Every
capture is taken at 16:10 and downscaled to 1120×700, never cropped, so framing stays
consistent with the hand-shot originals. Only if *nothing at all* could be refreshed does the
run exit non-zero — a scheduled job that silently succeeds forever while doing nothing is
worse than a red one.

**The tape is read out of the DOM, not out of text**, and it has to stay that way. BoltNews
renders its market table semantically — one `<tr>` per instrument, the ticker in
`th > .mt-code`, the price in `td.mt-last`, the one-day change in the *first* `td.mt-val` (the
columns after it are week, month, quarter and year to date). Scraping `innerText` instead
looks easier and is wrong: the ticker and its label render with no space between them
(`ES1S&P 500`, `TU12Y Note`), so a text scan happily reads the `500` out of "S&P 500" as the
price. The DOM read was checked against a real published edition before it shipped; all ten
rows come back clean.

One deliberate divergence: the tape colours each figure **by its own sign**, not by BoltNews'
`tone-up`/`tone-down` classes. BoltNews paints a rising yield red and a falling VIX green,
which is the correct call in a briefing that explains itself — but on a bare one-line ticker a
green minus sign just reads as a bug.

Per-site quirks live as comments on the `CARDS` rows in `scripts/refresh.mjs`: YouTube
Briefings is shot at 860 px so its third-party thumbnail grid falls below the fold, FitForge at
1280 px because its floating readouts collide narrower, Grand Atlantic is clicked once to get
past its splash screen, and X Feed Intelligence is captured with `colorScheme: 'dark'` because
it follows the viewer's own system preference and the desk frames dark UIs only — a visitor on
a light system sees the same site in light, which is the site working, not a mismatch.

Adding or removing a card means editing both `index.html` and that `CARDS` list. Playwright is
pinned in `scripts/package.json`; the browser is installed by the workflow, not committed.

## Favicon & link-preview assets

`assets/` holds the hosted icon and social files (`favicon-32.png`, `favicon-64.png`,
`apple-touch-icon.png`, `icon-512.png`, `og-image.png`), all derived from the Girnar Holdings
house mark and masked to a circular disc so the medallion stays legible at 32 px. The page
title, `og:site_name`, and both card titles all lead with **Girnar Holdings**. These are committed
as real files rather than inline data URIs — link-preview crawlers (iMessage, Slack, X) and
iOS's apple-touch-icon need a fetchable URL and won't reliably resolve a `data:` URI.
`og-image.png` is a rendered 1200×630 card matching the page's design, and its source lives
beside the refresh script at `scripts/og-card.html` — rendering instructions are in a comment
at the top of that file. It is **not** generated by the refresh workflow, so it is
hand-maintained: it carries the hero's promise ("Your mandate, read overnight.") and the edition
card, so when the pitch changes, re-render it. A share card that contradicts the page is the
first thing a stranger sees when the link is pasted.

> **Account rename, July 2026:** this account renamed from `ZeusNightBolt` to `girnarholdings`
> (same account, same numeric ID). GitHub redirects repository URLs but **not** `*.github.io`
> Pages subdomains, so every link here points at `girnarholdings.github.io/*`. If a card 404s,
> check that the project's own Pages deploy has been re-triggered under the new namespace.

## 📡 Market intelligence — *the engines*

Six engines that do the overnight reading a person cannot: 115 news sources, hours of video, a
whole equity universe and the timeline, read while the market is shut and handed back as one
page you can act on before the open. All six are live. The page lists them in this order, and
each card pairs **Today** (below) with **Built for you** (the offer, also below).

The source count appears twice in the page — in the hero's proof strip and on the BoltNews card
— and is **not** hand-maintained: the refresh workflow reads it out of the BoltNews dateline and
rewrites both, so the pitch cannot drift away from what the pipeline actually sweeps.

| # | Project | Live site | Today | Tech |
|---|---|---|---|---|
| 1 | **BoltNews** | [news.bolt.ceo](https://news.bolt.ceo/) | Walk in already knowing. Reads every source in the sweep overnight and returns one page: what moved, why, and what is set up for today — equities, rates, credit, FX, commodities, volatility, crypto. Pre-market, mid-day and weekend editions. | Python 3.12, multi-agent LLM pipeline, cron, GitHub Pages |
| 2 | **X Feed Intelligence** | [x.bolt.ceo](https://x.bolt.ceo/) | Stop scrolling for the one post that mattered. An agent reads the timeline on its own schedule, checks what each post actually claims against the sources, and writes back what was really said — so a call that breaks at 7am is not lost by lunch. Pointed at a mandate, it keeps only what moves that book. | Scheduled reader over the signed-in session, per-post research notes, static site |
| 3 | **YouTube Briefings** | [girnarholdings.github.io/yt-briefing](https://girnarholdings.github.io/yt-briefing/) | Hear the call while it is still tradeable. Watches every tracked creator's output and returns each one's actual thesis in a paragraph, instead of an endless subscriptions feed. | Python, GitHub Actions → Pages, static HTML |
| 4 | **BoltFactors** | [girnarholdings.github.io/BoltFactors](https://girnarholdings.github.io/BoltFactors/) | Stop trading into the tide. Says which style is paying right now — value, momentum, quality or safety — and refreshes five times a day as the regime shifts. | Python, DuckDB/Polygon warehouse, cron (5× daily) |
| 5 | **Equity Screener** | [girnarholdings.github.io/equity-screener](https://girnarholdings.github.io/equity-screener/) | A short list worth your morning. Seven deterministic sleeves (RSI inflection, value, momentum, squeeze) rank the universe nightly, with a wave-stage classifier and a factor-momentum-tilted EV master score — each name carrying the reason it made the cut. | Python, DuckDB/Polygon warehouse, pandas |
| 6 | **Earnings Screener** | [girnarholdings.github.io/AI-Assisted-Earnings-Screener](https://girnarholdings.github.io/AI-Assisted-Earnings-Screener/) | Be positioned before the print, not reacting after it. Cross-references the holdings universe against a SEC EDGAR/DoltHub calendar, scores which setups are worth taking and writes the case for each. | Python, SEC EDGAR, DoltHub, DuckDB, LLM commentary |

**On X Feed Intelligence specifically.** Its own pages carry `robots: noindex,nofollow` — the
owner did not want it in search results. Linking it from this directory does not change that
(a link is not an index), but it does make a site that was effectively unlisted publicly
reachable, which was asked for deliberately. The card is written as a proposal: the agent
scanning and researching the timeline is what ships today, and shaping it to a mandate is the
offer around it, so the copy says "point it at a mandate" rather than claiming the feed on
screen is already filtered to one. That matters, because it is not — the capture is the
owner's real feed, and it reads as AI infrastructure, trading playbooks and product launches.
Writing "a fixed-income feed" over that screenshot would have been a caption the picture
contradicts.

### Built for you — the offer on each engine card

| Engine | Built for you |
|---|---|
| **BoltNews** | Your coverage universe becomes the source list · your house view becomes the lens, every line footnoted · a desk memory that flags the moment the story changes |
| **X Feed Intelligence** | Curated to your mandate — fixed income, credit, one sector · the accounts that move your book, tracked by name · an alert the minute a voice you trust changes their call |
| **YouTube Briefings** | Your expert network, dealer calls and podcasts, distilled · every speaker's view tracked over time, so you can see who was right · earnings calls in paragraphs before the Q&A ends |
| **BoltFactors** | Your factor model, run on your universe · regime shifts mapped to your positions, not an index · what you did the last time this regime showed up |
| **Equity Screener** | Your screens and limits — liquidity, caps, exclusions · each pick arriving with its first-draft memo · every screen tested against your own history |
| **Earnings Screener** | Your book's calendar, not the whole market's · setup memos before the print and "what changed" minutes after · guidance and tone shifts flagged line by line |

## 🎭 Agents & products — *the second tab*

The same discipline in other rooms: agents, security, consumer products and private tooling.
Each card ends with a one-line **For you** — the pattern it would become for a client.

| # | Project | Live site | Tech | Description |
|---|---|---|---|---|
| 1 | **Grand Atlantic** | [girnarholdings.github.io/GrandAtlanticLive](https://girnarholdings.github.io/GrandAtlanticLive/) | React, Vite, vanilla JS, client-side only | A casino floor built to teach rather than take: Blackjack, Roulette, Baccarat, Craps and Poker trainers behind one front desk, sharing a single bankroll and walk-away goal across every table. |
| 2 | **AgentSwarm** | [girnarholdings.github.io/AgentSwarm](https://girnarholdings.github.io/AgentSwarm/) | Cloudflare Workers, multi-pool inference routing, 223 tests | Describe an app in plain English and a swarm of cheap agents builds it in parallel — every file its own agent, priced before anything runs, online in one tap. Trivial parts fan out across free inference pools; only hard parts reach the paid model. |
| 3 | **TriDelPhi** | [girnarholdings.github.io/TriDelPhi](https://girnarholdings.github.io/TriDelPhi/) | Python 3.11–3.13, Apache-2.0, zero default network calls | A static *Agents Rule of Two* analyzer for GitHub Actions: it finds the CI job where an attacker's comment becomes remote code execution. Runs fully offline by default and never certifies a project as safe. |
| 4 | **FitForge** | [girnarholdings.github.io/FitForge](https://girnarholdings.github.io/FitForge/) | Next.js 15, SwiftUI (iOS 17+), Supabase, TypeScript shared package | Learns the equipment you have, the lifts you prefer and the movements you avoid, then substitutes equivalents by muscle group and movement pattern instead of handing out a generic plan. Macro targets follow Mifflin–St Jeor. |
| 5 | **VibeNYC** | [girnarholdings.github.io/VibeNYC](https://girnarholdings.github.io/VibeNYC/) | Python, GitHub Actions → Pages, static HTML | A living read on what's happening across New York tonight, built from official facts, local expertise and community signals — with every claim traceable back to its source. |
| 6 | **Hatch** | — *(private, runs on the fleet)* | Python, MoE routing, shared memory, fleet M2M bus | A local orchestrator running a three-machine fleet: four coding harnesses, a mixture-of-experts router, shared memory with nightly hygiene, a skill flywheel and a machine-to-machine bus. |
| 7 | **Hatch for iOS** | — *(private, no public build)* | SwiftUI, zero dependencies, VPN optional | Mission control for Hatch from a phone — cockpit (dreams, feed, routines), streaming chat, approvals and dispatch. |
| 8 | **CRE AI Agent** | — *(private, no public deployment)* | Python, browser automation, Streamlit | Gathers commercial listings into a private, interactive underwriting dashboard for per-deal deep dives. |

### Off the page right now

Three desk projects that used to have cards no longer do. The repositories and, where they
exist, the deployments are untouched — this is an editing decision about the directory, not a
retirement:

| Project | Why it is not on the page |
|---|---|
| **bolt.ceo** | Taken down for now, at the owner's instruction. It was the question box over the pipelines; it will come back when it is ready to be the front door again. BoltNews keeps its `news.bolt.ceo` subdomain and is unaffected. |
| **BetNews** | Live at [girnarholdings.github.io/BetNews](https://girnarholdings.github.io/BetNews/), but betting markets are a different pitch from the market desk, and mixing them blunted both. |
| **HousingTrends** | Private, with no public deployment. A card nobody can open does not earn its place on a page whose whole promise is that every door opens. |

If any of them goes back up, its card belongs in the engines grid and its snapshot in
`scripts/refresh.mjs`'s `CARDS` list — the two have to move together or the refresh will
quietly stop covering it.

### Not listed here

Three repositories created in this period are deliberately absent, because they are
infrastructure rather than projects: **engine-infra** (machine provisioning and contract
tests), **nima-infra-vault** (an off-site encrypted secret vault — ciphertext only, and
nothing that should be advertised), and **agentswarm-e2e-test** (a throwaway artifact
AgentSwarm built to prove itself).


The five individual casino trainers (Blackjack, Poker, Roulette, Craps, Baccarat) are no
longer separate cards — **Grand Atlantic** is the front door to all five, and listing them
twice made the directory longer without making it more useful. Their repositories are
unchanged.

Link convention: each card opens the project's live deployment. Source repositories are
private, so there are no repository links. The three projects with no public deployment —
Hatch, Hatch for iOS and CRE AI Agent — carry a "Private build" panel in place of a
screenshot, and their only control is "Ask for a walkthrough", which goes to the contact
address. CRE AI Agent is still never screenshotted: it works on live broker listings, so a
capture would publish proprietary deal data.
