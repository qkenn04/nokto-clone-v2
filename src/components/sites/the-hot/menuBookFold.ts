/**
 * Geometry for a single-page corner peel. The leaf is hinged on its left edge (the spine) and folds
 * along the perpendicular bisector of its free corner and the point that corner has been pulled to.
 */

export type Point = { x: number; y: number };
export type Corner = "top" | "bottom";

export type Fold = {
  /** Part of the leaf still lying flat, in stage pixels. */
  front: Point[];
  /** Lifted part of the leaf in its own coordinates, before it is mirrored over the fold. */
  flap: Point[];
  /** Midpoint of the fold line. */
  origin: Point;
  /** Unit vector pointing from the fold toward the spine, the side the flap lands on. */
  normal: Point;
  /** Distance from the fold to the lifted corner. */
  depth: number;
};

const PEAK_LIFT = 0.075;

export function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

/** Corner lift as a share of page height: a diagonal peel early in the turn that straightens as the leaf crosses. */
export function liftAt(progress: number) {
  return PEAK_LIFT * Math.sqrt(Math.sin(Math.PI * clamp01(progress)));
}

function keepSide(polygon: Point[], side: (point: Point) => number) {
  const kept: Point[] = [];
  polygon.forEach((point, index) => {
    const next = polygon[(index + 1) % polygon.length];
    const a = side(point);
    const b = side(next);
    if (a >= 0) kept.push(point);
    if ((a >= 0) !== (b >= 0)) {
      const t = a / (a - b);
      kept.push({ x: point.x + (next.x - point.x) * t, y: point.y + (next.y - point.y) * t });
    }
  });
  return kept;
}

/**
 * Folds a width x height leaf. `progress` runs 0 (flat) to 1 (turned past the spine); `lift` raises the
 * pulled corner as a share of the height. A bottom corner lets the lower edge lead; a top corner the upper.
 */
export function foldLeaf(width: number, height: number, progress: number, lift: number, corner: Corner): Fold | null {
  let x = Math.min(width * (1 - 2 * progress), width);
  let y = Math.min(height * (1 - Math.max(0, lift)), height);

  // The spine stays attached: the corner can only reach as far as the paper allows from either end of it.
  const fromBase = Math.hypot(x, height - y);
  if (fromBase > width) {
    x *= width / fromBase;
    y = height - (height - y) * (width / fromBase);
  }
  const diagonal = Math.hypot(width, height);
  const fromHead = Math.hypot(x, y);
  if (fromHead > diagonal) {
    x *= diagonal / fromHead;
    y *= diagonal / fromHead;
  }

  const dx = x - width;
  const dy = y - height;
  const length = Math.hypot(dx, dy);
  if (length < 0.5) return null;

  const normal = { x: dx / length, y: dy / length };
  const origin = { x: (width + x) / 2, y: (height + y) / 2 };
  const page = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }];
  const side = (point: Point) => (point.x - origin.x) * normal.x + (point.y - origin.y) * normal.y;
  const toStage = (point: Point) => (corner === "top" ? { x: point.x, y: height - point.y } : point);

  return {
    front: keepSide(page, side).map(toStage),
    flap: keepSide(page, (point) => -side(point)).map(toStage),
    origin: toStage(origin),
    normal: corner === "top" ? { x: normal.x, y: -normal.y } : normal,
    depth: length / 2,
  };
}

export function polygonCss(points: Point[]) {
  // An empty polygon() is invalid CSS and would drop the clip entirely, so collapse to a point instead.
  if (points.length < 3) return "polygon(0 0, 0 0, 0 0)";
  return `polygon(${points.map((point) => `${point.x.toFixed(2)}px ${point.y.toFixed(2)}px`).join(", ")})`;
}

/** Mirrors an element over the fold line. Needs `transform-origin: 0 0`. */
export function mirrorCss(origin: Point, normal: Point) {
  const { x: nx, y: ny } = normal;
  const shift = 2 * (origin.x * nx + origin.y * ny);
  const f = (value: number) => value.toFixed(5);
  return `matrix(${f(1 - 2 * nx * nx)}, ${f(-2 * nx * ny)}, ${f(-2 * nx * ny)}, ${f(1 - 2 * ny * ny)}, ${(shift * nx).toFixed(2)}, ${(shift * ny).toFixed(2)})`;
}

/** A linear-gradient for a width x height box that starts at the fold and runs along `direction`; stops are px from the fold. */
export function foldGradientCss(width: number, height: number, origin: Point, direction: Point, stops: [string, number][]) {
  const angle = Math.atan2(direction.x, -direction.y);
  const length = Math.abs(width * direction.x) + Math.abs(height * direction.y);
  const start = (origin.x - width / 2) * direction.x + (origin.y - height / 2) * direction.y + length / 2;
  let last = -Infinity;
  const list = stops.map(([color, offset]) => {
    last = Math.max(last, start + offset);
    return `${color} ${last.toFixed(2)}px`;
  });
  return `linear-gradient(${angle.toFixed(5)}rad, ${list.join(", ")})`;
}
