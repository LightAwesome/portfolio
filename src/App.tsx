import { useEffect, useRef, useState, type ReactNode } from "react";

// ---------- Typewriter for hero tagline ----------
type Seg = { text: string; cls?: string; speed: number };

function HeroTagline({ onDone }: { onDone: () => void }) {
  const line1: Seg[] = [
    { text: "Backend engineer focused on ", speed: 26 },
    { text: "systems that scale", cls: "hl", speed: 52 },
    { text: ".", speed: 26 },
  ];
  const line2: Seg[] = [
    { text: "Building data pipelines, API gateways, and query engines at UBC.", speed: 26 },
  ];

  const [out1, setOut1] = useState<{ text: string; cls?: string }[]>([]);
  const [out2, setOut2] = useState<{ text: string; cls?: string }[]>([]);
  const [showLine2, setShowLine2] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const typeSeq = async (
      segs: Seg[],
      setOut: (v: { text: string; cls?: string }[]) => void
    ) => {
      const acc: { text: string; cls?: string }[] = [];
      for (const seg of segs) {
        acc.push({ text: "", cls: seg.cls });
        for (let i = 0; i < seg.text.length; i++) {
          if (cancelled) return;
          acc[acc.length - 1] = { text: seg.text.slice(0, i + 1), cls: seg.cls };
          setOut([...acc]);
          await new Promise((r) => setTimeout(r, seg.speed));
        }
      }
    };

    (async () => {
      await typeSeq(line1, setOut1);
      if (cancelled) return;
      await new Promise((r) => setTimeout(r, 300));
      if (cancelled) return;
      setShowLine2(true);
      await typeSeq(line2, setOut2);
      if (cancelled) return;
      onDone();
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <p className="tagline">
      {out1.map((s, i) => (
        <span key={`a${i}`} className={s.cls}>{s.text}</span>
      ))}
      {showLine2 && <br />}
      {out2.map((s, i) => (
        <span key={`b${i}`} className={s.cls}>{s.text}</span>
      ))}
    </p>
  );
}

// ---------- Section with typing label + fade content ----------
function Section({ label, children }: { label: string; children: ReactNode }) {
  const [typed, setTyped] = useState("");
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            let i = 0;
            const tick = () => {
              i++;
              setTyped(label.slice(0, i));
              if (i < label.length) {
                setTimeout(tick, 40);
              } else {
                setVisible(true);
              }
            };
            tick();
            obs.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [label]);

  return (
    <section ref={ref} className="section">
      <div className="section-label">{typed}</div>
      <div className={`section-content${visible ? " visible" : ""}`}>{children}</div>
    </section>
  );
}

// ---------- Project card ----------
type Project = {
  name: string;
  desc: string;
  metric: string;
  tags: string[];
  diff: string;
  featured?: boolean;
};

const PROJECTS: Project[] = [
  {
    name: "Portcullis",
    desc: "API gateway & reverse proxy with per-route rate limiting and circuit breaking.",
    metric: "sub-1ms middleware overhead",
    tags: ["Go", "Redis", "PostgreSQL", "Prometheus", "Docker"],
    diff: "atomic sliding-window rate limiting via Redis Lua",
    featured: true,
  },
  {
    name: "SQL Query Engine",
    desc: "Vectorized engine for 10M-row datasets with Pratt parser and rule-based optimizer.",
    metric: "12.7× Top-N latency reduction",
    tags: ["Python", "NumPy"],
    diff: "Limit(Sort) → TopN rewrite via argpartition",
  },
  {
    name: "Rootstock",
    desc: "Multi-channel RAG platform with D3.js knowledge graph. 3rd place @ youCode.",
    metric: "23+ doc cross-source retrieval",
    tags: ["LangChain", "D3.js", "Scrapy"],
    diff: "spaCy NER PII redaction + multilingual retrieval",
  },
  {
    name: "Markaba pipeline",
    desc: "Async scraping pipeline ingesting 32K+ automotive listings across 7 marketplaces.",
    metric: "15s → <1s dashboard latency",
    tags: ["Scrapy", "FastAPI", "Docker"],
    diff: "proxy rotation + JWT extraction + fault-tolerant retry",
  },
];

function ProjectCard({ p }: { p: Project }) {
  return (
    <div className={`project-card${p.featured ? " featured" : ""}`}>
      <div className="pc-head">
        <div className="pc-name">{p.name}</div>
        <a href="#" className="pc-link">↗</a>
      </div>
      <div className="pc-desc">{p.desc}</div>
      <div className="pc-metric">↑ {p.metric}</div>
      <div className="pc-tags">
        {p.tags.map((t) => (
          <span key={t} className="pc-tag" data-tag={t}>{t}</span>
        ))}
      </div>
      <div className="pc-diff">+ {p.diff}</div>
    </div>
  );
}

// ---------- Contact ----------
function Contact() {
  const [value, setValue] = useState("");
  const [out, setOut] = useState<{ text: string; ok: boolean } | null>(null);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const v = value.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      if (isEmail) {
        setOut({ text: `✓ got it — will reach out to ${v} shortly.`, ok: true });
      } else {
        setOut({
          text: "> message noted. email welcometouseef@gmail.com to follow up.",
          ok: false,
        });
      }
      setValue("");
    }
  };

  return (
    <div className="contact-box">
      <div className="contact-head">
        connect — type an email or message and hit <span className="kbd"> + ↵ enter</span>
      </div>
      <div className="contact-input-row">
        <span className="contact-prompt">~&gt;</span>
        <input
          className="contact-input"
          placeholder="your message or email address"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
        />
      </div>
      {out && (
        <div className={`contact-output ${out.ok ? "ok" : "err"}`}>{out.text}</div>
      )}
    </div>
  );
}

