/*
  RELEASE DATA — main file to edit for information releases.

  IMPORTANT:
  - Do not upload embargoed images/body copy to public GitHub before release.
  - Keep future items published:false with only safe teaser metadata.
  - On release day, add the content/CTA, upload required assets, then set published:true.
  - v4.4 automatically renders the 3×2 RELEASED / NEXT card UI.
*/

window.CYNS_RELEASES = [
  {
    id: "x-account-open",
    number: "01",
    dateLabel: "2026.12.18",
    sortDate: "2026-12-18",
    name: "X ACCOUNT OPEN",
    teaser: "CUSTOM YOUR NARUSASU 公式X OPEN",
    thumbnail: "",
    thumbnailAlt: "",
    pinned: false,
    pinOrder: 0,
    published: false,
    type: "information",
    title: "",
    image: "",
    imageAlt: "",
    imageCaption: "",
    body: [],
    ctaText: "",
    ctaUrl: ""
  },
  {
    id: "anthology-teaser",
    number: "02",
    dateLabel: "2026.12.21",
    sortDate: "2026-12-21",
    name: "ANTHOLOGY TEASER",
    teaser: "『そのあと、ふたりで。』TEASER",
    thumbnail: "",
    thumbnailAlt: "",
    pinned: false,
    pinOrder: 0,
    published: false,
    type: "information",
    title: "",
    image: "",
    imageAlt: "",
    imageCaption: "",
    body: [],
    ctaText: "",
    ctaUrl: ""
  },
  {
    id: "prompt-gacha",
    number: "03",
    dateLabel: "2026.12.24",
    sortDate: "2026-12-24",
    name: "NARUSASU PROMPT GACHA",
    teaser: "NARUSASU お題ガチャ OPEN",
    thumbnail: "",
    thumbnailAlt: "",
    pinned: false,
    pinOrder: 0,
    published: false,
    type: "information",
    title: "",
    image: "",
    imageAlt: "",
    imageCaption: "",
    body: [],
    ctaText: "",
    ctaUrl: ""
  }
];

/*
  v4.4 RELEASE CARD FIELDS

  sortDate: "YYYY-MM-DD"
    Card ordering only.

  thumbnail: "./assets/releases/xxxxx.jpg"
    Square thumbnail used by the RELEASED / NEXT grid.

  thumbnailAlt: "..."
    Accessibility text.

  pinned: true / false
    Keep an already-published item on the first 3×2 panel.

  pinOrder: 1, 2, 3...
    Priority among pinned items. Lower numbers come first.

  FIRST PANEL PRIORITY:
    1) latest published item
    2) nearest NEXT item
    3) pinned published items
    4) most recent remaining published items

  Future embargoed body copy / images should still NOT be uploaded
  to the public repository before release.
*/
