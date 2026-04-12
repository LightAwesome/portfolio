import { useEffect } from "react";
import { useStore, BUFFER_ORDER } from "@/store";

function isTyping(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  // Block nav when focused on any input-like element
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    (el as HTMLElement).isContentEditable
  );
}

export function useKeyboardNav() {
  const store = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Always allow Escape — even from inputs
      if (e.key === "Escape") {
        if (store.paletteOpen) {
          store.setPalette(false);
          return;
        }
        if (store.activeProjectId) {
          store.setProject(null);
          return;
        }
        return;
      }

      // Stop here if user is typing in any input
      if (isTyping()) return;

      // Command palette
      if (e.key === ":") {
        e.preventDefault();
        store.setPalette(true);
        return;
      }

      // Sidebar toggle
      if (e.key === "\\") {
        store.toggleSidebar();
        return;
      }

      // Help buffer
      if (e.key === "?") {
        store.setBuffer("help");
        return;
      }

      // Buffer navigation — j/k
      const idx = BUFFER_ORDER.indexOf(store.activeBuffer);
      if (e.key === "j" && idx < BUFFER_ORDER.length - 1) {
        store.setBuffer(BUFFER_ORDER[idx + 1]);
        return;
      }
      if (e.key === "k" && idx > 0) {
        store.setBuffer(BUFFER_ORDER[idx - 1]);
        return;
      }

      // Tab cycling
      if (e.key === "Tab") {
        e.preventDefault();
        const next = e.shiftKey
          ? BUFFER_ORDER[(idx - 1 + BUFFER_ORDER.length) % BUFFER_ORDER.length]
          : BUFFER_ORDER[(idx + 1) % BUFFER_ORDER.length];
        store.setBuffer(next);
        return;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store.paletteOpen, store.activeBuffer, store.activeProjectId]);
}
