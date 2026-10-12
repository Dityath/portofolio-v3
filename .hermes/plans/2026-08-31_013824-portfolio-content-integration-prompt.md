# Portfolio Content Integration Prompt

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace the fictional placeholder content in Ditya’s Astro portfolio with accurate, professional, source-backed career content while preserving the existing visual identity, performance, and accessibility.

**Architecture:** Keep the existing Astro 7 static-site architecture and editorial engineering design. Treat content as structured data, reuse the current components where practical, and add only the minimum sections/components required to communicate Ditya’s positioning, selected work, services, experience, and contact information. Never invent metrics, responsibilities, technologies, or outcomes.

**Tech Stack:** Astro 7, TypeScript 7, plain Astro components, Three.js, existing CSS design tokens, Bun.

---

## Ready-to-use prompt

Copy everything inside the following block into the coding agent that will work on the portfolio repository.

```text
You are working on Ditya Athallah’s portfolio website.

Repository:
/Volumes/dityath-workspace/Projects/portofolio

Your task is to integrate real portfolio and career content into the existing website. This is primarily a content-architecture and content-migration task, not a visual redesign.

Work until the implementation is complete and verified. Do not stop after producing a plan. Do not commit or push unless explicitly asked.

# Primary objective

Turn the existing polished but placeholder-filled Astro site into a credible portfolio for Ditya’s current positioning as a Technical Lead who has experience across frontend engineering, UI/UX, project delivery, and multidisciplinary technical leadership.

The finished site should help Ditya:

1. explain his current professional positioning;
2. demonstrate real projects and career progression;
3. present services suitable for freelance or fractional technical-lead work;
4. give potential clients or recruiters a clear way to contact him;
5. preserve room for later expansion when current confidential projects are approved for publication.

# Sources of truth

Use the following sources in this priority order:

1. Curated analysis note:
   /Users/dityath/Documents/My Notes/00 Inbox/2026-08-31 - Inventaris Karier dan Bahan Portofolio Ditya.md

2. Structured legacy extraction:
   /Volumes/dityath-workspace/Projects/portofolio/content/legacy-portfolio-extract.json

3. Human-readable legacy extraction:
   /Volumes/dityath-workspace/Projects/portofolio/content/legacy-portfolio-extract.md

4. Legacy source repository and its images:
   /Volumes/dityath-workspace/Projects/legacy-portofolio

5. Current portfolio source:
   /Volumes/dityath-workspace/Projects/portofolio/src

The curated analysis note wins when sources conflict. Legacy wording is historical source material, not publication-ready copy.

# Non-negotiable factual rules

- Never fabricate metrics, user counts, team size, revenue, performance improvements, availability, client testimonials, responsibilities, or technical outcomes.
- Never publish credentials, credential IDs, private company data, employee information, internal architecture, or confidential project names unless already clearly public and safe.
- Distinguish hands-on implementation from leadership. Do not claim that Ditya personally implemented computer-vision models merely because he leads a team that includes computer-vision engineering.
- Current multidisciplinary leadership information comes from Ditya’s own statement. Phrase it conservatively: he leads or coordinates delivery across web, mobile, and computer-vision work; do not add team-size claims.
- If a fact needs confirmation, exclude it from rendered copy and leave a `TODO(content-review)` comment near the relevant data instead.
- Do not migrate casual, self-deprecating, or emotionally unsafe phrases from the legacy portfolio.
- Do not expose the local source paths in rendered HTML.

# Existing design and engineering constraints

Preserve the current design system and engineering decisions:

- Astro static output;
- no UI framework;
- existing dark editorial/engineering visual language;
- existing typography, grid, colors, spacing, and motion character;
- progressive enhancement: all essential content must remain readable with JavaScript disabled;
- reduced-motion behavior;
- accessible heading hierarchy, links, landmarks, focus states, and labels;
- existing Three.js sculpture and its static fallback;
- existing responsive breakpoint convention using `LAYOUT_BREAKPOINT` at 900px;
- no unnecessary dependencies.

Do not rewrite the site from scratch. Do not replace the visual system with a generic portfolio template.

# Current repository facts

Important existing files:

- `src/pages/index.astro` composes the homepage.
- `src/components/Hero.astro` contains the hero copy and accessible fallback headline.
- `src/data/roles.ts` drives the rotating two-word role headline. Every role must remain exactly two display words.
- `src/components/SelectedSystems.astro` renders project cards.
- `src/data/projects.ts` currently contains fictional placeholders: Relay, Forge, and Atlas.
- `src/components/ProjectCard.astro` renders the project schema.
- `src/components/Philosophy.astro` contains the engineering principle.
- `src/components/Header.astro` currently marks Lab, Notes, and About as “coming soon”.
- `src/components/Footer.astro` currently contains GitHub and `hello@dityath.dev`.
- `src/styles/global.css` defines the design tokens and shared behavior.

The placeholders Relay, Forge, and Atlas must not remain in the production output.

# Content direction

## 1. Hero

Make Technical Lead the primary positioning.

The no-JavaScript accessible/static headline and the first item in `src/data/roles.ts` must stay synchronized.

Use a concise hero description based on this direction:

“Technical lead guiding multidisciplinary product delivery across web, mobile, and computer vision—turning operational problems into practical systems.”

You may improve the sentence for clarity and tone, but preserve the meaning and do not add unsupported claims.

Keep rotating roles truthful and limited. A reasonable set is:

- Technical / Lead
- Software / Engineer
- Product / Engineer
- UX / Engineer
- Web / Developer

Every displayed role must remain two words because the existing headline layout requires it. Do not use “CTO”, “Head of Engineering”, “AI Engineer”, or “Computer Vision Engineer”.

Update hero metadata only when facts are supported. Keep Jakarta/Indonesia and availability language conservative. If availability for freelance has not been formally confirmed, use wording such as “Open to selected work” rather than “Available”.

## 2. Selected work

Replace Relay, Forge, and Atlas with three real public-safe projects:

1. Dashboard Dinas Kehutanan Provinsi Jawa Barat
2. SEAN-CSO Website
3. Wangsaff.js

Why these three:

- Dashboard Dishut demonstrates frontend engineering, GIS, WebGL/mapping, API integration, and real technical problem solving.
- SEAN-CSO demonstrates project leadership, stakeholder translation, and coordination between management and developers.
- Wangsaff.js demonstrates independent automation, Node.js, SQL, Docker, deployment, and an application that ran on a VPS.

Use source-backed descriptions. Keep them concise on the homepage.

Suggested safe content direction:

### Dashboard Dinas Kehutanan Provinsi Jawa Barat

Role: Frontend Developer

Summary direction:
“Geospatial information dashboard for West Java forestry data, built with React/Vite and interactive map layers using MapLibre and MapTiler.”

Technology candidates supported by the legacy source:
React, Vite, MapLibre, MapTiler, Tailwind CSS, Directus, Fastify, Docker, WebGL.

Do not imply sole ownership. Do not publish metrics that are not in the source.

### SEAN-CSO Website

Role: Website Project Manager

Summary direction:
“Content and community platform delivered for a collaboration involving PeaceGeneration and Deakin University, coordinating stakeholder feedback, developer progress, and technical delivery.”

Technology candidates supported by the legacy source:
Bedrock WordPress, PHP, Tailwind CSS, SQL, VPS.

Do not overstate organizational ownership or impact.

### Wangsaff.js

Role: Software Engineer / Independent Project

Summary direction:
“WhatsApp commerce automation prototype that kept customer service and catalogue access available while sellers were away, backed by Node.js, SQL, Sequelize, Docker, and VPS deployment.”

The legacy source says it ran for approximately six months. Only include that duration if the wording is clearly attributed to the project history and not presented as an unverified scale claim.

## 3. Project data model

Expand `src/data/projects.ts` only as much as needed. Prefer structured fields such as:

- index;
- title;
- short description;
- role;
- period or year when supported;
- tags/technology;
- optional public link;
- optional image;
- art variant;
- optional status label;
- optional case-study sections.

Do not create an over-generalized CMS architecture. YAGNI applies.

If adding project images:

- copy only selected, relevant assets from the legacy repository into a clearly named directory under `public/`;
- preserve source images without modifying the legacy repository;
- use descriptive filenames and alt text;
- optimize or resize only when necessary;
- keep the abstract technical art if it better preserves the current design—real content matters more than forcing screenshots into every card.

## 4. About section

Implement a real About section and turn the disabled About navigation item into a working anchor.

The About section should explain the progression:

- early foundation in frontend engineering and UI/UX;
- experience translating stakeholder needs into delivery;
- current work leading multidisciplinary technical delivery;
- practical engineering philosophy: choose technology based on the problem, not hype.

Do not copy the 2022–2023 About text verbatim. Rewrite it in a mature, concise voice.

Suggested tone:

“I started in frontend engineering and product design, then moved deeper into delivery and technical decision-making. Today I coordinate work across web, mobile, and computer-vision initiatives, balancing product needs, engineering quality, and practical constraints.”

Refine this based on the source note without inventing details.

## 5. Services section

Add a concise section describing work Ditya may offer to selected clients. Turn one appropriate navigation item into a real link; rename “Lab” to “Services” if that fits the existing navigation.

Use three service groups:

1. Technical Audit
   - codebase and architecture review;
   - technical-debt identification;
   - practical prioritized recommendations.

2. Fractional Technical Lead
   - technical decisions;
   - code-review process;
   - developer guidance;
   - bounded delivery coordination.

3. MVP Planning & Delivery Advisory
   - requirement clarification;
   - technology selection;
   - initial architecture;
   - backlog and delivery planning.

Do not promise 24/7 availability, guaranteed outcomes, or services unsupported by the source material.

## 6. Experience

Add a compact experience/timeline section if it can be integrated without cluttering the homepage.

Use the current LinkedIn chronology from the curated analysis note:

- Technical Lead — Nusapala Berkah Autonomous, June 2025–Present
- Project Engineer — ABAROBOTICS, May 2025–August 2025
- UI/UX Developer — ABAROBOTICS, October 2024–May 2025
- Career break, January 2024–October 2024
- IT Officer — PeaceGeneration Indonesia, June 2022–September 2023
- Frontend Developer — Braga Technologies, May 2022–December 2022

The career break may be presented neutrally or omitted from the homepage if the timeline remains truthful. Do not change dates to remove overlaps.

Legacy-only internships may be omitted or placed under “Earlier experience”; they are not required in the initial release.

## 7. Contact and call to action

Add a clear final CTA for selected freelance, consulting, or contract opportunities.

Use the existing `hello@dityath.dev` only as the current repository’s provisional public email. Add a `TODO(content-review)` comment asking Ditya to confirm that the address is active before deployment.

Include:

- email;
- GitHub;
- LinkedIn: https://www.linkedin.com/in/dityath/

Do not add phone numbers or private contact information.

## 8. Navigation

Remove dead or misleading “coming soon” navigation labels when their corresponding sections now exist.

A practical homepage navigation could be:

- Work
- About
- Services
- Contact

Use working anchor links and ensure sticky/header behavior remains accessible.

“Notes” may remain omitted until there is a real Notes section. Do not create an empty section just to satisfy the existing label.

## 9. Philosophy

The current principle is strong:

“Good engineering optimizes for the problem, not the trend.”

Keep it unless a small grammatical or typographic improvement is clearly beneficial. It should remain a core thematic bridge between Ditya’s technical-lead positioning and his project history.

# Content quality requirements

The writing must be:

- concise;
- professional but not corporate or inflated;
- specific without inventing metrics;
- confident without self-aggrandizement;
- understandable by both founders and technical reviewers;
- consistent in English across the public site;
- free of the grammar problems and casual jokes in the legacy portfolio.

Prefer outcome-oriented phrasing, but use only outcomes supported by source material.

Avoid empty phrases such as:

- passionate developer;
- cutting-edge solutions;
- results-driven visionary;
- world-class technology;
- revolutionary AI;
- 10x engineer.

# Implementation process

1. Inspect all relevant existing components and source data before editing.
2. Read the curated analysis and extracted JSON in full.
3. Write down a source-backed content mapping before implementation.
4. Update the project and role data.
5. Update hero copy and accessible fallback text.
6. Add About, Services, Experience, and Contact sections using the existing visual language.
7. Update navigation to real anchors.
8. Add selected project assets only if they improve the design.
9. Keep all uncertain content out of the rendered page and mark it with `TODO(content-review)` comments.
10. Verify responsive layout and accessibility.

# Likely files to modify

- `src/pages/index.astro`
- `src/components/Hero.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/SelectedSystems.astro`
- `src/components/ProjectCard.astro`
- `src/components/Philosophy.astro` only if needed
- `src/data/roles.ts`
- `src/data/projects.ts`
- `src/styles/global.css` only for genuinely shared styles

Likely files to create:

- `src/components/About.astro`
- `src/components/Services.astro`
- `src/components/Experience.astro`
- `src/components/Contact.astro`
- optionally `src/data/experience.ts`
- optionally `src/data/services.ts`

Do not create all optional files automatically if a simpler implementation is clearer.

# Verification

Run the actual commands and report their real output:

1. `bun run check`
2. `bun run build`

Then serve or preview the built site and verify at minimum:

- desktop viewport around 1440px;
- tablet viewport around 768px;
- mobile viewport around 375px;
- navigation anchors;
- no horizontal overflow;
- headline does not wrap into a third line;
- project cards remain readable;
- all important content is visible with JavaScript disabled;
- reduced-motion mode remains usable;
- keyboard focus is visible;
- all external links are validly formed;
- no placeholder names Relay, Forge, or Atlas appear in built output;
- no local filesystem paths appear in built HTML;
- no unsupported metrics or claims appear in the rendered site.

If the build emits an existing known limitation about Astro template type-checking under TypeScript 7, do not hide it; report it accurately and avoid introducing new errors.

# Acceptance criteria

The task is complete only when:

- the production homepage contains real, source-backed content;
- the hero clearly presents Ditya as a Technical Lead;
- the three fictional projects are fully removed;
- three real selected projects are presented professionally;
- About, Services, and Contact are real sections with working navigation;
- experience is represented clearly without altering dates;
- no confidential or unverified claims are published;
- the original design identity and progressive-enhancement behavior are preserved;
- `bun run check` and `bun run build` succeed;
- the final response lists changed files, content decisions, verification results, and every remaining `TODO(content-review)` item.
```

---

## Files likely to change during implementation

- `src/pages/index.astro`
- `src/components/Hero.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/SelectedSystems.astro`
- `src/components/ProjectCard.astro`
- `src/data/roles.ts`
- `src/data/projects.ts`
- New About, Services, Experience, and Contact components as needed

## Validation

The implementation agent must run:

```bash
bun run check
bun run build
```

It must additionally verify the built site at desktop, tablet, and mobile widths, confirm progressive enhancement and reduced-motion behavior, and search the built output for fictional placeholders and leaked local paths.

## Main risks and tradeoffs

- Current-role projects may be confidential; the first public release should prefer already-public historical work.
- Legacy prose contains useful facts but is not publication-ready.
- The strongest Technical Lead proof still needs concrete metrics and publication approval.
- Adding too many sections can weaken the site’s restrained editorial design; sections should remain compact.
- `hello@dityath.dev` is already in the repository but still needs confirmation before public deployment.
