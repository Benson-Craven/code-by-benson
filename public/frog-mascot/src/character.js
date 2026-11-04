/**
 * A procedurally built frog mascot. No model file, no textures, no sprites:
 * every part below is a primitive with a transform.
 *
 * Units: the nominal head radius is 1.4 and the figure is about 7.6 units tall.
 * The rig is scaled at placement time so the head lands on the size the layout
 * asks for.
 *
 * A frog is not a recoloured human. The differences that matter:
 *   - the skull is wider than it is tall, and the eyes sit on top of it,
 *     bulging past the silhouette, rather than inset in the face;
 *   - there is no hair, no beard, no ears and no brows;
 *   - the mouth is very wide and shallow;
 *   - the belly is a lighter patch painted with vertex colours.
 */

import * as THREE from '../vendor/three.module.js';

const {
  Group, Mesh, Vector3, Vector2, Color, Box3,
  SphereGeometry, CapsuleGeometry, LatheGeometry,
  TorusGeometry, CylinderGeometry, BufferGeometry, BufferAttribute,
  MeshStandardMaterial, MeshBasicMaterial,
} = THREE;

export const R = 1.4;          // nominal head radius
export const NECK_Y = 2.4;     // head pivot, close to the head's own centre
const HEAD_Y = 0.3;
const BODY_BOTTOM = -0.85;     // the body sits low: this is a squatting frog
export const RIG_BOTTOM = -0.85;

// The head is deliberately wider than it is tall, so anything that needs to
// frame or point at the head has to ask rather than assume a sphere.
// The reference is far wider than it is tall, and the head is nearly as wide as
// the whole body, so the skull is stretched hard on X and squashed on Y.
export const HEAD_X_SCALE = 2.0;
export const HEAD_Y_SCALE = 0.86;
export const HEAD_LOCAL_Y = NECK_Y + HEAD_Y;          // head centre, rig space
export const HEAD_HALF_WIDTH = R * HEAD_X_SCALE;      // widest point of the skull
export const HEAD_TOP = HEAD_LOCAL_Y + R * HEAD_Y_SCALE;
export const BODY_TOP = 1.85;                         // shoulders, tucked under the head
export const BODY_HALF_WIDTH = 2.1;                   // torso without the legs

export const PALETTE = {
  skin: '#6fa65c',   // leaf green
  belly: '#efd9a0',  // warm cream
  spot: '#47703a',   // darker green
  ink: '#0b0b0c',
  paper: '#fbfbf8',

  // Fixed ramp used by the pixel-art pass: a 3-step green, a 3-step belly
  // that runs warm, and near-black for the outline.
  ramp: {
    deep: '#2f6b35',
    mid: '#4f9a3f',
    light: '#86c95a',
    creamLo: '#d99b46',
    creamMid: '#eac76b',
    creamHi: '#f6eca6',
  },
};

const MOUTH_SEGMENTS = 24;
const MOUTH_BASE = -0.52;      // low on the face, where the jaw meets the body

