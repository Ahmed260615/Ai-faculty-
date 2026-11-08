import * as THREE from 'three';
import { STATUS } from '../../config/status';

/**
 * Procedural 3D "health orbit": Earth core (overall health) + faceted orbs (one per health domain).
 * No external textures or models. Orb colour = the domain's real status (never decorative).
 * Motion budget (all calm, all purposeful):
 *   auto-rotate 0.05 rad/s · Earth spin 0.03 rad/s · orb bob ±0.06 u @ 0.6 rad/s · focus ease ~4/s · selection scale ease ~8/s
 * Reduced motion: no autonomous motion; frames render only in response to the user.
 */
const hash = (x, y, z) => { let h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); };
const smooth = (t) => t * t * (3 - 2 * t);
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = smooth(x - xi), yf = smooth(y - yi), zf = smooth(z - zi);
  const l = (a, b, t) => a + (b - a) * t; let r = 0;
  const c = (dx, dy, dz) => hash(xi + dx, yi + dy, zi + dz);
  return l(l(l(c(0, 0, 0), c(1, 0, 0), xf), l(c(0, 1, 0), c(1, 1, 0), xf), yf), l(l(c(0, 0, 1), c(1, 0, 1), xf), l(c(0, 1, 1), c(1, 1, 1), xf), yf), zf) + r;
}
const fbm = (x, y, z, o = 4) => { let a = 0.5, f = 1, s = 0; for (let i = 0; i < o; i++) { s += a * vnoise(x * f, y * f, z * f); f *= 2.03; a *= 0.5; } return s; };

function earthTextures(w = 512, h = 256) {
  const mk = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const cLand = mk(), cCloud = mk(); const gl = cLand.getContext('2d'), gc = cCloud.getContext('2d');
  const il = gl.createImageData(w, h), ic = gc.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const lon = (x / w) * Math.PI * 2, lat = (y / h) * Math.PI - Math.PI / 2;
    const px = Math.cos(lat) * Math.cos(lon), py = Math.sin(lat), pz = Math.cos(lat) * Math.sin(lon);
    const n = fbm(px * 2.2 + 3, py * 2.2 + 3, pz * 2.2 + 3, 5), i = (y * w + x) * 4;
    let r, g, b;
    if (n > 0.54) { const t = Math.min(1, (n - 0.54) * 4); r = 70 + 70 * t; g = 92 + 80 * t; b = 78 + 66 * t; if (n > 0.66) { r = 168; g = 176; b = 170; } }
    else { const t = n / 0.54; r = 6 + 8 * t; g = 26 + 40 * t; b = 18 + 28 * t; }
    if (Math.abs(py) > 0.88) { r = 225; g = 235; b = 242; }
    il.data[i] = r; il.data[i + 1] = g; il.data[i + 2] = b; il.data[i + 3] = 255;
    const cn = fbm(px * 3.1 + 11, py * 3.1 + 7, pz * 3.1 + 5, 5), a = Math.max(0, Math.min(1, (cn - 0.5) * 3.2));
    ic.data[i] = ic.data[i + 1] = ic.data[i + 2] = 255; ic.data[i + 3] = a * 210;
  }
  gl.putImageData(il, 0, 0); gc.putImageData(ic, 0, 0);
  const t1 = new THREE.CanvasTexture(cLand), t2 = new THREE.CanvasTexture(cCloud);
  t1.colorSpace = THREE.SRGBColorSpace; t2.colorSpace = THREE.SRGBColorSpace; t1.anisotropy = t2.anisotropy = 4;
  return { land: t1, cloud: t2 };
}

function glowTexture(hex) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, hex + 'cc'); gr.addColorStop(0.35, hex + '55'); gr.addColorStop(1, hex + '00');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

const SHELL = [
  { a: 0.35, R: 3.05, y: 0.95 }, { a: 1.4, R: 3.45, y: -0.65 }, { a: 2.45, R: 3.15, y: 0.55 },
  { a: 3.5, R: 3.55, y: -1.0 }, { a: 4.55, R: 3.1, y: 1.1 }, { a: 5.55, R: 3.4, y: -0.25 },
]; // domains[1..6]

