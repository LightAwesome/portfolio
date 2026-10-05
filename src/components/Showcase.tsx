import { currentRole, fallbackVisual } from "@/data/experience";
import { projects } from "@/data/projects";
import Diagram from "./Diagram";
import RoadCanvas from "./RoadCanvas";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// The hero's split window. What it shows follows the current role in src/data/experience.ts,
// so a job change never leaves a visual that belongs to the old company.
export default function Showcase() {
  const visual = currentRole?.visual ?? fallbackVisual;
  const owner = currentRole?.visual ? currentRole : undefined;

  let path: string, tag: string, body: React.ReactNode;
  if (visual.kind === "sim") {
    path = `~/work/${slug(owner?.company ?? "sim")}/${visual.file}`;
    tag = "now";
    body = <RoadCanvas />;
  } else {
    const p = projects.find((x) => x.name === visual.project) ?? projects[0];
    path = `~/projects/${p.name}/architecture.svg`;
    tag = "featured";
    body = (
      <div className="split-diagram">
        <Diagram spec={p.diagram} title={p.name} />
      </div>
    );
  }

  return (
    <figure className="split">
      <div className="winbar">
        <span className="win-tag">{tag}</span>
        <span className="win-path">{path}</span>
        {owner?.url && (
          <a className="win-link" href={owner.url}>{owner.url.replace(/^https?:\/\//, "")}</a>
        )}
      </div>
      {body}
      <figcaption className="split-caption c">-- {visual.caption}</figcaption>
    </figure>
  );
}
