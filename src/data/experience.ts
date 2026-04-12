export interface Job {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
}

export const experience: Job[] = [
  {
    id: "markaba",
    company: "Markaba",
    role: "Software & Automation Developer Intern",
    start: "2025-07",
    end: "2025-10",
    bullets: [
      "-> Built an end-to-end async data pipeline (Scrapy, FastAPI, PostgreSQL) ingesting 32,000+ automotive listings from 7 marketplaces.",
      "-> Achieved 95% crawl reliability across protected marketplaces via adaptive throttling, proxy rotation, and JWT token extraction.",
      "-> Reduced analytics dashboard latency from 15s to under 1s at p95 by redesigning query execution with batching, indexing, and caching.",
      "-> Built an async OCR microservice (FastAPI, Camelot) for SIMAH credit reports — 4× throughput improvement.",
      "-> Developed features across React, FastAPI, and Django codebases: RBAC, audit logging, and transaction management for lending workflows.",
      "-> Configured GitHub Actions CI/CD and deployed services via Docker on Microsoft Azure.",
    ],
  },
];
