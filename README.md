# Project-Map

Index of active projects. This repo publishes a landing page (`index.html`), titled
**ZeusBot — Project Directory**, via GitHub Pages at
**https://girnarholdings.github.io/Project-Map/**.

The page is a **two-tab** directory rather than a long scroll. Each tab is its own room with
its own visual world:

| Tab | Room | Contents |
|---|---|---|
| **Markets & Trading** | *the desk* — night trading terminal | Six systems that publish on a schedule |
| **Creative & Agentic** | *the floor* — an establishment after dark | Four products that run all the time |

Tabs deep-link (`#desk`, `#floor`), support arrow-key navigation, and use proper
`tablist`/`tab`/`tabpanel` roles. The tables below are the underlying source of truth, and
they list projects in the same order the page does.

## Design

Both rooms are deliberately dark — every product screenshot they frame is itself a dark UI,
and both rooms are night rooms. There is no light variant, by choice rather than omission.

**The desk** (default tab) keeps the trading-terminal treatment:

- **Palette lifted from the products, not invented.** Amber `#F5B93B` is the accent BoltNews,
  BoltFactors and FitForge already use. It appears as a hairline across the top of every
  screenshot.
- **Monospace as the display face** — the honest register for a room where every project is a
  terminal — against a system grotesque for running text.
- **The tape** shows real prices captured from the BoltNews desk at 2026-07-27 13:44 ET. It is
  explicitly labelled as a capture rather than a live feed, is not wired to any data source,
  and will not update. It belongs to the desk and is hidden on the floor.

**The floor** switches to gold-on-oxblood luxury:

- **Palette** of gold `#D4AF37` on oxblood velvet, taken from Grand Atlantic's own curtain and
  chip livery.
- **Playfair Display** (SIL Open Font License) as the display face, self-hosted from
  `assets/fonts/` as a latin-subset variable woff2 (61 KB for both roman and italic). Nothing
  is fetched from a font CDN at runtime. Because the floor panel is `hidden` until opened, the
  browser does not download the face until someone actually switches tabs.
- **Projects are plaques, not cards** — engraved double-rule frames with a gold "enter"
  control, so each one reads as a thing you press. Each is labelled by the room it is rather
  than an arbitrary number: the Floor, the Training Room, the Concierge, the Back Office.
- Screenshots are dimmed to `brightness(0.86)` to sit in the room's low light and come back to
  full brightness on hover — which also keeps the one light-themed product (VibeNYC) from
  glaring against the velvet.

### A note on imagery

There is **no stock photography on this page, and none should be added**. Getty Images and
similar libraries are licensed stock; republishing their work on a public Pages site would be
copyright infringement regardless of how the file was obtained. Unsplash, Pexels and Wikimedia
are all blocked by this environment's network policy anyway.

Everything visual here is either the owner's own work or generated for this repo:

- `assets/shots/*.jpg` — real screenshots of the owner's own deployed products.
- `assets/floor-velvet.jpg` — the oxblood drape, generated procedurally (layered CSS gradients
  plus an SVG `feTurbulence` grain, rendered to a 1600×900 JPEG in headless Chromium, 31 KB).
- The gold chip crest on the floor is inline SVG drawn to match Grand Atlantic's house mark.

## Card screenshots

Every image on the page is a **real screenshot of the actual deployed project**, not stylised
preview art. They live in `assets/shots/` (one JPEG per project, 1120×700).

They were captured by pulling each project's own built output through the GitHub API and
rendering it locally in headless Chromium, because this build environment's network policy
blocks `*.github.io` and cannot reach the live sites directly:

| Source of the build | Projects |
|---|---|
| `gh-pages` branch (deployed output committed) | BoltNews, BoltFactors, Earnings Screener, BetNews |
| Static site committed on `main` | Equity Screener (`docs/`), VibeNYC (`site/`), Grand Atlantic (`gateway/`) |
| Built from source locally (`npm ci`, Next.js static export) | FitForge |
| Project's own committed brand card | YouTube Briefings (`docs/share-card.png`) |

Caveats worth knowing before regenerating them:

- Two sites load webfonts from Google Fonts, which the sandbox also blocks, so those
  screenshots render in fallback faces and differ very slightly from production.
- Grand Atlantic opens on a splash screen; its screenshot is taken after clicking through to
  the training floor, which is the view worth showing.
- The screenshots are point-in-time. Dashboards that publish daily will have moved on — the
  footer records the capture date so the page never implies the numbers are current.
- **CRE AI Agent is deliberately not screenshotted.** It is a private tool operating on live
  broker listings and underwriting, so publishing its dashboard here would leak proprietary
  deal data. Its card is a non-clickable panel that says so.

## Favicon & link-preview assets

`assets/` holds the hosted icon and social files (`favicon.svg`, `favicon-32.png`,
`favicon-64.png`, `apple-touch-icon.png`, `icon-512.png`, `og-image.png`). These are committed
as real files rather than inline data URIs — link-preview crawlers (iMessage, Slack, X) and
iOS's apple-touch-icon need a fetchable URL and won't reliably resolve a `data:` URI.
`og-image.png` is a rendered 1200×630 card matching the page's design.

