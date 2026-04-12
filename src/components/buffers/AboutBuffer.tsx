import styles from "./AboutBuffer.module.css";
import { useRef } from "react";
import { TildeLines } from "@/components/shell/TildeLines";
import { useModified } from "@/hooks/useModified";
import { useStore } from "@/store";

const lines = [
  {
    n: 1,
    content: (
      <>
        <span className="md-h1"># Mohammed Touseef Ansari</span>
      </>
    ),
  },
  { n: 2, content: null },
  { n: 3, content: <>CS @ UBC · graduating May 2027</> },
  { n: 4, content: null },
  {
    n: 5,
    content: (
      <>
        <span className="md-h2">## Currently</span>
      </>
    ),
  },
  { n: 6, content: null },
  {
    n: 7,
    content: (
      <>
        <span className="md-li">-</span> Looking for Summer 2026 internships
      </>
    ),
  },
  {
    n: 8,
    content: (
      <>
        <span className="md-li">-</span> Building this portfolio
      </>
    ),
  },
  { n: 9, content: null },
  {
    n: 10,
    content: (
      <>
        <span className="md-h2">## Setup</span>
      </>
    ),
  },
  { n: 11, content: null },
  { n: 12, content: <>Neovim · yabai · tmux · Alacritty · Gruvbox · macOS</> },
  { n: 13, content: null },
  {
    n: 14,
    content: (
      <>
        <span className="md-h2">## Elsewhere</span>
      </>
    ),
  },
  { n: 15, content: null },
  {
    n: 16,
    content: (
      <>
        <a href="https://github.com/LightAwesome" target="_blank">
          GitHub
        </a>
        {" · "}
        <a
          href="https://linkedin.com/in/mohammed-touseef-ansari"
          target="_blank"
        >
          LinkedIn
        </a>
        {" · "}
        <a href="mailto:welcometouseef@gmail.com">welcometouseef@gmail.com</a>
      </>
    ),
  },
];

export function AboutBuffer() {
  useModified("about");
  const setHoveredLine = useStore((s) => s.setHoveredLine);
  const hoverProps = (n: number) => ({
    onMouseEnter: () => setHoveredLine(`about:${n}`),
    onMouseLeave: () => setHoveredLine(null),
  });

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.wrapper}>
      <div ref={contentRef} className={styles.file}>
        {lines.map(({ n, content }) => (
          <div key={n} className={styles.line} {...hoverProps(n)}>
            <span className={styles.linenum}>{n}</span>
            <span className={styles.content}>{content ?? "\u00A0"}</span>
          </div>
        ))}
        <div className={styles.line} {...hoverProps(lines.length + 1)}>
          <span className={styles.linenum}>{lines.length + 1}</span>
          <span className={`${styles.content} ${styles.cursor}`}> </span>
        </div>
      </div>
      <TildeLines contentRef={contentRef} />
    </div>
  );
}
