import { useEffect } from "react";
import { useStore } from "@/store";
import styles from "./IntroScreen.module.css";

const ASCII_LOGO = `
███╗   ███╗ █████╗
████╗ ████║██╔══██╗
██╔████╔██║███████║
██║╚██╔╝██║██╔══██║
██║ ╚═╝ ██║██║  ██║
╚═╝     ╚═╝╚═╝  ╚═╝
`;

export function IntroScreen() {
  const { introSeen, setIntroSeen, setBuffer } = useStore();

  // Skip on any keypress or click
  useEffect(() => {
    const skip = () => setIntroSeen();
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("click", skip, { once: true });

    // Auto-advance after 4s if idle
    const timer = setTimeout(setIntroSeen, 100000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, []);

  if (introSeen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.center}>
        <pre className={styles.ascii}>{ASCII_LOGO}</pre>

        <div className={styles.name}>Mohammed Touseef Ansari</div>
        <div className={styles.title}>cs @ ubc · software developer</div>
        <div className={styles.menu}>
          <button
            onClick={() => {
              setBuffer("about");
              setIntroSeen();
            }}
            className={styles.item}
          >
            <span className={styles.bracket}>[</span>
            <span className={styles.key}>about.md</span>
            <span className={styles.bracket}>]</span>
            <span className={styles.desc}>who I am</span>
          </button>
          <button
            onClick={() => {
              setBuffer("projects");
              setIntroSeen();
            }}
            className={styles.item}
          >
            <span className={styles.bracket}>[</span>
            <span className={styles.key}>projects/</span>
            <span className={styles.bracket}>]</span>
            <span className={styles.desc}>what I've built</span>
          </button>
          <button
            onClick={() => {
              setBuffer("contact");
              setIntroSeen();
            }}
            className={styles.item}
          >
            <span className={styles.bracket}>[</span>
            <span className={styles.key}>contact.sh</span>
            <span className={styles.bracket}>]</span>
            <span className={styles.desc}>get in touch</span>
          </button>
        </div>

        <div className={styles.footer}>
          <span>
            type <span className={styles.cmd}>:help</span> for keybinds
          </span>
          <span className={styles.dot}>·</span>
          <span>
            type <span className={styles.cmd}>:q</span> if you hate this
          </span>
        </div>

        <div className={styles.version}>Neovim-inspired v1.0.0</div>
        <div className={styles.hint}>press any key to continue</div>
      </div>
    </div>
  );
}
