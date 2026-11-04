/**
 * <frog-mascot> — a self-contained dithered frog.
 *
 * Everything it needs lives inside a shadow root: canvas, renderer, speech
 * bubble, emoticon and Zzz. The page supplies a box; the frog fills it.
 *
 *   import 'frog-mascot/src/frog-mascot.js';
 *   <frog-mascot style="position:fixed; inset:0"></frog-mascot>
 *
 * Or drive it directly:
 *
 *   import { FrogMascot } from 'frog-mascot/src/frog-mascot.js';
 *   const frog = new FrogMascot(el, { mode: 'pixel' });
 *   frog.say('Hello.');
 */

import * as THREE from '../vendor/three.module.js';
import { DitherRenderer } from './dither.js';
import {
  buildCharacter, PALETTE, R, HEAD_LOCAL_Y, HEAD_HALF_WIDTH,
} from './character.js';

const Z_PATH = 'M0 0h5v1H0zM3 1h1v1H3zM2 2h1v1H2zM1 3h1v1H1zM0 4h5v1H0z';

const Z_SPAN = `<span><svg viewBox="0 0 5 5" shape-rendering="crispEdges"><path d="${Z_PATH}"/></svg></span>`;

const STYLES = `
  :host {
    position: relative;
    display: block;
    --frog-paper: #fbfbf8;
    --frog-ink: #0b0b0c;
    --frog-shadow: #2261e9;
  }
  canvas {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    image-rendering: pixelated;
    pointer-events: auto;
    touch-action: none;
    cursor: default;
  }
  .bubble {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    max-width: min(22rem, 60%);
    padding: 0.85rem 1.1rem;
    border-radius: 14px;
    background: var(--frog-paper);
    color: var(--frog-ink);
    font: 600 1rem/1.15 system-ui, -apple-system, "Segoe UI", sans-serif;
    letter-spacing: -0.02em;
    box-shadow: 8px 8px 0 0 var(--frog-shadow);
    opacity: 0;
    transform-origin: 50% 100%;
    transition: opacity 0.25s ease, scale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    scale: 0.94;
    pointer-events: none;
  }
  .bubble.is-visible { opacity: 1; scale: 1; }
  .emote {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    width: 58px;
    height: 58px;
    padding: 10px;
    border-radius: 50%;
    background: var(--frog-paper);
    color: var(--frog-ink);
    box-shadow: 5px 5px 0 0 var(--frog-shadow);
    opacity: 0;
    scale: 0.55;
    transition: opacity 0.18s ease, scale 0.26s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
  }
  .emote svg { width: 100%; height: 100%; display: block; }
  .emote.is-on { opacity: 1; scale: 1; }
  .zzz {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    width: 0;
    height: 0;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }
  .zzz.is-on { opacity: 1; }
  .zzz span {
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    width: 24px;
    height: 24px;
    color: var(--frog-paper);
    opacity: 0;
    animation: frog-zrise 3.9s ease-in infinite;
  }
  .zzz span svg { display: block; width: 100%; height: 100%; fill: currentColor; }
  .zzz span:nth-child(2) { animation-delay: 1.3s; width: 32px; height: 32px; }
  .zzz span:nth-child(3) { animation-delay: 2.6s; width: 42px; height: 42px; }
  @keyframes frog-zrise {
    0%   { opacity: 0; transform: translate(0, 0); }
    18%  { opacity: 0.95; }
    65%  { opacity: 0.7; }
    100% { opacity: 0; transform: translate(34px, -74px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .zzz span { animation-duration: 0.01ms; animation-iteration-count: 1; opacity: 0.9; }
  }
`;

const DEFAULTS = {
  fit: 'viewport',       // 'container' reserves padding around the whole rig
  paused: false,
  mode: 'dither',        // 'dither' | 'pixel'
  palette: null,         // partial override of PALETTE
  follow: true,          // body leans and turns after the pointer
  hover: true,           // hover -> smile, squint, emoticon
  idle: true,            // glances, pupil darts, whistling, bounce burst
  autoSleep: true,       // doze off after `sleepAfter` ms of stillness
  draggable: true,       // click and drag squashes the frog
  badge: false,          // small circular crop
  sleepAfter: 15000,
  loungeAfter: 2600,
  smileFor: 1500,
  turn: -0.18,           // resting body yaw, in radians
};

