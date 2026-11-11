# Showcase media

Edit `showcaseMedia` near the top of `app/redesign/projectPresentationData.ts`. Each project has independent `desktop` and `mobile` entries. Desktop keys `0`, `1` and `2` select the three laptop views. Mobile keys `front` and `back` select the two phone faces. Each slot accepts either an image or a clip. Omitted slots are absent; the project pages only render the media that exists.

Waxlist renders all three desktop clips and the phone's `front` preview, with all three frog speech bubbles. Its phone stays front-facing without flipping, and the `back` face is omitted.

Nibbles with Nifa renders only desktop slot `0` and the phone's `front` preview, with all three frog speech bubbles. Its phone stays front-facing without flipping. Its project page uses the same wide clip and has no paired frames.

Chronic Pain Recovery renders all three desktop clips and both phone faces, so the section cycles through the homepage, conditions and science views before flipping the phone. Each desktop clip keeps a matching still as its poster, which is what shows while the clip loads.

The Nibbles project page uses slot `0` in its wide frame. It has no paired frames: the earlier recipe-index and travel-feature captures belonged to the previous public design and were removed from `showcaseMedia`. The architecture diagrams stay on `/work/nibbles-with-nifa`, next to the decisions they explain.

The Waxlist project page uses slot `0` in its wide frame and slots `1` and `2` in the paired frames. Its wide frame plays the homepage clip, and its separate walkthrough section is gone. The walkthrough clip stays on `/work/waxlist`.

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
