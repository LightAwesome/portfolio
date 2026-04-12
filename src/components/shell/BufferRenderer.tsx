import { useStore } from "@/store";
import { AboutBuffer } from "@/components/buffers/AboutBuffer";
import { ProjectsBuffer } from "@/components/buffers/ProjectsBuffer";
import { StackBuffer } from "@/components/buffers/StackBuffer";
import { ExperienceBuffer } from "@/components/buffers/ExperienceBuffer";
import { ContactBuffer } from "@/components/buffers/ContactBuffer";
import { HelpBuffer } from "@/components/buffers/HelpBuffer";
import { DiagnosticsBuffer } from "../buffers/DiagnosticsBuffer";
import { TerminalBuffer } from "../buffers/TerminalBuffer";

export function BufferRenderer() {
  const activeBuffer = useStore((s) => s.activeBuffer);

  switch (activeBuffer) {
    case "about":
      return (
        <div className="buffer-content">
          <AboutBuffer />
        </div>
      );
    case "projects":
      return (
        <div className="buffer-content">
          <ProjectsBuffer />
        </div>
      );
    case "stack":
      return (
        <div className="buffer-content">
          <StackBuffer />
        </div>
      );
    case "experience":
      return (
        <div className="buffer-content">
          <ExperienceBuffer />
        </div>
      );
    case "contact":
      return (
        <div className="buffer-content">
          <ContactBuffer />
        </div>
      );
    case "help":
      return (
        <div className="buffer-content">
          <HelpBuffer />
        </div>
      );
    case "diagnostics":
      return (
        <div className="buffer-content">
          <DiagnosticsBuffer />
        </div>
      );
    case "terminal":
      return (
        <div className="buffer-content">
          <TerminalBuffer />
        </div>
      );
    default:
      return null;
  }
}
