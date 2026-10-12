---
name: Dityath / Workspace
description: Annotated working drawing of how a technical lead reasons; graphite ground, blueprint blue, pencil-amber annotations.
colors:
  graphite-ground: "#0f1115"
  drafting-surface: "#171a21"
  drafting-surface-raised: "#1c2029"
  hairline: "#262b35"
  hairline-strong: "#333b49"
  control-edge: "#5b6474"
  chalk-text: "#f4f7fb"
  graphite-text: "#a3acba"
  muted-graphite: "#7a8391"
  blueprint-blue: "#4c8dff"
  accent-ink: "#06090f"
  pencil-amber: "#e5b25d"
typography:
  display:
    fontFamily: "Inter Tight Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(3rem, 8.4vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  display-sm:
    fontFamily: "Inter Tight Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.5rem, 5.6vw, 4.25rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  statement:
    fontFamily: "Inter Tight Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(3rem, 8.4vw, 6rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Inter Tight Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter Tight Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.375rem, 2.2vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "Inter Tight Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.125rem, 1.4vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Inter Tight Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Inter Tight Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.12em"
rounded:
  none: "0"
  dot: "50%"
spacing:
  col-gap: "clamp(1rem, 2vw, 2rem)"
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  block: "clamp(2.5rem, 5vw, 4rem)"
  page-top: "clamp(3rem, 7vw, 6rem)"
  section: "clamp(6rem, 12vw, 10rem)"
  header: "4rem"
  container: "76rem"
components:
  button-primary:
    backgroundColor: "{colors.blueprint-blue}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.none}"
    padding: "0.95rem 1.4rem"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.chalk-text}"
    rounded: "{rounded.none}"
    padding: "0.95rem 1.4rem"
  nav-link:
    textColor: "{colors.graphite-text}"
    height: "2.75rem"
  nav-link-current:
    textColor: "{colors.chalk-text}"
  project-plate:
    backgroundColor: "{colors.drafting-surface}"
    rounded: "{rounded.none}"
    padding: "clamp(1.25rem, 2.5vw, 2.5rem)"
  annotation-label:
    textColor: "{colors.pencil-amber}"
    typography: "{typography.label}"
  callout-label:
    textColor: "{colors.pencil-amber}"
    typography: "{typography.label}"
  work-panel:
    backgroundColor: "{colors.drafting-surface}"
    rounded: "{rounded.none}"
    padding: "clamp(1rem, 3vw, 2.5rem)"
  contact-email:
    textColor: "{colors.chalk-text}"
  meta-label:
    textColor: "{colors.muted-graphite}"
    typography: "{typography.label}"
---

# Design System: Dityath / Workspace

## Overview

**Creative North Star: "The Annotated Working Drawing"**

The site is a technical drawing of a person's reasoning, laid on a dark graphite sheet. Everything structural is drafted: 1px hairlines divide sections, a shared 12-column grid carries page intros and project plates on the same tracks, and progress rails and ruled rows mark the sheet as a working surface. On top of that build layer sits a second, human layer: pencil-amber annotations with dot terminals and leader lines, used only where a thought is being explained.

Density is calm and editorial. Large tightly tracked display type opens each page, sections breathe on generous vertical rhythm, and nothing floats on a shadow. Depth comes from real geometry (the 3D Dionysus bust, a few degrees of pointer tilt on project plates), never from elevation chrome. The homepage is a scroll story: pinned scenes whose progress is driven by the scroll position, so the drawing is made while the visitor scrolls (frames and rulers draw around the bust, the bust turns and dissolves into points, the work slides past, the career line draws itself). Every scene also exists as a complete static composition for reduced motion and for no JavaScript.

Two type voices split the work: Inter Tight for every word a person reads, IBM Plex Mono for data (dates, stack, coordinates, indices, annotation and callout labels).