export function createOrbitScene(host, { reduced, labels, onPick }) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); } catch { return null; }
  if (!renderer.getContext()) return null;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const el = renderer.domElement; el.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab'; el.setAttribute('aria-hidden', 'true');
  host.appendChild(el);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  const world = new THREE.Group(); scene.add(world);

  // lights: warm sun from the right, cool rim from behind, soft ambient
  scene.add(new THREE.AmbientLight(0x8a948e, 0.5));
  const sun = new THREE.DirectionalLight(0xf2f6f2, 2.4); sun.position.set(6, 3, 5); scene.add(sun);
  const rim = new THREE.DirectionalLight(0x2fcf7c, 1.0); rim.position.set(-6, -1, -4); scene.add(rim);

  // stars (neutral + a few coloured)
  const starGeo = (n, colored) => {
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), pal = [[0.18, 0.81, 0.49], [0.6, 0.64, 0.61], [0.18, 0.81, 0.49], [0.82, 0.85, 0.83]];
    for (let i = 0; i < n; i++) {
      const u = Math.random() * 2 - 1, t = Math.random() * Math.PI * 2, r = 30 + Math.random() * 25, s = Math.sqrt(1 - u * u);
      pos.set([r * s * Math.cos(t), r * u, r * s * Math.sin(t)], i * 3);
      col.set(colored ? pal[Math.floor(Math.random() * 3)] : pal[3], i * 3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); return g;
  };
  scene.add(new THREE.Points(starGeo(1300, false), new THREE.PointsMaterial({ size: 0.11, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.75, depthWrite: false })));
  scene.add(new THREE.Points(starGeo(220, true), new THREE.PointsMaterial({ size: 0.2, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false })));

  // Earth core
  const tex = earthTextures();
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1.35, 64, 48), new THREE.MeshStandardMaterial({ map: tex.land, roughness: 0.85, metalness: 0.05 }));
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.372, 64, 48), new THREE.MeshStandardMaterial({ map: tex.cloud, transparent: true, depthWrite: false, roughness: 1 }));
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.56, 48, 32), new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(0x2fcf7c) } }, transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
    vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'varying vec3 vN; uniform vec3 uColor; void main(){ float i = pow(0.74 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(uColor, 1.0) * i * 1.25; }',
  }));
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xd9a441, transparent: true, opacity: 0.8 });
  const statusRing = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.012, 8, 160), ringMat); statusRing.rotation.x = Math.PI / 2 - 0.35; statusRing.rotation.y = 0.2;
  const earthGroup = new THREE.Group(); earthGroup.add(earth, clouds, atmo, statusRing); world.add(earthGroup);
  const earthGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('#2FCF7C'), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })); earthGlow.scale.setScalar(5.2); earthGroup.add(earthGlow);
  earth.rotation.z = 0.41;

  // orbs
  const orbs = SHELL.map((s, i) => {
    const grp = new THREE.Group(); grp.position.set(Math.cos(s.a) * s.R, s.y, Math.sin(s.a) * s.R);
    const geo = new THREE.IcosahedronGeometry(0.46, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.55, roughness: 0.38, flatShading: true, emissive: 0x334455, emissiveIntensity: 0.28 });
    const mesh = new THREE.Mesh(geo, mat);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 }));
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('#FFFFFF'), color: 0x778899, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })); halo.scale.setScalar(2.1);
    grp.add(mesh, edges, halo); world.add(grp);
    const pts = []; for (let k = 0; k <= 128; k++) pts.push(new THREE.Vector3(Math.cos((k / 128) * 6.2832) * s.R, s.y, Math.sin((k / 128) * 6.2832) * s.R));
    const orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x9aa19c, transparent: true, opacity: 0.14 })); world.add(orbit);
    return { grp, mesh, edges, halo, mat, orbit, base: s, scale: 1, target: 1, tint: new THREE.Color() };
  });

  // state
  let yaw = -0.5, pitch = 0.18, vel = 0, selected = 0, focusYaw = null, autoRotate = !reduced, lastDrag = -1e9, dragging = false, running = false, raf = 0, disposed = false, visible = true, domains = [];
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2(), v3 = new THREE.Vector3();
  const targets = () => [earth, ...orbs.map((o) => o.mesh)];
  const angDiff = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));

  function resize() {
    const w = host.clientWidth || 300, h = host.clientHeight || 300; renderer.setSize(w, h, false); camera.aspect = w / h;
    const need = 5.7, tv = Math.tan((camera.fov * Math.PI) / 360), z = Math.max(9, need / (tv * Math.min(1.4, Math.max(camera.aspect, 0.78))) * 0.95);
    camera.position.set(0, 0.7, z); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); request();
  }

  function project() {
    const w = host.clientWidth, h = host.clientHeight;
    labels.forEach((node, i) => {
      if (!node) return; const o = i === 0 ? earthGroup : orbs[i - 1].grp;
      o.getWorldPosition(v3); const depth = v3.z; v3.project(camera);
      const x = (v3.x * 0.5 + 0.5) * w, y = (-v3.y * 0.5 + 0.5) * h, front = THREE.MathUtils.clamp(0.35 + (depth + 3) / 8, 0.25, 1);
      node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`; node.style.opacity = i === selected ? 1 : front * 0.85; node.dataset.front = depth > -0.5 ? '1' : '0';
    });
  }

  function step(dt, t) {
    if (!dragging) { yaw += vel * dt * 60; vel *= 0.93; if (Math.abs(vel) < 1e-4) vel = 0; }
    if (!reduced && !dragging && autoRotate && focusYaw === null && performance.now() - lastDrag > 2500) yaw += 0.05 * dt;
    if (focusYaw !== null) { const d = angDiff(yaw, focusYaw); yaw += d * (1 - Math.exp(-dt * 4)); if (Math.abs(d) < 0.003) focusYaw = null; }
    world.rotation.y = yaw; world.rotation.x = pitch;
    if (!reduced) { earth.rotation.y += 0.03 * dt; clouds.rotation.y += 0.04 * dt; }
    orbs.forEach((o, i) => {
      o.scale += (o.target - o.scale) * (1 - Math.exp(-dt * 8)); o.grp.scale.setScalar(o.scale);
      o.grp.position.y = o.base.y + (reduced ? 0 : Math.sin(t * 0.6 + i * 1.3) * 0.06); o.mesh.rotation.y += reduced ? 0 : dt * 0.15;
      o.edges.rotation.copy(o.mesh.rotation);
    });
    project();
  }

  let last = performance.now();
  const frame = (now) => { if (disposed || !running) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; step(dt, now / 1000); renderer.render(scene, camera); raf = requestAnimationFrame(frame); };
  function start() { if (running || disposed || reduced) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  let queued = false;
  function request() { // on-demand rendering (reduced motion, or while paused)
    if (running || queued || disposed) return; queued = true;
    requestAnimationFrame(() => { queued = false; if (disposed) return; if (focusYaw !== null) { yaw = focusYaw; focusYaw = null; } step(0.016, 0); orbs.forEach((o) => { o.scale = o.target; o.grp.scale.setScalar(o.scale); }); renderer.render(scene, camera); });
  }
  function sync() { if (visible && !document.hidden && !reduced) start(); else stop(); }

  // pointer: drag to rotate, tap to pick
  let down = null;
  const ndc = (e) => { const r = el.getBoundingClientRect(); mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); };
  const pick = () => { ray.setFromCamera(mouse, camera); const hit = ray.intersectObjects(targets(), false)[0]; if (!hit) return -1; return hit.object === earth ? 0 : orbs.findIndex((o) => o.mesh === hit.object) + 1; };
  const onDown = (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now(), px: e.clientX, py: e.clientY }; dragging = true; focusYaw = null; vel = 0; el.setPointerCapture?.(e.pointerId); el.style.cursor = 'grabbing'; };
  const onMove = (e) => {
    if (down) { const dx = e.clientX - down.px, dy = e.clientY - down.py; down.px = e.clientX; down.py = e.clientY; yaw += dx * 0.006; vel = dx * 0.006 / 60 * 60; pitch = THREE.MathUtils.clamp(pitch + dy * 0.003, -0.35, 0.55); lastDrag = performance.now(); request(); }
    else { ndc(e); el.style.cursor = pick() >= 0 ? 'pointer' : 'grab'; }
  };
  const onUp = (e) => { if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), dur = performance.now() - down.t; dragging = false; el.style.cursor = 'grab'; lastDrag = performance.now();
    if (moved < 6 && dur < 450) { ndc(e); const i = pick(); if (i >= 0) onPick(i); } down = null; request(); };
  el.addEventListener('pointerdown', onDown); el.addEventListener('pointermove', onMove); el.addEventListener('pointerup', onUp); el.addEventListener('pointercancel', onUp);

  const ro = new ResizeObserver(resize); ro.observe(host);
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; sync(); }); io.observe(host);
  const onVis = () => sync(); document.addEventListener('visibilitychange', onVis);
  resize(); sync(); request();

  const api = {
    setDomains(list) {
      domains = list;
      const c0 = new THREE.Color(STATUS[list[0]?.status]?.hex || STATUS.UNKNOWN.hex); ringMat.color.copy(c0);
      orbs.forEach((o, i) => {
        const hex = STATUS[list[i + 1]?.status]?.hex || STATUS.UNKNOWN.hex; o.tint.set(hex);
        o.mat.color.copy(o.tint).multiplyScalar(0.55); o.mat.emissive.copy(o.tint); o.halo.material.color.copy(o.tint);
      }); request();
    },
    select(i, { instant } = {}) {
      selected = i; orbs.forEach((o, k) => { o.target = k + 1 === i ? 1.35 : 1; o.halo.material.opacity = k + 1 === i ? 0.95 : 0.5; o.edges.material.opacity = k + 1 === i ? 0.7 : 0.3; });
      earthGlow.material.opacity = i === 0 ? 0.6 : 0.3;
      if (i > 0) { const a = orbs[i - 1].base.a; focusYaw = yaw + angDiff(yaw, Math.PI / 2 - a); } else focusYaw = yaw + angDiff(yaw, -0.5);
      if (instant || reduced) { yaw = focusYaw; focusYaw = null; } request();
    },
    setAutoRotate(b) { autoRotate = b && !reduced; },
    dispose() {
      disposed = true; stop(); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis);
      el.removeEventListener('pointerdown', onDown); el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerup', onUp); el.removeEventListener('pointercancel', onUp);
      scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => { x.map?.dispose?.(); x.dispose?.(); }); });
      tex.land.dispose(); tex.cloud.dispose(); renderer.dispose(); el.remove();
    },
  };
  return api;
}
