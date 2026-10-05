import { useEffect, useState, type RefObject } from "react";
import { createBuffer, type Buffer } from "./buffer";
import { attachKeys } from "./keys";

// Starts the buffer + keybinds on <main>, plays the first-visit draw, prints vim's open message.
export function useEditor(mainRef: RefObject<HTMLElement | null>) {
  const [buf, setBuf] = useState<Buffer | null>(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const b = createBuffer(main);
    const detach = attachKeys(main, b);
    setBuf(b);

    const openMsg = () => {
      const line = document.getElementById("msgline");
      const s = document.createElement("span");
      s.setAttribute("aria-hidden", "true");
      s.textContent = `"touseef.md" ${b.lineCount()}L`;
      line?.replaceChildren(s);
    };

    // First visit only: the file paints top to bottom like vim drawing a buffer.
    let seen = true;
    try { seen = sessionStorage.getItem("drawn") === "1"; sessionStorage.setItem("drawn", "1"); } catch { /* storage blocked */ }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    if (!seen && !reduce) {
      main.querySelectorAll<HTMLElement>(".r").forEach((r, i) => r.style.setProperty("--i", String(Math.min(i, 60))));
      main.classList.add("drawing");
      timer = window.setTimeout(() => { main.classList.remove("drawing"); openMsg(); }, 650);
    } else openMsg();

    // Web fonts change line heights after the browser's own anchor jump; redo it once they're in.
    document.fonts?.ready.then(() => {
      const t = location.hash && document.getElementById(location.hash.slice(1));
      if (t) t.scrollIntoView({ behavior: "instant" });
      b.refresh();
    });

    return () => { clearTimeout(timer); detach(); b.destroy(); };
  }, [mainRef]);

  return buf;
}
