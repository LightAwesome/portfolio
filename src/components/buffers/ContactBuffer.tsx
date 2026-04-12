import styles from "./ContactBuffer.module.css";
import { useRef } from "react";
import { TildeLines } from "@/components/shell/TildeLines";
import { useModified } from "@/hooks/useModified";
import { useStore } from "@/store";

const EMAIL = "welcometouseef@gmail.com";
const GITHUB = "https://github.com/LightAwesome";
const LINKEDIN = "https://linkedin.com/in/mohammed-touseef-ansari";

export function ContactBuffer() {
  useModified("contact");
  const setHoveredLine = useStore((s) => s.setHoveredLine);
  const hoverProps = (n: number) => ({
    onMouseEnter: () => setHoveredLine(`contact:${n}`),
    onMouseLeave: () => setHoveredLine(null),
  });
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.wrapper}>
      <div ref={contentRef} className={styles.file}>
        <div className={styles.line} {...hoverProps(1)}>
          <span className={styles.shebang}>#!/bin/bash</span>
        </div>
        <div className={styles.line} {...hoverProps(2)}>
          <span className={styles.comment}>
            # open to new work — let's talk
          </span>
        </div>
        <div className={styles.line} {...hoverProps(3)}></div>
        <div className={styles.line} {...hoverProps(4)}>
          <span className={styles.var}>EMAIL</span>=
          <span className={styles.string}>"{EMAIL}"</span>
        </div>
        <div className={styles.line} {...hoverProps(5)}></div>
        <div className={styles.line} {...hoverProps(6)}>
          <span className={styles.fn}>send_email</span>
          <span className={styles.paren}>()</span>
          <span className={styles.brace}>{" {"}</span>
        </div>
        <div className={styles.line} {...hoverProps(7)}>
          <span className={styles.indent}>{"  "}</span>
          <a href={`mailto:${EMAIL}`} className={styles.link}>
            xdg-open "mailto:$EMAIL"
          </a>
        </div>
        <div className={styles.line} {...hoverProps(8)}>
          <span className={styles.brace}>{"}"}</span>
        </div>
        <div className={styles.line} {...hoverProps(9)}></div>
        <div className={styles.line} {...hoverProps(10)}>
          <span className={styles.fn}>open_github</span>
          <span className={styles.paren}>()</span>
          <span className={styles.brace}>{" {"}</span>
        </div>
        <div className={styles.line} {...hoverProps(11)}>
          <span className={styles.indent}>{"  "}</span>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            xdg-open "{GITHUB}"
          </a>
        </div>
        <div className={styles.line} {...hoverProps(12)}>
          <span className={styles.brace}>{"}"}</span>
        </div>
        <div className={styles.line} {...hoverProps(13)}></div>
        <div className={styles.line} {...hoverProps(14)}>
          <span className={styles.fn}>open_linkedin</span>
          <span className={styles.paren}>()</span>
          <span className={styles.brace}>{" {"}</span>
        </div>
        <div className={styles.line} {...hoverProps(15)}>
          <span className={styles.indent}>{"  "}</span>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            xdg-open "{LINKEDIN}"
          </a>
        </div>
        <div className={styles.line} {...hoverProps(16)}>
          <span className={styles.brace}>{"}"}</span>
        </div>
        <div className={styles.line} {...hoverProps(17)}></div>
        <div className={styles.line} {...hoverProps(18)}>
          <span className={styles.comment}># run one:</span>
        </div>
        <div className={styles.line} {...hoverProps(19)}>
          <a href={`mailto:${EMAIL}`} className={styles.link}>
            <span className={styles.fn}>send_email</span>
          </a>
        </div>
        <div className={styles.line} {...hoverProps(20)}>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            <span className={styles.fn}>open_github</span>
          </a>
        </div>
        <div className={styles.line} {...hoverProps(21)}>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            <span className={styles.fn}>open_linkedin</span>
          </a>
        </div>
      </div>
      <TildeLines contentRef={contentRef} />
    </div>
  );
}
