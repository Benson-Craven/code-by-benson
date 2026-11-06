# Showcase media

Edit `showcaseMedia` near the top of `app/redesign/projectPresentationData.ts`. Each project has independent `desktop` and `mobile` entries. Desktop keys `0`, `1` and `2` select the three laptop views. Mobile keys `front` and `back` select the two phone faces. Each slot accepts either an image or a clip. Omitted slots keep their existing media.

Waxlist and Nibbles with Nifa render only desktop slot `0` and the phone's `front` preview, with all three frog speech bubbles. Their phones stay front-facing without flipping. The other desktop slots and the phone's `back` face are omitted.

Chronic Pain Recovery renders all three desktop clips and both phone faces, so the section cycles through the homepage, conditions and science views before flipping the phone. Each desktop clip keeps a matching still as its poster, which is what shows while the clip loads.

The Nibbles project page also reads desktop slots `1` and `2` for its two half-width screenshot frames. Those are live captures of the recipe index and the travel feature; the homepage showcase still renders only slot `0`. The project page skips its separate walkthrough section because the desktop clip fills the main frame and the real homepage still fills the hero.

These are device mockup slots, not viewport overrides. The scroll sequence shows both laptop and phone views on narrow screens. Put files under `public/images` and use paths beginning with `/images`.

Video entries accept an optional poster image:

```ts
{
    type: "video",
    src: "/images/chronic-pain-recovery/cprie-hp-1-vid.mp4",
    poster: "/images/chronic-pain-recovery/home.webp",
    alt: "Chronic Pain Recovery homepage walkthrough",
    label: "Homepage",
}
```

MP4, WebM and OGV file extensions are also detected automatically. Videos autoplay muted, loop and play inline without controls. Keep shared project covers in `app/data/portfolioProjects.ts` as images because cards, metadata and project transitions consume them as images.
