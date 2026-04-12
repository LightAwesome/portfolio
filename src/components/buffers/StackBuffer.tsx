import { stack } from "@/data/stack";
import styles from "./StackBuffer.module.css";
import { useRef } from "react";
import { TildeLines } from "@/components/shell/TildeLines";
import { useModified } from "@/hooks/useModified";
import { useStore } from "@/store";

// Helpers — keep the JSX clean
function Arr({ values }: { values: string[] }) {
  return (
    <span className={styles.string}>
      [{values.map((v) => `"${v}"`).join(", ")}]
    </span>
  );
}
function Str({ value }: { value: string }) {
  return <span className={styles.string}>"{value}"</span>;
}

let lineCounter = 0;
const nextLine = () => ++lineCounter;

export function StackBuffer() {
  useModified("stack");
  lineCounter = 0; // reset on each render

  const setHoveredLine = useStore((s) => s.setHoveredLine);
  const hoverProps = (n: number) => ({
    onMouseEnter: () => setHoveredLine(`stack:${n}`),
    onMouseLeave: () => setHoveredLine(null),
  });
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.wrapper}>
      <div ref={contentRef} className={styles.file}>
        {/* comment */}
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.comment}>
            # auto-generated from ~/.config/stack.toml
          </span>
        </div>
        <div className={styles.spacer} />

        {/* [languages] */}
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.section}>[languages]</span>
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>primary </span>
          <span className={styles.eq}> = </span>
          <Arr values={stack.languages.primary} />
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>learning</span>
          <span className={styles.eq}> = </span>
          <Arr values={stack.languages.learning} />
        </div>
        <div className={styles.spacer} />

        {/* [frontend] */}
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.section}>[frontend]</span>
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>frameworks</span>
          <span className={styles.eq}> = </span>
          <Arr values={stack.frontend.frameworks} />
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>styling </span>
          <span className={styles.eq}> = </span>
          <Arr values={stack.frontend.styling} />
        </div>
        <div className={styles.spacer} />

        {/* [backend] */}
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.section}>[backend]</span>
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>frameworks</span>
          <span className={styles.eq}> = </span>
          <Arr values={stack.backend.frameworks} />
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>databases </span>
          <span className={styles.eq}> = </span>
          <Arr values={stack.backend.databases} />
        </div>
        <div className={styles.spacer} />

        {/* [ml] */}
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.section}>[ml]</span>
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>libraries</span>
          <span className={styles.eq}> = </span>
          <Arr values={stack.ml.libraries} />
        </div>
        <div className={styles.spacer} />

        {/* [infrastructure] */}
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.section}>[infrastructure]</span>
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>containers</span>
          <span className={styles.eq}> = </span>
          <Arr values={stack.infrastructure.containers} />
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>cloud </span>
          <span className={styles.eq}> = </span>
          <Arr values={stack.infrastructure.cloud} />
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>ci_cd </span>
          <span className={styles.eq}> = </span>
          <Arr values={stack.infrastructure.ci_cd} />
        </div>
        <div className={styles.spacer} />

        {/* [tools] */}
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.section}>[tools]</span>
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>editor </span>
          <span className={styles.eq}> = </span>
          <Str value={stack.tools.editor} />
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>shell </span>
          <span className={styles.eq}> = </span>
          <Str value={stack.tools.shell} />
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>terminal</span>
          <span className={styles.eq}> = </span>
          <Str value={stack.tools.terminal} />
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>wm </span>
          <span className={styles.eq}> = </span>
          <Str value={stack.tools.wm} />
        </div>
        <div className={styles.line} {...hoverProps(nextLine())}>
          <span className={styles.key}>theme </span>
          <span className={styles.eq}> = </span>
          <Str value={stack.tools.theme} />
        </div>
      </div>
      <TildeLines contentRef={contentRef} />
    </div>
  );
}
