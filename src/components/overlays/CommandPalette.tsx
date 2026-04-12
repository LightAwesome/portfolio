import { Command } from "cmdk";
import { useStore, BUFFER_NAMES } from "@/store";
import styles from "./CommandPalette.module.css";

export function CommandPalette() {
  const store = useStore();
  const paletteOpen = useStore((s) => s.paletteOpen);
  const setPalette = useStore((s) => s.setPalette);

  if (!paletteOpen) return null;

  const run = (action: () => void) => {
    action();
    setPalette(false);
  };

  return (
    <div className={styles.backdrop} onClick={() => setPalette(false)}>
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        <Command>
          <Command.Input
            className={styles.input}
            placeholder=": command"
            autoFocus
          />
          <Command.List>
            {/* ── Navigation ── */}
            <Command.Item
              className={styles.item}
              onSelect={() => run(() => store.setBuffer("about"))}
            >
              {BUFFER_NAMES.about}
            </Command.Item>
            <Command.Item
              className={styles.item}
              onSelect={() => run(() => store.setBuffer("projects"))}
            >
              {BUFFER_NAMES.projects}
            </Command.Item>
            <Command.Item
              className={styles.item}
              onSelect={() => run(() => store.setBuffer("stack"))}
            >
              {BUFFER_NAMES.stack}
            </Command.Item>
            <Command.Item
              className={styles.item}
              onSelect={() => run(() => store.setBuffer("experience"))}
            >
              {BUFFER_NAMES.experience}
            </Command.Item>
            <Command.Item
              className={styles.item}
              onSelect={() => run(() => store.setBuffer("contact"))}
            >
              {BUFFER_NAMES.contact}
            </Command.Item>

            {/* ── Hidden buffers ── */}
            <Command.Item
              className={styles.item}
              onSelect={() => run(() => store.setBuffer("help"))}
            >
              help
            </Command.Item>
            <Command.Item
              className={styles.item}
              onSelect={() => run(() => store.setBuffer("diagnostics"))}
            >
              diagnostics
            </Command.Item>
            <Command.Item
              className={styles.item}
              onSelect={() => run(() => store.setBuffer("terminal"))}
            >
              terminal
            </Command.Item>

            {/* ── Utility ── */}
            <Command.Item
              className={styles.item}
              onSelect={() => run(() => store.toggleSidebar())}
            >
              toggle sidebar
            </Command.Item>
            <Command.Item
              className={styles.item}
              onSelect={() => run(() => window.open("/resume.pdf"))}
            >
              open resume.pdf
            </Command.Item>

            {/* ── Easter eggs ── */}
            <Command.Item
              className={styles.item}
              onSelect={() =>
                run(() =>
                  store.setEggMessage(
                    "E37: No write since last change (add ! to override)",
                  ),
                )
              }
            >
              q
            </Command.Item>

            <Command.Item
              className={styles.item}
              onSelect={() => run(() => store.triggerQuit())}
            >
              q!
            </Command.Item>

            <Command.Item
              className={styles.item}
              onSelect={() =>
                run(() => {
                  store.clearModified(store.activeBuffer);
                  store.setEggMessage(
                    `"${BUFFER_NAMES[store.activeBuffer]}" written — just kidding, nothing was saved`,
                  );
                })
              }
            >
              wq
            </Command.Item>

            <Command.Item
              className={styles.item}
              onSelect={() =>
                run(() => {
                  store.clearModified(store.activeBuffer);
                  store.setEggMessage(
                    "Nothing to write. You're just visiting.",
                  );
                })
              }
            >
              w
            </Command.Item>

            <Command.Item
              className={styles.item}
              onSelect={() =>
                run(() =>
                  store.setEggMessage(
                    "E36: Not enough room — only one buffer in this universe",
                  ),
                )
              }
            >
              vsp
            </Command.Item>

            <Command.Item
              className={styles.item}
              onSelect={() =>
                run(() => {
                  document.documentElement.classList.add("gruvbox-light");
                  setTimeout(
                    () =>
                      document.documentElement.classList.remove(
                        "gruvbox-light",
                      ),
                    3000,
                  );
                })
              }
            >
              theme gruvbox-light
            </Command.Item>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
