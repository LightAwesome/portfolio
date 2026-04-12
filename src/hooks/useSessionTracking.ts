import { useEffect } from "react";
import { useStore } from "@/store";

export function useSessionTracking() {
  const activeBuffer = useStore((s) => s.activeBuffer);
  const recordVisit = useStore((s) => s.recordVisit);
  const setNavMethod = useStore((s) => s.setNavMethod);

  useEffect(() => {
    recordVisit(activeBuffer);
  }, [activeBuffer, recordVisit]);

  useEffect(() => {
    const onKey = () => setNavMethod("keyboard");
    const onMouse = () => setNavMethod("mouse");

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onMouse);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onMouse);
    };
  }, [setNavMethod]);
}
