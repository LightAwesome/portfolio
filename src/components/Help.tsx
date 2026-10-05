import { useSyncExternalStore } from "react";
import { helpStore } from "@/editor/buffer";
import Line, { Heading } from "./Line";

const KEYS: [string, string][] = [
  ["j  k", "move down / up a line"],
  ["gg G", "top / bottom"],
  ["]] [[", "next / previous section"],
  ["/  n  N", "search / next / previous match"],
  [":{n}", "go to line n"],
  [":projects :experience :stack :contact", "jump to a section"],
  [":resume :noh :set nornu", "resume, clear search, plain numbers"],
];

export default function Help() {
  const open = useSyncExternalStore(helpStore.subscribe, helpStore.get);
  return (
    <section id="help" data-sec="help" hidden={!open} aria-labelledby="h-help">
      <Heading id="help">help</Heading>
      {KEYS.map(([k, d]) => (
        <Line key={k}>
          <span className="help"><span className="hk">{k.padEnd(10)}</span> {d}</span>
        </Line>
      ))}
      <Line><span className="c">-- in the project finder: j/k or arrows to move, type to filter, Enter to open</span></Line>
      <Line><span className="c">-- close with :q or Esc</span></Line>
      <Line />
    </section>
  );
}
