import { useState, useEffect } from "react";
import styles from "../buffers/Neofetch.module.css";

const PAGE_LOAD = Date.now();

function useUptime() {
  const [uptime, setUptime] = useState("");
  useEffect(() => {
    const update = () => {
      const s = Math.floor((Date.now() - PAGE_LOAD) / 1000);
      setUptime(s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return uptime;
}

const ASCII_ART = `
  ███╗   ███╗ █████╗ 
  ████╗ ████║██╔══██╗
  ██╔████╔██║███████║
  ██║╚██╔╝██║██╔══██║
  ██║ ╚═╝ ██║██║  ██║
  ╚═╝     ╚═╝╚═╝  ╚═╝`;

const COLORS = [
  "bg3",
  "red",
  "green",
  "yellow",
  "blue",
  "purple",
  "aqua",
  "fg3",
];
const COLORS2 = [
  "bg1",
  "red",
  "green",
  "yellow",
  "blue",
  "purple",
  "aqua",
  "fg",
];

export function NeofetchOutput() {
  const uptime = useUptime();

  const info: [string, string][] = [
    ["", "mohammed@portfolio"],
    ["", "─".repeat(20)],
    ["OS", "macOS Sequoia 15.0 arm64"],
    ["WM", "yabai + skhd"],
    ["Shell", "zsh 5.9 + tmux 3.4"],
    ["Editor", "Neovim (btw)"],
    ["Theme", "Gruvbox Medium Dark"],
    ["Font", "JetBrains Mono"],
    ["Uni", "UBC — CS, May 2027"],
    ["Uptime", uptime],
    ["Site", "this one"],
  ];

  return (
    <div className={styles.neofetch}>
      <div className={styles.columns}>
        <pre className={styles.ascii}>{ASCII_ART}</pre>
        <div className={styles.info}>
          {info.map(([key, val], i) => (
            <div key={i} className={styles.row}>
              {key ? (
                <>
                  <span className={styles.key}>{key}:</span>
                  <span className={styles.val}>{val}</span>
                </>
              ) : (
                <span className={styles.special}>{val}</span>
              )}
            </div>
          ))}
          <div className={styles.colorRow}>
            {COLORS.map((c) => (
              <span
                key={c}
                className={styles.block}
                style={{ background: `var(--${c})` }}
              />
            ))}
          </div>
          <div className={styles.colorRow}>
            {COLORS2.map((c) => (
              <span
                key={c}
                className={styles.block}
                style={{ background: `var(--${c})` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
