import styles from "./HelpBuffer.module.css";
import { useStore } from "@/store";

export function HelpBuffer() {
  const setBuffer = useStore((s) => s.setBuffer);

  return (
    <div className={styles.file}>
      <p className={styles.header}>
        <span className={styles.tag}>*portfolio.txt*</span>
        {"    Mohammed Ansari — Portfolio Help    "}
        <span className={styles.tag}>*portfolio*</span>
      </p>

      <Gap />
      <Section title="INTRODUCTION" tag="*portfolio-intro*" />
      <Gap />
      <Body text="  This portfolio runs in your browser but thinks it's Neovim." />
      <Body text="  Navigation works exactly like the real thing. Mostly." />
      <Gap />
      <Rule />

      <Section title="NAVIGATION" tag="*portfolio-navigation*" />
      <Gap />
      <KV k=":about" v="open about buffer" />
      <KV k=":projects" v="open project explorer" />
      <KV k=":stack" v="open stack config" />
      <KV k=":experience" v="open experience log" />
      <KV k=":contact" v="open contact script" />
      <KV k=":terminal" v="open terminal buffer" />
      <KV k=":diagnostics" v="open session diagnostics" />
      <KV k=":q" v="you know what this does" />
      <Gap />
      <Rule />

      <Section title="KEYBINDS" tag="*portfolio-keybinds*" />
      <Gap />
      <KV k="j / k" v="navigate buffers in sidebar" />
      <KV k="Tab / Shift-Tab" v="cycle through open buffers" />
      <KV k="\" v="toggle file explorer" />
      <KV k=":" v="open command palette" />
      <KV k="Esc" v="close / go back" />
      <KV k="/ (projects)" v="open telescope search" />
      <Gap />
      <Rule />

      <Section title="EASTER EGGS" tag="*portfolio-eggs*" />
      <Gap />
      <Body text="  There are a few. You'll know them when you find them." />
      <Body text="  Hint: try :q!, :vsp, and :theme gruvbox-light" />
      <Gap />
      <Rule />

      <Section title="SEE ALSO" tag="*portfolio-seealso*" />
      <Gap />
      <div className={styles.body}>
        {"  "}
        <span className={styles.ref} onClick={() => setBuffer("about")}>
          |about.md|
        </span>
        {"  "}
        <span className={styles.ref} onClick={() => setBuffer("projects")}>
          |projects/|
        </span>
        {"  "}
        <span className={styles.ref} onClick={() => setBuffer("contact")}>
          |contact.sh|
        </span>
      </div>
      <Gap />
      <p className={styles.footer}>vim:ft=help:ts=8:sw=8:et</p>
    </div>
  );
}

const Gap = () => <div style={{ height: "0.75em" }} />;
const Rule = () => <p className={styles.rule}>{"=".repeat(70)}</p>;
const Body = ({ text }: { text: string }) => (
  <p className={styles.body}>{text}</p>
);

function Section({ title, tag }: { title: string; tag: string }) {
  return (
    <div className={styles.sectionLine}>
      <span className={styles.sectionTitle}>{title}</span>
      <span className={styles.tag}>{tag}</span>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className={styles.kv}>
      <span className={styles.kvKey}>{k}</span>
      <span className={styles.kvVal}>{v}</span>
    </div>
  );
}