**Key Characteristics:**
- Graphite dark ground with a single blueprint-blue accent and an amber reserved for annotations and drawn marks.
- Square corners everywhere; the only round shapes are 6px dot terminals and status dots.
- Hairline rules, not cards or shadows, separate content.
- Uppercase, tightly tracked display headlines; one outline line in the role headline pair.
- Motion is drafting motion, scrubbed by scroll: lines draw in, labels step forward, panels slide; it animates only transform, opacity, stroke-dashoffset, and clip-path, and settles to a static composition under reduced motion or without JavaScript.

## Colors

A near-monochrome graphite sheet with two inks: blueprint blue for the build, pencil amber for the reasoning.

### Primary
- **Blueprint Blue** (`blueprint-blue`): the system/build ink. Primary button fill, focus ring (2px outline, 3px offset), text selection, current-nav underline, "Read the case" CTAs, link hover, availability dot, the accent tick above page titles, the rim light on the 3D bust. On the homepage: the story progress rail fill and active tick, the chosen path in the Decide drawing and the one filled cell of the Build grid, Path station pips and years, and the underline under the contact email.

### Secondary
- **Pencil Amber** (`pencil-amber`): the reasoning layer only. Annotation labels, leader lines, and dot terminals: the four story callouts (Frame, Constrain, Decide, Build), the Frame and Constrain chapter drawings around the bust, and the question marks on case pages.

### Neutral
- **Graphite Ground** (`graphite-ground`): page background, header background, the fill behind outline display type.
- **Drafting Surface** (`drafting-surface`): project plates and work-rail plates, skip links; row hover tint is this color mixed at 70%.
- **Drafting Surface Raised** (`drafting-surface-raised`): inner faces inside line-drawn project art only. Muted text does not meet AA on it.
- **Hairline** (`hairline`): every 1px rule, section divider, header border on scroll, the unfilled story progress rail.
- **Hairline Strong** (`hairline-strong`): plate border on hover, inactive rail ticks, the scroll-cue line, the Path line, the rejected path in the Decide drawing, scrollbar thumb.
- **Control Edge** (`control-edge`): quiet button and menu-toggle borders (3.17:1 on ground, for non-text contrast).
- **Chalk Text** (`chalk-text`): headings and primary text.
- **Graphite Text** (`graphite-text`): body copy, ledes, chapter lines, nav links at rest, the outline stroke of the role headline.
- **Muted Graphite** (`muted-graphite`): mono metadata, dates, tags, wordmark suffix, rail tick labels, scroll cue. 4.9:1 on ground; do not darken.
- **Accent Ink** (`accent-ink`): text on blueprint blue.

### Named Rules
**The Two Inks Rule.** Blue is the build, amber is the thinking. Amber appears only as annotation (label, leader line, dot terminal, drawn frame or ruler); it is never a button, link, or heading color. Inside an amber drawing, blue marks the thing that gets built (the chosen path, the shipped cell).

**The Muted Floor Rule.** Muted Graphite holds AA only on Graphite Ground and Drafting Surface. Small muted text never sits on the raised surface.

## Typography

