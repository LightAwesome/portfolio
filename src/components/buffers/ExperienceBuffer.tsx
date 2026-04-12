import { experience } from "@/data/experience";
import styles from "./ExperienceBuffer.module.css";
import { useRef } from "react";
import { TildeLines } from "@/components/shell/TildeLines";
import { useModified } from "@/hooks/useModified";
import { useStore } from "@/store";

export function ExperienceBuffer() {
  useModified("experience");
  const setHoveredLine = useStore((s) => s.setHoveredLine);
  const hoverProps = (n: number) => ({
    onMouseEnter: () => setHoveredLine(`experience:${n}`),
    onMouseLeave: () => setHoveredLine(null),
  });

  const contentRef = useRef<HTMLDivElement>(null);
  let lineNumber = 1;

  return (
    <div className={styles.wrapper}>
      <div ref={contentRef} className={styles.file}>
        {experience.map((job) => {
          const headerLine = lineNumber++;
          const bulletLines = job.bullets.map(() => lineNumber++);

          return (
            <div key={job.id} className={styles.entry}>
              <div className={styles.header} {...hoverProps(headerLine)}>
                <span className={styles.date}>
                  [{job.start} → {job.end}]
                </span>{" "}
                <span className={styles.company}>{job.company}</span>{" "}
                <span className={styles.role}>— {job.role}</span>
              </div>

              {job.bullets.map((bullet, index) => (
                <div
                  key={index}
                  className={styles.bullet}
                  {...hoverProps(bulletLines[index])}
                >
                  {bullet}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <TildeLines contentRef={contentRef} />
    </div>
  );
}