const BADGE = { x: 100, y: 152, radius: 58 };

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

export class FrogMascot {
  constructor(host, options = {}) {
    this.host = typeof host === 'string' ? document.querySelector(host) : host;
    if (!this.host) throw new Error('FrogMascot: host element not found');

    this.opts = { ...DEFAULTS, ...options };
    this.palette = { ...PALETTE, ...(this.opts.palette || {}) };
    if (this.opts.palette && this.opts.palette.ramp) {
      this.palette.ramp = { ...PALETTE.ramp, ...this.opts.palette.ramp };
    }

    this.width = 1;
    this.height = 1;

    /* ---------------- shadow DOM ---------------- */
    this.shadow = this.host.shadowRoot || this.host.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = `
      <style>${STYLES}</style>
      <canvas></canvas>
      <div class="bubble" role="status"><span class="bubble-text"></span></div>
      <div class="emote" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round">
          <circle cx="16" cy="16" r="11.5" />
          <circle cx="11.6" cy="13.2" r="1.9" fill="currentColor" stroke="none" />
          <circle cx="20.4" cy="13.2" r="1.9" fill="currentColor" stroke="none" />
          <path d="M10.2 19.4 Q16 24.6 21.8 19.4" />
        </svg>
      </div>
      <div class="zzz" aria-hidden="true">${Z_SPAN}${Z_SPAN}${Z_SPAN}</div>
    `;

    this.canvas = this.shadow.querySelector('canvas');
    this.bubble = this.shadow.querySelector('.bubble');
    this.bubbleText = this.shadow.querySelector('.bubble-text');
    this.emote = this.shadow.querySelector('.emote');
    this.zzz = this.shadow.querySelector('.zzz');

    /* ---------------- scene ---------------- */
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 4000);
    this.camera.position.z = 2000;

    this.scene.add(new THREE.HemisphereLight('#ffffff', '#6a6a6a', 1.35));
    const key = new THREE.DirectionalLight('#ffffff', 2.2);
    key.position.set(-4, 5, 6);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight('#ffffff', 1.5);
    rim.position.set(6, 2, -5);
    this.scene.add(rim);
    const fill = new THREE.DirectionalLight('#ffffff', 1.0);
    fill.position.set(1, 0.5, 9);
    this.scene.add(fill);

    this.dither = new DitherRenderer(this.canvas, this.palette, { mode: this.opts.mode });
    this.character = buildCharacter({ kind: 'frog', colors: this.palette });
    this.scene.add(this.character.root);

    this.dither.setScene(this.scene, this.camera);
    this.applyPalette();

    /* ---------------- state ---------------- */
    this.layout = { radius: 100, scale: 71, x: 0, feetWorldY: 0, turn: this.opts.turn };
    this.view = { x: 0, y: 0, s: 1, turn: this.opts.turn };

    this.pointer = new THREE.Vector2(0, 0);
    this.pointerCss = { x: -999, y: -999 };
    this.hover = { over: false, happy: false };
    this.follow = { x: 0, y: 0 };
    this.drag = {
      active: false,
      offset: new THREE.Vector2(0, 0),
      start: { x: 0, y: 0 },
      last: new THREE.Vector2(0, 0),
      released: 0,
    };

    this.sleeping = false;
    this.idle = false;
    this.happyUntil = 0;
    this.badgeOn = !!this.opts.badge;
    this.bubbleTimer = 0;
    this.stretch = 0;
    this.time = 0;
    this.last = performance.now();
    this.revealStart = performance.now();
    this.lastActivity = performance.now();
    this.raf = 0;
    this.destroyed = false;
    this.paused = !!this.opts.paused;

    /* ---------------- listeners ---------------- */
    this.onPointerMove = (e) => this.handlePointerMove(e);
    this.onPointerDown = (e) => this.handlePointerDown(e);
    this.onPointerUp = () => this.handlePointerUp();
    this.onClick = (e) => this.handleClick(e);

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('click', this.onClick);

    this.ro = new ResizeObserver(() => this.measure());
    this.ro.observe(this.host);

    /* ---------------- go ---------------- */
    this.character.api.setRestMouth('flat');
    this.measure();
    this.view.x = this.layout.x;
    this.view.y = this.layout.feetWorldY - this.character.bounds.minY * this.layout.scale;
    this.view.s = this.layout.scale;
    this.view.turn = this.layout.turn;
    this.applyBadge();

