import type { Project } from "@/data/projects";
import styles from "./ProjectDetail.module.css";

export function ProjectDetail({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  return (
    <div className={styles.file}>
      <button onClick={onBack} className={styles.back}>
        ← projects/
      </button>

      <h1 className={styles.title}># {project.name}</h1>
      <p className={styles.description}>{project.description}</p>

      <div className={styles.sectionTitle}>## Stack</div>
      <div className={styles.tags}>
        {project.stack.map((item) => (
          <span key={item} className={styles.tag}>
            {item}
          </span>
        ))}
      </div>

      <div className={styles.sectionTitle}>## Links</div>
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          :!open --live
        </a>
      )}
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          :!open --repo
        </a>
      )}
    </div>
  );
}
