import { create } from "zustand";

export type BufferID =
  | "about"
  | "projects"
  | "stack"
  | "experience"
  | "contact"
  | "help"
  | "diagnostics"
  | "terminal";

interface Store {
  activeBuffer: BufferID;
  sidebarOpen: boolean;
  activeProjectId: string | null;
  paletteOpen: boolean;

  setBuffer: (id: BufferID) => void;
  setSidebar: (open: boolean) => void;
  toggleSidebar: () => void;
  setProject: (id: string | null) => void;
  setPalette: (open: boolean) => void;

  introSeen: boolean;
  setIntroSeen: () => void;

  // F4 — modified indicator
  modifiedBuffers: Set<BufferID>;
  markModified: (id: BufferID) => void;
  clearModified: (id: BufferID) => void;

  // F5 — git blame
  hoveredLineKey: string | null; // "buffer:linenum"
  setHoveredLine: (key: string | null) => void;

  // F6 — easter egg overlay
  eggMessage: string | null;
  setEggMessage: (msg: string | null) => void;
  quitActive: boolean;
  triggerQuit: () => void;

  // F8 — session tracking (for diagnostics buffer)
  sessionStart: number; // Date.now() at mount
  visitedBuffers: BufferID[];
  recordVisit: (id: BufferID) => void;
  navMethod: "mouse" | "keyboard";
  setNavMethod: (m: "mouse" | "keyboard") => void;
}

export const useStore = create<Store>((set) => ({
  activeBuffer: "about",
  sidebarOpen: true,
  activeProjectId: null,
  paletteOpen: false,

  setBuffer: (activeBuffer) => set({ activeBuffer, activeProjectId: null }),
  setSidebar: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setProject: (activeProjectId) => set({ activeProjectId }),
  setPalette: (paletteOpen) => set({ paletteOpen }),
  introSeen: false,
  setIntroSeen: () => set({ introSeen: true }),

  modifiedBuffers: new Set(),
  markModified: (id) =>
    set((s) => ({
      modifiedBuffers: new Set([...s.modifiedBuffers, id]),
    })),
  clearModified: (id) =>
    set((s) => {
      const next = new Set(s.modifiedBuffers);
      next.delete(id);
      return { modifiedBuffers: next };
    }),

  hoveredLineKey: null,
  setHoveredLine: (hoveredLineKey) => set({ hoveredLineKey }),

  eggMessage: null,
  setEggMessage: (eggMessage) => set({ eggMessage }),
  quitActive: false,
  triggerQuit: () => {
    set({ quitActive: true });
    setTimeout(() => set({ quitActive: false }), 2200);
  },
  sessionStart: Date.now(),
  visitedBuffers: ["about"],
  recordVisit: (id) =>
    set((s) => ({
      visitedBuffers: s.visitedBuffers.includes(id)
        ? s.visitedBuffers
        : [...s.visitedBuffers, id],
    })),
  navMethod: "mouse",
  setNavMethod: (navMethod) => set({ navMethod }),
}));

export const BUFFER_NAMES: Record<BufferID, string> = {
  about: "about.md",
  projects: "projects/",
  stack: "stack.toml",
  experience: "experience.log",
  contact: "contact.sh",
  help: "help.txt", // ← new
  diagnostics: "diagnostics.lua", // ← new
  terminal: "[terminal]", // ← new
};

// Buffers that appear in the sidebar nav (not the secret ones)
export const NAV_BUFFERS: BufferID[] = [
  "about",
  "projects",
  "stack",
  "experience",
  "contact",
];

// All buffer order for Tab cycling — includes hidden ones if open
export const BUFFER_ORDER: BufferID[] = [
  "about",
  "projects",
  "stack",
  "experience",
  "contact",
  "help",
  "diagnostics",
  "terminal",
];
