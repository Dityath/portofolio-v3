# Product

<!-- impeccable:product-schema 1 -->

> Written 2026-10-11 without an interview: the owner asked for autonomous work
> and will review afterwards. Lines marked _(inferred)_ come from the repository
> and the original brief, not from a confirmed answer.

## Platform

web

## Users

- **Primary — people deciding whether to bring Ditya in** _(inferred)_: founders,
  product leads, and engineering managers evaluating a technical lead or advisor
  for a product that is messy, early, or stalled. They arrive from a link
  (LinkedIn, GitHub, a referral), skim for a few minutes, and decide whether to
  start a conversation.
- **Secondary — peers and recruiters** _(inferred)_: checking background,
  range, and how Ditya reasons about trade-offs.

## Product Purpose

A personal portfolio for Ditya Athallah ("Dityath"), a technical lead in
Indonesia. It exists to show *how Ditya thinks* — framing problems, mapping
constraints, making trade-offs visible — and to turn the right visitors into a
conversation (email). Success: a visitor can say what Ditya does, why it is
different, and how to reach him within one scroll.

## Positioning

"Thinking as design" (owner's brief): the reasoning behind a product is treated
as a design material in its own right. Ditya's path — UI/UX and frontend, then
project management, then technical leadership across web, mobile, and computer
vision — is the evidence that he can hold the product, the people, and the code
in one head.

## Capabilities and Constraints

- Static Astro 7 site, no UI framework; three.js loaded only behind a gate.
- Routes: `/`, `/work/`, `/work/<slug>/`, `/about/`, `/services/`,
  `/services/<slug>/`, `/blog/` (Medium RSS at build time), `/404`.
- Must stay readable with JavaScript off and respect reduced motion.
- Lint/format: Biome. CI: GitHub Actions running Biome, typecheck, build.

## Brand Commitments

- Name: "Dityath" / "Ditya Athallah"; wordmark `DITYATH / WORKSPACE`.
- Dark graphite ground, blueprint-blue accent, Inter Tight + IBM Plex Mono,
  Dionysus bust as the 3D hero object — owner asked to keep the look "roughly
  the same", modern, with a light 3D touch.
- Voice: plain, confident, specific. No hype, no self-deprecation, no
  "passionate about" filler.

## Evidence on Hand

- Experience (`src/data/experience.ts`): Technical Lead, Nusapala Berkah
  Autonomous (Jun 2025–present); Project Engineer and UI/UX Developer,
  ABAROBOTICS (Oct 2024–Aug 2025); IT Officer, PeaceGeneration Indonesia
  (2022–2023); Frontend Developer, Braga Technologies (2022).
- Project narratives in `content/legacy-portfolio-extract.md` (2022–2023 era):
  West Java forestry dashboard, SEAN-CSO website, Wangsaff.js, Testcov.id
  (1st place, Devday Hackathon 2021), Curio (design-thinking concept).
- **Absent — never fabricate:** metrics, client testimonials, pricing, details
  of current-employer projects, permission to publish client screenshots or
  live links (see `TODO(content-review)` notes), a confirmed public email
  (`hello@dityath.dev` is unverified).

## Product Principles

1. Show the reasoning, not just the result.
2. Every claim is something Ditya can defend in a conversation.
3. Calm over loud: the work should feel considered, never performed.
4. Fast and accessible by default; the 3D is a reward, never a requirement.

## Accessibility & Inclusion

WCAG 2.1 AA contrast, full keyboard support, `prefers-reduced-motion`
honoured everywhere, no content locked behind animation or WebGL.
