import { Shell } from "@/components/Shell";
import { Bufferline } from "@/components/shell/Bufferline";
import { Sidebar } from "@/components/shell/Sidebar";
import { Statusline } from "@/components/shell/Statusline";
import { BufferRenderer } from "@/components/shell/BufferRenderer";
import { CommandPalette } from "@/components/overlays/CommandPalette";
import { IntroScreen } from "@/components/overlays/IntroScreen";
import { EasterEggOverlay } from "@/components/overlays/EasterEggOverlay";
import { useSessionTracking } from "@/hooks/useSessionTracking";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { useStore } from "@/store";

export default function App() {
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const quitActive = useStore((s) => s.quitActive);

  useSessionTracking();
  useKeyboardNav();

  return (
    <>
      <IntroScreen />
      <EasterEggOverlay />

      {quitActive && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font)",
            color: "var(--fg4)",
            fontSize: "var(--text-sm)",
            animation: "fadeInOut 2.2s ease",
          }}
        >
          Goodbye. Come back soon.
        </div>
      )}

      <Shell>
        <Bufferline />

        <div
          className="shell__workspace"
          data-sidebar={sidebarOpen ? "open" : "closed"}
        >
          <Sidebar />
          <main className="shell__buffer">
            <BufferRenderer />
          </main>
        </div>

        <CommandPalette />
        <Statusline />
      </Shell>
    </>
  );
}
