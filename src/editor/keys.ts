import { helpStore, type Buffer } from "./buffer";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

export const PICK_EVENT = "picker:select";
const isField = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);

export function resumeMessage(buf: Buffer) {
  buf.say(`resume.pdf is being updated. Email ${profile.email} for a copy.`);
}

// Search highlights use the CSS Custom Highlight API, so React-owned text nodes are never touched.
function searchRanges(main: HTMLElement, q: string) {
  const ranges: Range[] = [];
  const ql = q.toLowerCase();
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      (n.parentElement?.closest(".nr, textarea, [hidden], [aria-hidden='true']") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  while (walker.nextNode()) {
    const n = walker.currentNode as Text;
    const t = n.data.toLowerCase();
    for (let i = t.indexOf(ql); i >= 0; i = t.indexOf(ql, i + ql.length)) {
      const r = document.createRange();
      r.setStart(n, i);
      r.setEnd(n, i + q.length);
      ranges.push(r);
    }
  }
  return ranges;
}

export function attachKeys(main: HTMLElement, buf: Buffer) {
  const hl = typeof CSS !== "undefined" && "highlights" in CSS ? CSS.highlights : null;
  let hits: Range[] = [];
  let hi = -1;
  let lastQ = "";

  const clearSearch = () => { hl?.delete("search"); hl?.delete("search-cur"); hits = []; hi = -1; };

  function step(d: number) {
    if (!hits.length) return;
    hi = (hi + d + hits.length) % hits.length;
    const r = hits[hi];
    hl?.set("search-cur", new Highlight(r));
    const row = r.startContainer.parentElement?.closest(".r");
    if (row) buf.goTo(row);
    else r.startContainer.parentElement?.scrollIntoView({ block: "center", behavior: "instant" });
    buf.say(`/${lastQ}  [${hi + 1}/${hits.length}]`);
  }

  function search(q: string) {
    clearSearch();
    if (!q) return;
    lastQ = q;
    const ql = q.toLowerCase();
    // A match inside another project's details: bring that project into the preview first.
    const p = projects.findIndex((x) => [x.name, x.summary, x.note, x.stack, x.metric].join(" ").toLowerCase().includes(ql));
    if (p >= 0) window.dispatchEvent(new CustomEvent(PICK_EVENT, { detail: p }));
    requestAnimationFrame(() => {
      hits = searchRanges(main, q);
      if (!hits.length) { buf.say(`Pattern not found: ${q}`, true); return; }
      hl?.set("search", new Highlight(...hits));
      step(1);
    });
  }

  const jump = (id: string) => buf.goTo(document.getElementById(id));
  const commands: Record<string, () => void> = {
    projects: () => jump("projects"),
    experience: () => jump("experience"),
    stack: () => jump("stack"),
    contact: () => jump("contact"),
    help: () => { helpStore.set(true); requestAnimationFrame(() => jump("help")); },
    resume: () => (profile.resume ? location.assign(profile.resume) : resumeMessage(buf)),
    noh: () => { clearSearch(); buf.say(""); },
    "set rnu": () => buf.setRelative(true),
    "set nornu": () => buf.setRelative(false),
    q: () => {
      if (helpStore.get()) { helpStore.set(false); buf.say(""); }
      else buf.say("This buffer stays open. Try :contact instead.");
    },
    wq: () => (document.getElementById("mailform") as HTMLFormElement | null)?.requestSubmit(),
  };

  function openCmd(prefix: ":" | "/") {
    const line = document.getElementById("msgline");
    const hint = document.getElementById("hint");
    if (!line) return;
    buf.setMode("COMMAND");
    if (hint) hint.hidden = true;
    const lab = document.createElement("label");
    lab.textContent = prefix;
    lab.htmlFor = "cmdin";
    const inp = document.createElement("input");
    inp.id = "cmdin";
    inp.autocomplete = "off";
    inp.spellcheck = false;
    inp.setAttribute("aria-label", prefix === ":" ? "Command" : "Search");
    line.replaceChildren(lab, inp);
    inp.focus();
    const done = () => { buf.setMode("NORMAL"); if (hint) hint.hidden = false; };
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.preventDefault(); buf.say(""); done(); }
      if (e.key !== "Enter") return;
      e.preventDefault();
      const v = inp.value.trim();
      done();
      buf.say("");
      if (prefix === "/") { search(v); return; }
      const c = v.replace(/^:/, "").replace(/!$/, "");
      if (!c) return;
      if (/^\d+$/.test(c)) { buf.goRow(Number(c) - 1); return; }
      (commands[c] ?? (() => buf.say(`Not an editor command: ${c}  (try :help)`, true)))();
    });
    inp.addEventListener("blur", () => {
      if (document.getElementById("mode")?.dataset.m === "COMMAND") { buf.say(""); done(); }
    });
  }

  let pending = "";
  let timer = 0;
  const heads = () =>
    [...main.querySelectorAll("section:not([hidden]) h2")]
      .map((h) => buf.rows.indexOf(h.closest(".r") as HTMLElement))
      .filter((i) => i >= 0);

  const map: Record<string, () => void> = {
    j: () => buf.goRow(buf.cur + 1),
    k: () => buf.goRow(buf.cur - 1),
    G: () => buf.goRow(buf.rows.length - 1),
    gg: () => buf.goRow(0),
    "]]": () => { const n = heads().find((i) => i > buf.cur); if (n !== undefined) buf.goRow(n); },
    "[[": () => { const p = heads().reverse().find((i) => i < buf.cur); buf.goRow(p ?? 0); },
    n: () => step(1),
    N: () => step(-1),
    ":": () => openCmd(":"),
    "/": () => openCmd("/"),
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (helpStore.get()) helpStore.set(false);
      clearSearch();
      buf.say("");
      return;
    }
    if (isField(e.target) || e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
    const seq = pending + e.key;
    clearTimeout(timer);
    pending = "";
    const fn = map[seq];
    if (fn) { e.preventDefault(); buf.speakVim(); fn(); return; }
    if (["g", "]", "["].includes(e.key)) { pending = e.key; timer = window.setTimeout(() => (pending = ""), 700); }
  };

  document.addEventListener("keydown", onKey);
  return () => { document.removeEventListener("keydown", onKey); clearSearch(); clearTimeout(timer); };
}
