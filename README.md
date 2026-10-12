# DITYATH / WORKSPACE

Personal portfolio — experimental engineering editorial.

Astro 7, built fully static (`output: 'static'`), with no UI framework at all.
The 3D sculpture is plain three.js behind a dynamic import, so a visitor who
does not qualify for the live render downloads a few KB of JavaScript;
three.js loads only after the gate passes, when the browser is idle.

## Architecture notes

- **Progressive enhancement.** Every element is readable with JavaScript off.
  The scroll-reveal styles are wrapped in `@media (scripting: enabled)`, and a
  safety net in the head script (`BaseLayout.astro`) drops the page back to its
  static composition if the bundled scripts never mark themselves ready.
- **Scroll scenes.** `src/lib/scroll-scenes.ts` drives the pinned home page
  sections (`Story`, `WorkRail`, `Path`). They pin only when `MOTION_QUERY`
  in `src/constants.ts` matches: motion allowed and a screen at least 600px
  tall. Otherwise they render as ordinary stacked content.
- **The bust has two renders.** The raster poster in `Story.astro` is the
  real, always-present image. `Sculpture/gate.ts` decides whether to load
  `Sculpture/sculpture.ts` over it, and only then cross-fades the poster out.
  The gate is reactive: crossing the breakpoint or a change in `MOTION_QUERY`
  mounts and unmounts the scene.
- **Breakpoint.** `LAYOUT_BREAKPOINT` in `src/constants.ts` (900px). CSS cannot
  read it, so it is mirrored by hand in every media query — grep before changing.
- **`site` in `astro.config.mjs`** drives the canonical URL, `og:url` and the
  absolute `og:image` URL. Set it to the real domain before deploying.

## Site structure

- `src/pages/` — routes: `index`, `about`, `blog`, `404`, `work/` (index and
  `[slug]`), `services/` (index and `[slug]`).
- `src/layouts/BaseLayout.astro` — document shell, meta and OG tags, header and footer.
- `src/components/` — home page scenes (`Story`, `WorkRail`, `Path`, `Contact`),
  other page sections (`About`, `Experience`, `SelectedSystems`, `ProjectCard`, …)
  plus shared pieces (`Header`, `Footer`, `SectionHead`, `Annotation`, `Arrow`).
- `src/components/Sculpture/` — the bust's three.js scene and its gate.
- `src/lib/` — the scroll scene engine and the Medium feed reader.
- `src/styles/global.css` — design tokens and global styles.
- `src/constants.ts` — shared constants such as `LAYOUT_BREAKPOINT`.

## Content

All copy lives in `src/data/*.ts`, not in the templates:

- `site.ts` — site identity, contact email, availability, navigation.
- `projects.ts` — selected work.
- `experience.ts` — experience timeline.
- `services.ts` — services offered.
- `method.ts` — the four moves told by the home page story.

Project facts (dates, roles, outcomes) must come from
`content/legacy-portfolio-extract.md`. Do not invent or embellish them.

Open `TODO(content-review)` items. Each must be resolved before deployment:

- Confirm `hello@dityath.dev` is active (`src/data/site.ts`).
- Confirm current availability (`src/data/site.ts`).
- Confirm permission to publish each client project, including project links
  and screenshots (`src/data/projects.ts`).
- Confirm the exact scope of each service and any conflict-of-interest
  constraints (`src/data/services.ts`, `Services.astro`).

## Design brief

- `PRODUCT.md` — product intent, audience and tone.
- `.impeccable/surfaces/` — the design brief for the surfaces. It is committed
  on purpose. Other `.impeccable/` folders (`review/`, `live/`, `mocks/`,
  `config.local.json`) are local tooling output and are git-ignored.

## Commands

- `bun install` — install dependencies
- `bun run dev` — dev server
- `bun run build` — typecheck, then build the static site into `dist/`
- `bun run preview` — serve the built output locally
- `bun run check` — typecheck only (`tsc --noEmit`)
- `bun run lint` — Biome lint and format check across the repo
- `bun run lint:fix` — Biome lint with safe fixes applied
- `bun run format` — Biome format, write mode
- `bun run ci` — `biome ci`, typecheck, then `astro build` (the same gates as CI)
- `bun run build:dionysus` — regenerate `public/models/dionysus-bust.glb` from
  `assets/dionysus-bust-source.glb`
- `bun run build:og` — regenerate the `public/og.png` social card from
  `src/data/site.ts` and the bust poster (run it after changing the name or role)

Set `MEDIUM_REQUIRED=1` on the deploy build to fail it when the Medium feed
cannot be fetched, instead of shipping the Writing page with only a profile link.
Image provenance notes (prompts, capture dates) live in `assets/provenance/`,
outside `public/`, so they are not deployed.

`check` runs `tsc --noEmit` rather than `astro check`, which cannot run under
TypeScript 7 yet — the native compiler does not expose the programmatic API the
Astro language server needs. That means `.astro` templates are not type-checked;
switching to TypeScript 6.x would restore it.

## Quality gates

- **Biome** (`biome.json`) handles linting and formatting for TypeScript,
  JavaScript, JSON, and CSS. Import organization is enforced by the assist
  action `organizeImports`.
- **`.astro` files.** Biome lints the frontmatter and scripts. The rules
  `noUnusedVariables` and `noUnusedImports` are turned off for `**/*.astro`,
  because Biome cannot see that a value is used in the template. Full Astro and
  HTML formatting is still experimental in Biome, so template markup is not
  formatted. Keep template markup tidy by hand.
- **GitHub Actions** (`.github/workflows/ci.yml`) runs on pushes to `main` and
  on pull requests. It installs with `bun install --frozen-lockfile`, then runs
  `bunx biome ci .`, `bun run check`, and `bunx astro build`. Dependencies are
  pinned by `bun.lock`.

Run `bun run ci` locally before pushing. It runs the same gates.

## Credits

- Dionysus bust — source in `assets/`, kept out of `public/` so the 42 MB
  original is never deployed. `scripts/build-dionysus.mjs` drops the unused
  specular map and re-encodes the remaining 4K PNGs as WebP, emitting two
  variants: `dionysus-bust.glb` (1K maps, ~445 KB) and `dionysus-bust-mobile.glb`
  (512px maps, ~312 KB). `gate.ts` picks between them at `LAYOUT_BREAKPOINT`.
