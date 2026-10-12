export interface SceneDetail {
  p: number;
  chapter: number;
  cp: number;
}

export function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export function smoothstep(a: number, b: number, x: number): number {
  if (a === b) return x < a ? 0 : 1;
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

interface Scene {
  el: HTMLElement;
  top: number; // absolute document offset
  height: number;
  stage: number; // sticky `.scene-stage` height, 0 when absent
  chapters: number;
  /** Descendants that receive --p / --cp, or null to write on the scene root. */
  targets: HTMLElement[] | null;
  near: boolean;
  lastP: number; // last p that dispatched; -1 until first dispatch
  written: number; // last p written to the DOM; -1 forces the next write
}

const scenes = new Map<HTMLElement, Scene>();
let started = false;
let listening = false;
let rafId = 0;
let io: IntersectionObserver | null = null;

const root = (): HTMLElement => document.documentElement;
const motionOn = (): boolean => root().hasAttribute('data-motion');

function readChapters(el: HTMLElement): number {
  const n = Number.parseInt(el.dataset.chapters ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Opt-in: `data-scene-target="<selector>"` routes --p / --cp to matching descendants. */
function readTargets(el: HTMLElement): HTMLElement[] | null {
  const sel = el.dataset.sceneTarget;
  if (!sel) return null;
  try {
    return Array.from(el.querySelectorAll<HTMLElement>(sel));
  } catch {
    return [];
  }
}

function setVar(s: Scene, name: string, value: string): void {
  if (s.targets === null) {
    s.el.style.setProperty(name, value);
    return;
  }
  for (const t of s.targets) t.style.setProperty(name, value);
}

function measure(): void {
  const y = window.scrollY;
  for (const s of scenes.values()) {
    const r = s.el.getBoundingClientRect();
    s.top = r.top + y;
    s.height = r.height;
    s.stage = s.el.querySelector<HTMLElement>(':scope > .scene-stage')?.offsetHeight ?? 0;
    s.chapters = readChapters(s.el);
  }
}

function write(s: Scene, p: number, force: boolean): void {
  if (!force && p === s.written) return;
  s.written = p;
  const el = s.el;
  let chapter = 0;
  let cp = 0;
  setVar(s, '--p', p.toFixed(4));
  if (s.chapters > 0) {
    chapter = Math.min(s.chapters - 1, Math.floor(p * s.chapters));
    cp = clamp01(p * s.chapters - chapter);
    el.dataset.chapter = String(chapter);
    setVar(s, '--cp', cp.toFixed(4));
  }
  if (force || Math.abs(p - s.lastP) > 0.0005) {
    s.lastP = p;
    el.dispatchEvent(
      new CustomEvent<SceneDetail>('scene:progress', { detail: { p, chapter, cp } }),
    );
  }
}

function progress(s: Scene, scrollY: number, vh: number): number {
  // The stage pins for exactly (height - stage) px of scroll, so measure against it
  // to reach 1 at unpin. Falls back to the viewport height when there is no stage.
  const ref = s.stage > 0 ? s.stage : vh;
  const top = s.top - scrollY;
  if (s.height <= ref) return clamp01((ref - top) / (ref + s.height));
  return clamp01(-top / (s.height - ref));
}

function frame(): void {
  rafId = 0;
  const y = window.scrollY;
  const vh = window.innerHeight;
  for (const s of scenes.values()) {
    if (!s.near) continue;
    const top = s.top - y;
    s.el.toggleAttribute('data-active', top < vh && top + s.height > 0);
    write(s, progress(s, y, vh), false);
  }
}

function schedule(): void {
  if (!rafId) rafId = requestAnimationFrame(frame);
}

function onResize(): void {
  measure();
  schedule();
}

let ro: ResizeObserver | null = null;

function startListening(): void {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', schedule, { passive: true });
  ro = new ResizeObserver(onResize);
  ro.observe(root());
  measure();
  for (const s of scenes.values()) s.near = true;
  frame();
  // Real "near" flags come from the IntersectionObserver callback.
}

function stopListening(): void {
  if (!listening) return;
  listening = false;
  window.removeEventListener('scroll', schedule);
  ro?.disconnect();
  ro = null;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
}

function settleStatic(): void {
  for (const s of scenes.values()) {
    s.chapters = readChapters(s.el);
    setVar(s, '--p', '1');
    setVar(s, '--cp', '1');
    if (s.chapters > 0) s.el.dataset.chapter = String(s.chapters - 1);
    s.el.removeAttribute('data-active');
    s.lastP = 1;
    s.written = -1; // so the next live frame rewrites the vars
    s.el.dispatchEvent(
      new CustomEvent<SceneDetail>('scene:progress', {
        detail: { p: 1, chapter: Math.max(0, s.chapters - 1), cp: 1 },
      }),
    );
  }
}

function applyMode(): void {
  if (motionOn()) {
    startListening();
  } else {
    stopListening();
    settleStatic();
  }
}

function collect(): void {
  const found = document.querySelectorAll<HTMLElement>('[data-scene]');
  for (const el of scenes.keys()) {
    if (!el.isConnected) {
      scenes.delete(el);
      io?.unobserve(el);
    }
  }
  for (const el of found) {
    if (scenes.has(el)) continue;
    scenes.set(el, {
      el,
      top: 0,
      height: 0,
      stage: 0,
      chapters: readChapters(el),
      targets: readTargets(el),
      near: false,
      lastP: -1,
      written: -1,
    });
    io?.observe(el);
  }
  if (motionOn()) {
    measure();
    for (const s of scenes.values()) if (s.lastP < 0) write(s, 0, true);
    schedule();
  } else {
    settleStatic();
  }
}

/**
 * The scene's current progress, or null before the engine has measured it.
 * Lets late subscribers (the sculpture, mounted seconds after load) start at
 * the right pose instead of guessing from a CSS variable that may live on a
 * `data-scene-target` descendant.
 */
export function sceneProgress(el: HTMLElement): number | null {
  const s = scenes.get(el);
  if (!s) return null;
  if (s.written >= 0) return s.written;
  return s.lastP >= 0 ? s.lastP : null;
}

/** Idempotent: safe to call from several component scripts. */
export function initScenes(): void {
  if (typeof window === 'undefined') return;
  if (started) {
    collect();
    return;
  }
  started = true;

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const s = scenes.get(e.target as HTMLElement);
        if (s) s.near = e.isIntersecting;
      }
      if (listening) schedule();
    },
    { rootMargin: '100% 0px' },
  );

  collect();
  new MutationObserver(applyMode).observe(root(), {
    attributes: true,
    attributeFilter: ['data-motion'],
  });
  document.addEventListener('astro:page-load', collect);
  applyMode();
  // Read by the head script's safety net in BaseLayout.astro.
  root().dataset.scenes = 'ready';
}