    this.frame = (now) => this.tick(now);
    if (!this.paused) this.raf = requestAnimationFrame(this.frame);
  }

  /* ================= geometry ================= */

  measure() {
    const rect = this.host.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    this.width = w;
    this.height = h;

    const narrow = w < 760;
    const b = this.character.bounds;
    const fitH = (h - (narrow ? 300 : 230)) / b.height;
    const fitW = (w * (narrow ? 0.86 : 0.36)) / b.width;

    this.layout.scale = Math.max(12, Math.min(fitH, fitW));
    this.layout.radius = this.layout.scale * R;
    this.layout.x = narrow ? w * 0.5 : w * 0.7;
    this.layout.feetWorldY = narrow ? 56 : 62;

    if (this.opts.fit === 'container') {
      this.layout.scale = Math.max(1, Math.min((w - 64) / b.width, (h - 64) / b.height));
      this.layout.radius = this.layout.scale * R;
      this.layout.x = w / 2;
      this.layout.feetWorldY = 32;
    }
    this.dither.resize(w, h);
    this.camera.updateProjectionMatrix();
  }

  /** Head centre in local screen space (y from the top). */
  headScreenPos() {
    const v = new THREE.Vector3();
    this.character.root.updateMatrixWorld(true);
    this.character.parts.head.getWorldPosition(v);
    return { x: v.x, y: this.height - v.y };
  }

  /** Mouth centre in host pixels, including the current head rotation. */
  mouthScreenPos() {
    const mouth = this.character.look.mouth;
    const positions = mouth.geometry.attributes.position;
    const middle = Math.floor(positions.count / 4) * 2;
    const point = new THREE.Vector3().fromBufferAttribute(positions, middle);
    this.character.root.updateMatrixWorld(true);
    mouth.localToWorld(point);
    return { x: point.x, y: this.height - point.y };
  }

  localPoint(e) {
    const rect = this.host.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  overFrog(x, y) {
    const b = this.character.bounds;
    const s = this.view.s;
    const cx = this.character.root.position.x;
    const cy = this.height - (this.character.root.position.y + ((b.minY + b.maxY) / 2) * s);
    const rx = (b.width / 2) * s * 0.96;
    const ry = (b.height / 2) * s * 0.96;
    const dx = (x - cx) / rx;
    const dy = (y - cy) / ry;
    return dx * dx + dy * dy <= 1;
  }

  /* ================= interaction ================= */

  noteActivity() {
    this.lastActivity = performance.now();
    if (!this.sleeping) return;
    this.sleeping = false;
    this.character.api.setSleeping(false);
    this.character.api.blink();
    this.emit('frog:wake');
  }

  handlePointerMove(e) {
    this.noteActivity();
    const p = this.localPoint(e);
    this.pointerCss.x = p.x;
    this.pointerCss.y = p.y;
    this.pointer.set((p.x / this.width) * 2 - 1, (p.y / this.height) * 2 - 1);

    if (!this.drag.active) return;
    this.drag.offset.set(
      (e.clientX - this.drag.start.x) * 0.9,
      (e.clientY - this.drag.start.y) * 0.9,
    );
    this.drag.last.copy(this.drag.offset);
  }

  handlePointerDown(e) {
    this.noteActivity();
    const p = this.localPoint(e);
    if (!this.overFrog(p.x, p.y)) return;
    if (!this.opts.draggable) return;
    this.drag.active = true;
    this.drag.start = { x: e.clientX - this.drag.offset.x, y: e.clientY - this.drag.offset.y };
    this.drag.last.copy(this.drag.offset);
    this.canvas.style.cursor = 'grabbing';
    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic or already-released pointers cannot be captured; dragging
      // still works through the window-level move listener.
    }
  }

  handlePointerUp() {
    if (!this.drag.active) return;
    this.drag.active = false;
    this.drag.released = 1;
    this.canvas.style.cursor = this.overFrog(this.pointerCss.x, this.pointerCss.y) ? 'grab' : 'default';
  }

  handleClick(e) {
    const p = this.localPoint(e);
    if (!this.overFrog(p.x, p.y)) return;
    this.emit('frog:click');
  }

  emit(type, detail = {}) {
    this.host.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  }

  /* ================= loop ================= */

  tick(now) {
    if (this.destroyed || this.paused) return;
    this.raf = requestAnimationFrame(this.frame);

    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;
    const t = this.time;

    const rp = Math.min(1, (now - this.revealStart) / 1150);
    const cover = easeOutCubic(rp);
    const develop = easeOutCubic(Math.max(0, (rp - 0.35) / 0.65));

    if (this.drag.released) {
      const k = Math.min(1, dt * 8);
      this.drag.offset.x += (0 - this.drag.offset.x) * k;
      this.drag.offset.y += (0 - this.drag.offset.y) * k;
      if (this.drag.offset.length() < 0.5) {
        this.drag.offset.set(0, 0);
        this.drag.released = 0;
      }
    }

    const sway = this.drag.active ? 0 : Math.sin(t * 2.1) * 5;
    const offsetX = this.drag.offset.x + sway;
    const offsetY = this.drag.offset.y;

    const nxRaw = (this.pointerCss.x - this.layout.x) / (this.width * 0.45);
    const nyRaw = (this.pointerCss.y / this.height) * 2 - 1;
    const kf = Math.min(1, dt * 6);
    const followOn = this.opts.follow && !this.badgeOn && !this.attention;
    this.follow.x += ((followOn ? Math.max(-1, Math.min(1, nxRaw)) : 0) - this.follow.x) * kf;
    this.follow.y += ((followOn ? Math.max(-1, Math.min(1, nyRaw)) : 0) - this.follow.y) * kf;

    /* --- sleep --- */
    if (!this.attention && this.opts.autoSleep && !this.sleeping && now - this.lastActivity > this.opts.sleepAfter) {
      this.sleeping = true;
      this.hover.over = false;
      this.hover.happy = false;
      if (this.idle) {
        this.idle = false;
        this.character.api.setIdle(false);
      }
      this.character.api.setSleeping(true);
      this.character.api.setHappy(false);
      this.character.api.setRestMouth('flat');
      this.canvas.style.cursor = 'default';
      this.emit('frog:sleep');
    }

    /* --- idle --- */
    const idleNow = !this.attention && this.opts.idle && !this.sleeping && !this.drag.active && !this.badgeOn
      && now - this.lastActivity > this.opts.loungeAfter;
    if (idleNow !== this.idle) {
      this.idle = idleNow;
      this.character.api.setIdle(idleNow);
    }

    /* --- hover --- */
    const isOver = this.opts.hover && !this.drag.active && !this.sleeping && !this.badgeOn
      && this.overFrog(this.pointerCss.x, this.pointerCss.y);
    if (isOver !== this.hover.over) {
      this.hover.over = isOver;
      if (isOver) this.happyUntil = now + this.opts.smileFor;
      this.canvas.style.cursor = isOver && this.opts.draggable ? 'grab' : 'default';
    }

    const happyNow = this.hover.over && now < this.happyUntil;
    if (happyNow !== this.hover.happy) {
      this.hover.happy = happyNow;
      this.character.api.setHappy(happyNow);
      this.character.api.setRestMouth(happyNow ? 'smile' : 'flat');
    }

    /* --- placement --- */
    this.stretch += (Math.min(24, Math.abs(this.drag.offset.x) * 0.1) - this.stretch) * Math.min(1, dt * 8);

    let wantX = this.layout.x + offsetX + (this.badgeOn ? 0 : this.follow.x * 22);
    let wantY = this.layout.feetWorldY - this.character.bounds.minY * this.layout.scale
      - offsetY - (this.badgeOn ? 0 : this.follow.y * 8);
    let wantS = this.layout.scale;

    if (this.badgeOn) {
      wantS = (BADGE.radius * 1.24) / HEAD_HALF_WIDTH;
      wantX = BADGE.x;
      wantY = BADGE.y - HEAD_LOCAL_Y * wantS;
    }

    const wantTurn = this.badgeOn ? 0 : this.layout.turn + this.follow.x * 0.34;
    this.view.turn += (wantTurn - this.view.turn) * Math.min(1, dt * 5);

    const ease = Math.min(1, dt * 7);
    this.view.x += (wantX - this.view.x) * ease;
    this.view.y += (wantY - this.view.y) * ease;
    this.view.s += (wantS - this.view.s) * ease;

    this.character.root.rotation.y = this.view.turn;
    this.character.root.position.set(this.view.x, this.view.y, 0);
    this.character.root.scale.set(
      this.view.s * (1 + this.stretch * 0.002),
      this.view.s * (1 - this.stretch * 0.002),
      this.view.s,
    );

    const head = this.headScreenPos();
    if (this.badgeOn) {
      this.character.api.lookAt(0, 0);
    } else if (this.attention) {
      this.character.api.lookAt(this.attention.x, this.attention.y);
    } else if (!this.idle) {
      const nx = (head.x - (this.pointer.x * 0.5 + 0.5) * this.width) / (this.width * 0.45);
      this.character.api.lookAt(nx * 0.6, this.pointer.y);
    }

    this.character.api.update(dt, t);

    /* --- uniforms --- */
    const u = this.dither.pass.uniforms;
    const px = this.dither.pixelRatio;
    if (this.badgeOn) {
      u.uClip.value.set(BADGE.x / px, BADGE.y / px, (BADGE.radius * 1.06) / px);
      u.uPrint.value.set(1, 1, 0, 1);
      if (u.uTug) u.uTug.value.set(0, 0);
    } else {
      const feetDev = (this.layout.feetWorldY - offsetY) / px;
      u.uClip.value.set(this.view.x / px, feetDev + (this.view.s * R) / px * 4.6, 1e4);
      if (u.uTug) u.uTug.value.set(offsetX / px, -offsetY / px);
      const headDev = (this.height - head.y) / px;
      const rDev = (this.view.s * R) / px;
      u.uPrint.value.set(cover, develop, headDev + rDev * 1.3, rDev * 3.5);
    }

    this.dither.render();

    /* --- overlays --- */
    this.zzz.classList.toggle('is-on', this.sleeping);
    if (this.sleeping) {
      const zx = Math.max(8, Math.round(head.x + this.layout.radius * 0.52));
      const zy = Math.max(8, Math.round(head.y - this.layout.radius * 1.32));
      this.zzz.style.transform = `translate(${zx}px, ${zy}px)`;
    }

    if (this.bubbleTimer > 0) {
      this.bubbleTimer -= dt;
      if (this.bubbleTimer <= 0) this.bubble.classList.remove('is-visible');
    }
    const bw = this.bubble.offsetWidth || 200;
    const bh = this.bubble.offsetHeight || 60;
    const bubbleX = Math.max(12, Math.min(this.width - bw - 12, Math.round(head.x - bw / 2)));
    const gap = this.layout.radius * (this.width < 760 ? 1.15 : 2);
    const bubbleY = Math.max(12, Math.round(head.y - gap - bh));
    this.bubble.style.transform = `translate(${bubbleX}px, ${bubbleY}px)`;

    const showEmote = this.hover.happy && !this.bubble.classList.contains('is-visible') && !this.badgeOn;
    this.emote.classList.toggle('is-on', showEmote);
    if (showEmote) {
      const ex = Math.max(12, Math.min(this.width - 70, Math.round(head.x + this.layout.radius * 0.82)));
      const ey = Math.max(12, Math.round(head.y - this.layout.radius * 1.0 - 58));
      this.emote.style.transform = `translate(${ex}px, ${ey}px)`;
    }
  }

  /* ================= public API ================= */

  setPaused(paused) {
    if (this.destroyed || this.paused === paused) return this;
    this.paused = paused;
    this.zzz.style.display = paused ? 'none' : '';
    cancelAnimationFrame(this.raf);
    if (!paused) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
    return this;
  }

  /** Render synchronously before reading the canvas for a static fallback. */
  snapshot() {
    this.dither.render();
    return this.canvas.toDataURL('image/png');
  }

  setMode(mode) {
    if (mode !== 'dither' && mode !== 'pixel') return this;
    this.dither.setMode(mode);
    this.opts.mode = mode;
    this.measure();
    this.emit('frog:mode', { mode });
    return this;
  }

  getMode() {
    return this.opts.mode;
  }

  /** Face front and crop into a small circle. */
  setBadge(on) {
    this.badgeOn = !!on;
    this.opts.badge = this.badgeOn;
    this.applyBadge();
    return this;
  }

  applyBadge() {
    if (this.badgeOn) this.bubble.classList.remove('is-visible');
    if (this.badgeOn) {
      this.hover.over = false;
      this.hover.happy = false;
      this.character.api.setHappy(false);
      this.character.api.setRestMouth('flat');
      if (this.idle) {
        this.idle = false;
        this.character.api.setIdle(false);
      }
    }
  }

  /** Show a speech bubble and make the mouth chatter. */
  say(text, hold = 3.4) {
    this.bubbleText.textContent = text;
    this.bubble.classList.add('is-visible');
    this.bubbleTimer = hold;
    this.character.api.talk(1.4);
    this.emit('frog:say', { text });
    return this;
  }

  /** Hold a page-directed gaze until the page releases it with null. */
  setAttention(x, y = 0) {
    this.attention = x === null ? null : { x, y };
    if (this.attention) this.noteActivity();
    return this;
  }

  /** Animate speech while the page owns the visible text. */
  talk(duration = 1.8) {
    this.noteActivity();
    this.character.api.talk(duration);
    this.character.api.blink();
    return this;
  }

  blink() {
    this.character.api.blink();
    return this;
  }

  sleep() {
    this.lastActivity = performance.now() - this.opts.sleepAfter - 1;
    return this;
  }

  wake() {
    this.noteActivity();
    return this;
  }

  setPalette(partial = {}) {
    const next = { ...this.palette, ...partial };
    if (partial.ramp) next.ramp = { ...this.palette.ramp, ...partial.ramp };
    this.palette = next;
    this.applyPalette();
    return this;
  }

  applyPalette() {
    const p = this.palette;
    const set = (uniforms, key, value) => {
      if (uniforms[key] && value) uniforms[key].value.set(value);
    };
    for (const pass of [this.dither.dither, this.dither.pixel]) {
      set(pass.uniforms, 'uInk', p.ink);
      set(pass.uniforms, 'uPaper', p.paper);
      set(pass.uniforms, 'uWhite', p.paper);
      set(pass.uniforms, 'uDeep', p.ramp.deep);
      set(pass.uniforms, 'uMid', p.ramp.mid);
      set(pass.uniforms, 'uLight', p.ramp.light);
      set(pass.uniforms, 'uCreamLo', p.ramp.creamLo);
      set(pass.uniforms, 'uCreamMid', p.ramp.creamMid);
      set(pass.uniforms, 'uCreamHi', p.ramp.creamHi);
    }
  }

  /** Re-fit after the host changes size (also handled by a ResizeObserver). */
  resize() {
    this.measure();
    return this;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('click', this.onClick);
    for (const pass of [this.dither.dither, this.dither.pixel]) {
      pass.scene.traverse((object) => {
        object.geometry?.dispose();
        object.material?.dispose();
      });
    }
    this.dither.renderer.dispose();
    this.dither.renderer.forceContextLoss();
    this.dither.target.dispose();
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) m.dispose();
      }
    });
  }
}

/* ------------------------------------------------------------------ *
 * <frog-mascot> element
 * ------------------------------------------------------------------ */

// Keeps the module importable outside a browser (SSR, bundler analysis).
const HTMLElementBase = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

export class FrogMascotElement extends HTMLElementBase {
  static get observedAttributes() {
    return ['mode', 'badge'];
  }

  connectedCallback() {
    if (this._frog) return;
    if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
    this._frog = new FrogMascot(this, {
      mode: this.getAttribute('mode') || 'dither',
      badge: this.hasAttribute('badge'),
    });
  }

  disconnectedCallback() {
    this._frog?.destroy();
    this._frog = null;
  }

  attributeChangedCallback(name, _old, value) {
    if (!this._frog) return;
    if (name === 'mode') this._frog.setMode(value === 'pixel' ? 'pixel' : 'dither');
    if (name === 'badge') this._frog.setBadge(value !== null);
  }

  get frog() {
    return this._frog;
  }

  say(text, hold) { this._frog?.say(text, hold); return this; }
  setMode(mode) { this._frog?.setMode(mode); return this; }
}

if (typeof customElements !== 'undefined' && !customElements.get('frog-mascot')) {
  customElements.define('frog-mascot', FrogMascotElement);
}

export default FrogMascot;
