/**
 * The live sculpture render.
 *
 * Behaviour: the bust faces front (matching the poster raster) and never
 * auto-rotates. Scroll progress `p` (from `scene:progress` events on the nearest
 * `[data-scene]` ancestor, else on the stage itself) turns it up to 0.55 rad,
 * dollies the camera in slightly, and past p ~ 0.78 dissolves the mesh into a
 * point cloud. Total yaw is clamped to +-0.6 rad so the unfinished back of the
 * scan is never visible. Four anchor points on the mesh surface are projected
 * when they move into a `sculpture:anchors` CustomEvent on the stage (stage-
 * relative px), so callout leaders can follow the model without per-frame
 * style invalidation. Rendering is throttled while the pose is at rest.
 *
 * Loaded only via dynamic import from `gate.ts`, so three.js never reaches
 * devices that cannot (or should not) show it. Deliberately plain three.js:
 * a React renderer would cost ~190 KB of runtime to draw a single mesh.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { sceneProgress } from '../../lib/scroll-scenes';

/**
 * Which build of the bust to fetch, and how hard to drive the renderer for it.
 * Phones get the 512px-map GLB (~130 KB lighter) and a lower pixel-ratio cap:
 * the bust is roughly a third the size there, so the detail is not resolvable,
 * and the saved fill rate is battery. Keep in step with VARIANTS in
 * scripts/build-dionysus.mjs.
 */
export type Quality = 'desktop' | 'mobile';

const MODELS: Record<Quality, { url: string; maxPixelRatio: number }> = {
  desktop: { url: '/models/dionysus-bust.glb', maxPixelRatio: 2 },
  mobile: { url: '/models/dionysus-bust-mobile.glb', maxPixelRatio: 1.5 },
};

const CAMERA_FOV = 32;
const CAMERA_DISTANCE = 3.5;
/** Camera distance at the closest point of the scroll "lean in" (p = 0.5). */
const CAMERA_DISTANCE_NEAR = 3.32;
/** Hard yaw limit (rad); beyond this the hollow back of the scan would show. */
const MAX_YAW = 0.6;
const SCROLL_YAW = 0.55;
const SWAY_AMPLITUDE = 0.05;
const SWAY_PERIOD_S = 8;
const POINTER_YAW = 0.08;
const MAX_POINTS = 12000;
/** Minimum change (px) before a new `sculpture:anchors` event is dispatched. */
const ANCHOR_EPSILON = 0.5;
/** Idle (pose at rest) render rate caps, in frames per second. */
const IDLE_FPS: Record<Quality, number> = { desktop: 30, mobile: 24 };
/** Pointer activity keeps full-rate rendering for this long (ms). */
const POINTER_ACTIVE_MS = 300;
/** |smoothP - targetP| above this counts as a material pose change. */
const POSE_EPSILON = 1e-3;
/** Point size as a fraction of drawing-buffer height at the camera distance. */
const POINT_SIZE_FRACTION = 0.0035;

/**
 * Anchor positions as fractions of the model bounding box
 * (x from left, y from bottom): crown, brow/eye, mouth/chin, shoulder.
 */
const ANCHOR_FRACTIONS: ReadonlyArray<readonly [number, number]> = [
  [0.5, 0.93],
  [0.62, 0.7],
  [0.52, 0.56],
  [0.3, 0.28],
];

const POINT_VERTEX = /* glsl */ `
  uniform float uDissolve;
  uniform float uBufferHeight;
  uniform float uPixelRatio;
  uniform float uPointFraction;
  attribute vec3 aRandom;
  varying float vFade;
  void main() {
    vec3 dir = normalize(position + vec3(0.0001));
    // ~70% of points hug the surface (tracing the bust); ~30% drift away and fade faster.
    float w = aRandom.x * 0.5 + 0.5;
    float drift = step(0.7, w);
    float driftAmt = drift * (0.35 + 0.65 * (w - 0.7) / 0.3);
    float reach = mix(0.04 * (0.5 + 0.5 * aRandom.y), 0.22 * driftAmt, drift);
    vec3 displaced = position + (dir * 0.7 + aRandom * 0.3) * uDissolve * reach;
    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    // Soft fade near the canvas border only, so there is no hard box edge.
    float border = 1.0 - smoothstep(0.72, 0.94, max(abs(ndc.x), abs(ndc.y)));
    vFade = border * (1.0 - drift * 0.55 * uDissolve);
    float size = uPointFraction * uBufferHeight * 3.4 / -mv.z;
    gl_PointSize = clamp(size, 2.0 * uPixelRatio, 3.2 * uPixelRatio);
    gl_Position = clip;
  }
`;