**Display Font:** Inter Tight Variable (with system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Inter Tight Variable
**Label/Mono Font:** IBM Plex Mono 400/500 (with ui-monospace, SF Mono, Menlo)

**Character:** A compressed grotesk set big and tight reads like a drawing title block; the mono reads like the dimensions and notes written onto it.

### Hierarchy
- **Display** (700, `display`, 0.94, -0.035em, uppercase): page titles and the homepage role headline, which pairs a solid line with an outline line (Graphite Ground fill, 3px Graphite Text stroke painted behind the fill). The pinned story's chapter verbs use the same size, weight, and case, one at a time.
- **Display Small** (600, `display-sm`, 1, -0.035em): scene titles on the homepage (How I got here), and the step-down for display-size type below 900px (role headline, chapter verbs, static move verbs, Path words).
- **Statement** (600, `statement`, 1, -0.035em, sentence case): display-size sentences and section openers in the scroll story: the work-rail intro title and the closing contact sentence (max 16ch). Path station words use this size at 700.
- **Headline** (600, `headline`, 1.1, -0.03em): section heads and project titles, including work-rail panels. The contact email uses this size at 550.
- **Title** (600, `title`, 1.2, -0.02em): case-study block heads, blog post titles, chapter lines (400, Graphite Text, 24ch).
- **Lede** (400, `lede`, 1.5): the one-sentence intro under a display title, 34 to 60ch; work-rail project questions at 500 / 1.3.
- **Body** (400, 1rem, 1.6): Graphite Text, capped at 65ch in prose and 45 to 52ch beside plates.
- **Small** (400, 0.8125rem, 1.5): annotation body text.
- **Label** (Plex Mono 400, 0.75rem, 0.12em, uppercase): dates, stack lists joined by " · ", coordinates, indices, annotation and callout labels, rail tick labels, the scroll cue, the wordmark.

### Named Rules
**The Data Voice Rule.** Plex Mono carries data and labels only. Sentences, headings, and buttons are always Inter Tight.

**The One Display Rule.** One uppercase display line is on screen at a time: the page title, or in the pinned story the active chapter's layer. Section openers further down use Statement or Display Small in sentence case, never a second uppercase display.

## Layout

A centered container (`container`, 76rem) with fluid gutters (`gutter`). Page intros, project rows, and case/service blocks sit on a shared 12-column grid with `col-gap`: project rows alternate 7 plate / 5 info and flip; case and service detail blocks use a 4-column head and an 8-column body. Sections are separated by `section` vertical padding plus a top hairline when stacked; blocks inside a section use `block`. The header is sticky at `header` height; scroll padding matches it.

**Scroll scenes.** A scene is a tall section (its height set per scene, e.g. 600vh for the story, 220vh for Path, viewport plus track overflow for the work rail) holding a stage that sticks under the header and fills the remaining viewport height (100svh minus `header`). Pinning applies only while motion is on; otherwise the stage is ordinary flow. The story stage splits copy (columns 1 to 6) and the bust (6 to the end), with a 1px progress rail in the left gutter whose tick labels appear from 1200px. The work rail is a horizontal track of panels starting at the content column's left edge (project panels `min(78vw, 68rem)`, narrow intro `clamp(16rem, 24vw, 22rem)` and outro `clamp(14rem, 20vw, 18rem)` columns so the first and last project fill the screen, gap `clamp(1rem, 2.5vw, 2rem)`). Path lays three stations on a three-column grid under a horizontal line.

**Responsive.** One layout breakpoint at 900px (the source of truth is `LAYOUT_BREAKPOINT` in `src/constants.ts`, mirrored by hand in every media query): below it every grid collapses to a single column; the pinned story stacks the bust (36% of the stage) above the copy and drops the progress rail; the work rail never pins and becomes a vertical sequence of projects; Path turns vertical with its line at the left and stops pinning. Path also stops pinning on viewports under 700px tall, and nothing pins below 600px tall (`MOTION_QUERY`). Without motion on wide screens the work rail becomes a vertical sequence of 7/4 plate-and-info rows that alternate sides. The nav collapses to a full-width menu at 760px; the wordmark suffix drops at 560px. Interactive targets keep a 2.75rem minimum block size.

## Elevation & Depth

The system is flat: no UI box-shadows. Depth is tonal (ground, surface, raised surface) and geometric. The only shadow is a blurred radial contact shadow under the 3D bust, which belongs to the object, not to the UI.

### Named Rules
**The Real Depth Rule.** If something needs depth, give it geometry (perspective, translateZ, the 3D bust), not a drop shadow. Pointer tilt on plates is capped at 4 degrees and disabled for coarse pointers and reduced motion.

**The Front-Facing Rule.** The bust always faces the visitor: scroll, sway, and pointer yaw together are clamped to ±0.6 rad, so the hollow back of the scan never shows. It is the only 3D object.

## Shapes

Square corners throughout (`rounded.none`): buttons, plates, panels, menus, inputs, Path pips (9px squares), Build grid cells. The only circles are 6px dot terminals (amber on annotations and callouts, blue on status/availability). Lines are 1px. Recurring drafting marks: a 2rem accent tick above page titles, leader lines ending in a dot, progress-rail ticks, and the chapter drawings (corner-bracketed dashed frame, ruler pair with ticks, a forked decision path with the chosen branch in blue, a 7 by 5 grid of square cells).

## Components

### Buttons
Plain drafted rectangles, confident but not loud.
- **Shape:** square (0 radius), 1px border.
- **Primary:** Blueprint Blue fill and border, Accent Ink text, Inter Tight 500 at 0.9375rem, padding 0.95rem 1.4rem.
- **Hover / Focus:** primary lightens to 80% accent mixed with white; trailing arrow nudges 4px right over 0.25s `ease-out`. Focus is the global 2px blue outline at 3px offset.
- **Quiet:** transparent, Chalk Text, Control Edge border; border turns blue on hover.

### Arrow Icon
The only arrow in the system: an authored 16-unit SVG (right, left, up-right), 1.5 stroke with square caps, `currentColor`, sized 1em and dropped 0.125em to sit on the text baseline. Used in buttons, arrow links, work-rail CTAs, Path, and the contact email.

### Text Links
- **Arrow link:** Graphite Text, turns blue on hover, trailing arrow nudges 4px right.
- **Card CTA:** blue, 500 weight, same nudge, triggered by hovering the whole row, plate, or panel.

### Cards / Containers
There are no cards. Content is either a **plate** or a **ruled row**.
- **Plate:** Drafting Surface, 1px hairline border, square, fluid padding; border strengthens to Hairline Strong on hover. Holds line-drawn SVG project art.
- **Ruled row:** list items divided by hairlines top and bottom (services, blog, static story moves); hover tints the row with Drafting Surface at 70%.

### Navigation
Wordmark in mono 500 ("DITYATH" in Chalk Text, "/ WORKSPACE" in Muted Graphite) left; nav links right in Inter Tight 0.9375rem, Graphite Text, Chalk on hover. The current page is Chalk Text with a 1px blue underline at 0.4em offset. A compact quiet button ("Contact") ends the row. The header border is transparent at the top and appears on scroll. Under 760px a bordered "Menu" toggle opens a full-width panel of Title-size links divided by hairlines; without JavaScript the nav simply wraps under the brand.

### Annotation (signature)
The reasoning layer on case pages. A 6px amber dot, a 1px amber leader, then a mono uppercase amber label, with optional Small body text in Graphite Text (max 28ch). Mirrors for right alignment.

### Callout (signature)
The annotation anchored to the bust. A 6px amber dot sits on a point of the model (crown, brow, mouth, shoulder); a 1px amber leader runs horizontally from it to a mono uppercase amber label in the stage's left or right edge zone, clear of the silhouette. Labels always sit outside the silhouette, never on the face; crown and shoulder labels go left, brow and mouth right. The dot is placed from poster-relative fractions by default (pure CSS, so it works without JavaScript), then follows points projected from the live 3D model via the `sculpture:anchors` event. Placement moves only `transform` (translate for dot and label, scaleX for the leader). In the pinned story all four sit at 60% opacity in the intro, then the active chapter's callout is full strength and the others drop back to 50%.

### Scroll Scene (motion contract)
The engine behind every pinned homepage section.
- **Markup:** a section with `data-scene` (and the `scene` class for pinning) containing one sticky stage. `data-chapters="n"` splits progress into n chapters; `data-scene-target="<selector>"` routes the progress variables to matching descendants instead of the section.
- **Outputs:** `--p` (0 to 1 across the pin), `--cp` (0 to 1 within the current chapter), `data-chapter` (index) and `data-active` (in view) on the section, and a `scene:progress` event carrying `{ p, chapter, cp }` for scripts such as the bust and the work rail.
- **Motion flag:** an inline head script sets `html[data-motion="on"]` when `prefers-reduced-motion: no-preference`, and removes it live when the preference changes. Pinning, hidden chapter layers, and scrubbed drawings are all written under that flag.
- **Static settle:** with the flag off, the engine stops listening and writes `--p` and `--cp` as 1 with the last chapter selected, so every scene renders finished. With JavaScript off the flag is never set and the same static CSS applies.
- **What moves:** chapter layers enter and leave by 24px translate plus opacity (0.5s); chapter drawings draw by `stroke-dashoffset` against `pathLength="1"`; the progress rail fills by `scaleY(--p)`; the work track translates horizontally while each plate reveals by `clip-path` inset and scales from 0.94; Path's line draws by `stroke-dashoffset`, pips scale in, words reveal by `clip-path`, lines fade and rise; the contact sentence reveals word by word (0.6em rise, 60ms stagger). Nothing scroll-linked animates layout, color, or size.

### Story
The pinned five-chapter opening: the role headline with two actions, then Frame, Constrain, Decide, Build, each a Display verb and one line beside the bust with its own drawing and callout. A Muted "Scroll" cue with a repeating 1px line sits at the bottom of the intro chapter. In-page jumps skip straight past the pin. Statically, the bust shows all drawings and callouts at once and the four moves follow the actions as ruled rows.

### Work Rail
A horizontal sequence: an intro panel (Statement title, mono count), one panel per featured project (plate with line art, Headline title, question at Lede 500, blue "Read the case" CTA), and an outro arrow link. Pinned and scroll-driven on wide screens with motion; a plain vertical sequence under 900px; a vertical alternating sequence on wide screens without motion. Project figures fill their plate. Keyboard focus on an off-screen panel scrolls it into the centre.

### Path
Three career stations (Design, Build, Lead) on a 1px Hairline Strong line that draws with scroll: a 9px blue square pip, a large word, a blue mono year, and one Graphite line (26ch).

### Contact
Closing Statement sentence, the email at Headline size with a 1px blue underline (turns blue on hover), and a mono row with the blue availability dot and profile links.

### Section Head
Headline-size title, then a hairline rule filling the rest of the row, then an optional mono note in Muted Graphite (hidden under 620px).

### Page Intro
2rem blue tick, uppercase Display title, Lede, optional mono meta line; closed by a hairline.

### Sculpture Stage
The Dionysus bust: a static WebP poster first, cross-faded to a transparent three.js canvas (1.1s) only after the canvas paints, rim-lit in Blueprint Blue. Reduced motion, save-data, and missing WebGL keep the poster. In the story, scroll progress turns it within the front-facing limit, dollies in slightly, and late in the Build chapter dissolves the mesh into points as the Build grid settles in.

## Do's and Don'ts

### Do:
- **Do** separate content with 1px hairlines (`hairline`) and tonal surfaces, never shadows.
- **Do** keep every corner square; reserve circles for 6px dot terminals.
- **Do** use Pencil Amber only for annotations and drawn marks: dot, leader, mono label, frame, ruler.
- **Do** set dates, stacks, coordinates, and indices in Plex Mono 0.75rem uppercase at 0.12em.
- **Do** align new sections to the 12-column grid and collapse to one column at 900px.
- **Do** build scroll motion on the scene engine and animate only transform, opacity, stroke-dashoffset, and clip-path.
- **Do** give every scene a finished static composition under `html:not([data-motion="on"])`, so reduced motion and no JavaScript see the whole story.
- **Do** keep callout labels in the stage's edge zones with the leader running to a dot on the model.
- **Do** use the authored Arrow icon for every arrow.

### Don't:
- **Don't** use amber for buttons, links, headings, or decoration.
- **Don't** add box-shadows, rounded cards, or gradient fills.
- **Don't** set sentences or headings in Plex Mono, or data in Inter Tight.
- **Don't** put Muted Graphite text on Drafting Surface Raised.
- **Don't** tilt or rotate interface elements beyond 4 degrees, or turn the bust beyond ±0.6 rad.
- **Don't** use Unicode glyphs (→ ← ↗) as icons.
- **Don't** hide content behind motion: nothing may start invisible unless the motion flag or a scripting guard is set.
