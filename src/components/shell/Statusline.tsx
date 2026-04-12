import { useMemo } from "react";
import { useStore, BUFFER_NAMES } from "@/store";
import { useClock } from "@/hooks/useClock";
import { getBlame } from "@/data/blame";
import styles from "./Statusline.module.css";

export function Statusline() {
  const activeBuffer = useStore((s) => s.activeBuffer);
  const paletteOpen = useStore((s) => s.paletteOpen);
  const hoveredLineKey = useStore((s) => s.hoveredLineKey);
  const time = useClock();

  const mode = paletteOpen ? "COMMAND" : "NORMAL";

  const blame = useMemo(() => {
    if (!hoveredLineKey) return null;
    const [buf, line] = hoveredLineKey.split(":");
    return getBlame(buf, parseInt(line));
  }, [hoveredLineKey]);

  return (
    <div className={styles.statusline} data-mode={mode.toLowerCase()}>
      <span className={styles.mode}>{mode}</span>
      <span className={styles.filename}>{BUFFER_NAMES[activeBuffer]}</span>
      <span className={styles.spacer} />
      {blame && (
        <span className={styles.blame}>
          <span className={styles.blameAuthor}>mohammed</span>
          <span className={styles.blameTime}> {blame[2]} </span>
          <span className={styles.blameMsg}>"{blame[3]}"</span>
        </span>
      )}
      <span className={styles.hint}>[?] keys</span>
      <span className={styles.time}>{time}</span>
    </div>
  );
}
