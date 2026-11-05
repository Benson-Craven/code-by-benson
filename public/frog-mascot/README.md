# frog-mascot

A self-contained 3D frog that renders itself to two colours. Drop the folder into
any page, add one element, done.

- **Two looks.** Ordered dither (two colours) or pixel art (a fixed ramp).
- **No build step, no framework.** Plain ES modules and one custom element.
- **Transparent canvas.** Whatever background you put behind it shows through.
- **Alive on its own.** Follows the pointer, blinks, fidgets when idle, falls
  asleep, wakes with a shudder.
- **2.1 MB**, almost all of it three.js.

```
frog-mascot/
├── src/frog-mascot.js     the component (API, loop, overlays)
├── src/character.js       the rig — procedural, no meshes on disk
├── src/dither.js          the two render passes
├── vendor/three.module.js three.js r186 (the only dependency)
├── demo.html              minimal usage example
└── README.md
```

## Try it

Any static server will do, because ES modules will not load from `file://`:

```sh
npx serve .          # or: python3 -m http.server
```

Then open `demo.html`.

## Use it

### The element

```html
<script type="module" src="./frog-mascot/src/frog-mascot.js"></script>

<style>
  frog-mascot { position: fixed; inset: 0; pointer-events: none; }
</style>

<frog-mascot id="frog"></frog-mascot>
```

Give it a box and it fills it. `pointer-events: none` on the host lets clicks
pass through the empty space while the canvas itself stays interactive — the
component already sets `pointer-events: auto` on the canvas inside its shadow
root.

### The class

```js
import { FrogMascot } from './frog-mascot/src/frog-mascot.js';

const frog = new FrogMascot(document.querySelector('#frog'), {
  mode: 'pixel',
});
```

### Options

| Option | Default | Meaning |
| --- | --- | --- |
| `mode` | `'dither'` | `'dither'` or `'pixel'`. |
| `palette` | the frog palette | Partial override; `ramp` merges deeply. |
| `follow` | `true` | Body leans and turns after the pointer. |
| `hover` | `true` | Hover gives a smile, a squint and an emoticon. |
| `idle` | `true` | Glances, pupil darts, whistling, a short dance. |
| `autoSleep` | `true` | Dozes off after `sleepAfter` ms of stillness. |
| `draggable` | `true` | Click and drag squashes the frog; it springs back. |
| `badge` | `false` | Small circular crop, facing front. |
| `sleepAfter` | `15000` | Stillness before sleeping, ms. |
| `loungeAfter` | `2600` | Stillness before idle fidgeting starts, ms. |
| `smileFor` | `1500` | How long the hover reaction lasts, ms. |
| `turn` | `-0.18` | Resting body yaw, radians. |

### API

```js
frog.setMode('pixel');       // 'dither' | 'pixel'
frog.getMode();
frog.say('Hello.');          // speech bubble + mouth chatter
frog.say('Long one.', 5);    // …held for 5 seconds
frog.blink();
frog.sleep();                // force the sleeping pose
frog.wake();                 // wake with the shudder
frog.setBadge(true);         // circular crop, faces front
frog.setBadgeMix(0.5);       // blend between full body (0) and badge (1)
frog.setPalette({ ink: '#10141a' });
frog.resize();               // normally automatic (ResizeObserver)
frog.destroy();              // stop the loop, dispose GPU resources
```

### Events

Dispatched on the host element, so they bubble and compose:

```js
el.addEventListener('frog:click', () => frog.say('Oi.'));
el.addEventListener('frog:sleep', () => {});
el.addEventListener('frog:wake', () => {});
el.addEventListener('frog:mode', (e) => console.log(e.detail.mode));
el.addEventListener('frog:say', (e) => console.log(e.detail.text));
```

### Theming

The overlays read CSS custom properties off the host:

```css
frog-mascot {
  --frog-paper: #fffdf6;
  --frog-ink: #10141a;
  --frog-shadow: #c9c2ad;   /* the offset block shadow */
}
```

The character's own colours come from the `palette` option. The dither pass uses
`ink` and `paper` only; the pixel pass uses the `ramp` entries plus `paper`.

## How it renders

Each frame the scene is rendered once into an offscreen target, then a
fullscreen quad flattens it:

- **dither** — half resolution, a 4×4 Bayer threshold, exactly two colours.
- **pixel** — quarter resolution, posterised into a fixed ramp, plus a
  one-pixel outline grown from the alpha channel.

Both discard where the scene alpha is empty, which is why the canvas is
transparent outside the frog.

## Notes and limits

- **Sizes to its host.** Put it in a fixed full-viewport box, or a sized
  container. It does not measure the window.
- **Follows the pointer anywhere on the page.** The listener is on `window`, so
  the frog notices the cursor even outside its own box. Two instances on one
  page will both follow.
- **three.js is vendored.** To use your own copy, change the
  `../vendor/three.module.js` import at the top of the three files in `src/`.
- **WebGL2 required.** The render target is `HalfFloatType`.
- **The character is procedural.** No mesh or texture files; it is built from
  spheres, capsules and a lathe at load time.

## Portfolio integration additions

The copied component accepts `fit: 'container'` for a padded, centered rig and
`paused: true` to start without a render loop. `setPaused(boolean)` cancels or
resumes the loop. `snapshot()` renders synchronously and returns a PNG data URL.
Both postprocessing passes are disposed on destruction. The original source
workspace remains unchanged. `capture.html` reproduces the static fallback.
The portfolio adapter disables canvas pointer events so scrolling and links
remain accessible. Three.js licence notices remain in both vendor modules.
