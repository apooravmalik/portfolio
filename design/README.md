# Apoorav Malik — portfolio concept canvases

Open [the gallery](index.html), or open the PNGs directly. Each canvas is 1536 × 1024 pixels. These are proposed designs for the next revision of the portfolio.

| Canvas | What to review |
| --- | --- |
| [01 — Symbol hero](canvases/01-symbol-hero.png) | An editorial introduction with a knot, a browser window, and a spark embedded in the sentence. |
| [02 — Theme reveal](canvases/02-theme-reveal.png) | Light, mid-transition, and dark states; the circular reveal starts at the toggle. |
| [03 — Analogy-led content](canvases/03-analogy-content.png) | Original writing explaining your actual projects through familiar objects and situations. |
| [04 — Loading sequence](canvases/04-loading-sequence.png) | A brief personal greeting, followed by the monogram settling into the header. |

## What I took from your references

Reviewed on 18 October 2026 using the live pages, rendered Chromium screenshots, and accessible page source. Chromium was used because no Browser/IAB tool was available in the session. Saved reference captures are in [references/](references/).

| Reference | Observed | Proposed adaptation for you |
| --- | --- | --- |
| [Sergey Bertagnini](https://www.sergeybertagnini.com/) | The introductory sentence includes small visual symbols. The theme control uses `document.startViewTransition()` and a circle expanding from the control over 650 ms. | Embed symbols that illustrate your own words. Keep a circular theme reveal while leaving layout and scroll position stable. |
| [Tanay Shinde](https://www.tanayshinde.me/) | The writing connects engineering, design, structure, and product feel. The about section uses an overlap metaphor. | Use original metaphors tied to your projects, with a plain description of what each project actually does. |
| [Abhee](https://abhee.dev/) | The opening sequence presents a small centered avatar and then a personal greeting before the fuller portfolio appears. | Use your `am.` mark and a short greeting, then move the mark into the header. |

The design combines those specific ideas with your name, projects, and orange accent. The wording is original. The illustrative project interfaces and abstract thumbnails in these images are concept artwork, not screenshots or evidence of project features. In particular, the theme storyboard's thumbnail captions are mood placeholders; use the real project names and verified project screenshots when building it. Session Ledger's generated GUI is illustrative: the real project is a CLI/MCP context layer, so its production preview should show its actual terminal workflow.

## How I would build it in your Next.js project

### 1. The hero: meaningful inline symbols

Use real HTML for the headline, with a small reusable `InlineSymbol` beside each relevant phrase. The knot represents a tangled idea, the window represents useful software, and the spark represents AI.

Render the window and spark as SVG. The knot can be an optimized illustration or SVG, with a short transform on hover. There is no need for a WebGL canvas or a continuously running 3D scene to achieve this look. Reserve an explicit size for every symbol so loading cannot shift the words. Wrap each phrase with its symbol on mobile; keep symbols decorative for screen readers.

The large PNG is a reference for implementation. The actual webpage's text, navigation, and controls should remain selectable, semantic HTML.

### 2. The light/dark switch: reveal the new palette

Keep the existing CSS theme variables and persisted theme preference. On activation:

1. Find the center of the theme button.
2. Start a same-document view transition while changing the root theme attribute.
3. After the new snapshot is ready, animate its circular clip from radius zero to the distance needed to cover the farthest viewport corner.
4. Use roughly 650 ms with an ease-in-out curve. The page content stays in place.

Use an immediate theme update if the API is unavailable or reduced motion is requested. Serialize rapid repeat clicks so overlapping transitions cannot leave the control out of sync. Resolve the saved theme before the first visible paint.

Technical references: [MDN: startViewTransition](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition), [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

### 3. The writing: metaphor, then a concrete explanation

Hero draft:

> I turn tangled ideas into useful software, with a little help from AI.

> I'm Apoorav, a full-stack developer exploring interfaces, data, and AI. I like tools that clear the noise and give you room to think.

About draft:

> Good software should feel like a clear desk. The important things are easy to find. The clutter stays out of the way. That's the feeling I try to build into interfaces, data tools, and AI experiments.

Project drafts:

- **InsightDuck — Clear the desk.** Messy data is a desk covered in loose notes. InsightDuck sorts the pile before you start thinking. Follow with the concrete description: AI-assisted CSV cleaning and data preparation.
- **Session Ledger — Keep the thread.** A bookmark for a coding agent's train of thought. Close a session; keep the context. Follow with the concrete description: a local-first context layer using SQLite, a CLI, and read-only MCP retrieval.
- **AutoPM — Move the work.** A project's to-do list, in the room where the conversation already happens. Follow with the concrete description: Telegram commands for creating, assigning, and tracking project tasks.

Use open project rows and generous spacing. Keep the metaphor short enough that the visitor can still understand the practical purpose at a glance.

### 4. The intro: a short greeting and a clean handoff

Use an `IntroSequence` client component with a small state machine: `arrive → greet → settle → complete`. The server-rendered portfolio sits underneath it from the start.

The storyboard's times describe a target feel, not an enforced wait. Tie completion to essential font/mark readiness, use a short maximum timeout, and do not wait for below-the-fold content. Remember completion in `sessionStorage` so repeat navigation goes straight to the portfolio. Storage failure should still allow the sequence to finish.

Animate the mark into its final header position using a measured transform; fade the greeting and reveal the page. Skip the motion for reduced-motion visitors. Make the intro decorative and avoid trapping keyboard focus or hiding the document if JavaScript fails.

## Implementation structure and checks

Keep most page content server-rendered. Isolate interaction into `ThemeToggle`, `IntroSequence`, and the small symbol components. Store project copy in one data file. Retain bundled fonts and use a restrained palette: near-white `#FAFAF8`, charcoal `#242622`, orange `#E56B3C`, and dark `#171A18`.

For the production revision, verify first visit, repeat visit, slow assets, storage failure, reduced motion, rapid theme clicks, keyboard navigation, and responsive widths from 320 px upward. Compare the built hero and content sections directly with their canvases. Replace the generated interface illustrations with verified project screenshots or faithful terminal previews.

## Generation record

Created with the built-in image generation tool. Exact prompts are saved in [prompts/](prompts/): [hero](prompts/01-symbol-hero.txt), [theme](prompts/02-theme-reveal.txt), [content](prompts/03-analogy-content.txt), and [intro](prompts/04-loading-sequence.txt).

The PNGs are the visual deliverables. The HTML gallery is a local viewer and needs no installation.
