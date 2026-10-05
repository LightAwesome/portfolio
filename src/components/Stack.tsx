import { stack } from "@/data/stack";
import Line, { Heading } from "./Line";

export default function Stack() {
  const w = Math.max(...stack.map(([k]) => k.length));
  return (
    <section id="stack" data-sec="stack" aria-labelledby="h-stack">
      <Heading id="stack">stack</Heading>
      <Line />
      <Line><code className="code"><span className="kw">return</span> {"{"}</code></Line>
      {stack.map(([k, items]) => (
        <Line key={k}>
          <code className="code">
            {"  "}<span className="k">{k}</span>{" ".repeat(w - k.length)} = {"{ "}
            {items.map((it, i) => (
              <span key={it}><span className="s">"{it}"</span>{i < items.length - 1 ? ", " : ""}</span>
            ))}
            {" },"}
          </code>
        </Line>
      ))}
      <Line><code className="code">{"}"}</code></Line>
      <Line />
    </section>
  );
}