const POINT_FRAGMENT = /* glsl */ `
  uniform float uDissolve;
  uniform vec3 uColor;
  varying float vFade;
  void main() {
    vec2 c = abs(gl_PointCoord - 0.5) * 2.0;
    float edge = 1.0 - smoothstep(0.7, 1.0, max(c.x, c.y));
    gl_FragColor = vec4(uColor, uDissolve * 0.9 * edge * vFade);
    #include <colorspace_fragment>
  }
`;

/**
 * Share of the framed height the model fills. The remainder is breathing room
 * for the hair and for the scroll-driven turn, which widens the silhouette.
 */
const FRAME_FILL = 0.86;

/**
 * Target height of the normalized model, derived from the camera rather than
 * hard-coded. The previous fixed 2.3 exceeded the 2.007 units this lens actually
 * frames, so the model was always cropped ~15%; the marble bust hid that in its
 * pedestal, but a head-and-shoulders bust loses the head to it.
 */
const MODEL_HEIGHT =
  2 * CAMERA_DISTANCE * Math.tan((CAMERA_FOV / 2) * THREE.MathUtils.DEG2RAD) * FRAME_FILL;
/** Guards the damping maths against the huge delta after a backgrounded tab. */
const MAX_FRAME_DELTA = 0.1;

/**
 * Loads the model, then mounts a canvas into `stage`.
 *
 * The load happens before anything touches the DOM, so a failed or missing GLB
 * rejects without ever disturbing the static SVG fallback already on screen.
 *
 * @returns a teardown function that fully releases the GPU context.
 */
