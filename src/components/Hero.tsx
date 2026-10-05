import { profile } from "@/data/profile";
import Line from "./Line";
import Showcase from "./Showcase";
import { useBufferApi } from "@/editor/context";
import { resumeMessage } from "@/editor/keys";

export default function Hero() {
  const buf = useBufferApi();
  return (
    <section id="top" data-sec="touseef" className="hero">
      <div className="hero-text">
        <Line className="big">
          <h1>
            <span className="mk" aria-hidden="true"># </span>
            {profile.name}
          </h1>
        </Line>
        <Line />
        <Line>
          <dl className="facts">
            {profile.facts.map((f) => (
              <div key={f.label} className={"now" in f ? "fact-now" : undefined}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </Line>
        <Line />
        <Line>
          <nav className="links" aria-label="Links">
            <a
              className="resume"
              href={profile.resume ?? "#contact"}
              onClick={(e) => { if (!profile.resume && buf) { e.preventDefault(); resumeMessage(buf); } }}
            >
              resume.pdf
            </a>
            <a href={`mailto:${profile.email}`}>email</a>
            {profile.links.map((l) => (
              <a key={l.label} href={l.href}>{l.label}</a>
            ))}
          </nav>
        </Line>
      </div>
      <Showcase />
    </section>
  );
}
