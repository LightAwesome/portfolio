export type NodeKind = "io" | "svc" | "store" | "key";
export type DiagramNode = { id: string; label: string; sub?: string; col: number; row: number; kind?: NodeKind };
export type DiagramEdge = { from: string; to: string; label?: string; dashed?: boolean };
export type Diagram = { nodes: DiagramNode[]; edges: DiagramEdge[]; swatch?: string[] };

export type Project = {
  name: string;
  lang: string;
  year: number;
  metric: string;
  summary: string;
  note: string;
  stack: string;
  repo?: string;
  demo?: string;
  diagram: Diagram;
};

export const projects: Project[] = [
  {
    name: "portcullis",
    lang: "go",
    year: 2026,
    metric: "<1ms overhead",
    summary: "API gateway with per-route rate limiting and circuit breaking.",
    note: "limits are atomic: one Redis Lua script per request",
    stack: "Go, Redis, PostgreSQL, Prometheus",
    repo: "https://github.com/LightAwesome/portcullis",
    diagram: {
      nodes: [
        { id: "c", label: "client", col: 0, row: 0, kind: "io" },
        { id: "g", label: "gateway", sub: "routes", col: 1, row: 0, kind: "svc" },
        { id: "l", label: "limiter", sub: "sliding window", col: 2, row: 0, kind: "key" },
        { id: "u", label: "upstream", col: 3, row: 0, kind: "io" },
        { id: "r", label: "redis", sub: "lua script", col: 2, row: 1, kind: "store" },
        { id: "p", label: "prometheus", col: 1, row: 1, kind: "store" },
      ],
      edges: [
        { from: "c", to: "g" },
        { from: "g", to: "l" },
        { from: "l", to: "u", label: "ok" },
        { from: "l", to: "r", label: "EVALSHA" },
        { from: "g", to: "p", dashed: true, label: "metrics" },
      ],
    },
  },
  {
    name: "fastSQL-qe",
    lang: "py",
    year: 2026,
    metric: "12.7x top-N",
    summary: "Vectorized SQL engine for 10M-row tables.",
    note: "Limit(Sort) becomes TopN via numpy.argpartition",
    stack: "Python, NumPy",
    repo: "https://github.com/LightAwesome/fastSQL-qe",
    diagram: {
      nodes: [
        { id: "q", label: "SQL", col: 0, row: 0, kind: "io" },
        { id: "p", label: "parser", sub: "Pratt", col: 1, row: 0, kind: "svc" },
        { id: "o", label: "optimizer", sub: "Sort+Limit → TopN", col: 2, row: 0, kind: "key" },
        { id: "e", label: "executor", sub: "vectorized", col: 3, row: 0, kind: "svc" },
        { id: "d", label: "columns", sub: "10M rows", col: 3, row: 1, kind: "store" },
      ],
      edges: [
        { from: "q", to: "p" },
        { from: "p", to: "o", label: "plan" },
        { from: "o", to: "e" },
        { from: "e", to: "d" },
      ],
    },
  },
  {
    name: "rootstock",
    lang: "py",
    year: 2026,
    metric: "3rd at youCode",
    summary: "RAG across 23+ sources with a D3 knowledge graph.",
    note: "personal data is redacted with spaCy NER before indexing",
    stack: "LangChain, D3.js, Scrapy, spaCy",
    demo: "https://lightawesometdm-rootstock.hf.space",
    diagram: {
      nodes: [
        { id: "s", label: "sources", sub: "23+", col: 0, row: 0, kind: "io" },
        { id: "c", label: "scrapers", col: 1, row: 0, kind: "svc" },
        { id: "n", label: "redact", sub: "spaCy NER", col: 2, row: 0, kind: "key" },
        { id: "v", label: "vectors", col: 3, row: 0, kind: "store" },
        { id: "r", label: "RAG", sub: "LangChain", col: 3, row: 1, kind: "svc" },
        { id: "g", label: "graph", sub: "D3", col: 2, row: 1, kind: "io" },
      ],
      edges: [
        { from: "s", to: "c" },
        { from: "c", to: "n" },
        { from: "n", to: "v" },
        { from: "v", to: "r" },
        { from: "r", to: "g" },
      ],
    },
  },
  {
    name: "institutional-shadow",
    lang: "py",
    year: 2026,
    metric: "SAP hackathon",
    summary: "Turns a nonprofit's documents into answers staff can ask for.",
    note: "storage swaps between ChromaDB and SAP HANA Cloud",
    stack: "Python, Streamlit, ChromaDB",
    repo: "https://github.com/LightAwesome/institutional-shadow",
    diagram: {
      nodes: [
        { id: "d", label: "documents", col: 0, row: 0, kind: "io" },
        { id: "i", label: "ingest", sub: "chunk + embed", col: 1, row: 0, kind: "svc" },
        { id: "s", label: "store", sub: "Chroma / HANA", col: 2, row: 0, kind: "key" },
        { id: "a", label: "chat", sub: "Streamlit", col: 2, row: 1, kind: "io" },
        { id: "u", label: "staff", col: 1, row: 1, kind: "io" },
      ],
      edges: [
        { from: "d", to: "i" },
        { from: "i", to: "s" },
        { from: "s", to: "a", label: "retrieve" },
        { from: "u", to: "a", label: "ask" },
      ],
    },
  },
  {
    name: "gruvboxify",
    lang: "c++",
    year: 2026,
    metric: "wallpapers",
    summary: "Generates Gruvbox wallpapers for my desktop.",
    note: "this page uses the same palette",
    stack: "C++",
    repo: "https://github.com/LightAwesome/gruvboxify",
    diagram: {
      nodes: [
        { id: "p", label: "palette", sub: "gruvbox", col: 0, row: 0, kind: "io" },
        { id: "g", label: "generator", col: 1, row: 0, kind: "key" },
        { id: "w", label: "wallpaper", col: 2, row: 0, kind: "io" },
      ],
      edges: [
        { from: "p", to: "g" },
        { from: "g", to: "w" },
      ],
      swatch: ["#282828", "#cc241d", "#98971a", "#d79921", "#458588", "#b16286", "#689d6a", "#a89984"],
    },
  },
];
