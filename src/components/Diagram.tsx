import { useId } from "react";
import type { Diagram as Spec, DiagramNode } from "@/data/projects";

// One box-and-arrow grammar for every project: nodes sit on a small grid,
// edges run straight when nodes share a row or column and bend once otherwise.
const CW = 150;  // column pitch
const RH = 92;   // row pitch
const BW = 118;  // box width
const BH = 46;   // box height
const PAD = 14;

const center = (n: DiagramNode) => ({ x: PAD + n.col * CW + BW / 2, y: PAD + n.row * RH + BH / 2 });

// Point where the segment from a box centre toward (tx, ty) leaves the box.
function exit(c: { x: number; y: number }, tx: number, ty: number) {
  const dx = tx - c.x, dy = ty - c.y;
  if (Math.abs(dx) * BH > Math.abs(dy) * BW) return { x: c.x + Math.sign(dx) * BW / 2, y: c.y };
  return { x: c.x, y: c.y + Math.sign(dy) * BH / 2 };
}

export default function Diagram({ spec, title }: { spec: Spec; title: string }) {
  const cols = Math.max(...spec.nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...spec.nodes.map((n) => n.row)) + 1;
  const w = PAD * 2 + (cols - 1) * CW + BW;
  const h = PAD * 2 + (rows - 1) * RH + BH + (spec.swatch ? 40 : 0);
  const byId = new Map(spec.nodes.map((n) => [n.id, n]));
  const arrow = `arrow${useId().replace(/:/g, "")}`;

  return (
    <svg className="diagram" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${title} architecture`}>
      <defs>
        <marker id={arrow} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" className="d-head" />
        </marker>
      </defs>

      {spec.edges.map((e) => {
        const a = byId.get(e.from)!, b = byId.get(e.to)!;
        const ca = center(a), cb = center(b);
        let d: string, lx: number, ly: number;
        if (a.row === b.row || a.col === b.col) {
          const p = exit(ca, cb.x, cb.y), q = exit(cb, ca.x, ca.y);
          d = `M${p.x},${p.y} L${q.x},${q.y}`;
          lx = (p.x + q.x) / 2; ly = (p.y + q.y) / 2;
        } else {
          // leave vertically, arrive horizontally
          const p = exit(ca, ca.x, cb.y), q = exit(cb, ca.x, cb.y);
          d = `M${p.x},${p.y} L${ca.x},${cb.y} L${q.x},${q.y}`;
          lx = ca.x; ly = (p.y + cb.y) / 2;
        }
        return (
          <g key={`${e.from}-${e.to}`}>
            <path d={d} className={`d-edge${e.dashed ? " dashed" : ""}`} markerEnd={`url(#${arrow})`} />
            {e.label && (
              <text x={lx} y={ly - 5} className="d-label" textAnchor="middle">{e.label}</text>
            )}
          </g>
        );
      })}

      {spec.nodes.map((n) => {
        const x = PAD + n.col * CW, y = PAD + n.row * RH;
        return (
          <g key={n.id} className={`d-node ${n.kind ?? "svc"}`}>
            <rect x={x} y={y} width={BW} height={BH} />
            <text x={x + BW / 2} y={y + (n.sub ? 20 : 28)} textAnchor="middle" className="d-name">{n.label}</text>
            {n.sub && <text x={x + BW / 2} y={y + 36} textAnchor="middle" className="d-sub">{n.sub}</text>}
          </g>
        );
      })}

      {spec.swatch && (
        <g>
          {spec.swatch.map((c, i) => (
            <rect key={c} x={PAD + i * ((w - PAD * 2) / spec.swatch!.length)} y={h - 30} width={(w - PAD * 2) / spec.swatch!.length} height={18} fill={c} />
          ))}
        </g>
      )}
    </svg>
  );
}
