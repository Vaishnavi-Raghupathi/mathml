import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

type Vec2 = [number, number]
type SpanCase = 'two-directions' | 'same-direction'

const mono = '"IBM Plex Mono", monospace'

const xMin = -4
const xMax = 4
const yMin = -4
const yMax = 4

const svgSize = 480
const pad = 48
const plot = svgSize - pad * 2

const xToSvg = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * plot
const yToSvg = (y: number) => pad + ((yMax - y) / (yMax - yMin)) * plot

const arrowHeadPoints = (from: Vec2, to: Vec2) => {
  const fromX = xToSvg(from[0])
  const fromY = yToSvg(from[1])
  const toX = xToSvg(to[0])
  const toY = yToSvg(to[1])

  const angle = Math.atan2(toY - fromY, toX - fromX)
  const length = 11
  const width = 6

  const leftX = toX - length * Math.cos(angle) + width * Math.sin(angle)
  const leftY = toY - length * Math.sin(angle) - width * Math.cos(angle)
  const rightX = toX - length * Math.cos(angle) - width * Math.sin(angle)
  const rightY = toY - length * Math.sin(angle) + width * Math.cos(angle)

  return `${toX},${toY} ${leftX},${leftY} ${rightX},${rightY}`
}

const drawArrow = ({
  from,
  to,
  color,
  label,
  labelOffset = [8, -8]
}: {
  from: Vec2
  to: Vec2
  color: string
  label: string
  labelOffset?: [number, number]
}) => (
  <>
    <line x1={xToSvg(from[0])} y1={yToSvg(from[1])} x2={xToSvg(to[0])} y2={yToSvg(to[1])} stroke={color} strokeWidth="2.2" />
    <polygon points={arrowHeadPoints(from, to)} fill={color} />
    <text
      x={xToSvg(to[0]) + labelOffset[0]}
      y={yToSvg(to[1]) + labelOffset[1]}
      fontSize="13"
      fill={color}
      fontFamily="Inter, sans-serif"
    >
      {label}
    </text>
  </>
)

