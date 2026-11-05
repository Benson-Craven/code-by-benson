# Showcase media

Edit `showcaseMedia` near the top of `app/redesign/projectPresentationData.ts`. Each project has independent `desktop` and `mobile` entries. Desktop keys `0`, `1` and `2` select the three laptop views. Mobile keys `front` and `back` select the two phone faces. Each slot accepts either an image or a clip. Omitted slots keep their existing media.

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
