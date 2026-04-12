import { projects } from "@/data/projects";
import { useStore } from "@/store";
import { ProjectDetail } from "./ProjectDetail";
import styles from "./ProjectsBuffer.module.css";
import { useModified } from "@/hooks/useModified";
import { useRef, useState, useEffect } from "react";
import { TildeLines } from "@/components/shell/TildeLines";
import { TelescopeSearch } from "@/components/overlays/TelescopeSearch";

export function ProjectsBuffer() {
  // ALL hooks at the top — no exceptions
  useModified("projects");
  const setHoveredLine = useStore((s) => s.setHoveredLine);
  const activeProjectId = useStore((s) => s.activeProjectId);
  const setProject = useStore((s) => s.setProject);
  const contentRef = useRef<HTMLDivElement>(null);
  const [telescopeOpen, setTelescopeOpen] = useState(false);

  const hoverProps = (n: number) => ({
    onMouseEnter: () => setHoveredLine(`projects:${n}`),
    onMouseLeave: () => setHoveredLine(null),
  });

  // Hook must live here — before any early return
  useEffect(() => {
    if (activeProjectId) return; // don't listen when in detail view
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !telescopeOpen) {
        e.preventDefault();
        setTelescopeOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [telescopeOpen, activeProjectId]);

  // Early return is fine now — all hooks are already called above
  if (activeProjectId) {
    const project = projects.find((p) => p.id === activeProjectId);
    if (!project) return null;
    return <ProjectDetail project={project} onBack={() => setProject(null)} />;
  }

  return (
    <>
      {telescopeOpen && (
        <TelescopeSearch onClose={() => setTelescopeOpen(false)} />
      )}

      <div className={styles.wrapper}>
        <div ref={contentRef} className={styles.file}>
          <div className={styles.dir} {...hoverProps(1)}>
            projects/
          </div>

          {projects.map((project, index) => (
            <button
              key={project.id}
              className={styles.row}
              onClick={() => setProject(project.id)}
              {...hoverProps(index + 2)}
            >
              <span className={styles.name}>{project.name}/</span>
              <span className={styles.year}>{project.year}</span>
              <span className={styles.stack}>{project.stack.join(" · ")}</span>
            </button>
          ))}
        </div>
        <TildeLines contentRef={contentRef} />
      </div>
    </>
  );
}