// ---------- Lua card ----------
function LuaCard() {
  const lines: ReactNode[] = [
    <><span className="lua-kw">local</span> <span className="lua-fn">engineer</span> = {"{"}</>,
    <>  <span className="lua-key">name</span> = <span className="lua-str">"Mohammed Touseef Ansari"</span>,</>,
    <>  <span className="lua-key">focus</span> = {"{"}</>,
    <>    <span className="lua-str">"Backend Systems"</span>,</>,
    <>    <span className="lua-str">"Automation"</span>,</>,
    <>    <span className="lua-str">"Full-Stack Products"</span>,</>,
    <>  {"}"},</>,
    <>  <span className="lua-key">strengths</span> = {"{"}</>,
    <>    <span className="lua-str">"performance"</span>, <span className="lua-str">"reliability"</span>,</>,
    <>    <span className="lua-str">"observability"</span>,</>,
    <>  {"}"},</>,
    <>{"}"}</>,
    <>&nbsp;</>,
    <><span className="lua-kw">return</span> <span className="lua-fn">engineer</span><span className="cursor-lua" /></>,
  ];
  return (
    <div className="lua-card">
      <div className="lua-top">
        <span className="ldot" /><span className="ldot" /><span className="ldot" />
        <span className="lua-fname">profile.lua</span>
      </div>
      <div className="lua-body">
        {lines.map((l, i) => (
          <div key={i} className="lua-line">
            <span className="lua-num">{i + 1}</span>
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function App() {
  const [ctaVisible, setCtaVisible] = useState(false);

  return (
    <div>
      <div className="browser-bar">
        <span className="bdot" style={{ background: "#cc241d" }} />
        <span className="bdot" style={{ background: "#d79921" }} />
        <span className="bdot" style={{ background: "#98971a" }} />
        <div className="url-bar">touseef.pages.dev</div>
      </div>

      <nav className="nav">
        <div className="logo">mta<span>();</span></div>
        <ul className="nav-links">
          <li><a href="#work">work</a></li>
          <li><a href="#experience">experience</a></li>
          <li><a href="#stack">stack</a></li>
          <li><a href="#contact">contact</a></li>
        </ul>
      </nav>

      <div className="page">
        <section className="hero">
          <div className="scanlines" />
          <div>
            <div className="status-pill">
              <span className="sdot" />
              available for internships &amp; roles
            </div>
            <div className="hero-prompt">
              ~ <span className="cursor-hero" />
            </div>
            <h1>
              Mohammed <span className="accent">Touseef</span> Ansari
            </h1>
            <HeroTagline onDone={() => setCtaVisible(true)} />
            <div className={`cta-row${ctaVisible ? " visible" : ""}`}>
              <a className="btn-primary" href="#">resume.pdf</a>
              <a className="btn-ghost" href="#contact">get in touch</a>
              <div className="socials">
                <a href="#">gh</a>
                <a href="#">li</a>
                <a href="#">mail</a>
              </div>
            </div>
          </div>
          <LuaCard />
        </section>

        <Section label="selected work">
          <div className="projects-grid" id="work">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.name} p={p} />
            ))}
          </div>
        </Section>

        <Section label="experience">
          <div className="exp-entry" id="experience">
            <div className="exp-left">
              <div className="exp-company">Markaba</div>
              <div className="exp-date">Jul – Oct 2025</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="exp-role">Software &amp; Automation Dev Intern</div>
              <ul className="exp-bullets">
                <li>95% crawl reliability across anti-bot marketplaces with proxy rotation, JWT extraction, and adaptive throttling.</li>
                <li>4× throughput on SIMAH credit report processing via async OCR microservice.</li>
                <li>Analytics dashboard latency from 15s → &lt;1s at p95 via batching, indexing, and caching.</li>
                <li>Shipped RBAC, audit logging, and transaction management across React, FastAPI, and Django.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section label="tools">
          <div id="stack">
            {[
              { cat: "languages", items: ["Go","Python","TypeScript","C","SQL","R"] },
              { cat: "backend", items: ["FastAPI","Django","Flask","React"] },
              { cat: "infra", items: ["PostgreSQL","Redis","Docker","AWS","Nginx","Azure"] },
              { cat: "observability", items: ["Prometheus","Grafana","GitHub Actions"] },
              { cat: "data / ai", items: ["LangChain","ChromaDB","NumPy","pandas","spaCy"] },
            ].map((r) => (
              <div key={r.cat} className="skill-row">
                <div className="skill-cat">{r.cat}</div>
                <div className="skill-pills">
                  {r.items.map((it) => (
                    <span key={it} className="skill-pill">{it}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section label="contact">
          <div id="contact"><Contact /></div>
        </Section>
      </div>

      <footer className="statusline">
        <div>&nbsp;NORMAL</div>
        <div>© 2026 Mohammed Touseef Ansari</div>
        <div>gruvbox · nvim · touseef.pages.dev&nbsp;</div>
      </footer>
    </div>
  );
}
