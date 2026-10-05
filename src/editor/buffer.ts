// The page behaves like a Neovim buffer: every `.r` element is one line of touseef.md.
// This module owns line numbers, the cursor line, the statusline and the cmdline.
// It works on the DOM directly (React renders the lines once and never re-renders them),
// so scrolling never triggers a React render.

export type Mode = "NORMAL" | "INSERT" | "COMMAND";

type Listener = () => void;
const listeners = new Set<Listener>();
let helpOpen = false;

// Tiny external store for the one piece of editor state React renders: the :help section.
export const helpStore = {
  get: () => helpOpen,
  set: (open: boolean) => { helpOpen = open; listeners.forEach((l) => l()); },
  subscribe: (l: Listener) => { listeners.add(l); return () => { listeners.delete(l); }; },
};

const READING_LINE = 0.35;

export function createBuffer(main: HTMLElement) {
  const $ = <T extends Element>(id: string) => document.getElementById(id) as T | null;
  let rows: HTMLElement[] = [];
  let lineNo = new Map<HTMLElement, number>();
  let cur = 0;
  let rnu = false; // `set number` until the visitor uses a vim key, then `set relativenumber`
  let lastY = -1;

  const allRows = () =>
    [...main.querySelectorAll<HTMLElement>(".r")].filter((r) => !r.classList.contains("tilde") && !r.closest("[hidden]"));

  function paint() {
    rows.forEach((r, i) => {
      const n = r.firstElementChild as HTMLElement | null;
      if (n) n.textContent = rnu && i !== cur ? String(Math.abs(i - cur)) : String(lineNo.get(r));
      r.classList.toggle("cur", i === cur);
    });
    const row = rows[cur];
    const name = (row?.closest("section") as HTMLElement | null)?.dataset.sec ?? "touseef";
    const where = $("where");
    if (where) where.textContent = name === "touseef" ? "touseef.md" : `touseef.md › ${name}`;
    document.querySelectorAll<HTMLAnchorElement>(".tabline a[data-sec]").forEach((a) =>
      a.setAttribute("aria-current", String(a.dataset.sec === name)),
    );
    const pos = $("pos");
    if (pos) pos.textContent = `${row ? lineNo.get(row) : 1}:1`;
    const pct = $("pct");
    if (pct) {
      const max = document.documentElement.scrollHeight - innerHeight;
      pct.textContent = scrollY < 4 ? "Top" : scrollY >= max - 4 ? "Bot" : `${Math.round((scrollY / max) * 100)}%`;
    }
  }

  function fromScroll() {
    const y = innerHeight * READING_LINE;
    let best = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].getBoundingClientRect().top <= y + 1) best = i;
      else break;
    }
    cur = scrollY < 4 ? 0 : best;
    paint();
  }

  function refresh() {
    const keep = rows[cur];
    const all = allRows();
    lineNo = new Map(all.map((r, i) => [r, i + 1]));
    rows = all;
    const i = keep ? rows.indexOf(keep) : -1;
    if (i >= 0) { cur = i; paint(); } else fromScroll();
  }

  function goRow(i: number) {
    if (!rows.length) return;
    cur = Math.max(0, Math.min(rows.length - 1, i));
    const top = rows[cur].getBoundingClientRect().top + scrollY - innerHeight * READING_LINE;
    scrollTo({ top: Math.max(0, top), behavior: "instant" });
    lastY = scrollY;
    paint();
  }

  function goTo(el: Element | null) {
    if (!el) return;
    refresh();
    const r = el.matches(".r") ? (el as HTMLElement) : el.querySelector<HTMLElement>(".r");
    const i = r ? rows.indexOf(r) : -1;
    if (i >= 0) goRow(i);
    else el.scrollIntoView({ block: "start", behavior: "instant" });
  }

  function say(text: string, err = false) {
    const line = $("msgline");
    if (!line) return;
    const s = document.createElement("span");
    if (err) s.className = "err";
    s.textContent = text;
    line.replaceChildren(s);
  }

  function setMode(m: Mode) {
    const el = $<HTMLElement>("mode");
    if (!el) return;
    el.textContent = m;
    el.dataset.m = m;
  }

  function speakVim() {
    if (rnu) return;
    rnu = true;
    say(":set relativenumber");
    paint();
  }

  function setRelative(on: boolean) { rnu = on; paint(); }

  // events
  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (Math.abs(scrollY - lastY) < 1) return; // screenshots and layout nudges fire no-op scrolls
      lastY = scrollY;
      fromScroll();
    });
  };
  const onClick = (e: MouseEvent) => {
    const i = rows.indexOf((e.target as Element).closest(".r") as HTMLElement);
    if (i >= 0) { cur = i; paint(); }
  };
  let moRaf = 0;
  const mo = new MutationObserver(() => {
    if (!moRaf) moRaf = requestAnimationFrame(() => { moRaf = 0; refresh(); });
  });

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", refresh);
  main.addEventListener("click", onClick);
  mo.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });

  refresh();

  const destroy = () => {
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", refresh);
    main.removeEventListener("click", onClick);
    mo.disconnect();
    cancelAnimationFrame(raf);
    cancelAnimationFrame(moRaf);
  };

  return {
    refresh, goRow, goTo, say, setMode, speakVim, setRelative, destroy,
    get cur() { return cur; },
    get rows() { return rows; },
    lineCount: () => allRows().length,
  };
}

export type Buffer = ReturnType<typeof createBuffer>;
