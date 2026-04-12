import { useRef, useEffect, useState } from "react";
import styles from "./TildeLines.module.css";

interface Props {
  contentRef: React.RefObject<HTMLDivElement>;
}

export function TildeLines({ contentRef }: Props) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculate = () => {
      if (!contentRef.current || !containerRef.current) return;
      const containerH = containerRef.current.parentElement!.clientHeight;
      const contentH = contentRef.current.scrollHeight;
      const remaining = containerH - contentH;
      const lineH = 27; // matches --lh-prose at 15px
      setCount(Math.max(0, Math.floor(remaining / lineH)));
    };

    calculate();
    const ro = new ResizeObserver(calculate);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [contentRef]);

  if (count === 0) return null;

  return (
    <div ref={containerRef} className={styles.tildes}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.line}>
          <span className={styles.linenum}>&nbsp;</span>
          <span className={styles.tilde}>~</span>
        </div>
      ))}
    </div>
  );
}
