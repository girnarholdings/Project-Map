# Project-Map

Index of active projects. This repo publishes a landing page (`index.html`), titled
**Girnar Holdings — Project Directory**, via GitHub Pages at
**https://girnarholdings.github.io/Project-Map/**.

The page is a **two-tab** directory rather than a long scroll. Each tab is its own room with
its own visual world:

| Tab | Room | Contents |
|---|---|---|
| **Markets & Trading** | *the desk* — night trading terminal | Five tools that read overnight and publish before the open |
| **Creative & Agentic** | *the floor* — the house itself, in lapis and gold | Eight products built to be used |

Tabs deep-link (`#desk`, `#floor`), support arrow-key navigation, and use proper
`tablist`/`tab`/`tabpanel` roles. The tables below are the underlying source of truth, and
they list projects in the same order the page does.

**The copy is written to be clicked, not skimmed.** Each card leads with the problem the tool
removes and what the visitor gets out of it, in plain English, and closes on an imperative
("Read this morning's edition", "See today's shortlist") rather than a feature list. The
technical facts still live in this README and in the small `card-tech` chips on the page —
they just stopped being the first thing a stranger reads. Nothing on the page offers anything
for sale or implies it is available; the register is a showroom, not a listing.

## Design

Both rooms are deliberately dark — every product screenshot they frame is itself a dark UI,
and both rooms are night rooms. There is no light variant, by choice rather than omission.

**The desk** (default tab) keeps the trading-terminal treatment:

- **Palette lifted from the products, not invented.** Amber `#F5B93B` is the accent BoltNews,
  BoltFactors and the screeners already use. It appears as a hairline across the top of every
  screenshot. FitForge has since rebranded to forge-copper and no longer matches, which is why
  that claim now names the desks rather than the whole portfolio.
- **Monospace as the display face** — the honest register for a room where every project is a
  terminal — against a system grotesque for running text.
- **The tape** shows real prices read off the BoltNews desk. Its header names the edition and
  timestamp the figures actually came from, written by the refresh workflow out of the live
  dateline, so it cannot claim a post-market tape when the run picked up a pre-market one. It
  is labelled a capture rather than a live feed because that is what it is — rewritten once a
  day, not streamed. It belongs to the desk and is hidden on the floor.

**The floor** switches to antique gold on lapis:

- **Palette sampled directly from the house mark** — navy `#071848`, gold `#D6B788`, cream
  `#EAD7B4`, read off the logo file rather than eyeballed. An earlier pass used Grand
  Atlantic's oxblood-and-bright-gold, which made the whole room read as a knock-off of one
  product inside it; the room now belongs to Girnar Holdings instead.
- **Playfair Display** (SIL Open Font License) as the display face, self-hosted from
  `assets/fonts/` as a latin-subset variable woff2 (61 KB for both roman and italic). Nothing
  is fetched from a font CDN at runtime. Because the floor panel is `hidden` until opened, the
  browser does not download the face until someone actually switches tabs.
- **Projects are plaques, not cards** — engraved double-rule frames with a gold "enter"
  control, so each one reads as a thing you press. Each is labelled by the room it is rather
  than an arbitrary number: the Floor, the Training Room, the Concierge, the Back Office.
- Screenshots are dimmed to `brightness(0.86)` to sit in the room's low light and come back to
  full brightness on hover — which also keeps the one light-themed product (VibeNYC) from
  glaring against the stone.

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
- `assets/floor-hall.jpg` — the vaulted hall behind the floor tab, generated for this repo
  and rendered to a 1600×900 JPEG in headless Chromium.

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
  deal data. Its card is a non-clickable panel that says so.

## Keeping itself current

The page used to go stale the moment it shipped: the snapshots were point-in-time and the tape
was a hand-typed capture. `.github/workflows/refresh.yml` now re-reads both on a schedule.

- **When.** `23:37 UTC` on weekdays, which lands after the BoltNews post-market edition has
  published, so the tape and the cards agree with each other. Also `workflow_dispatch` for an
  immediate run.
