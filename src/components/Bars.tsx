import { profile } from "@/data/profile";

const SECTIONS = ["projects", "experience", "stack", "contact"];

export function Tabline() {
  return (
    <header className="tabline" aria-label="Sections">
      <span className="file">touseef.md</span>
      {SECTIONS.map((s) => (
        <a key={s} href={`#${s}`} data-sec={s}>{s}</a>
      ))}
    </header>
  );
}

export function Statusline() {
  return (
    <footer className="bottom">
      <div className="status">
        <span className="mode" id="mode" data-m="NORMAL">NORMAL</span>
        <span className="where" id="where">touseef.md</span>
        <span className="fill">{profile.status}</span>
        <span className="pos" id="pos">1:1</span>
        <span className="pct" id="pct">Top</span>
      </div>
      <div className="cmd">
        <span id="msgline" role="status" aria-live="polite" />
        <span className="hint" id="hint">:help for keys</span>
      </div>
    </footer>
  );
}
