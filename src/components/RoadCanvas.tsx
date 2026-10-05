import { useEffect, useRef, useState } from "react";

// A tiny top-down traffic sim: lanes on a road grid, signalised intersections,
// car-following, and one ego vehicle that shows its planned path and boxes what it perceives.
// Pauses off screen and in hidden tabs; draws a single settled frame under reduced motion.

type Axis = "h" | "v";
type Lane = { axis: Axis; at: number; dir: 1 | -1 };
type Car = { lane: Lane; pos: number; v: number; vmax: number; color: string; ego?: boolean };
type Light = { x: number; y: number; offset: number };

const ROAD = 26;      // road width, px
const LANE = 6.5;     // lane offset from road centre
const CAR_L = 15;
const CAR_W = 7;
const CYCLE = 9;      // seconds per full signal cycle
const SENSE = 92;     // ego perception radius

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

// Signal phase for one intersection at time t: which axis has green, and whether it's amber.
function phase(l: Light, t: number): { green: Axis; amber: boolean } {
  const p = ((t + l.offset) % CYCLE) / CYCLE;
  if (p < 0.44) return { green: "h", amber: p > 0.36 };
  if (p < 0.5) return { green: "v", amber: true }; // all-red-ish clearance shown as amber
  return { green: "v", amber: p > 0.92 };
}

