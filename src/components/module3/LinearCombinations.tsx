import { useMemo, useState } from 'react'

type Vec2 = [number, number]

const mono = '"IBM Plex Mono", monospace'

const v1: Vec2 = [3, 1]
const v2: Vec2 = [1, 3]

const xMin = -5
const xMax = 5
const yMin = -5
const yMax = 5

const svgSize = 480
const pad = 44
const plot = svgSize - pad * 2

const xToSvg = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * plot
const yToSvg = (y: number) => pad + ((yMax - y) / (yMax - yMin)) * plot

const format = (value: number) => {
  const rounded = Math.round(value * 100) / 100
  if (Math.abs(rounded) < 0.005) return '0'
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2)
}

const add = (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]]
const scale = (a: Vec2, scalar: number): Vec2 => [a[0] * scalar, a[1] * scalar]

const arrowheadPoints = (from: Vec2, to: Vec2) => {
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

const LinearCombinations = () => {
  const [a1, setA1] = useState(1)
  const [a2, setA2] = useState(1)
  const [visibleObservations, setVisibleObservations] = useState(0)

  const scaledV1 = useMemo(() => scale(v1, a1), [a1])
  const scaledV2 = useMemo(() => scale(v2, a2), [a2])
  const result = useMemo(() => add(scaledV1, scaledV2), [scaledV1, scaledV2])

  const ticks = useMemo(() => Array.from({ length: xMax - xMin + 1 }, (_, i) => i + xMin), [])

  const observations = [
    'When a1 = 1 and a2 = 0, the result is exactly v1. One vector, scaled by 1.',
    'When a1 = a2 = 0.5, the result sits halfway between them. The combination is an average.',
    'When a1 is negative, the first vector pulls backward. The combination can reach places neither vector points toward alone.'
  ]

  return (
    <section className="max-w-[900px] space-y-14">
      <div className="space-y-6">
        <p className="text-[17px] leading-[1.8] text-[#1e2d42]">
          Combine both operations. Scale some vectors, then add them up. The result is a linear combination.
        </p>

        <div className="rounded-[4px] border px-6 py-5" style={{ background: '#f4f6f9', borderColor: '#e2e6ed' }}>
          <pre className="m-0 whitespace-pre text-[15px] text-[#1e2d42]" style={{ fontFamily: mono }}>{`result = a1*v1 + a2*v2 + ... + an*vn

where a1, a2, ..., an are scalars
and   v1, v2, ..., vn are vectors`}</pre>
        </div>

        <p className="text-[13px] text-[#64748b]">
          The scalars are the weights. The vectors are the inputs. The result is what the model outputs.
        </p>

        <p className="text-[17px] leading-[1.8] text-[#1e2d42]">
          This is not a special operation reserved for specific parts of ML. It is the operation. Almost everything a
          neural network computes is a linear combination followed by a nonlinearity.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-[17px] font-semibold text-[#1e2d42]">Build a combination</h3>

        <div className="flex flex-wrap items-center gap-5 text-[15px]" style={{ fontFamily: mono }}>
          <span style={{ color: '#1a56db' }}>v1 = [3, 1]</span>
          <span style={{ color: '#64748b' }}>v2 = [1, 3]</span>
        </div>

        <div className="space-y-4">
          <label className="block text-[14px] text-[#1e2d42]" style={{ fontFamily: mono }}>
            a1: <span className="text-[#1a56db]">{format(a1)}</span>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.01}
              value={a1}
              onChange={(event) => setA1(Number(event.target.value))}
              className="mt-2 block w-full"
              aria-label="a1 slider"
            />
          </label>

          <label className="block text-[14px] text-[#1e2d42]" style={{ fontFamily: mono }}>
            a2: <span className="text-[#1a56db]">{format(a2)}</span>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.01}
              value={a2}
              onChange={(event) => setA2(Number(event.target.value))}
              className="mt-2 block w-full"
              aria-label="a2 slider"
            />
          </label>
        </div>

        <p className="text-[15px] text-[#1a56db]" style={{ fontFamily: mono }}>
          {`${format(a1)} * [3, 1] + ${format(a2)} * [1, 3] = [${format(result[0])}, ${format(result[1])}]`}
        </p>

        <div className="mx-auto w-full max-w-[480px]">
          <svg
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            width={svgSize}
            height={svgSize}
            className="block h-auto w-full"
            role="img"
            aria-label="Interactive linear combination grid"
          >
            <rect x="0" y="0" width={svgSize} height={svgSize} fill="#ffffff" />

            {ticks.map((x) => (
              <line key={`gx-${x}`} x1={xToSvg(x)} y1={yToSvg(yMin)} x2={xToSvg(x)} y2={yToSvg(yMax)} stroke="#f1f4f9" strokeWidth="1" />
            ))}
            {ticks.map((y) => (
              <line key={`gy-${y}`} x1={xToSvg(xMin)} y1={yToSvg(y)} x2={xToSvg(xMax)} y2={yToSvg(y)} stroke="#f1f4f9" strokeWidth="1" />
            ))}

            <line x1={xToSvg(0)} y1={yToSvg(yMin)} x2={xToSvg(0)} y2={yToSvg(yMax)} stroke="#cbd5e1" strokeWidth="1" />
            <line x1={xToSvg(xMin)} y1={yToSvg(0)} x2={xToSvg(xMax)} y2={yToSvg(0)} stroke="#cbd5e1" strokeWidth="1" />

            <line x1={xToSvg(0)} y1={yToSvg(0)} x2={xToSvg(scaledV1[0])} y2={yToSvg(scaledV1[1])} stroke="#1a56db" strokeWidth="2.2" />
            <polygon points={arrowheadPoints([0, 0], scaledV1)} fill="#1a56db" />
            <text
              x={xToSvg(scaledV1[0]) + 8}
              y={yToSvg(scaledV1[1]) - 10}
              fontSize="13"
              fill="#1a56db"
              fontFamily="Inter, sans-serif"
            >
              {`a1·v1 = [${format(scaledV1[0])}, ${format(scaledV1[1])}]`}
            </text>

            <line
              x1={xToSvg(scaledV1[0])}
              y1={yToSvg(scaledV1[1])}
              x2={xToSvg(result[0])}
              y2={yToSvg(result[1])}
              stroke="#64748b"
              strokeWidth="2.2"
            />
            <polygon points={arrowheadPoints(scaledV1, result)} fill="#64748b" />
            <text
              x={xToSvg(result[0]) + 8}
              y={yToSvg(result[1]) - 10}
              fontSize="13"
              fill="#64748b"
              fontFamily="Inter, sans-serif"
            >
              {`+ a2·v2 = [${format(result[0])}, ${format(result[1])}]`}
            </text>

            <line
              x1={xToSvg(0)}
              y1={yToSvg(0)}
              x2={xToSvg(result[0])}
              y2={yToSvg(result[1])}
              stroke="#1a1f36"
              strokeWidth="2.5"
              strokeDasharray="8 4"
            />
            <polygon points={arrowheadPoints([0, 0], result)} fill="#1a1f36" />
            <text
              x={xToSvg(result[0]) + 8}
              y={yToSvg(result[1]) + 18}
              fontSize="13"
              fill="#1a1f36"
              fontFamily="Inter, sans-serif"
            >
              {`result = [${format(result[0])}, ${format(result[1])}]`}
            </text>
          </svg>
        </div>

        <div className="space-y-3">
          {observations.slice(0, visibleObservations).map((text) => (
            <p key={text} className="text-[15px] text-[#64748b]">
              {text}
            </p>
          ))}

          {visibleObservations < observations.length && (
            <button
              type="button"
              className="btn-ghost text-sm underline underline-offset-4"
              onClick={() => setVisibleObservations((prev) => Math.min(prev + 1, observations.length))}
            >
              show next observation
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[680px] space-y-5">
        <p className="text-[17px] leading-[1.8] text-[#1e2d42]">
          A linear layer in a neural network takes an input vector and produces a linear combination of its columns,
          where the input values are the scalars. The weights matrix is a collection of vectors. The forward pass is:
          for each output neuron, compute a weighted sum of all inputs. That weighted sum is a linear combination.
        </p>

        <div className="callout-insight">
          <p className="m-0 text-[15px] leading-[1.8] text-[#dbe7ff]">
            When you hear &apos;the model learned a representation,&apos; it means the model found scalars, the weights,
            such that the linear combinations of input features produce vectors that are useful for the task. Every
            forward pass is this operation, scaled to millions of dimensions.
          </p>
        </div>
      </div>
    </section>
  )
}

export default LinearCombinations
