/**
 * Two looks, one scene.
 *
 *   'dither' — half-resolution render, thresholded against a Bayer 4x4 matrix
 *              down to exactly two colours. Print/halftone.
 *
 *   'pixel'  — quarter-resolution render, posterised into a fixed ramp and
 *              given a one-pixel ink outline. Classic pixel art.
 *
 * Both passes read the same offscreen render, so the character, its animation
 * and the reveal all work identically in either mode.
 */

import * as THREE from '../vendor/three.module.js';

/* ------------------------------------------------------------------ *
 * Shared fullscreen-quad vertex shader
 * ------------------------------------------------------------------ */

export const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/* ------------------------------------------------------------------ *
 * Dither pass
 * ------------------------------------------------------------------ */

export const DITHER_FRAG = /* glsl */ `
  uniform sampler2D uScene;
  uniform vec3  uClip;    // xy = circle centre (device px), z = radius (device px)
  uniform vec2  uTug;     // drag offset, stretches the dither away from the grab point
  uniform vec3  uInk;
  uniform vec3  uPaper;
  uniform vec4  uPrint;   // x = cover, y = develop, z = wipe origin, w = wipe height

  varying vec2 vUv;

  // Ordered dithering without a lookup texture: two 2x2 levels compose into 4x4.
  float bayer2(vec2 a) {
    a = floor(a);
    return fract(a.x / 2.0 + a.y * a.y * 0.75);
  }

  float bayer4(vec2 a) {
    return bayer2(0.5 * a) * 0.25 + bayer2(a);
  }

  void main() {
    vec4 color = texture2D(uScene, vUv);

    // Ragged, noisy edge for the "printing on" wipe.
    vec2  from  = gl_FragCoord.xy - uClip.xy;
    vec2  along = uTug * clamp(dot(from, uTug) / (dot(uTug, uTug) + 1e-4), 0.0, 1.0);
    float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    float key   = (noise + clamp((uPrint.z - gl_FragCoord.y) / uPrint.w, 0.0, 1.0)) / 2.0;

    if (color.a < 0.5 || distance(from, along) > uClip.z || key >= uPrint.x) discard;

    // Perceptual luma (the scene is lit in linear space, so gamma-correct it
    // first), then a single threshold. That is the entire shading model.
    float light = pow(dot(color.rgb, vec3(0.2126, 0.7152, 0.0722)), 1.0 / 2.2);
    gl_FragColor = vec4(key < uPrint.y && light > bayer4(gl_FragCoord.xy) ? uPaper : uInk, 1.0);
  }
`;

/* ------------------------------------------------------------------ *
 * Pixel pass
 * ------------------------------------------------------------------ */