const Span = () => {
  const [activeCase, setActiveCase] = useState<SpanCase>('two-directions')
  const [showReasoning, setShowReasoning] = useState(false)

  const ticks = useMemo(() => Array.from({ length: xMax - xMin + 1 }, (_, i) => i + xMin), [])

  const isCase1 = activeCase === 'two-directions'
  const case1Opacity = isCase1 ? 0.5 : 0
  const case2Opacity = isCase1 ? 0 : 1

  const v1: Vec2 = isCase1 ? [2, 1] : [2, 2]
  const v2: Vec2 = isCase1 ? [1, 2] : [1, 1]

  return (
    <section className="max-w-[900px] space-y-14">
      <div className="space-y-6">
        <p className="text-[17px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
          Here is a question the linear combination builder raises. If you can choose any scalars at all, which points
          in space can you actually reach?
        </p>

        <p className="text-[17px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
          The answer has a name: the span. The span of a set of vectors is every point you can reach using any linear
          combination of those vectors.
        </p>

        <div className="rounded-[4px] border px-6 py-5" style={{ background: 'transparent', borderColor: 'var(--border)' }}>
          <pre className="m-0 whitespace-pre text-[15px]" style={{ fontFamily: mono, color: 'var(--text-primary)' }}>{`span({v1, v2}) = { a1*v1 + a2*v2 | a1, a2 ∈ ℝ }`}</pre>
        </div>

        <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Read this as: all possible weighted sums, with any real-valued scalars.</p>
      </div>

      <div className="space-y-6">
  <h3 className="text-[17px] font-semibold" style={{ color: 'var(--text-primary)' }}>What can you reach?</h3>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveCase('two-directions')}
            className="rounded-[4px] border text-[14px] transition-colors"
            style={{
              padding: '8px 16px',
              borderColor: isCase1 ? 'var(--accent)' : 'var(--border)',
              background: isCase1 ? 'rgba(29,78,216,0.06)' : 'transparent',
              color: isCase1 ? 'var(--accent)' : 'var(--text-primary)',
              fontFamily: 'Inter, sans-serif'
            }}
            aria-pressed={isCase1}
          >
            Case 1: Two directions
          </button>

          <button
            type="button"
            onClick={() => setActiveCase('same-direction')}
            className="rounded-[4px] border text-[14px] transition-colors"
            style={{
              padding: '8px 16px',
              borderColor: !isCase1 ? 'var(--accent)' : 'var(--border)',
              background: !isCase1 ? 'rgba(29,78,216,0.06)' : 'transparent',
              color: !isCase1 ? 'var(--accent)' : 'var(--text-primary)',
              fontFamily: 'Inter, sans-serif'
            }}
            aria-pressed={!isCase1}
          >
            Case 2: Same direction
          </button>
        </div>

        <div className="mx-auto w-full max-w-[480px]">
          <svg
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            width={svgSize}
            height={svgSize}
            className="block h-auto w-full"
            role="img"
            aria-label="Span visualization comparing independent versus parallel vectors"
          >
            <rect x="0" y="0" width={svgSize} height={svgSize} fill="transparent" />

            {ticks.map((x) => (
              <line key={`gx-${x}`} x1={xToSvg(x)} y1={yToSvg(yMin)} x2={xToSvg(x)} y2={yToSvg(yMax)} stroke="var(--border-strong)" strokeWidth="1" />
            ))}
            {ticks.map((y) => (
              <line key={`gy-${y}`} x1={xToSvg(xMin)} y1={yToSvg(y)} x2={xToSvg(xMax)} y2={yToSvg(y)} stroke="var(--border-strong)" strokeWidth="1" />
            ))}

            <line x1={xToSvg(0)} y1={yToSvg(yMin)} x2={xToSvg(0)} y2={yToSvg(yMax)} stroke="var(--border)" strokeWidth="1" />
            <line x1={xToSvg(xMin)} y1={yToSvg(0)} x2={xToSvg(xMax)} y2={yToSvg(0)} stroke="var(--border)" strokeWidth="1" />

            <motion.rect
              x={xToSvg(xMin)}
              y={yToSvg(yMax)}
              width={xToSvg(xMax) - xToSvg(xMin)}
              height={yToSvg(yMin) - yToSvg(yMax)}
              fill="rgba(29,78,216,0.06)"
              initial={false}
              animate={{ opacity: case1Opacity }}
              transition={{ duration: 0.3, ease: 'linear' }}
            />

            <motion.g initial={false} animate={{ opacity: case1Opacity }} transition={{ duration: 0.3, ease: 'linear' }}>
              <text
                x={(xToSvg(xMin) + xToSvg(xMax)) / 2}
                y={(yToSvg(yMin) + yToSvg(yMax)) / 2}
                textAnchor="middle"
                fontSize="13"
                fill="var(--accent)"
                fontFamily="Inter, sans-serif"
              >
                span = all of ℝ²
              </text>
            </motion.g>

            <motion.g initial={false} animate={{ opacity: case2Opacity }} transition={{ duration: 0.3, ease: 'linear' }}>
              <line x1={xToSvg(-4)} y1={yToSvg(-4)} x2={xToSvg(4)} y2={yToSvg(4)} stroke="var(--accent)" strokeWidth="2" />
              <text x={xToSvg(1.2)} y={yToSvg(1.6)} fontSize="13" fill="var(--accent)" fontFamily="Inter, sans-serif">
                span = one line through origin
              </text>
            </motion.g>

            {drawArrow({ from: [0, 0], to: v1, color: 'var(--accent)', label: `v1 = [${v1[0]}, ${v1[1]}]` })}
            {drawArrow({ from: [0, 0], to: v2, color: 'var(--text-secondary)', label: `v2 = [${v2[0]}, ${v2[1]}]`, labelOffset: [8, 16] })}
          </svg>
        </div>

        <p className="text-center text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          {isCase1
            ? 'Two vectors pointing in genuinely different directions span the entire 2D plane. You can reach any point.'
            : 'Two vectors pointing the same direction span only a line. No matter what scalars you choose, you are stuck on that line.'}
        </p>

        <div className="callout-insight">
          <p className="m-0 text-[15px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
            The span tells you what a set of vectors can express. If your model&apos;s weight vectors all point in
            similar directions, it cannot express the full range of outputs you need. This is why diverse
            representations matter. It is a geometry problem, not a data problem.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-[17px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
          In a neural network layer, the output is constrained to the span of the weight vectors. If you have a
          512-dimensional hidden layer but the weight vectors are all roughly parallel, the actual outputs live in a
          much smaller subspace. The layer has less expressive power than its dimension count suggests.
        </p>

        <p className="text-[17px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
          This is why initialization matters. If all weights start at the same value, all neurons compute the same
          thing. They span a line, not a space. Random initialization spreads them out so they span a richer subspace
          from the start.
        </p>

        <p className="text-[17px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
          We will return to this rigorously in module 4 when we talk about rank and column space. For now: span is the
          set of things your model can say. Design your representations so that set contains the answers you need.
        </p>
      </div>

      <div className="space-y-4">
        <div className="callout-note space-y-3">
          <p className="m-0 text-[15px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
            A language model produces output by computing a linear combination of token embedding vectors. If two
            tokens have nearly identical embedding vectors, what does that tell you about the model&apos;s ability to
            distinguish them in downstream tasks?
          </p>

          <button type="button" className="btn-ghost text-sm underline underline-offset-4" onClick={() => setShowReasoning(true)}>
            Show reasoning
          </button>

          {showReasoning && (
            <p className="m-0 text-[15px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
              If two embedding vectors are nearly parallel, any linear combination that includes one will produce nearly
              the same result as including the other. The model cannot distinguish them. This is the representation
              collapsed meaning failure from module 1.1, now explained geometrically. The embeddings span the same
              direction.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Span
