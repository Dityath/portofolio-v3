/**
 * Decides whether the hero shows the live three.js render or stays on its
 * static SVG. Plain DOM on purpose: this runs on every visitor, including the
 * ones who will never qualify, so it must not drag a UI framework along.
 *
 * The decision is reactive — toggling reduced-motion mounts and unmounts the
 * scene, and resizing across the breakpoint swaps quality tier, rather than
 * either being read once at load.
 *
 * The three.js chunk is the heaviest thing on the page, so it is not requested
 * until the browser is idle after `load`, and never on data-saver or slow
 * connections (the static SVG stays).
 */
import { LAYOUT_BREAKPOINT, MOTION_QUERY } from '../../constants';
import type { Quality } from './sculpture';

type State = 'off' | 'loading' | 'on' | 'failed';

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return false;
    // Release the probe context right away; browsers cap live contexts and
    // three.js is about to create its own.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** `navigator.connection` is non-standard (Chromium); type only what is read. */
function isConstrainedConnection(): boolean {
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (!connection) return false;
  return (
    connection.saveData === true ||
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.effectiveType === '3g'
  );
}

/** Run `task` once the page has loaded and the main thread is idle. */
function whenIdleAfterLoad(task: () => void): void {
  const schedule = (): void => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(task, { timeout: 2000 });
    } else {
      window.setTimeout(task, 1200);
    }
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
}

const stage = document.querySelector<HTMLElement>('[data-sculpture-stage]');

if (stage && !isConstrainedConnection() && supportsWebGL()) {
  // Width no longer decides whether to render, only how: narrow viewports get
  // the lighter build. Reduced motion is still an outright veto — the bust
  // sways, turns and dissolves with scroll, which that preference asks us to
  // avoid — and so is a screen too short to pin the story (the same query
  // drives `data-motion`, so the poster and the static annotations line up).
  const wideEnough = window.matchMedia(`(min-width: ${LAYOUT_BREAKPOINT}px)`);
  const motionAllowed = window.matchMedia(MOTION_QUERY);

  let state: State = 'off';
  let teardown: (() => void) | null = null;
  let mounted: Quality | null = null;
  /** Flipped once the idle callback fires; until then nothing is imported. */
  let ready = false;

  const sync = async (): Promise<void> => {
    if (!ready) return;
    if (state === 'loading' || state === 'failed') return;
    const wanted = motionAllowed.matches;
    const quality: Quality = wideEnough.matches ? 'desktop' : 'mobile';

    if (wanted && state === 'off') {
      state = 'loading';
      try {
        const { mountSculpture } = await import('./sculpture');
        teardown = await mountSculpture(stage, quality);
        mounted = quality;
        state = 'on';
      } catch (error) {
        // The static SVG is already on screen and untouched, so there is
        // nothing to roll back — just stop trying.
        state = 'failed';
        console.warn('[sculpture] live render unavailable, keeping static fallback', error);
        return;
      }
      // Conditions may have flipped while the chunk was downloading.
      void sync();
    } else if (state === 'on' && (!wanted || mounted !== quality)) {
      // Also unmounts when only the tier changed: the model URL and pixel ratio
      // are read once at mount, so crossing the breakpoint has to remount to
      // pick them up. The `void sync()` below is what mounts the new tier.
      teardown?.();
      teardown = null;
      mounted = null;
      state = 'off';
      void sync();
    }
  };

  wideEnough.addEventListener('change', () => void sync());
  motionAllowed.addEventListener('change', () => void sync());
  whenIdleAfterLoad(() => {
    ready = true;
    void sync();
  });
}
