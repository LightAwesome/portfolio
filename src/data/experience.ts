// The hero's split window shows a visual tied to whatever you do now.
// "sim" is the live traffic sim; "diagram" shows a project's architecture diagram.
export type Visual =
  | { kind: "sim"; file: string; caption: string }
  | { kind: "diagram"; project: string; caption: string };

export type Role = {
  company: string;
  place?: string;
  title: string;
  when: string;
  url?: string;
  // Exactly one role (or none) is current. It drives the hero's "now" line, the split window,
  // and the (HEAD -> now) marker in the experience log.
  // When a job ends: remove `current`, finish `when` (e.g. "2026-05..2026-12"), and give the
  // next role `current: true` and its own `visual` if it has one.
  // Static copies to update by hand: the description, og:description and JSON-LD worksFor in
  // index.html, and public/og.png.
  current?: boolean;
  visual?: Visual;
  bullets: { text: string; metric?: string }[]; // {metric} marks the highlighted number
};

export const experience: Role[] = [
  {
    company: "Inverted AI",
    place: "Vancouver",
    title: "research intern",
    when: "2026..now",
    url: "https://inverted.ai",
    current: true,
    visual: {
      kind: "sim",
      file: "sim.lua",
      caption: "Inverted AI builds simulated drivers for testing self-driving cars. This is a tiny one, running live.",
    },
    bullets: [
      { text: "Systems work on the test vehicle: NVIDIA Jetson Thor compute, Leopard Imaging cameras, and the end-to-end pipeline between them." },
    ],
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

export const currentRole = experience.find((r) => r.current);

// Shown in the split when there is no current role, or the current role has no visual of its own.
export const fallbackVisual: Visual = {
  kind: "diagram",
  project: "fastSQL-qe",
  caption: "Between jobs, so here's how my favourite project is put together.",
};