export const PIXEL_FRAG = /* glsl */ `
  uniform sampler2D uScene;
  uniform vec2  uTexel;   // 1.0 / render resolution
  uniform vec3  uClip;
  uniform vec4  uPrint;

  uniform vec3 uInk;
  uniform vec3 uDeep, uMid, uLight;        // green ramp, dark -> light
  uniform vec3 uCreamLo, uCreamMid, uCreamHi;  // belly ramp, orange -> pale
  uniform vec3 uWhite;

  varying vec2 vUv;

  float lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

  float alphaAt(vec2 o) { return texture2D(uScene, vUv + o).a; }

  void main() {
    // Badge clip and print-in wipe, same conventions as the dither pass.
    vec2 from = gl_FragCoord.xy - uClip.xy;
    if (uClip.z < 5000.0 && length(from) > uClip.z) discard;

    float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    float key = (noise + clamp((uPrint.z - gl_FragCoord.y) / uPrint.w, 0.0, 1.0)) / 2.0;
    if (key >= uPrint.x) discard;

    vec4 c = texture2D(uScene, vUv);

    if (c.a <= 0.5) {
      // One-pixel outline: an empty pixel touching the body becomes ink.
      float nb = max(
        max(alphaAt(vec2( uTexel.x, 0.0)), alphaAt(vec2(-uTexel.x, 0.0))),
        max(alphaAt(vec2(0.0,  uTexel.y)), alphaAt(vec2(0.0, -uTexel.y)))
      );
      nb = max(nb, max(
        max(alphaAt(vec2( uTexel.x,  uTexel.y)), alphaAt(vec2(-uTexel.x,  uTexel.y))),
        max(alphaAt(vec2( uTexel.x, -uTexel.y)), alphaAt(vec2(-uTexel.x, -uTexel.y)))
      ));
      if (nb <= 0.5) discard;
      gl_FragColor = vec4(uInk, 1.0);
      return;
    }

    float l = lum(c.rgb);
    float mx = max(max(c.r, c.g), c.b);
    float mn = min(min(c.r, c.g), c.b);
    float sat = (mx - mn) / max(mx, 1e-4);

    vec3 col;
    if (l < 0.12) {
      // Anything this dark is an ink mark: pupil, mouth, nostril.
      col = uInk;
    } else if (sat < 0.15 && l > 0.58) {
      // The eye glint is the only near-neutral light.
      col = uWhite;
    } else if (c.r > c.g) {
      // Warm family: the throat and belly.
      col = l > 0.88 ? uCreamHi : (l > 0.74 ? uCreamMid : uCreamLo);
    } else {
      // Green family: head, limbs, body.
      col = l > 0.56 ? uLight : (l > 0.33 ? uMid : uDeep);
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ------------------------------------------------------------------ *
 * Passes
 * ------------------------------------------------------------------ */

class FullscreenPass {
  constructor(uniforms, fragmentShader) {
    this.uniforms = uniforms;
    this.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: QUAD_VERT,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
    });
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));
    this.camera = new THREE.OrthographicCamera(0, 1, 0, -1, 0, 4000);
    this.camera.position.z = 2000;
  }

  setSize(width, height) {
    this.camera.right = width;
    this.camera.top = height;
    this.camera.bottom = 0;
    this.camera.updateProjectionMatrix();
  }
}

export class DitherPass extends FullscreenPass {
  constructor(palette) {
    super({
      uScene: { value: null },
      uClip: { value: new THREE.Vector3(0, 0, 1e4) },
      uTug: { value: new THREE.Vector2(0, 0) },
      uInk: { value: new THREE.Color(palette.ink) },
      uPaper: { value: new THREE.Color(palette.paper) },
      uPrint: { value: new THREE.Vector4(1, 1, 0, 1) },
    }, DITHER_FRAG);
  }
}

export class PixelPass extends FullscreenPass {
  constructor(palette) {
    super({
      uScene: { value: null },
      uTexel: { value: new THREE.Vector2(1 / 720, 1 / 450) },
      uClip: { value: new THREE.Vector3(0, 0, 1e4) },
      uPrint: { value: new THREE.Vector4(1, 1, 0, 1) },
      uInk: { value: new THREE.Color(palette.ink) },
      uDeep: { value: new THREE.Color(palette.ramp.deep) },
      uMid: { value: new THREE.Color(palette.ramp.mid) },
      uLight: { value: new THREE.Color(palette.ramp.light) },
      uCreamLo: { value: new THREE.Color(palette.ramp.creamLo) },
      uCreamMid: { value: new THREE.Color(palette.ramp.creamMid) },
      uCreamHi: { value: new THREE.Color(palette.ramp.creamHi) },
      uWhite: { value: new THREE.Color(palette.paper) },
    }, PIXEL_FRAG);
  }
}

/* ------------------------------------------------------------------ *
 * Renderer
 * ------------------------------------------------------------------ */

const SCALE = { dither: 2, pixel: 8 };

export class DitherRenderer {
  constructor(canvas, palette, { mode = 'dither' } = {}) {
    this.canvas = canvas;
    this.mode = mode;
    this.pixelRatio = SCALE[mode];

    THREE.ColorManagement.enabled = false;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    this.target = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      depthBuffer: true,
    });

    this.dither = new DitherPass(palette);
    this.pixel = new PixelPass(palette);
    this.dither.uniforms.uScene.value = this.target.texture;
    this.pixel.uniforms.uScene.value = this.target.texture;

    this.scene = null;
    this.camera = null;
    this.width = 1;
    this.height = 1;
  }

  get pass() {
    return this.mode === 'pixel' ? this.pixel : this.dither;
  }

  setMode(mode) {
    this.mode = mode;
    this.pixelRatio = SCALE[mode];
    return this;
  }

  setScene(scene, camera) {
    this.scene = scene;
    this.camera = camera;
  }

  resize(cssWidth, cssHeight) {
    const an = this.pixelRatio;
    const w = Math.max(1, Math.ceil(cssWidth / an));
    const h = Math.max(1, Math.ceil(cssHeight / an));

    this.width = w;
    this.height = h;

    this.renderer.setPixelRatio(1);
    this.renderer.setSize(w, h, false);
    this.target.setSize(w, h);

    this.canvas.style.width = `${w * an}px`;
    this.canvas.style.height = `${h * an}px`;

    this.dither.setSize(w, h);
    this.pixel.setSize(w, h);
    this.pixel.uniforms.uTexel.value.set(1 / w, 1 / h);

    if (this.camera) {
      this.camera.right = w * an;
      this.camera.top = h * an;
      this.camera.bottom = 0;
      this.camera.updateProjectionMatrix();
    }
    // Resizing clears the canvas after animation callbacks, before browser paint.
    if (this.scene && this.camera) this.render();
  }

  render() {
    this.renderer.setRenderTarget(this.target);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
    const p = this.pass;
    this.renderer.render(p.scene, p.camera);
  }
}