> **Account rename, July 2026:** this account renamed from `ZeusNightBolt` to `girnarholdings`
> (same account, same numeric ID). GitHub redirects repository URLs but **not** `*.github.io`
> Pages subdomains, so every link here points at `girnarholdings.github.io/*`. If a card 404s,
> check that the project's own Pages deploy has been re-triggered under the new namespace.

## 📡 Markets & Trading — *the desk*

Research pipelines that run themselves — each ingests messy public data on a cron and ships a
finished, readable briefing.

| # | Project | Live site | Tech | Description |
|---|---|---|---|---|
| 1 | **BoltNews** | [girnarholdings.github.io/BoltNews](https://girnarholdings.github.io/BoltNews/) | Python 3.12, multi-agent LLM pipeline, cron, GitHub Pages | Automated news desk for a fundamental long/short PM. Multi-agent discovery lanes sweep equities, rates, credit, FX, commodities, volatility and crypto, then write the pre-market, mid-day and weekend briefings. |
| 2 | **BoltFactors** | [girnarholdings.github.io/BoltFactors](https://girnarholdings.github.io/BoltFactors/) | Python, DuckDB/Polygon warehouse, cron (5× daily) | Quantitative factor briefings generated off the market-data warehouse, tracking regime shifts across value, momentum, quality and volatility. |
| 3 | **YouTube Briefings** | [girnarholdings.github.io/yt-briefing](https://girnarholdings.github.io/yt-briefing/) | Python, GitHub Actions → Pages, static HTML | Turns channel and video activity across a tracked list of creators into a structured, digestible briefing instead of an endless subscriptions feed. |
| 4 | **Equity Screener** | [girnarholdings.github.io/equity-screener](https://girnarholdings.github.io/equity-screener/) | Python, DuckDB/Polygon warehouse, pandas | Ranks low-priced, large-cap VTI names through seven deterministic scoring sleeves (RSI inflection, value, momentum, squeeze), plus a wave-stage classifier and a factor-momentum-tilted EV master score. |
| 5 | **Earnings Screener** | [girnarholdings.github.io/AI-Assisted-Earnings-Screener](https://girnarholdings.github.io/AI-Assisted-Earnings-Screener/) | Python, SEC EDGAR, DoltHub, DuckDB, LLM commentary | Cross-references the holdings universe against a SEC EDGAR/DoltHub earnings calendar to find the best setups heading into a print, reusing the screener's scoring engine and adding written commentary per name. |
| 6 | **BetNews** | [girnarholdings.github.io/BetNews](https://girnarholdings.github.io/BetNews/) | Python 3.11+ (stdlib only), Polymarket Gamma API, RSS, vanilla JS search | The same briefing discipline pointed at betting markets: consensus odds, positive-EV screens and underdog trends aggregated across Polymarket, Kalshi, DraftKings, FanDuel and 60+ other books and sources. |

## 🎭 Creative & Agentic — *the floor*

Things people use rather than things that publish — each shapes itself around a single person.

| # | Project | Live site | Tech | Description |
|---|---|---|---|---|
| 1 | **Grand Atlantic** | [girnarholdings.github.io/GrandAtlanticLive](https://girnarholdings.github.io/GrandAtlanticLive/) | React, Vite, vanilla JS, client-side only | A casino floor built to teach rather than take: Blackjack, Roulette, Baccarat, Craps and Poker trainers behind one front desk, sharing a single bankroll and walk-away goal across every table. |
| 2 | **FitForge** | [girnarholdings.github.io/FitForge](https://girnarholdings.github.io/FitForge/) | Next.js 15, SwiftUI (iOS 17+), Supabase, TypeScript shared package | Learns the equipment you have, the lifts you prefer and the movements you avoid, then substitutes equivalents by muscle group and movement pattern instead of handing out a generic plan. Macro targets follow Mifflin–St Jeor. |
| 3 | **VibeNYC** | [girnarholdings.github.io/VibeNYC](https://girnarholdings.github.io/VibeNYC/) | Python, GitHub Actions → Pages, static HTML | A living read on what's happening across New York tonight, built from official facts, local expertise and community signals — with every claim traceable back to its source. |
| 4 | **CRE AI Agent** | — *(private, no public deployment)* | Python, Selenium/Firefox CDP scraping, Streamlit | Scrapes commercial listings past Akamai bot protection via Firefox remote-debugging, then serves the deal set through an interactive underwriting dashboard for per-deal deep dives. |

### Not listed here

The five individual casino trainers (Blackjack, Poker, Roulette, Craps, Baccarat) are no
longer separate cards — **Grand Atlantic** is the front door to all five, and listing them
twice made the directory longer without making it more useful. Their repositories are
unchanged.

Link convention: each card opens the project's live GitHub Pages deployment. Source
repositories are private, so there are no repository links; the one project with no public
deployment is shown as an explicitly non-clickable card.
