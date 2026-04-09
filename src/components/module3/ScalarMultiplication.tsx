import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

type ScalarOption = '2v' | '0.5v' | '-1v'
type Vec2 = [number, number]

const mono = '"IBM Plex Mono", monospace'

const xMin = -2
const xMax = 3
const yMin = -2.5
const yMax = 4.5

const svgWidth = 480
const svgHeight = 320
const padX = 48
const padY = 28

const plotWidth = svgWidth - padX * 2
const plotHeight = svgHeight - padY * 2

const xToSvg = (x: number) => padX + ((x - xMin) / (xMax - xMin)) * plotWidth
const yToSvg = (y: number) => padY + ((yMax - y) / (yMax - yMin)) * plotHeight

const tipText = (vec: Vec2) => `[${vec[0]}, ${vec[1]}]`

const options: Array<{ key: ScalarOption; vector: Vec2; color: string }> = [
  { key: '2v', vector: [2, 4], color: 'var(--accent)' },
  { key: '0.5v', vector: [0.5, 1], color: 'var(--accent)' },
  { key: '-1v', vector: [-1, -2], color: 'var(--error)' }
]

const ScalarMultiplication = () => {
  const [selected, setSelected] = useState<ScalarOption>('2v')

  const target = useMemo(() => options.find((item) => item.key === selected) ?? options[0], [selected])

  const originX = xToSvg(0)
  const originY = yToSvg(0)
  const originalTipX = xToSvg(1)
  const originalTipY = yToSvg(2)

  const targetTipX = xToSvg(target.vector[0])
  const targetTipY = yToSvg(target.vector[1])

  const angle = Math.atan2(targetTipY - originY, targetTipX - originX)
  const arrowLength = 11
  const arrowWidth = 6

  const arrowLeftX = targetTipX - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle)
  const arrowLeftY = targetTipY - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle)
  const arrowRightX = targetTipX - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle)
  const arrowRightY = targetTipY - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle)

  const xTicks = useMemo(() => Array.from({ length: Math.floor(xMax - xMin) + 1 }, (_, i) => i + xMin), [])
  const yTicks = useMemo(() => Array.from({ length: Math.floor(yMax - yMin) + 1 }, (_, i) => i + Math.ceil(yMin)), [])

  return (
    <section className="max-w-[900px] space-y-14">
      <div className="space-y-6">
        <p className="text-[17px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
          Before we can talk about linear combinations, we need one more operation. Scalar multiplication: scaling a
          vector by a single number.
        </p>
        <div className="rounded-[4px] border px-6 py-5" style={{ background: 'var(--surface-raised)', borderColor: 'var(--border)' }}>
          <pre className="m-0 whitespace-pre text-[15px]" style={{ fontFamily: mono, color: 'var(--text-primary)' }}>{`2 * [1, 3] = [2, 6]
0.5 * [4, 2] = [2, 1]
-1 * [3, 1] = [-3, -1]`}</pre>
        </div>

        <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Multiply every component by the scalar. Direction scales. Negative scalars reverse direction.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {options.map((option) => {
            const active = option.key === selected

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setSelected(option.key)}
                className="rounded-[4px] border text-[14px] transition-colors"
                style={{
                  padding: '8px 16px',
                  borderColor: active ? 'var(--accent)' : 'var(--border)',
                  background: active ? 'rgba(29,78,216,0.08)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-primary)',
                  fontFamily: 'Inter, sans-serif'
                }}
                aria-pressed={active}
              >
                {option.key}
              </button>
            )
          })}
        </div>

        <div className="mx-auto w-full max-w-[480px]">
          <div className="relative mx-auto" style={{ width: `${svgWidth}px`, height: `${svgHeight}px` }}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              width={svgWidth}
              height={svgHeight}
              className="block h-auto w-full"
              role="img"
              aria-label="Scalar multiplication vector diagram"
            >
              <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="transparent" />

              {xTicks.map((x) => (
                <line
                  key={`gx-${x}`}
                  x1={xToSvg(x)}
                  y1={yToSvg(yMin)}
                  x2={xToSvg(x)}
                  y2={yToSvg(yMax)}
                  stroke="var(--border-strong)"
                  strokeWidth="1"
                />
              ))}

              {yTicks.map((y) => (
                <line
                  key={`gy-${y}`}
                  x1={xToSvg(xMin)}
                  y1={yToSvg(y)}
                  x2={xToSvg(xMax)}
                  y2={yToSvg(y)}
                  stroke="var(--border-strong)"
                  strokeWidth="1"
                />
              ))}

              <line x1={xToSvg(0)} y1={yToSvg(yMin)} x2={xToSvg(0)} y2={yToSvg(yMax)} stroke="var(--border)" strokeWidth="1" />
              <line x1={xToSvg(xMin)} y1={yToSvg(0)} x2={xToSvg(xMax)} y2={yToSvg(0)} stroke="var(--border)" strokeWidth="1" />

              <line x1={originX} y1={originY} x2={originalTipX} y2={originalTipY} stroke="var(--text-secondary)" strokeWidth="2" />
              <polygon
                points={`${originalTipX},${originalTipY} ${originalTipX - 10},${originalTipY + 4} ${originalTipX - 6},${originalTipY - 8}`}
                fill="var(--text-secondary)"
              />
              <text
                x={originalTipX + 8}
                y={originalTipY - 10}
                fontSize="13"
                fill="var(--text-secondary)"
                fontFamily="Inter, sans-serif"
              >
                v = [1, 2]
              </text>

              <motion.line
                x1={originX}
                y1={originY}
                x2={targetTipX}
                y2={targetTipY}
                stroke={target.color}
                strokeWidth="2.5"
                initial={false}
                animate={{ x2: targetTipX, y2: targetTipY, stroke: target.color }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />

              <motion.polygon
                points={`${targetTipX},${targetTipY} ${arrowLeftX},${arrowLeftY} ${arrowRightX},${arrowRightY}`}
                fill={target.color}
                initial={false}
                animate={{
                  points: `${targetTipX},${targetTipY} ${arrowLeftX},${arrowLeftY} ${arrowRightX},${arrowRightY}`,
                  fill: target.color
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />

              <motion.text
                x={targetTipX + 8}
                y={targetTipY + (selected === '-1v' ? 20 : -10)}
                fontSize="13"
                fill={target.color}
                fontFamily="Inter, sans-serif"
                initial={false}
                animate={{
                  x: targetTipX + 8,
                  y: targetTipY + (selected === '-1v' ? 20 : -10),
                  fill: target.color
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {`${selected} = ${tipText(target.vector)}`}
              </motion.text>
            </svg>
          </div>
        </div>

        <p className="text-center text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Same direction, different magnitude. Except -1, which reverses. The scalar is a dial on the vector&apos;s
          influence.
        </p>
      </div>

      <div className="mx-auto w-full max-w-[680px] space-y-5">
        <p className="text-[17px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
          In a neural network, every weight is a scalar multiplied by an input feature. A weight of 2.0 on a feature
          means: double its influence. A weight of -0.5 means: half its influence and reverse its sign. Scalar
          multiplication is the atomic operation inside every linear layer.
        </p>

        <div className="callout-insight">
          <p className="m-0 text-[15px] leading-[1.8]" style={{ color: 'var(--text-secondary)' }}>
            When a model learns weights, it is learning scalars. The features are fixed vectors. Training adjusts the
            scalars until the weighted combination produces useful outputs.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ScalarMultiplication
