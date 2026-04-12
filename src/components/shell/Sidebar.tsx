import { useStore, BUFFER_NAMES, NAV_BUFFERS } from "@/store";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const activeBuffer = useStore((s) => s.activeBuffer);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const setBuffer = useStore((s) => s.setBuffer);

  return (
    <nav className={`${styles.sidebar} shell__sidebar`} data-open={sidebarOpen}>
      <div className={styles.title}>EXPLORER</div>
      <ul className={styles.tree}>
        {NAV_BUFFERS.map((id) => (
          <li key={id}>
            <button
              className={`${styles.item} ${activeBuffer === id ? styles.active : ""}`}
              onClick={() => setBuffer(id)}
            >
              <span className={styles.prefix}>
                {activeBuffer === id ? "▶" : " "}
              </span>
              {BUFFER_NAMES[id]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
