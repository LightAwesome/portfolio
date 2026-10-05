import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { projects, type Project } from "@/data/projects";
import { PICK_EVENT } from "@/editor/keys";
import Diagram from "./Diagram";

function Preview({ p }: { p: Project }) {
  return (
    <>
      <div className="dg">
        <Diagram spec={p.diagram} title={p.name} />
      </div>
      <p className="pv-sum">{p.summary}</p>
      <p className="pv-note c">-- {p.note}</p>
      <p className="pv-meta">
        <span className="lbl">built with</span> {p.stack}
      </p>
      <p className="pv-links">
        {p.repo && <a href={p.repo}>source</a>}
        {p.demo && <a href={p.demo}>live demo</a>}
      </p>
    </>
  );
}

// Telescope-style picker: results on the left, preview on the right.
// On narrow screens the preview opens inline under the selected result.
export default function ProjectPicker() {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => !q || [p.name, p.lang, p.summary, p.stack].join(" ").toLowerCase().includes(q));
  }, [query]);
  const active = results[Math.min(sel, results.length - 1)];

  useEffect(() => {
    const onPick = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      flushSync(() => { setQuery(""); setSel(i); });
    };
    window.addEventListener(PICK_EVENT, onPick);
    return () => window.removeEventListener(PICK_EVENT, onPick);
  }, []);

  const move = (d: number) => setSel((s) => Math.max(0, Math.min(results.length - 1, s + d)));

  const onListKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === "j" || k === "ArrowDown") move(1);
    else if (k === "k" || k === "ArrowUp") move(-1);
    else if (k === "Home" || k === "g") setSel(0);
    else if (k === "End" || k === "G") setSel(results.length - 1);
    else if (k === "Enter" && active) {
      const href = active.repo ?? active.demo;
      if (href) location.assign(href);
    } else return;
    e.preventDefault();
  };

  const onPromptKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || (e.ctrlKey && e.key === "n")) { move(1); e.preventDefault(); }
    if (e.key === "ArrowUp" || (e.ctrlKey && e.key === "p")) { move(-1); e.preventDefault(); }
    if (e.key === "Escape") { setQuery(""); (e.target as HTMLInputElement).blur(); }
  };

  return (
    <div className="scope">
      <div className="scope-left">
        <div className="scope-prompt">
          <span className="scope-title">Find Projects</span>
          <label htmlFor="pick" className="sr">Filter projects</label>
          <span className="scope-caret" aria-hidden="true">&gt;</span>
          <input
            id="pick"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSel(0); }}
            onKeyDown={onPromptKey}
            placeholder="type to filter"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="scope-count" aria-hidden="true">{results.length}/{projects.length}</span>
        </div>
        <ul
          ref={listRef}
          className="scope-list"
          role="listbox"
          tabIndex={0}
          aria-label="Projects"
          aria-activedescendant={active ? `pick-${active.name}` : undefined}
          onKeyDown={onListKey}
        >
          {results.map((p, i) => {
            const on = p === active;
            return (
              <li key={p.name} id={`pick-${p.name}`} role="option" aria-selected={on} className={on ? "on" : undefined}>
                <button type="button" tabIndex={-1} className="scope-row" onClick={() => { setSel(i); listRef.current?.focus({ preventScroll: true }); }}>
                  <span className="sr-caret" aria-hidden="true">{on ? ">" : " "}</span>
                  <span className="sr-name">{p.name}</span>
                  <span className="sr-lang">{p.lang}</span>
                  <span className="sr-metric">{p.metric}</span>
                  <span className="sr-year">{p.year}</span>
                </button>
                {on && (
                  <div className="scope-inline">
                    <Preview p={p} />
                  </div>
                )}
              </li>
            );
          })}
          {!results.length && <li className="scope-empty">No project matches "{query}". Press Esc to clear.</li>}
        </ul>
      </div>
      <div className="scope-preview" aria-live="polite">
        <span className="scope-title">Preview</span>
        {active && <Preview p={active} />}
      </div>
    </div>
  );
}
