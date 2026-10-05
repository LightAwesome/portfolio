import { experience } from "@/data/experience";
import Line, { Heading } from "./Line";

function withMetric(text: string, metric?: string) {
  if (!metric) return text;
  const [a, b] = text.split("{metric}");
  return <>{a}<span className="m">{metric}</span>{b}</>;
}

// Experience as `git log --graph`: newest first, HEAD is the current role.
export default function Experience() {
  return (
    <section id="experience" data-sec="experience" aria-labelledby="h-experience">
      <Heading id="experience">experience</Heading>
      <Line />
      <ol className="log">
        {experience.map((r, ri) => {
          const last = ri === experience.length - 1;
          return (
            <li key={r.company}>
              <Line>
                <span className="logl">
                  <span className="g star" aria-hidden="true">*</span>
                  <span>
                    {r.current && <span className="deco">(HEAD -&gt; now) </span>}
                    <span className="co">{r.url ? <a href={r.url}>{r.company}</a> : r.company}</span>
                    {r.place && <>, {r.place}</>} <span className="role">{r.title}</span> <span className="when">{r.when}</span>
                  </span>
                </span>
              </Line>
              {r.bullets.map((b, i) => (
                <Line key={i}>
                  <span className="logl">
                    <span className={last && i === r.bullets.length - 1 ? "g" : "g rail"} aria-hidden="true" />
                    <span>- {withMetric(b.text, b.metric)}</span>
                  </span>
                </Line>
              ))}
              {!last && (
                <Line>
                  <span className="logl"><span className="g rail" aria-hidden="true" /><span /></span>
                </Line>
              )}
            </li>
          );
        })}
      </ol>
      <Line />
    </section>
  );
}