- **What it does.** `scripts/refresh.mjs` drives Playwright Chromium: it re-captures all ten
  live cards, re-reads the ten futures/rates/commodity/volatility rows off the BoltNews market
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
  | `<!--sources:start-->` / `<!--sources:end-->` (×2) | the BoltNews source count, in the panel blurb and on the BoltNews card |

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
1280 px because its floating readouts collide narrower, and Grand Atlantic is clicked once to
get past its splash screen.

Adding or removing a card means editing both `index.html` and that `CARDS` list. Playwright is
pinned in `scripts/package.json`; the browser is installed by the workflow, not committed.

## Favicon & link-preview assets

`assets/` holds the hosted icon and social files (`favicon-32.png`, `favicon-64.png`,
`apple-touch-icon.png`, `icon-512.png`, `og-image.png`), all derived from the Girnar Holdings
house mark and masked to a circular disc so the medallion stays legible at 32 px. The page
title, `og:site_name`, and both card titles all read **Girnar Holdings**. These are committed
as real files rather than inline data URIs — link-preview crawlers (iMessage, Slack, X) and
iOS's apple-touch-icon need a fetchable URL and won't reliably resolve a `data:` URI.
`og-image.png` is a rendered 1200×630 card matching the page's design, and its source lives
beside the refresh script at `scripts/og-card.html` — rendering instructions are in a comment
at the top of that file. It is **not** generated by the refresh workflow, so its counts and
lede are hand-maintained: whenever the directory's shape changes, re-render it. A share card
still claiming six and four desks is the first thing a stranger sees when the link is pasted.

> **Account rename, July 2026:** this account renamed from `ZeusNightBolt` to `girnarholdings`
> (same account, same numeric ID). GitHub redirects repository URLs but **not** `*.github.io`
> Pages subdomains, so every link here points at `girnarholdings.github.io/*`. If a card 404s,
> check that the project's own Pages deploy has been re-triggered under the new namespace.

## 📡 Markets & Trading — *the desk*

Five tools that do the overnight reading a person cannot: 115 news sources, hours of video and
a whole equity universe, read while the market is shut and handed back as one page you can act
on before the open. All five are live. The page lists them in this order.

The source count appears twice in the page copy and is **not** hand-maintained — the refresh
workflow reads it out of the BoltNews dateline and rewrites both, so the pitch cannot drift
away from what the pipeline actually sweeps.

