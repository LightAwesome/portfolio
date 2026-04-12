import { useStore, BUFFER_NAMES, BUFFER_ORDER } from "@/store";
import styles from "./Bufferline.module.css";

export function Bufferline() {
  const activeBuffer = useStore((s) => s.activeBuffer);
  const setBuffer = useStore((s) => s.setBuffer);
  const modifiedBuffers = useStore((s) => s.modifiedBuffers);

  return (
    <div className={styles.bufferline}>
      {BUFFER_ORDER.map((id) => {
        const isActive = activeBuffer === id;

        return (
          <button
            key={id}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
            onClick={() => setBuffer(id)}
          >
            <span className={styles.label}>{BUFFER_NAMES[id]}</span>

            {modifiedBuffers.has(id) && (
              <span className={styles.modified} title="unsaved changes">
                ●
              </span>
            )}

            {isActive && <span>✕</span>}
          </button>
        );
      })}
    </div>
  );
}
