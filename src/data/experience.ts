export type Role = { company: string; place?: string; title: string; when: string; head?: boolean; bullets: { text: string; metric?: string }[] };

// Bullets use {metric} as the slot for the highlighted number.
export const experience: Role[] = [
  {
    company: "Inverted AI",
    place: "Vancouver",
    title: "autonomous driving",
    when: "2026..now",
    head: true,
    bullets: [],
  },
  {
    company: "Markaba",
    title: "software and automation intern",
    when: "2025-07..2025-10",
    bullets: [
      { text: "Kept crawlers {metric} on marketplaces that block bots.", metric: "95% reliable" },
      { text: "Made credit report processing {metric} with an async OCR service.", metric: "4x faster" },
      { text: "Cut dashboard p95 from {metric} with batching, indexes and caching.", metric: "15s to under 1s" },
    ],
  },
];
