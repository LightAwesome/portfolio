import { useEffect } from "react";
import { useStore } from "@/store";
import styles from "./EasterEggOverlay.module.css";

export function EasterEggOverlay() {
  const eggMessage = useStore((s) => s.eggMessage);
  const setEggMessage = useStore((s) => s.setEggMessage);

  useEffect(() => {
    if (!eggMessage) return;
    const timer = setTimeout(() => setEggMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [eggMessage]);

  if (!eggMessage) return null;

  return <div className={styles.bar}>{eggMessage}</div>;
}