export async function mountSculpture(
  stage: HTMLElement,
  quality: Quality = 'desktop',
): Promise<() => void> {
  const { url, maxPixelRatio } = MODELS[quality];
  const gltf = await new GLTFLoader().loadAsync(url);
  const model = gltf.scene;

  // The GLB's own materials are kept — it ships a WebP albedo, normal and
  // roughness map. Everything the loader creates is tracked so teardown can
  // release it; three does not free GPU memory on its own.
  const geometries: THREE.BufferGeometry[] = [];
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  // GPU resources created below, released in reverse if setup throws midway
  // (e.g. the WebGL context cannot be created), so a failed mount leaks nothing.
  const undo: Array<() => void> = [];

  try {
    model.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      geometries.push(mesh.geometry);

      for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        materials.add(material);
        const standard = material as THREE.MeshStandardMaterial;
        // The source is a spec/gloss export routed into the metallic-roughness
        // slot, so it reads as fully metallic without this.
        standard.metalness = 0;
        standard.transparent = false;
        for (const map of [standard.map, standard.normalMap, standard.roughnessMap])
          if (map) textures.add(map);
      }
    });

    // Normalize: centered on the origin, MODEL_HEIGHT units tall.
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = MODEL_HEIGHT / size.y;
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    // Outer pivot carries the animation so the normalization above stays untouched.
    const pivot = new THREE.Group();
    pivot.add(model);

    // Anchors and the point cloud are computed at yaw 0, in pivot-local space.
    pivot.updateMatrixWorld(true);
    const modelBox = new THREE.Box3().setFromObject(model);
    const raycaster = new THREE.Raycaster();
    const anchors = ANCHOR_FRACTIONS.map(([fx, fy]) => {
      const x = modelBox.min.x + (modelBox.max.x - modelBox.min.x) * fx;
      const y = modelBox.min.y + (modelBox.max.y - modelBox.min.y) * fy;
      raycaster.set(new THREE.Vector3(x, y, modelBox.max.z + 1), new THREE.Vector3(0, 0, -1));
      const hit = raycaster.intersectObject(model, true)[0];
      return hit ? hit.point.clone() : new THREE.Vector3(x, y, modelBox.max.z);
    });

    // Point cloud from FRONT-facing vertices only, so the unfinished back of the
    // scan never shows as dots. Preallocated, then uniformly subsampled.
    let totalVerts = 0;
    model.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) totalVerts += mesh.geometry.getAttribute('position').count;
    });
    const frontPositions = new Float32Array(totalVerts * 3);
    const depthMin = modelBox.min.z;
    const depthMax = modelBox.max.z;
    const zThreshold = (depthMin + depthMax) / 2 - 0.05 * (depthMax - depthMin);
    const v = new THREE.Vector3();
    const n = new THREE.Vector3();
    let frontCount = 0;
    model.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const attr = mesh.geometry.getAttribute('position');
      const normals = mesh.geometry.getAttribute('normal');
      for (let i = 0; i < attr.count; i++) {
        v.fromBufferAttribute(attr, i).applyMatrix4(mesh.matrixWorld);
        let front = v.z >= zThreshold;
        if (!front && normals) {
          n.fromBufferAttribute(normals, i).transformDirection(mesh.matrixWorld);
          front = n.z > 0.2;
        }
        if (!front) continue;
        frontPositions[frontCount * 3] = v.x;
        frontPositions[frontCount * 3 + 1] = v.y;
        frontPositions[frontCount * 3 + 2] = v.z;
        frontCount++;
      }
    });
    const pointCount = Math.min(frontCount, MAX_POINTS);
    const pointPositions = new Float32Array(pointCount * 3);
    const pointRandom = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      const src = Math.floor((i * frontCount) / pointCount) * 3;
      pointPositions[i * 3] = frontPositions[src];
      pointPositions[i * 3 + 1] = frontPositions[src + 1];
      pointPositions[i * 3 + 2] = frontPositions[src + 2];
      pointRandom[i * 3] = Math.random() * 2 - 1;
      pointRandom[i * 3 + 1] = Math.random() * 2 - 1;
      pointRandom[i * 3 + 2] = Math.random() * 2 - 1;
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    pointGeometry.setAttribute('aRandom', new THREE.BufferAttribute(pointRandom, 3));
    undo.push(() => pointGeometry.dispose());

    const accent =
      getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4C8DFF';
    let pixelRatio = Math.min(window.devicePixelRatio, maxPixelRatio);
    const pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uDissolve: { value: 0 },
        uColor: { value: new THREE.Color().set(accent) },
        uBufferHeight: { value: 1 },
        uPointFraction: { value: POINT_SIZE_FRACTION },
        uPixelRatio: { value: pixelRatio },
      },
      vertexShader: POINT_VERTEX,
      fragmentShader: POINT_FRAGMENT,
      transparent: true,
      depthWrite: false,
    });
    undo.push(() => pointMaterial.dispose());
    const points = new THREE.Points(pointGeometry, pointMaterial);
    points.frustumCulled = false;
    points.visible = false;
    pivot.add(points);

    const scene = new THREE.Scene();
    scene.add(pivot);
    scene.add(new THREE.HemisphereLight('#3A4150', '#0B0D11', 0.6));

    const key = new THREE.DirectionalLight('#F2F4F8', 1.25);
    key.position.set(-2.5, 3, 2.5);
    scene.add(key);

    // Rim colour follows the --accent design token so the bust stays on-palette.
    const rim = new THREE.DirectionalLight(new THREE.Color().set(accent), 2.2);
    rim.position.set(3, 1.4, -2.6);
    scene.add(rim);

    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 20);
    camera.position.set(0, 0.05, CAMERA_DISTANCE);

    const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio < 2,
      alpha: true,
      powerPreference: 'high-performance',
    });
    // Light intensities above were tuned under react-three-fiber, whose default
    // tone mapping is ACES Filmic rather than three's bare NoToneMapping.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    undo.push(() => {
      renderer.dispose();
      renderer.forceContextLoss();
    });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(pixelRatio);

    const holder = document.createElement('div');
    holder.className = 'sculpture-live';
    holder.appendChild(renderer.domElement);

    const resize = (): void => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // `false` — the canvas is sized by CSS, not by inline styles.
      renderer.setSize(width, height, false);
      pointMaterial.uniforms.uBufferHeight.value = height * pixelRatio;
    };

    const pointer = { x: 0, y: 0 };
    let lastPointerMs = -Infinity;
    const onPointerMove = (event: PointerEvent): void => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
      lastPointerMs = performance.now();
    };

    // Timer over the deprecated Clock; `connect` uses the Page Visibility API so
    // a backgrounded tab does not accumulate one enormous delta.
    const timer = new THREE.Timer();
    timer.connect(document);

    // Scroll progress comes from the enclosing scene (or the stage itself).
    const sceneEl = stage.closest<HTMLElement>('[data-scene]') ?? stage;
    // Seed from the engine so a mid-page reload or a late mount shows the right
    // pose; `scene:progress` only fires when p changes.
    const seed = sceneEl === stage ? null : sceneProgress(sceneEl);
    let targetP = THREE.MathUtils.clamp(seed ?? 0, 0, 1);
    const onSceneProgress = (event: Event): void => {
      const p = (event as CustomEvent<{ p?: number }>).detail?.p;
      if (typeof p === 'number' && Number.isFinite(p)) targetP = THREE.MathUtils.clamp(p, 0, 1);
    };
    sceneEl.addEventListener('scene:progress', onSceneProgress);

    let frame = 0;
    let readyFrame = 0;
    let disposed = false;
    let time = 0;
    let smoothP = targetP;
    let pointerYaw = 0;
    let distance = THREE.MathUtils.lerp(
      CAMERA_DISTANCE,
      CAMERA_DISTANCE_NEAR,
      (() => {
        const lean = smoothP <= 0.5 ? smoothP / 0.5 : (1 - smoothP) / 0.5;
        return lean * lean * (3 - 2 * lean);
      })(),
    );
    let lastDissolve = -1;
    let running = false;
    let lastRenderTs = -Infinity;
    let pendingDelta = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    const lastAnchor: number[] = anchors.flatMap(() => [Number.NaN, Number.NaN]);
    const currentPoints = anchors.map(() => ({ x: 0, y: 0 }));
    const projected = new THREE.Vector3();
    const idleInterval = 1000 / IDLE_FPS[quality];

    const applyDissolve = (d: number): void => {
      if (d === lastDissolve) return;
      const wasTransparent = lastDissolve > 0;
      lastDissolve = d;
      const transparent = d > 0;
      for (const material of materials) {
        material.opacity = 1 - d;
        material.depthWrite = d === 0;
        if (transparent !== wasTransparent || material.transparent !== transparent) {
          material.transparent = transparent;
          material.needsUpdate = true;
        }
      }
      model.visible = d < 1;
      points.visible = d > 0;
      pointMaterial.uniforms.uDissolve.value = d;
    };

    const dispatchAnchors = (width: number, height: number): void => {
      stage.dispatchEvent(
        new CustomEvent('sculpture:anchors', {
          detail: { points: currentPoints.map((pt) => ({ x: pt.x, y: pt.y })), width, height },
        }),
      );
    };

    /** Projects the anchors; dispatches only if one moved or the stage resized. */
    const writeAnchors = (): void => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;
      camera.updateMatrixWorld();
      pivot.updateMatrixWorld(true);
      let changed = width !== lastWidth || height !== lastHeight;
      anchors.forEach((anchor, i) => {
        projected.copy(anchor).applyMatrix4(pivot.matrixWorld).project(camera);
        const px = (projected.x * 0.5 + 0.5) * width;
        const py = (-projected.y * 0.5 + 0.5) * height;
        if (
          Number.isNaN(lastAnchor[i * 2]) ||
          Math.abs(px - lastAnchor[i * 2]) > ANCHOR_EPSILON ||
          Math.abs(py - lastAnchor[i * 2 + 1]) > ANCHOR_EPSILON
        ) {
          changed = true;
          lastAnchor[i * 2] = px;
          lastAnchor[i * 2 + 1] = py;
        }
        currentPoints[i].x = px;
        currentPoints[i].y = py;
      });
      stage.dataset.anchors = 'live';
      if (!changed) return;
      lastWidth = width;
      lastHeight = height;
      // Rewind the stored values to the dispatched ones so drift cannot accumulate.
      currentPoints.forEach((pt, i) => {
        lastAnchor[i * 2] = pt.x;
        lastAnchor[i * 2 + 1] = pt.y;
      });
      dispatchAnchors(width, height);
    };

    const update = (delta: number): void => {
      time += delta;
      smoothP = THREE.MathUtils.damp(smoothP, targetP, 4, delta);
      pointerYaw = THREE.MathUtils.damp(pointerYaw, pointer.x * POINTER_YAW, 2.2, delta);
      const sway = Math.sin((time * Math.PI * 2) / SWAY_PERIOD_S) * SWAY_AMPLITUDE;
      const yaw = SCROLL_YAW * smoothP + sway + pointerYaw;
      pivot.rotation.y = THREE.MathUtils.clamp(yaw, -MAX_YAW, MAX_YAW);
      pivot.rotation.x = THREE.MathUtils.damp(pivot.rotation.x, pointer.y * 0.05, 2.2, delta);
      pivot.position.x = THREE.MathUtils.damp(pivot.position.x, pointer.x * 0.07, 2.2, delta);

      // Lean in to p = 0.5, then ease back out by p = 1.
      const lean = smoothP <= 0.5 ? smoothP / 0.5 : (1 - smoothP) / 0.5;
      const eased = lean * lean * (3 - 2 * lean);
      distance = THREE.MathUtils.damp(
        distance,
        THREE.MathUtils.lerp(CAMERA_DISTANCE, CAMERA_DISTANCE_NEAR, eased),
        4,
        delta,
      );
      camera.position.z = distance;

      applyDissolve(THREE.MathUtils.smoothstep(smoothP, 0.74, 0.9));
      writeAnchors();
    };

    const tick = (timestamp: number): void => {
      frame = requestAnimationFrame(tick);
      timer.update(timestamp);
      pendingDelta += Math.min(timer.getDelta(), MAX_FRAME_DELTA);

      // Full rate while the pose is changing materially; idle sway is capped.
      const active =
        Math.abs(smoothP - targetP) > POSE_EPSILON ||
        performance.now() - lastPointerMs < POINTER_ACTIVE_MS;
      if (!active && timestamp - lastRenderTs < idleInterval - 2) return;

      lastRenderTs = timestamp;
      update(pendingDelta);
      pendingDelta = 0;
      renderer.render(scene, camera);
    };

    // Both the render loop and the global pointer listener are gated on
    // visibility — off-screen, this costs nothing at all.
    const start = (): void => {
      if (running) return;
      running = true;
      // Without this, the first delta after a pause spans the whole idle period.
      timer.reset();
      pendingDelta = 0;
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      frame = requestAnimationFrame(tick);
    };

    const stop = (): void => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
    };

    resize();
    update(0);
    renderer.render(scene, camera); // paint once before revealing, so no blank frame
    stage.appendChild(holder);
    undo.push(() => holder.remove());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    // Dragging the window to a screen with another pixel density: re-read the
    // ratio, or the canvas stays blurry (or oversized) until the next mount.
    let dprQuery: MediaQueryList | null = null;
    const onDprChange = (): void => {
      pixelRatio = Math.min(window.devicePixelRatio, maxPixelRatio);
      renderer.setPixelRatio(pixelRatio);
      pointMaterial.uniforms.uPixelRatio.value = pixelRatio;
      resize();
      watchDpr();
    };
    const watchDpr = (): void => {
      dprQuery?.removeEventListener('change', onDprChange);
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      dprQuery.addEventListener('change', onDprChange);
    };
    watchDpr();

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    intersectionObserver.observe(stage);

    // Next frame, so the browser has the painted canvas before the fade begins.
    readyFrame = requestAnimationFrame(() => {
      if (disposed) return;
      stage.classList.add('is-live');
      stage.dispatchEvent(new CustomEvent('sculpture:ready'));
      // Listeners may have attached after the first projection; resend once.
      if (lastWidth && lastHeight) dispatchAnchors(lastWidth, lastHeight);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(readyFrame);
      stop();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      dprQuery?.removeEventListener('change', onDprChange);
      sceneEl.removeEventListener('scene:progress', onSceneProgress);
      stage.classList.remove('is-live');
      delete stage.dataset.anchors;
      pointGeometry.dispose();
      pointMaterial.dispose();
      holder.remove();
      timer.disconnect();
      timer.dispose();
      // Textures before materials: disposing a material does not release the
      // GPU-side images it references.
      for (const texture of textures) texture.dispose();
      for (const material of materials) material.dispose();
      for (const geometry of geometries) geometry.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  } catch (error) {
    for (const release of undo.reverse()) {
      try {
        release();
      } catch {
        // keep releasing the rest
      }
    }
    for (const texture of textures) texture.dispose();
    for (const material of materials) material.dispose();
    for (const geometry of geometries) geometry.dispose();
    throw error;
  }
}
