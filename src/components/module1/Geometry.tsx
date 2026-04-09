import { scaleLinear } from 'd3-scale';
import { useEffect, useMemo, useRef, useState } from 'react';

type MoviePoint = {
  name: string;
  romance: number;
  action: number;
  comedy: number;
  order: number;
};

type DimKey = 'romance' | 'action' | 'comedy';

const movies: MoviePoint[] = [
  { name: 'Titanic', romance: 0.88, action: 0.35, comedy: 0.2, order: 1 },
  { name: 'Mad Max', romance: 0.08, action: 0.97, comedy: 0.1, order: 2 },
  { name: 'The Dark Knight', romance: 0.15, action: 0.92, comedy: 0.18, order: 3 },
  { name: 'La La Land', romance: 0.82, action: 0.12, comedy: 0.55, order: 4 },
  { name: 'The Princess Bride', romance: 0.75, action: 0.45, comedy: 0.8, order: 5 },
];

const incomingMovie = { romance: 0.45, action: 0.48, comedy: 0.51 };

const chartSize = { width: 640, height: 360, margin: { top: 24, right: 24, bottom: 52, left: 56 } };

const innerWidth = chartSize.width - chartSize.margin.left - chartSize.margin.right;
const innerHeight = chartSize.height - chartSize.margin.top - chartSize.margin.bottom;

const xScale = scaleLinear().domain([0, 1]).range([0, innerWidth]);
const yScale = scaleLinear().domain([0, 1]).range([innerHeight, 0]);

const euclidean = (a: number[], b: number[]) =>
  Math.sqrt(a.reduce((sum, value, i) => sum + (value - b[i]) ** 2, 0));

const denseArrayText = Array.from({ length: 24 }, (_, row) =>
  Array.from({ length: 18 }, (_, col) => ((Math.sin(row * 1.31 + col * 0.73) + 1) / 2).toFixed(2)).join(
    ' ',
  ),
).join('\n');