// Wide and shallow is what makes it read as a frog rather than a person.
// Wide and thick on purpose: the mouth wraps far enough around the skull to
// stay readable when the frog turns its head to follow the cursor.
export const MOUTHS = {
  smile: { width: 1.3, open: 0.22, smile: 0.24 },
  grin: { width: 1.55, open: 0.42, smile: 0.3 },
  open: { width: 1.2, open: 0.4, smile: 0.05 },
  flat: { width: 1.25, open: 0.16, smile: 0.02 },
  oh: { width: 0.42, open: 0.36, smile: 0.0 },
  yawn: { width: 1.0, open: 0.46, smile: 0.02 },
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sstep = (x, min, max) => {
  const t = clamp((x - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
};

function onSphere(azimuth, elevation, radius = R) {
  return new Vector3(
    Math.sin(azimuth) * Math.cos(elevation),
    Math.sin(elevation),
    Math.cos(azimuth) * Math.cos(elevation),
  ).multiplyScalar(radius);
}

function buildMaterials(p) {
  const skin = new Color(p.skin);
  const belly = new Color(p.belly);
  return {
    // Ink and paper are unlit on purpose: shaded near-blacks land mid-grey
    // under this much light and the dither shreds them into checkerboard.
    skin: new MeshStandardMaterial({ color: p.skin, roughness: 0.62 }),
    skinVC: new MeshStandardMaterial({ color: p.skin, roughness: 0.62, vertexColors: true }),
    skinShade: new MeshStandardMaterial({ color: skin.clone().multiplyScalar(0.55), roughness: 0.65 }),
    eyeSkin: new MeshStandardMaterial({ color: '#f8f0bd', roughness: 0.55 }),
    belly: new MeshStandardMaterial({ color: belly, roughness: 0.7 }),
    bodyVC: new MeshStandardMaterial({ color: '#ffffff', roughness: 0.7, vertexColors: true }),
    paper: new MeshBasicMaterial({ color: p.paper }),
    ink: new MeshBasicMaterial({ color: p.ink }),
    // Large ink areas (the mouth) would otherwise dither into a 76% stipple.
    // Pure black biases the threshold so the output is solid uInk.
    inkSolid: new MeshBasicMaterial({ color: '#000000', polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
  };
}

/* ------------------------------------------------------------------ *
 * Eyes: domes on top of the skull
 * ------------------------------------------------------------------ */

function buildEye(mats, side) {
  const holder = new Group();
  // Sat on the outer corners of the skull, as in the reference.
  holder.position.set(side * 0.78, 0.88, 0.46);
  holder.rotation.set(-0.05, side * 0.16, 0, 'YXZ');
  // The skull is squashed non-uniformly, so undo that here or the eyes come out
  // as wide ovals. Their *position* still inherits the stretch, which is wanted.
  holder.scale.set(1 / HEAD_X_SCALE, 1 / HEAD_Y_SCALE, 1);

  // Everything inside `squash` compresses vertically on a blink.
  const squash = new Group();
  holder.add(squash);

  // Black shell sitting behind the sclera. Because it is slightly larger and
  // pushed back, only its edge shows, which reads as the drawn outline.
  const rim = new Mesh(new SphereGeometry(0.655, 36, 28), mats.ink);
  rim.position.z = -0.08;
  squash.add(rim);

  // Pale yellow sclera.
  const dome = new Mesh(new SphereGeometry(0.62, 36, 28), mats.eyeSkin);
  squash.add(dome);

  // Gaze rotates this pivot, which swings the pupil across the sclera.
  const pivot = new Group();
  squash.add(pivot);

  const pupil = new Mesh(new SphereGeometry(1, 26, 20), mats.ink);
  pupil.scale.set(0.34, 0.36, 0.16);
  pupil.position.set(side * -0.13, -0.03, 0.5);
  pivot.add(pupil);

  const glint = new Mesh(new SphereGeometry(1, 16, 12), mats.paper);
  glint.scale.setScalar(0.06);
  glint.position.set(-0.085, 0.1, 0.6);
  pivot.add(glint);

  // One arc serves both squints: an arch for happy, flipped for sleeping.
  const arc = new Mesh(
    new TorusGeometry(0.34, 0.085, 8, 26, Math.PI * 0.8).scale(1, 1, 0.55),
    mats.ink,
  );
  arc.position.z = 0.535;
  arc.visible = false;
  squash.add(arc);

  // Floating eyebrow. It hangs off the holder (whose world scale is 1:1) so it
  // keeps its shape while still following the eye's own rotation.
  const brow = new Mesh(new CapsuleGeometry(0.066, 0.3, 4, 12).rotateZ(Math.PI / 2), mats.ink);
  const browBase = 0.98;
  brow.position.set(side * 0.02, browBase, 0.3);
  brow.rotation.z = -side * 0.18;
  holder.add(brow);

  const ARC_HAPPY = Math.PI * 0.1;
  const ARC_SLEEP = Math.PI * 1.1;

  function setMode(mode) {
    const closed = mode === 'happy' || mode === 'sleep';
    pupil.visible = !closed;
    glint.visible = !closed;
    arc.visible = closed;
    if (mode === 'happy') arc.rotation.z = ARC_HAPPY;
    if (mode === 'sleep') arc.rotation.z = ARC_SLEEP;
  }

  return {
    holder, squash, pivot, side, brow, browBase, arc,
    setMode,
    setBlink(k) {
      squash.scale.y = 1 - k * 0.9;
    },
  };
}

/* ------------------------------------------------------------------ *
 * Head
 * ------------------------------------------------------------------ */

function buildHead(mats, look) {
  const head = new Group();

  // Wide, slightly flattened skull with a warm patch on each cheek.
  const geo = new SphereGeometry(R, 72, 54);
  const cheeks = [onSphere(0.92, -0.2, 1), onSphere(-0.92, -0.2, 1)];
  const colors = [];
  const v = new Vector3();
  for (let i = 0; i < geo.attributes.position.count; i++) {
    v.fromBufferAttribute(geo.attributes.position, i).normalize();
    let k = 0;
    for (const c of cheeks) k = Math.max(k, clamp(1 - v.distanceTo(c) / 0.4, 0, 1) ** 2);
    // Warms the green slightly instead of lightening it.
    colors.push(1 + k * 0.05, 1 - k * 0.1, 1 - k * 0.16);
  }
  geo.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3));
  head.add(new Mesh(geo, mats.skinVC));

  const eyes = [buildEye(mats, 1), buildEye(mats, -1)];
  for (const e of eyes) head.add(e.holder);

  // Nostrils.
  for (const side of [1, -1]) {
    const n = new Mesh(new SphereGeometry(1, 12, 10), mats.ink);
    n.scale.setScalar(0.062);
    n.position.copy(onSphere(side * 0.2, -0.02, R + 0.012));
    head.add(n);
  }

  /* Mouth: a triangle strip recomputed on the sphere surface, so it wraps. */
  const mouthGeo = new BufferGeometry();
  mouthGeo.setAttribute('position', new BufferAttribute(new Float32Array((MOUTH_SEGMENTS + 1) * 6), 3));
  const index = [];
  for (let i = 0; i < MOUTH_SEGMENTS; i++) {
    const a = i * 2;
    index.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
  }
  mouthGeo.setIndex(index);
  const mouth = new Mesh(mouthGeo, mats.inkSolid);
  head.add(mouth);

  const mouthState = { ...MOUTHS.smile, chatter: 0, base: MOUTH_BASE };

  function layoutMouth() {
    const pos = mouthGeo.attributes.position;
    for (let i = 0; i <= MOUTH_SEGMENTS; i++) {
      const u = (i / MOUTH_SEGMENTS) * 2 - 1;
      const x = u * mouthState.width;
      const top = mouthState.base + mouthState.smile * u * u;
      // Keep some thickness at the corners so the mouth reads as a bar, not a lens.
      const bottom = top - mouthState.open * (1 - mouthState.chatter) * (0.62 + 0.38 * Math.sqrt(1 - u * u));
      const a = onSphere(x / R, top / R, R + 0.02);
      const b = onSphere(x / R, bottom / R, R + 0.02);
      pos.setXYZ(i * 2, a.x, a.y, a.z);
      pos.setXYZ(i * 2 + 1, b.x, b.y, b.z);
    }
    pos.needsUpdate = true;
  }
  layoutMouth();

  return { group: head, eyes, mouth, layoutMouth, mouthState };
}

/* ------------------------------------------------------------------ *
 * Body
 * ------------------------------------------------------------------ */

function buildBody(mats, colors) {
  // A wide barrel that tucks in under the overhanging head. Built from an
  // explicit radius profile so the silhouette can be tuned without guesswork.
  const profile = [];
  const STEPS = 26;
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const y = BODY_BOTTOM + t * (BODY_TOP - BODY_BOTTOM);
    // Bulges just above the ground, tucks in at the very bottom and the top.
    const r = 1.8 - 0.16 * (1 - sstep(t, 0, 0.22)) - 0.5 * sstep(t, 0.55, 1.0);
    profile.push(new Vector2(r, y));
  }
  const geo = new LatheGeometry(profile, 56);

  // Cream belly painted straight into vertex colours: a big patch covering
  // most of the front, feathered at the rim.
  const skin = new Color(colors.skin);
  const belly = new Color(colors.belly);
  const tmp = new Color();
  const out = [];
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const phi = Math.atan2(x, z);
    const d = Math.sqrt((phi / 1.22) ** 2 + ((y - 0.42) / 1.32) ** 2);
    const w = 1 - sstep(d, 0.55, 1.08);
    tmp.copy(skin).lerp(belly, sstep(w, 0.05, 0.9) * 0.95);
    out.push(tmp.r, tmp.g, tmp.b);
  }
  geo.setAttribute('color', new BufferAttribute(new Float32Array(out), 3));

  const body = new Mesh(geo, mats.bodyVC);
  body.scale.z = 0.82;

  const group = new Group();
  group.add(body);

  for (const side of [1, -1]) {
    // Hind legs: big rounded masses that push the silhouette out past the head.
    const haunch = new Mesh(new SphereGeometry(1, 32, 24), mats.skin);
    haunch.scale.set(1.0, 0.96, 1.02);
    haunch.position.set(side * 2.05, -0.18, -0.12);
    group.add(haunch);

    // Hind feet, splayed forward at ground level.
    const foot = new Mesh(new SphereGeometry(1, 28, 20), mats.skin);
    foot.scale.set(0.62, 0.26, 0.86);
    foot.position.set(side * 1.7, BODY_BOTTOM + 0.2, 0.88);
    foot.rotation.y = side * 0.24;
    group.add(foot);
  }

  return group;
}

function buildHand(mats, side) {
  const hand = new Group();

  const palm = new Mesh(new SphereGeometry(1, 20, 16), mats.skin);
  palm.scale.set(0.29, 0.3, 0.17);
  hand.add(palm);

  // Three chunky fingers reads more amphibian than four slender ones.
  const fingers = [];
  const fingerGeo = new CapsuleGeometry(0.088, 0.16, 4, 10);
  for (let i = 0; i < 3; i++) {
    const g = new Group();
    g.position.set((i - 1) * 0.19, -0.2, 0.01);
    const seg = new Mesh(fingerGeo, mats.skin);
    seg.position.y = -0.1;
    g.add(seg);
    hand.add(g);
    fingers.push(g);
  }

  const thumbPivot = new Group();
  thumbPivot.position.set(side * 0.25, -0.04, 0.04);
  thumbPivot.rotation.z = side * 0.5;
  const thumb = new Mesh(new CapsuleGeometry(0.085, 0.14, 4, 10), mats.skin);
  thumb.position.y = -0.09;
  thumbPivot.add(thumb);
  hand.add(thumbPivot);

  hand.rotation.z = side * 0.16;
  return { hand, fingers, thumbPivot };
}

function buildArm(mats, side) {
  const shoulder = new Group();
  shoulder.position.set(side * 1.55, 0.3, 1.02);
  shoulder.rotation.order = 'ZXY';
  shoulder.rotation.z = side * 0.55;

  const upper = new Mesh(new CapsuleGeometry(0.26, 0.62, 6, 18), mats.skin);
  upper.position.y = -0.31;
  shoulder.add(upper);

  const elbow = new Group();
  elbow.position.y = -0.62;
  shoulder.add(elbow);

  const fore = new Mesh(new CapsuleGeometry(0.23, 0.42, 6, 18), mats.skin);
  fore.position.y = -0.21;
  elbow.add(fore);

  const wrist = new Group();
  wrist.position.y = -0.42;
  elbow.add(wrist);

  const { hand, fingers, thumbPivot } = buildHand(mats, side);
  wrist.add(hand);

  return { shoulder, elbow, wrist, hand, fingers, thumbPivot, side };
}

/* ------------------------------------------------------------------ *
 * Public builder
 * ------------------------------------------------------------------ */

export function buildCharacter(look) {
  const colors = look.colors;
  const mats = buildMaterials(colors);

  const root = new Group();
  root.rotation.order = 'ZYX';

  const pivot = new Group();
  root.add(pivot);

  const neck = new Group();
  neck.position.y = NECK_Y;
  neck.rotation.order = 'YXZ';
  pivot.add(neck);

  const headPivot = new Group();
  neck.add(headPivot);

  const head = buildHead(mats, look);
  head.group.position.y = HEAD_Y;
  head.group.scale.set(HEAD_X_SCALE, HEAD_Y_SCALE, 1.0);
  headPivot.add(head.group);

  pivot.add(buildBody(mats, colors));

  const arms = {
    right: buildArm(mats, -1),
    left: buildArm(mats, 1),
  };
  pivot.add(arms.right.shoulder, arms.left.shoulder);

  /* ---------------- animation state ---------------- */

  const state = {
    blink: 0,
    blinkTimer: 2 + Math.random() * 3,
    breathe: 0,
    talk: 0,
    gaze: [0, 0],
    roll: 0,
    happy: false,
    sleeping: false,
    idle: false,
    wake: 0,
  };

  // Timers for the idle micro-behaviour: glances, pupil darts, whistling, bobbing.
  const idle = {
    nextLook: 0,
    lookYaw: 0,
    lookPitch: 0,
    lookRoll: 0,
    nextDart: 0,
    dartX: 0,
    dartY: 0,
    whistle: 0,
    nextWhistle: 0,
    bounce: 0,
  };

  const targets = { yaw: 0, pitch: 0, roll: 0 };

  // The mouth returns to this whenever a gesture finishes. The page swaps it
  // between a neutral line and a smile as the pointer enters the body.
  let restMouth = 'flat';

  function setMouth(name) {
    const shape = MOUTHS[name] ?? MOUTHS.smile;
    head.mouthState.base = MOUTH_BASE;
    head.mouthState.width = shape.width;
    head.mouthState.open = shape.open;
    head.mouthState.smile = shape.smile;
    head.layoutMouth();
  }

  /** 'open' | 'happy' | 'sleep' — sleep wins over happy. */
  function applyEyeMode() {
    const mode = state.sleeping ? 'sleep' : state.happy ? 'happy' : 'open';
    for (const e of head.eyes) e.setMode(mode);
  }

  function setHappy(on) {
    state.happy = on;
    applyEyeMode();
  }

  // How long the waking shiver lasts, in seconds.
  const WAKE_SECONDS = 0.85;

  function setIdle(on) {
    state.idle = on;
    if (on) {
      idle.nextLook = 0.3;
      idle.nextDart = 0.2;
      idle.nextWhistle = 1.6;
      idle.bounce = 2.0;
      return;
    }
    // Release the body back to rest so nothing is left offset.
    idle.whistle = 0;
    idle.lookYaw = 0;
    idle.lookPitch = 0;
    idle.lookRoll = 0;
    idle.dartX = 0;
    idle.dartY = 0;
    pivot.position.set(0, 0, 0);
    pivot.scale.set(1, 1, 1);
    pivot.rotation.z = 0;
  }

  function setSleeping(on) {
    if (!on && state.sleeping) state.wake = WAKE_SECONDS;
    state.sleeping = on;
    applyEyeMode();
    if (!on) setMouth(restMouth);
  }

  function setRestMouth(name) {
    restMouth = name;
    if (state.talk <= 0) setMouth(name);
  }

  function talk(duration = 1.4) {
    state.talk = duration;
    setMouth('open');
  }

  function blink() {
    state.blink = 1;
  }

  function lookAt(nx, ny) {
    const x = clamp(nx, -1, 1);
    const y = clamp(ny, -1, 1);
    // x is positive when the pointer sits to the LEFT of the head, and a negative
    // Y rotation turns the face that way — so yaw takes the opposite sign.
    targets.yaw = -x * 0.34;
    targets.pitch = y * 0.18;
    // Eyes travel further than the head and get there first; the head arriving
    // late is what makes the gaze read as eyes rather than a turret.
    // Both signs are negative because the pivot's Y rotation sends the pupil
    // toward +X, and its X rotation sends it toward +Y — the opposite of the
    // pointer's screen direction.
    state.gaze[0] = -x * 0.36;
    state.gaze[1] = -y * 0.24;
    // A positive Z rotation tips the crown toward -X, which is toward the pointer
    // when it is on the left, so the roll keeps x's sign.
    targets.roll = x * 0.17;
  }

  function update(dt, t) {
    state.breathe += dt;

    // A sleeping frog breathes slower, nods off, and its brows settle.
    const asleep = state.sleeping;
    const breath = Math.sin(state.breathe * (asleep ? 0.62 : 1.4));
    head.group.position.y = HEAD_Y + breath * (asleep ? 0.012 : 0.02);
    head.group.scale.y = HEAD_Y_SCALE + breath * 0.008;
    // Head roll: the frog tips its crown toward whatever it is looking at, which
    // is what makes the head read as twisting rather than just turning.
    const rollTarget = asleep ? 0 : targets.roll;
    state.roll += (rollTarget - state.roll) * Math.min(1, dt * 3.4);
    neck.rotation.z = Math.sin(state.breathe * 0.6) * 0.03 + state.roll;

    // Idle fidgeting: glances, pupil darts, whistling and a small bob.
    if (state.idle && !asleep) {
      idle.nextLook -= dt;
      if (idle.nextLook <= 0) {
        idle.lookYaw = (Math.random() * 2 - 1) * 0.3;
        idle.lookPitch = (Math.random() * 2 - 1) * 0.1;
        idle.lookRoll = (Math.random() * 2 - 1) * 0.09;
        idle.nextLook = 1.5 + Math.random() * 2.2;
      }
      targets.yaw = idle.lookYaw;
      targets.pitch = idle.lookPitch;
      targets.roll = idle.lookRoll;

      idle.nextDart -= dt;
      if (idle.nextDart <= 0) {
        idle.dartX = (Math.random() * 2 - 1) * 0.13;
        idle.dartY = (Math.random() * 2 - 1) * 0.08;
        idle.nextDart = 0.45 + Math.random() * 1.1;
      }
      state.gaze[0] = idle.dartX;
      state.gaze[1] = idle.dartY;

      // Whistling: a small pursed mouth that pulses, every few seconds.
      if (idle.whistle > 0) {
        idle.whistle -= dt;
        const w = Math.min(1, idle.whistle * 4);
        head.mouthState.base = MOUTH_BASE;
        head.mouthState.width = 0.36;
        head.mouthState.smile = -0.06;
        head.mouthState.chatter = 0;
        head.mouthState.open = (0.19 + 0.08 * Math.sin(t * 13)) * w;
        head.layoutMouth();
        if (idle.whistle <= 0) setMouth(restMouth);
      } else {
        idle.nextWhistle -= dt;
        if (idle.nextWhistle <= 0 && state.talk <= 0) {
          idle.whistle = 1.2 + Math.random() * 0.7;
          idle.nextWhistle = 3.6 + Math.random() * 3.4;
        }
      }

      // The bob is a short burst, not a permanent state: a couple of seconds of
      // dancing, then it settles and just looks around.
      if (idle.bounce > 0) {
        idle.bounce -= dt;
        const ph = t * 4.2;
        const lift = Math.abs(Math.sin(ph)) * 0.16;
        const sq = 0.03 * (1 - Math.abs(Math.sin(ph)));
        pivot.scale.set(1 + sq * 0.7, 1 - sq, 1 + sq * 0.7);
        pivot.position.y = RIG_BOTTOM * sq + lift;
        pivot.position.x = Math.sin(t * 1.9) * 0.05;
        pivot.rotation.z = Math.sin(ph + 0.7) * 0.012;
      } else {
        pivot.position.set(0, 0, 0);
        pivot.rotation.z = 0;
        pivot.scale.set(1, 1, 1);
      }
    }

    neck.rotation.y += (targets.yaw - neck.rotation.y) * Math.min(1, dt * 4);
    const pitchTarget = asleep ? 0.17 : targets.pitch;
    neck.rotation.x += (pitchTarget - neck.rotation.x) * Math.min(1, dt * (asleep ? 2 : 4));

    for (const e of head.eyes) {
      e.pivot.rotation.y += (state.gaze[0] - e.pivot.rotation.y) * Math.min(1, dt * 12);
      e.pivot.rotation.x += (-state.gaze[1] - e.pivot.rotation.x) * Math.min(1, dt * 12);

      const browTarget = e.browBase + (state.happy ? 0.1 : 0) - (asleep ? 0.06 : 0);
      e.brow.position.y += (browTarget - e.brow.position.y) * Math.min(1, dt * 9);
    }

    // Waking shudder: a short decaying shiver, like shaking off sleep.
    if (state.wake > 0) {
      state.wake = Math.max(0, state.wake - dt);
      const k = state.wake / WAKE_SECONDS;
      const env = k * k; // strongest immediately on waking, gone by the end
      const shiver = Math.sin(t * 46) * env;
      const shake = Math.sin(t * 33 + 1.3) * env;
      // Assign rather than accumulate: nothing else resets the pivot while awake,
      // so `+=` here would walk the body off in one direction.
      pivot.position.set(shiver * 0.14, Math.abs(shake) * 0.07, 0);
      pivot.rotation.z = shiver * 0.07;
      pivot.scale.set(1, 1 - Math.abs(shake) * 0.03, 1);
      // The neck is rewritten every frame by the pitch/yaw easing, so adding is safe.
      neck.rotation.z += shiver * 0.085;
      neck.rotation.x += shake * 0.05;
      if (state.wake === 0) {
        pivot.position.set(0, 0, 0);
        pivot.rotation.z = 0;
        pivot.scale.set(1, 1, 1);
      }
    }

    // Frogs blink less than people, so the timer runs a little longer.
    if (asleep) {
      // Eyes are already shut; a blink would flicker the closed lids.
      if (state.blink !== 0) {
        state.blink = 0;
        for (const e of head.eyes) e.setBlink(0);
      }
    } else {
      state.blinkTimer -= dt;
      if (state.blinkTimer <= 0) {
        state.blink = 1;
        state.blinkTimer = 2.6 + Math.random() * 5;
      }
      if (state.blink > 0) {
        state.blink = Math.max(0, state.blink - dt * 5.5);
        const k = Math.sin(state.blink * Math.PI) ** 0.6;
        for (const e of head.eyes) e.setBlink(k);
      }
    }

    if (state.talk > 0) {
      state.talk -= dt;
      head.mouthState.chatter = 0.5 + 0.5 * Math.sin(t * 22);
      head.layoutMouth();
      if (state.talk <= 0) {
        head.mouthState.chatter = 0;
        setMouth(restMouth);
      }
    }

    // Snoring: a small round mouth that opens and closes with the breath.
    if (asleep) {
      // A slower, deeper cycle than the idle breath, and a mouth that opens wide
      // enough to read at character scale.
      const snore = 0.5 + 0.5 * Math.sin(state.breathe * 1.05);
      head.mouthState.base = -0.26;
      head.mouthState.width = 0.68;
      head.mouthState.smile = 0.05;
      head.mouthState.chatter = 0;
      head.mouthState.open = 0.05 + 0.34 * snore;
      head.layoutMouth();
    }

    // Arms rest at the sides; there is no gesture vocabulary on this rig.
    const right = arms.right;
    const k = Math.min(1, dt * 5);
    right.wrist.rotation.z += (0.1 + Math.sin(t * 1.3 + 1.1) * 0.05 - right.wrist.rotation.z) * k;
    for (const f of right.fingers) f.rotation.x += (0.2 - f.rotation.x) * k;
  }

  // Measured once, in rig units, so layout does not have to assume proportions.
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const bounds = {
    minY: box.min.y,
    maxY: box.max.y,
    height: box.max.y - box.min.y,
    width: box.max.x - box.min.x,
  };

  return {
    root,
    bounds,
    parts: { neck, headPivot, head: head.group, arms },
    look: head,
    api: { update, setMouth, setRestMouth, talk, blink, lookAt, setHappy, setSleeping, setIdle, state },
  };
}
