import { useState, useEffect } from "react";
import { useStore, BUFFER_NAMES, NAV_BUFFERS } from "@/store";
import styles from "./DiagnosticsBuffer.module.css";

function useUptime(start: number) {
  const [uptime, setUptime] = useState("");
  useEffect(() => {
    const update = () => {
      const s = Math.floor((Date.now() - start) / 1000);
      if (s < 60) {
        setUptime(`${s}s`);
        return;
      }
      const m = Math.floor(s / 60),
        rs = s % 60;
      setUptime(`${m}m ${rs}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [start]);
  return uptime;
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Unknown";
}

export function DiagnosticsBuffer() {
  const { sessionStart, visitedBuffers, activeBuffer, navMethod } = useStore();
  const uptime = useUptime(sessionStart);
  const unvisited = NAV_BUFFERS.filter((b) => !visitedBuffers.includes(b));
  const mouseUser = navMethod === "mouse";

  return (
    <div className={styles.file}>
      <div className={styles.header}>
        LSP Diagnostics — portfolio.lua
        <span className={styles.clean}>{"  [0 errors  0 warnings]"}</span>
      </div>

      <div className={styles.blank} />

      <div className={styles.sectionTitle}>HINTS</div>
      <Row icon="✦" text={`You've been here for ${uptime}`} />
      <Row
        icon="✦"
        text={`${visitedBuffers.length} buffer${visitedBuffers.length !== 1 ? "s" : ""} visited: ${visitedBuffers.map((b) => BUFFER_NAMES[b]).join(", ")}`}
      />
      {mouseUser && (
        <Row
          icon="✦"
          text="Preferred navigation: mouse (try keyboard — it's faster)"
          dim
        />
      )}

      <div className={styles.blank} />

      <div className={styles.sectionTitle}>INFO</div>
      <InfoRow label="Current buffer" value={BUFFER_NAMES[activeBuffer]} />
      <InfoRow label="Browser" value={getBrowser()} />
      <InfoRow label="Local time" value={new Date().toLocaleTimeString()} />

      {unvisited.length > 0 && (
        <>
          <div className={styles.blank} />
          <div className={styles.sectionTitle}>SUGGESTIONS</div>
          {unvisited.map((b) => (
            <Suggestion
              key={b}
              text={`You haven't visited ${BUFFER_NAMES[b]} yet`}
            />
          ))}
          <Suggestion text="Press : to open the command palette" />
          {mouseUser && (
            <Suggestion text="Press e to toggle the file explorer" />
          )}
        </>
      )}
    </div>
  );
}

function Row({
  icon,
  text,
  dim,
}: {
  icon: string;
  text: string;
  dim?: boolean;
}) {
  return (
    <div className={`${styles.row} ${dim ? styles.dim : ""}`}>
      <span className={styles.icon}>{icon}</span>
      {text}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.icon}>ℹ</span>
      <span className={styles.label}>{label}:</span>
      {value}
    </div>
  );
}

function Suggestion({ text }: { text: string }) {
  return (
    <div className={styles.suggestion}>
      <span className={styles.arrow}>→</span>
      {text}
    </div>
  );
}
