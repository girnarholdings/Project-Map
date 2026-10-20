# Project-Map

Index of active projects. This repo publishes a landing page (`index.html`), titled
**Girnar Holdings — Project Directory**, via GitHub Pages at
**https://girnarholdings.github.io/Project-Map/**.

The page is a **two-tab** directory rather than a long scroll. Each tab is its own room with
its own visual world:

| Tab | Room | Contents |
|---|---|---|
| **Markets & Trading** | *the desk* — night trading terminal | Eight systems that publish on a schedule |
| **Creative & Agentic** | *the floor* — the house itself, in lapis and gold | Eight products that run all the time |

Tabs deep-link (`#desk`, `#floor`), support arrow-key navigation, and use proper
`tablist`/`tab`/`tabpanel` roles. The tables below are the underlying source of truth, and
they list projects in the same order the page does.

## Design

Both rooms are deliberately dark — every product screenshot they frame is itself a dark UI,
and both rooms are night rooms. There is no light variant, by choice rather than omission.

**The desk** (default tab) keeps the trading-terminal treatment:

- **Palette lifted from the products, not invented.** Amber `#F5B93B` is the accent BoltNews,
  BoltFactors and bolt.ceo already use. It appears as a hairline across the top of every
  screenshot. FitForge has since rebranded to forge-copper and no longer matches, which is why
  that claim now names the desks rather than the whole portfolio.
- **Monospace as the display face** — the honest register for a room where every project is a
  terminal — against a system grotesque for running text.
- **The tape** shows real prices read off the BoltNews post-market edition of 2026-10-19,
  18:24 ET. It is explicitly labelled as a capture rather than a live feed, is not wired to any
  data source, and will not update. It belongs to the desk and is hidden on the floor. Refresh
  it by rebuilding BoltNews and re-reading its market-table values.

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

They were captured by pulling each project's own built output through the GitHub API and
rendering it locally in headless Chromium, because this build environment's network policy
blocks `*.github.io` and cannot reach the live sites directly:

| Source of the build | Projects |
|---|---|
| `gh-pages` branch (deployed output committed) | BoltNews, BoltFactors, Earnings Screener, BetNews |
| Static site committed on `main` | Equity Screener (`docs/`), VibeNYC (`site/`), Grand Atlantic (`gateway/`) |
| Built from source locally (`npm ci`, Next.js static export) | FitForge |
| Static landing committed on `main`, served over HTTP to capture | bolt.ceo (`public/`), AgentSwarm (`gateway-worker/public/`), TriDelPhi (`site/`) |
| Generated from source locally (`python -c "from src import builder; builder.build_dashboard()"`, the same command its deploy workflow runs) | YouTube Briefings |

Caveats worth knowing before regenerating them:

- Several sites load webfonts from Google Fonts, which the sandbox also blocks, so those
  screenshots render in fallback faces and differ very slightly from production.
- YouTube Briefings embeds video thumbnails and channel avatars from `i.ytimg.com` and
  `yt3.googleusercontent.com`, both of which are blocked here. Those images load fine for real
  visitors. Rather than ship a card full of broken-image glyphs — which would misrepresent the
  live site as broken — the capture hides any image that failed to load and frames the card on
  the header, Creator Pulse and creator filters, which render completely. Narrowing the capture
  viewport to 860 px pushes the video grid below the fold and does this naturally.
- Grand Atlantic opens on a splash screen; its screenshot is taken after clicking through to
  the training floor, which is the view worth showing.
- bolt.ceo, AgentSwarm and TriDelPhi reference assets by absolute path (`/styles.css`), which
  resolves to the filesystem root under `file://` and renders an unstyled page. Serve the
  landing directory over HTTP and capture from `127.0.0.1` instead. bolt.ceo additionally
  renders a `Launchpad unavailable (404)` line when captured without its Worker API, so its
  card is framed above that line rather than by editing the page.
- The screenshots are point-in-time. Dashboards that publish daily will have moved on — the
  footer records the capture date so the page never implies the numbers are current.
- **CRE AI Agent is deliberately not screenshotted.** It is a private tool operating on live
  broker listings and underwriting, so publishing its dashboard here would leak proprietary
  deal data. Its card is a non-clickable panel that says so.

## Favicon & link-preview assets

`assets/` holds the hosted icon and social files (`favicon-32.png`, `favicon-64.png`,
`apple-touch-icon.png`, `icon-512.png`, `og-image.png`), all derived from the Girnar Holdings
house mark and masked to a circular disc so the medallion stays legible at 32 px. The page
title, `og:site_name`, and both card titles all read **Girnar Holdings**. These are committed
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
| 1 | **bolt.ceo** | [bolt.ceo](https://bolt.ceo) | Cloudflare Worker, zero runtime deps, 246 offline tests | A market-intelligence LLM over the six pipelines below. A plain question returns a verdict, a technical read and a levels ladder; every figure is computed before any prose is generated, so a fabricated citation fails hard. Routing is deterministic regex across eleven analyst profiles, never a model call. |
| 2 | **BoltNews** | [news.bolt.ceo](https://news.bolt.ceo/) | Python 3.12, multi-agent LLM pipeline, cron, GitHub Pages | Automated news desk for a fundamental long/short PM. Multi-agent discovery lanes sweep equities, rates, credit, FX, commodities, volatility and crypto, then write the pre-market, mid-day and weekend briefings. |
| 3 | **BoltFactors** | [girnarholdings.github.io/BoltFactors](https://girnarholdings.github.io/BoltFactors/) | Python, DuckDB/Polygon warehouse, cron (5× daily) | Quantitative factor briefings generated off the market-data warehouse, tracking regime shifts across value, momentum, quality and volatility. |
| 4 | **YouTube Briefings** | [girnarholdings.github.io/yt-briefing](https://girnarholdings.github.io/yt-briefing/) | Python, GitHub Actions → Pages, static HTML | Turns channel and video activity across a tracked list of creators into a structured, digestible briefing instead of an endless subscriptions feed. |
| 5 | **Equity Screener** | [girnarholdings.github.io/equity-screener](https://girnarholdings.github.io/equity-screener/) | Python, DuckDB/Polygon warehouse, pandas | Ranks low-priced, large-cap VTI names through seven deterministic scoring sleeves (RSI inflection, value, momentum, squeeze), plus a wave-stage classifier and a factor-momentum-tilted EV master score. |
| 6 | **Earnings Screener** | [girnarholdings.github.io/AI-Assisted-Earnings-Screener](https://girnarholdings.github.io/AI-Assisted-Earnings-Screener/) | Python, SEC EDGAR, DoltHub, DuckDB, LLM commentary | Cross-references the holdings universe against a SEC EDGAR/DoltHub earnings calendar to find the best setups heading into a print, reusing the screener's scoring engine and adding written commentary per name. |
| 7 | **BetNews** | [girnarholdings.github.io/BetNews](https://girnarholdings.github.io/BetNews/) | Python 3.11+ (stdlib only), Polymarket Gamma API, RSS, vanilla JS search | The same briefing discipline pointed at betting markets: consensus odds, positive-EV screens and underdog trends aggregated across Polymarket, Kalshi, DraftKings, FanDuel and 60+ other books and sources. |
| 8 | **HousingTrends** | — *(private, no public deployment)* | Python, official research files only | Listing-free US housing reports for buyers, built only from official research files rather than broker inventory, so a ZIP-code report says what the public record supports and nothing more. |

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
repositories are private, so there are no repository links; the one project with no public
deployment is shown as an explicitly non-clickable card.
