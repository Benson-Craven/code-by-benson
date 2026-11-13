# Share the footer frog tricks with the 404 page

Date: 2026-11-13

Status: Accepted

The 404 page uses the footer's black background, 80px grid, Funnel Sans and frog interaction. It offers a direct home link and a keyboard-accessible trick button.

`frogTricks.ts` owns the existing firefly flight, tongue catch, three hops and subsequent sighs. Both the homepage controller and the standalone `TrickFrog` use it. The standalone component owns renderer loading, visibility, resizing and disposal without the homepage scroll controller.

Reduced motion and renderer failure keep the static frog. The trick button reports that the frog is resting. Hidden or offscreen animation pauses, and unmount removes listeners and destroys the renderer and tweens.

This extraction changes the homepage controller, so its trick sequence shares the same implementation as the 404. No dependency was added.