export default function RoadCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState({ agents: 0, ego: "cruising" });

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const C = {
      bg: cssVar("--bg", "#1d2021"),
      road: cssVar("--bg1", "#282828"),
      mark: cssVar("--rule", "#7c6f64"),
      dim: cssVar("--nontext", "#928374"),
      ego: cssVar("--cursor", "#fabd2f"),
      green: cssVar("--str", "#b8bb26"),
      red: cssVar("--err", "#fb4934"),
      cars: [cssVar("--link", "#83a598"), cssVar("--kw", "#d3869b"), cssVar("--field", "#8ec07c"), cssVar("--head", "#fe8019"), cssVar("--fg3", "#bdae93")],
    };

    let W = 0, H = 0;
    let hs: number[] = [], vs: number[] = [];
    let lanes: Lane[] = [];
    let lights: Light[] = [];
    let cars: Car[] = [];
    let t = 0;

    function build() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      hs = [H * 0.3, H * 0.74];
      vs = W < 420 ? [W * 0.28, W * 0.74] : [W * 0.18, W * 0.5, W * 0.82];
      lanes = [
        ...hs.flatMap((y) => [{ axis: "h", at: y + LANE, dir: 1 }, { axis: "h", at: y - LANE, dir: -1 }] as Lane[]),
        ...vs.flatMap((x) => [{ axis: "v", at: x - LANE, dir: 1 }, { axis: "v", at: x + LANE, dir: -1 }] as Lane[]),
      ];
      lights = hs.flatMap((y, i) => vs.map((x, j) => ({ x, y, offset: (i * 2.3 + j * 3.1) % CYCLE })));

      const n = Math.max(8, Math.min(18, Math.round((W * H) / 11000)));
      cars = [];
      for (let i = 0; i < n; i++) {
        const lane = lanes[i % lanes.length];
        const len = lane.axis === "h" ? W : H;
        cars.push({ lane, pos: ((i * 0.37) % 1) * len, v: 0, vmax: 34 + ((i * 13) % 20), color: C.cars[i % C.cars.length] });
      }
      cars[0].ego = true;
      cars[0].vmax = 42;
      setStatus((s) => ({ ...s, agents: n }));
    }

    const laneLen = (l: Lane) => (l.axis === "h" ? W : H);
    const xy = (c: Car) => (c.lane.axis === "h" ? [c.pos, c.lane.at] : [c.lane.at, c.pos]);
    // distance travelling forward from a to b along a lane that wraps
    const ahead = (l: Lane, a: number, b: number) => {
      const len = laneLen(l) + 40;
      return (((b - a) * l.dir) % len + len) % len;
    };

    let egoState = "cruising";
    function step(dt: number) {
      t += dt;
      for (const c of cars) {
        const l = c.lane;
        let gap = Infinity;
        let why = "cruising";
        for (const o of cars) {
          if (o === c || o.lane !== l) continue;
          const d = ahead(l, c.pos, o.pos) - CAR_L - 4;
          if (d < gap) { gap = d; why = "following"; }
        }
        // stop line of the next signal on this lane
        for (const cross of l.axis === "h" ? vs : hs) {
          const stopAt = cross - l.dir * (ROAD / 2 + 3);
          const d = ahead(l, c.pos, stopAt) - CAR_L / 2;
          if (d < 0 || d > 70) continue;
          const lt = lights.find((x) => (l.axis === "h" ? x.x === cross && Math.abs(x.y - l.at) < ROAD : x.y === cross && Math.abs(x.x - l.at) < ROAD));
          if (!lt) continue;
          const ph = phase(lt, t);
          const go = ph.green === l.axis && !(ph.amber && d > 18);
          if (!go && d < gap) { gap = d; why = "stopping"; }
        }
        const target = Math.max(0, Math.min(c.vmax, (gap - 2) * 1.6));
        c.v += Math.max(-90 * dt, Math.min(40 * dt, target - c.v));
        c.pos += c.v * dt * l.dir;
        const len = laneLen(l);
        if (c.pos > len + 20) c.pos -= len + 40;
        if (c.pos < -20) c.pos += len + 40;
        if (c.ego) egoState = c.v < 2 && why === "stopping" ? "waiting at light" : why;
      }
    }

    function draw() {
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = C.road;
      for (const y of hs) ctx.fillRect(0, y - ROAD / 2, W, ROAD);
      for (const x of vs) ctx.fillRect(x - ROAD / 2, 0, ROAD, H);

      ctx.strokeStyle = C.mark;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 9]);
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      for (const y of hs) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
      for (const x of vs) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);

      for (const lt of lights) {
        const ph = phase(lt, t);
        const col = (axis: Axis) => (ph.green === axis ? (ph.amber ? C.ego : C.green) : C.red);
        ctx.fillStyle = col("h");
        ctx.fillRect(lt.x - ROAD / 2 - 6, lt.y + ROAD / 2 + 2, 4, 4);
        ctx.fillRect(lt.x + ROAD / 2 + 2, lt.y - ROAD / 2 - 6, 4, 4);
        ctx.fillStyle = col("v");
        ctx.fillRect(lt.x - ROAD / 2 - 6, lt.y - ROAD / 2 - 6, 4, 4);
        ctx.fillRect(lt.x + ROAD / 2 + 2, lt.y + ROAD / 2 + 2, 4, 4);
      }

      const ego = cars.find((c) => c.ego)!;
      const [ex, ey] = xy(ego);

      // planned path: dots ahead of the ego along its lane
      ctx.fillStyle = C.ego;
      for (let s = 16; s < 16 + Math.max(24, ego.v * 2.2); s += 7) {
        const p = ego.pos + s * ego.lane.dir;
        const [px, py] = ego.lane.axis === "h" ? [p, ego.lane.at] : [ego.lane.at, p];
        ctx.globalAlpha = 0.65 - (s / 120);
        ctx.fillRect(px - 1, py - 1, 2, 2);
      }
      ctx.globalAlpha = 1;

      for (const c of cars) {
        const [x, y] = xy(c);
        const w = c.lane.axis === "h" ? CAR_L : CAR_W;
        const h = c.lane.axis === "h" ? CAR_W : CAR_L;
        ctx.fillStyle = c.ego ? C.ego : c.color;
        ctx.fillRect(Math.round(x - w / 2), Math.round(y - h / 2), w, h);

        // perception: corner brackets around agents the ego can see
        if (!c.ego && Math.hypot(x - ex, y - ey) < SENSE) {
          const bx = x - w / 2 - 4, by = y - h / 2 - 4, bw = w + 8, bh = h + 8, k = 4;
          ctx.strokeStyle = C.dim;
          ctx.beginPath();
          ctx.moveTo(bx, by + k); ctx.lineTo(bx, by); ctx.lineTo(bx + k, by);
          ctx.moveTo(bx + bw - k, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + k);
          ctx.moveTo(bx + bw, by + bh - k); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw - k, by + bh);
          ctx.moveTo(bx + k, by + bh); ctx.lineTo(bx, by + bh); ctx.lineTo(bx, by + bh - k);
          ctx.stroke();
        }
      }
    }

    build();
    let running = false;
    let raf = 0;
    let last = 0;
    let lastStatus = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      step(dt);
      draw();
      if (now - lastStatus > 500) { lastStatus = now; setStatus((s) => (s.ego === egoState ? s : { ...s, ego: egoState })); }
      if (running) raf = requestAnimationFrame(loop);
    };
    const settle = () => { for (let i = 0; i < 240; i++) step(1 / 30); draw(); setStatus((s) => ({ ...s, ego: egoState })); };
    const start = () => { if (running || reduce) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    settle();
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !document.hidden) start(); else stop(); });
    io.observe(canvas);
    const onVis = () => (document.hidden || !visible ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => { build(); settle(); });
    ro.observe(canvas);

    return () => { stop(); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  return (
    <>
      <canvas ref={ref} className="road" aria-hidden="true" />
      <div className="split-status" aria-hidden="true">
        <span>{status.agents} agents</span>
        <span>signals on</span>
        <span className="split-ego">ego: {status.ego}</span>
      </div>
    </>
  );
}