| # | Project | Live site | What it gets you | Tech |
|---|---|---|---|---|
| 1 | **BoltNews** | [news.bolt.ceo](https://news.bolt.ceo/) | Walk in already knowing. Reads every source in the sweep overnight and returns one page: what moved, why, and what is set up for today — equities, rates, credit, FX, commodities, volatility, crypto. Pre-market, mid-day and weekend editions. | Python 3.12, multi-agent LLM pipeline, cron, GitHub Pages |
| 2 | **YouTube Briefings** | [girnarholdings.github.io/yt-briefing](https://girnarholdings.github.io/yt-briefing/) | Hear the call while it is still tradeable. Watches every tracked creator's output and returns each one's actual thesis in a paragraph, instead of an endless subscriptions feed. | Python, GitHub Actions → Pages, static HTML |
| 3 | **BoltFactors** | [girnarholdings.github.io/BoltFactors](https://girnarholdings.github.io/BoltFactors/) | Stop trading into the tide. Says which style is paying right now — value, momentum, quality or safety — and refreshes five times a day as the regime shifts. | Python, DuckDB/Polygon warehouse, cron (5× daily) |
| 4 | **Equity Screener** | [girnarholdings.github.io/equity-screener](https://girnarholdings.github.io/equity-screener/) | A short list worth your morning. Seven deterministic sleeves (RSI inflection, value, momentum, squeeze) rank the universe nightly, with a wave-stage classifier and a factor-momentum-tilted EV master score — each name carrying the reason it made the cut. | Python, DuckDB/Polygon warehouse, pandas |
| 5 | **Earnings Screener** | [girnarholdings.github.io/AI-Assisted-Earnings-Screener](https://girnarholdings.github.io/AI-Assisted-Earnings-Screener/) | Be positioned before the print, not reacting after it. Cross-references the holdings universe against a SEC EDGAR/DoltHub calendar, scores which setups are worth taking and writes the case for each. | Python, SEC EDGAR, DoltHub, DuckDB, LLM commentary |

## 🎭 Creative & Agentic — *the floor*

Things people use rather than things that publish — each shapes itself around a single person.

| # | Project | Live site | Tech | Description |
|---|---|---|---|---|
| 1 | **Grand Atlantic** | [girnarholdings.github.io/GrandAtlanticLive](https://girnarholdings.github.io/GrandAtlanticLive/) | React, Vite, vanilla JS, client-side only | A casino floor built to teach rather than take: Blackjack, Roulette, Baccarat, Craps and Poker trainers behind one front desk, sharing a single bankroll and walk-away goal across every table. |
| 2 | **AgentSwarm** | [girnarholdings.github.io/AgentSwarm](https://girnarholdings.github.io/AgentSwarm/) | Cloudflare Workers, multi-pool inference routing, 223 tests | Describe an app in plain English and a swarm of cheap agents builds it in parallel — every file its own agent, priced before anything runs, online in one tap. Trivial parts fan out across free inference pools; only hard parts reach the paid model. |
| 3 | **TriDelPhi** | [girnarholdings.github.io/TriDelPhi](https://girnarholdings.github.io/TriDelPhi/) | Python 3.11–3.13, Apache-2.0, zero default network calls | A static *Agents Rule of Two* analyzer for GitHub Actions: it finds the CI job where an attacker's comment becomes remote code execution. Runs fully offline by default and never certifies a project as safe. |
| 4 | **FitForge** | [girnarholdings.github.io/FitForge](https://girnarholdings.github.io/FitForge/) | Next.js 15, SwiftUI (iOS 17+), Supabase, TypeScript shared package | Learns the equipment you have, the lifts you prefer and the movements you avoid, then substitutes equivalents by muscle group and movement pattern instead of handing out a generic plan. Macro targets follow Mifflin–St Jeor. |
| 5 | **VibeNYC** | [girnarholdings.github.io/VibeNYC](https://girnarholdings.github.io/VibeNYC/) | Python, GitHub Actions → Pages, static HTML | A living read on what's happening across New York tonight, built from official facts, local expertise and community signals — with every claim traceable back to its source. |
| 6 | **Hatch** | — *(private, runs on the fleet)* | Python, MoE routing, shared memory, fleet M2M bus | A local orchestrator running a three-machine fleet: four coding harnesses, a mixture-of-experts router, shared memory with nightly hygiene, a skill flywheel and a machine-to-machine bus. |
| 7 | **Hatch for iOS** | — *(private, no public build)* | SwiftUI, zero dependencies, VPN optional | Mission control for Hatch from a phone — cockpit (dreams, feed, routines), streaming chat, approvals and dispatch. |
| 8 | **CRE AI Agent** | — *(private, no public deployment)* | Python, Selenium/Firefox CDP scraping, Streamlit | Scrapes commercial listings past Akamai bot protection via Firefox remote-debugging, then serves the deal set through an interactive underwriting dashboard for per-deal deep dives. |

### Off the page right now

Three desk projects that used to have cards no longer do. The repositories and, where they
exist, the deployments are untouched — this is an editing decision about the directory, not a
retirement:

| Project | Why it is not on the page |
|---|---|
| **bolt.ceo** | Taken down for now, at the owner's instruction. It was the question box over the pipelines; it will come back when it is ready to be the front door again. BoltNews keeps its `news.bolt.ceo` subdomain and is unaffected. |
| **BetNews** | Live at [girnarholdings.github.io/BetNews](https://girnarholdings.github.io/BetNews/), but betting markets are a different pitch from the market desk, and mixing them blunted both. |
| **HousingTrends** | Private, with no public deployment. A card nobody can open does not earn its place on a page whose whole promise is that every door opens. |

If any of them goes back up, its card belongs in the desk grid and its snapshot in
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

Link convention: each card opens the project's live GitHub Pages deployment. Source
repositories are private, so there are no repository links. The three projects with no public
deployment — Hatch, Hatch for iOS and CRE AI Agent — are shown as explicitly non-clickable
plaques that say so, because the page promises that every door it draws as a door opens.
