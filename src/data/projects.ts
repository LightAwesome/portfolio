export interface Project {
  id: string;
  name: string;
  year: number;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
}

export const projects: Project[] = [
  {
    id: "sql-engine",
    name: "vectorized-sql-engine",
    year: 2026,
    description:
      "A vectorized SQL query engine executing SELECT, WHERE, GROUP BY, ORDER BY, and LIMIT over 10M-row datasets. Includes a Pratt parser, logical planner, and rule-based optimizer.",
    stack: ["Python", "NumPy", "Systems Design", "Query Optimization"],
    github: "https://github.com/LightAwesome/vectorized-sql-engine", // update if different
  },
  {
    id: "rootstock",
    name: "rootstock",
    year: 2026,
    description:
      "Multi-channel RAG platform ingesting Gmail, Slack, and Google Drive into a unified ChromaDB vector store. Includes dual-persona retrieval, a D3.js knowledge graph, and PII redaction. Placed 3rd (solo) at youCode @ UBC.",
    stack: ["Python", "LangChain", "ChromaDB", "OpenAI", "Streamlit", "D3.js"],
    github: "https://github.com/LightAwesome/rootstock", // update if different
    live: "https://lightawesometdm-rootstock.hf.space", // add your HF URL
  },
];
