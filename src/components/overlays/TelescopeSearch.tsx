import { useState, useMemo, useEffect } from "react";
import { projects } from "@/data/projects";
import { useStore } from "@/store";
import styles from "./TelescopeSearch.module.css";

interface Props {
  onClose: () => void;
}

export function TelescopeSearch({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const setProject = useStore((s) => s.setProject);

  const filtered = useMemo(() => {
    if (!query) return projects;
    const q = query.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    setSelected(0);
  }, [filtered]);

  const open = (id: string) => {
    setProject(id);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    }
    if (e.key === "Enter" && filtered[selected]) open(filtered[selected].id);
    if (e.key === "Escape") onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.titleBar}>
          {"╭─ Find Project "}
          {"─".repeat(28)}
          {"╮"}
        </div>
        <div className={styles.inputRow}>
          <span className={styles.border}>│</span>
          <span className={styles.prompt}> &gt; </span>
          <input
            className={styles.input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="type to filter..."
            spellCheck={false}
          />
          <span className={styles.border}>│</span>
        </div>
        <div className={styles.divider}>
          {"╰"}
          {"─".repeat(44)}
          {"╯"}
        </div>

        <div className={styles.results}>
          {filtered.length === 0 && (
            <div className={styles.empty}>No results for "{query}"</div>
          )}
          {filtered.map((p, i) => (
            <div
              key={p.id}
              className={`${styles.result} ${i === selected ? styles.active : ""}`}
              onClick={() => open(p.id)}
              onMouseEnter={() => setSelected(i)}
            >
              <span className={styles.name}>{p.name}/</span>
              <span className={styles.stack}>{p.stack.join(" · ")}</span>
              <span className={styles.year}>{p.year}</span>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <span className={styles.hint}>↑↓ navigate</span>
          <span className={styles.hint}>Enter open</span>
          <span className={styles.hint}>Esc close</span>
        </div>
      </div>
    </div>
  );
}
