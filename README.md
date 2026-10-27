# Apoorav Malik — Portfolio

A minimal, responsive portfolio built with Next.js App Router, React, TypeScript, and CSS. Fonts are bundled locally. No API keys or external services are needed.

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```sh
npm run build
npm start
```

Run `npm run typecheck` to check TypeScript.

For browser checks, run `npx playwright install chromium`, then `npm run build && npm run test:e2e`. These cover project filters, navigation, theme persistence, profile links, and screen widths from 320px to 1440px.

## Customize

Edit profile links, selected projects, and copy in `src/app/page.tsx`. Theme colors and responsive styles are in `src/app/globals.css`; metadata is in `src/app/layout.tsx`.

The project artwork is an illustrative preview made with HTML and CSS. Project links point to Apoorav's actual public repositories. Contact links use LinkedIn because no public contact email was provided. The light/dark theme preference is saved locally.

Deploy to any hosting platform that supports Next.js, using `npm run build` as the build command.
