import type { ReactNode } from "react";

// One line of the buffer. The gutter number is filled in by the editor (src/editor/buffer.ts).
export default function Line({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={className ? `r ${className}` : "r"}>
      <span className="nr" aria-hidden="true" />
      <div className="tx">{children}</div>
    </div>
  );
}

export function Heading({ id, children }: { id: string; children: string }) {
  return (
    <div className="r">
      <span className="nr" aria-hidden="true" />
      <h2 className="tx" id={`h-${id}`}>
        <span className="mk" aria-hidden="true">## </span>
        {children}
      </h2>
    </div>
  );
}
