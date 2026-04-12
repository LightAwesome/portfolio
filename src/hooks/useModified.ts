import { useEffect } from "react";
import { useStore, type BufferID } from "@/store";

export function useModified(bufferId: BufferID) {
  const markModified = useStore((s) => s.markModified);
  const modifiedBuffers = useStore((s) => s.modifiedBuffers);

  useEffect(() => {
    if (modifiedBuffers.has(bufferId)) return;
    const timer = setTimeout(() => markModified(bufferId), 20_000);
    return () => clearTimeout(timer);
  }, [bufferId]);
}