export default function Geometry() {
  const part1Ref = useRef<HTMLDivElement | null>(null);
  const part3Ref = useRef<HTMLDivElement | null>(null);
  const part1Started = useRef(false);
  const part3Started = useRef(false);

  const [visibleCount, setVisibleCount] = useState(0);
  const [showClusters, setShowClusters] = useState(false);

  const [predictionPoint, setPredictionPoint] = useState<{ x: number; y: number } | null>(null);
  const [revealActual, setRevealActual] = useState(false);

  const [showStatementsCount, setShowStatementsCount] = useState(0);

  const [activeDims, setActiveDims] = useState<Record<DimKey, boolean>>({
    romance: true,
    action: true,
    comedy: true,
  });
  const [nearestName, setNearestName] = useState<string>('Titanic');

  const actual2D = useMemo(() => ({ x: incomingMovie.romance, y: incomingMovie.action }), []);

  useEffect(() => {
    const node = part1Ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || part1Started.current) return;
        part1Started.current = true;

        let step = 0;
        const timer = window.setInterval(() => {
          step += 1;
          setVisibleCount(step);
          if (step >= movies.length) {
            window.clearInterval(timer);
            window.setTimeout(() => setShowClusters(true), 450);
          }
        }, 420);
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = part3Ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || part3Started.current) return;
        part3Started.current = true;

        let step = 0;
        const timer = window.setInterval(() => {
          step += 1;
          setShowStatementsCount(step);
          if (step >= 3) window.clearInterval(timer);
        }, 450);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const nearestWithDims = useMemo(() => {
    const enabled = (Object.keys(activeDims) as DimKey[]).filter((key) => activeDims[key]);

    const dims: DimKey[] = enabled.length > 0 ? enabled : ['romance', 'action', 'comedy'];

    const query = incomingMovie;

    const scored = movies.map((movie) => {
      const a = dims.map((dim) => movie[dim]);
      const b = dims.map((dim) => query[dim]);
      return { name: movie.name, distance: euclidean(a, b), movie };
    });

    scored.sort((a, b) => a.distance - b.distance);
    return scored[0];
  }, [activeDims]);

  useEffect(() => {
    setNearestName(nearestWithDims.name);
  }, [nearestWithDims]);

  const togglePositions = useMemo(() => {
    const rOn = activeDims.romance ? 1 : 0;
    const aOn = activeDims.action ? 1 : 0;
    const cOn = activeDims.comedy ? 1 : 0;

    const xDen = rOn + cOn || 1;
    const yDen = aOn + cOn || 1;

    return movies.map((movie) => {
      const xVal = (movie.romance * rOn + movie.comedy * cOn) / xDen;
      const yVal = (movie.action * aOn + movie.comedy * cOn) / yDen;
      return { ...movie, x: xVal, y: yVal };
    });
  }, [activeDims]);

  const toggleQueryPoint = useMemo(() => {
    const rOn = activeDims.romance ? 1 : 0;
    const aOn = activeDims.action ? 1 : 0;
    const cOn = activeDims.comedy ? 1 : 0;

    const xDen = rOn + cOn || 1;
    const yDen = aOn + cOn || 1;

    return {
      x: (incomingMovie.romance * rOn + incomingMovie.comedy * cOn) / xDen,
      y: (incomingMovie.action * aOn + incomingMovie.comedy * cOn) / yDen,
    };
  }, [activeDims]);

  const nearestTogglePoint = useMemo(
    () => togglePositions.find((point) => point.name === nearestWithDims.name) ?? null,
    [nearestWithDims.name, togglePositions],
  );

  const toggleDimension = (key: DimKey) => {
    setActiveDims((prev) => {
      const activeCount = (Object.keys(prev) as DimKey[]).filter((k) => prev[k]).length;
      if (prev[key] && activeCount === 1) {
        return prev;
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const handlePlotClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - bounds.left - chartSize.margin.left;
    const py = event.clientY - bounds.top - chartSize.margin.top;

    const clampedX = Math.max(0, Math.min(innerWidth, px));
    const clampedY = Math.max(0, Math.min(innerHeight, py));

    const valueX = xScale.invert(clampedX);
    const valueY = yScale.invert(clampedY);

    setPredictionPoint({ x: valueX, y: valueY });
  };

  const barsSurfaceData = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => {
      const dim = 2 + i * 9.8;
      const nearSurfacePct = Math.min(100, 100 * (1 - (1 - 2 / dim) ** dim));
      return { dim: Math.round(dim), pct: nearSurfacePct };
    });
  }, []);

  return (
    <section className="max-w-[680px]">
      <div className="space-y-14">
        <div ref={part1Ref} className="rounded-xl border border-[#1f2937] bg-[#0b1220] p-5 md:p-7">
          <svg viewBox={`0 0 ${chartSize.width} ${chartSize.height}`} className="h-auto w-full">
            <g transform={`translate(${chartSize.margin.left}, ${chartSize.margin.top})`}>
              {showClusters && (
                <>
                  <ellipse
                    cx={xScale(0.18)}
                    cy={yScale(0.88)}
                    rx={85}
                    ry={58}
                    fill="#2563eb"
                    opacity={0.12}
                  >
                    <animate attributeName="opacity" from="0" to="0.12" dur="0.7s" fill="freeze" />
                  </ellipse>
                  <ellipse
                    cx={xScale(0.8)}
                    cy={yScale(0.26)}
                    rx={95}
                    ry={62}
                    fill="#7c3aed"
                    opacity={0.12}
                  >
                    <animate attributeName="opacity" from="0" to="0.12" dur="0.7s" fill="freeze" />
                  </ellipse>
                </>
              )}

              {xScale.ticks(6).map((tick: number) => (
                <line
                  key={`gx-${tick}`}
                  x1={xScale(tick)}
                  x2={xScale(tick)}
                  y1={0}
                  y2={innerHeight}
                  stroke="#1f2937"
                />
              ))}
              {yScale.ticks(6).map((tick: number) => (
                <line
                  key={`gy-${tick}`}
                  x1={0}
                  x2={innerWidth}
                  y1={yScale(tick)}
                  y2={yScale(tick)}
                  stroke="#1f2937"
                />
              ))}

              {movies.slice(0, visibleCount).map((movie) => (
                <g key={movie.name} transform={`translate(${xScale(movie.romance)}, ${yScale(movie.action)})`}>
                  <circle r={7} fill="#a78bfa">
                    <animate attributeName="r" from="0" to="7" dur="0.3s" fill="freeze" />
                  </circle>
                  <text y={-10} textAnchor="middle" fill="#dbeafe" fontSize={11}>
                    {movie.name}
                  </text>
                </g>
              ))}

              <line x1={0} x2={innerWidth} y1={innerHeight} y2={innerHeight} stroke="#64748b" />
              <line x1={0} x2={0} y1={0} y2={innerHeight} stroke="#64748b" />
            </g>

            <text
              x={chartSize.margin.left + innerWidth / 2}
              y={chartSize.height - 12}
              fill="#94a3b8"
              textAnchor="middle"
              fontSize={12}
            >
              romance →
            </text>
            <text
              transform={`translate(16 ${chartSize.margin.top + innerHeight / 2}) rotate(-90)`}
              fill="#94a3b8"
              textAnchor="middle"
              fontSize={12}
            >
              action →
            </text>
          </svg>

          <p className="mt-4 font-serif text-sm text-[#9ca3af] md:text-base">
            Nobody programmed those clusters. They emerged from the representation.
          </p>
        </div>

        <div className="rounded-xl border border-[#7c3aed]/35 bg-[#111827] p-5 md:p-7">
          <p className="font-serif text-lg leading-8 text-[#f3f4f6]">
            A new movie arrives: [0.45, 0.48, 0.51]. Before you calculate, where does it land?
          </p>

          <svg
            viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
            className="mt-4 h-auto w-full cursor-crosshair rounded-lg border border-[#1f2937] bg-[#0b1220]"
            onClick={handlePlotClick}
          >
            <g transform={`translate(${chartSize.margin.left}, ${chartSize.margin.top})`}>
              {movies.map((movie) => (
                <g key={`predict-${movie.name}`} transform={`translate(${xScale(movie.romance)}, ${yScale(movie.action)})`}>
                  <circle r={5.5} fill="#60a5fa" opacity={0.8} />
                  <text y={-9} textAnchor="middle" fill="#dbeafe" fontSize={10}>
                    {movie.name}
                  </text>
                </g>
              ))}

              {predictionPoint && (
                <g transform={`translate(${xScale(predictionPoint.x)}, ${yScale(predictionPoint.y)})`}>
                  <circle r={6} fill="#f59e0b" />
                  <text y={-10} textAnchor="middle" fill="#fbbf24" fontSize={10}>
                    your guess
                  </text>
                </g>
              )}

              {revealActual && (
                <>
                  {movies.map((movie) => {
                    const d = euclidean([actual2D.x, actual2D.y], [movie.romance, movie.action]);
                    const mx = (xScale(actual2D.x) + xScale(movie.romance)) / 2;
                    const my = (yScale(actual2D.y) + yScale(movie.action)) / 2;
                    return (
                      <g key={`line-${movie.name}`}>
                        <line
                          x1={xScale(actual2D.x)}
                          y1={yScale(actual2D.y)}
                          x2={xScale(movie.romance)}
                          y2={yScale(movie.action)}
                          stroke="#94a3b8"
                          strokeDasharray="5 5"
                          opacity={0.65}
                        />
                        <text x={mx} y={my - 5} fill="#cbd5e1" fontSize={10} textAnchor="middle">
                          {d.toFixed(2)}
                        </text>
                      </g>
                    );
                  })}

                  <g transform={`translate(${xScale(actual2D.x)}, ${yScale(actual2D.y)})`}>
                    <circle r={7} fill="#f472b6" />
                    <text y={-11} textAnchor="middle" fill="#fbcfe8" fontSize={10}>
                      actual
                    </text>
                  </g>
                </>
              )}
            </g>
          </svg>

          <button
            type="button"
            onClick={() => setRevealActual(true)}
            className="mt-4 rounded-lg border border-[#7c3aed]/50 bg-[#7c3aed]/10 px-4 py-2 text-sm text-[#e9d5ff] transition hover:bg-[#7c3aed]/20"
          >
            Reveal actual position
          </button>

          {revealActual && (
            <p className="mt-4 font-serif text-sm text-[#d1d5db] md:text-base">
              Near the center, close to everything, similar to nothing. The most ambiguous
              representation possible.
            </p>
          )}
        </div>

        <div ref={part3Ref} className="rounded-xl border border-[#1f2937] bg-[#0b1220] p-5 md:p-7">
          <p className="font-serif text-lg leading-8 text-[#f3f4f6] md:text-xl">
            Real systems do this in 768 dimensions, not 2. You cannot draw it, but the geometry still
            exists.
          </p>

          <div className="mt-4 max-h-44 overflow-hidden rounded-lg border border-[#1f2937] bg-[#050814] p-3">
            <pre className="animate-[scrollDense_18s_linear_infinite] whitespace-pre font-mono text-[10px] leading-4 text-[#60a5fa]/80">
              {denseArrayText}
            </pre>
          </div>

          <div className="mt-5 space-y-2">
            {[
              '1. Distance still exists in 768 dimensions. The formula is identical.',
              '2. Clusters still form.',
              '3. But your intuitions about space start to break.',
            ]
              .slice(0, showStatementsCount)
              .map((line) => (
                <p key={line} className="font-serif text-sm text-[#d1d5db] md:text-base">
                  {line}
                </p>
              ))}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-[#7c3aed]/30 bg-[#111827] p-5 md:p-7">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-[#1f2937] bg-[#0b1220] p-4">
              <p className="text-xs uppercase tracking-wide text-[#9ca3af]">2D</p>
              <svg viewBox="0 0 140 120" className="mt-2 h-28 w-full">
                <circle cx="68" cy="58" r="38" fill="#7c3aed" fillOpacity="0.22" stroke="#c4b5fd" />
              </svg>
              <p className="text-xs text-[#9ca3af]">volume mostly inside</p>
            </div>

            <div className="rounded-lg border border-[#1f2937] bg-[#0b1220] p-4">
              <p className="text-xs uppercase tracking-wide text-[#9ca3af]">3D</p>
              <svg viewBox="0 0 140 120" className="mt-2 h-28 w-full">
                <ellipse cx="68" cy="58" rx="42" ry="30" fill="#2563eb" fillOpacity="0.2" stroke="#93c5fd" />
                <ellipse
                  cx="68"
                  cy="58"
                  rx="42"
                  ry="12"
                  fill="none"
                  stroke="#93c5fd"
                  strokeOpacity="0.7"
                />
              </svg>
              <p className="text-xs text-[#9ca3af]">still mostly inside</p>
            </div>

            <div className="rounded-lg border border-[#1f2937] bg-[#0b1220] p-4">
              <p className="text-xs uppercase tracking-wide text-[#9ca3af]">2 → 100 dimensions</p>
              <div className="mt-2 flex h-28 items-end gap-1">
                {barsSurfaceData.map((item) => (
                  <div key={item.dim} className="group relative flex-1">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-[#7c3aed] to-[#2563eb]"
                      style={{ height: `${Math.max(4, (item.pct / 100) * 100)}%` }}
                    />
                    <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-[#0f172a] px-1 py-0.5 text-[10px] text-[#cbd5e1] opacity-0 transition group-hover:opacity-100">
                      {item.dim}D: {item.pct.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="font-serif text-sm text-[#d1d5db] md:text-base">
            In 100 dimensions, almost all volume is near the surface. The interior is empty.
          </p>

          <div className="rounded-lg border border-[#7c3aed]/45 bg-[#7c3aed]/8 px-4 py-3">
            <p className="font-serif text-sm text-[#e9d5ff] md:text-base">
              This is the curse of dimensionality.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[#1f2937] bg-[#0b1220] p-5 md:p-7">
          <h3 className="font-serif text-xl md:text-2xl">Try the controls</h3>
          <p className="mt-2 text-sm text-[#9ca3af]">
            Turn dimensions on/off to see how the points move, then compare how the nearest neighbor changes.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                ['romance', 'Romance'],
                ['action', 'Action'],
                ['comedy', 'Comedy'],
              ] as const
            ).map(([key, label]) => {
              const active = activeDims[key];
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleDimension(key)}
                  className={`module11-choice-btn rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? 'module11-choice-selected'
                      : 'border-[#334155] bg-[#0f172a] text-[#94a3b8]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <svg viewBox={`0 0 ${chartSize.width} ${chartSize.height}`} className="mt-5 h-auto w-full rounded-lg border border-[#1f2937] bg-[#050814]">
            <g transform={`translate(${chartSize.margin.left}, ${chartSize.margin.top})`}>
              {xScale.ticks(6).map((tick: number) => (
                <line
                  key={`tx-${tick}`}
                  x1={xScale(tick)}
                  x2={xScale(tick)}
                  y1={0}
                  y2={innerHeight}
                  stroke="#1f2937"
                />
              ))}
              {yScale.ticks(6).map((tick: number) => (
                <line
                  key={`ty-${tick}`}
                  x1={0}
                  x2={innerWidth}
                  y1={yScale(tick)}
                  y2={yScale(tick)}
                  stroke="#1f2937"
                />
              ))}

              {togglePositions.map((movie) => {
                const isNearest = movie.name === nearestWithDims.name;
                return (
                  <g key={movie.name} transform={`translate(${xScale(movie.x)}, ${yScale(movie.y)})`}>
                    <circle
                      r={isNearest ? 7.5 : 6}
                      fill={isNearest ? '#f59e0b' : '#a78bfa'}
                      stroke={isNearest ? '#fef3c7' : '#f5f3ff'}
                      strokeWidth={1.2}
                    />
                    <text y={-10} textAnchor="middle" fill="#dbeafe" fontSize={11}>
                      {movie.name}
                    </text>
                  </g>
                );
              })}

              {nearestTogglePoint && (
                <line
                  x1={xScale(toggleQueryPoint.x)}
                  y1={yScale(toggleQueryPoint.y)}
                  x2={xScale(nearestTogglePoint.x)}
                  y2={yScale(nearestTogglePoint.y)}
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  opacity={0.75}
                />
              )}

              <g transform={`translate(${xScale(toggleQueryPoint.x)}, ${yScale(toggleQueryPoint.y)})`}>
                <circle r={6.5} fill="#22d3ee" stroke="#cffafe" strokeWidth={1.2} />
                <text y={-10} textAnchor="middle" fill="#a5f3fc" fontSize={11}>
                  incoming
                </text>
              </g>

              <line x1={0} x2={innerWidth} y1={innerHeight} y2={innerHeight} stroke="#64748b" />
              <line x1={0} x2={0} y1={0} y2={innerHeight} stroke="#64748b" />
            </g>

            <text
              x={chartSize.margin.left + innerWidth / 2}
              y={chartSize.height - 12}
              fill="#94a3b8"
              textAnchor="middle"
              fontSize={12}
            >
              effective x-space
            </text>
            <text
              transform={`translate(16 ${chartSize.margin.top + innerHeight / 2}) rotate(-90)`}
              fill="#94a3b8"
              textAnchor="middle"
              fontSize={12}
            >
              effective y-space
            </text>
          </svg>

          <p className="mt-4 font-serif text-sm text-[#d1d5db] md:text-base">
            When removing a dimension doesn&apos;t change recommendations, that dimension was
            redundant.
          </p>
          <p className="mt-1 text-sm text-[#94a3b8]">Current nearest neighbor: {nearestName}</p>
        </div>
      </div>

      <style>{`
        @keyframes scrollDense {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </section>
  );
}
