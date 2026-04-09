import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

type Choice =
  | 'C is larger under both'
  | 'D is larger under both'
  | 'C larger L1, D larger L2'
  | 'D larger L1, C larger L2'

const choices: Choice[] = [
  'C is larger under both',
  'D is larger under both',
  'C larger L1, D larger L2',
  'D larger L1, C larger L2'
]

const correctChoice: Choice = 'C larger L1, D larger L2'

const L1Norm = () => {
  const [selected, setSelected] = useState<Choice | null>(null)

  const isCorrect = selected === correctChoice

  const cVector = useMemo(() => Array.from({ length: 10 }, () => 0.1), [])
  const dVector = useMemo(() => [1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [])

  const cL1 = useMemo(() => cVector.reduce((sum, value) => sum + Math.abs(value), 0), [cVector])
  const cL2 = useMemo(() => Math.sqrt(cVector.reduce((sum, value) => sum + value * value, 0)), [cVector])
  const dL1 = useMemo(() => dVector.reduce((sum, value) => sum + Math.abs(value), 0), [dVector])
  const dL2 = useMemo(() => Math.sqrt(dVector.reduce((sum, value) => sum + value * value, 0)), [dVector])

  const bars = [
    { label: 'C L1', value: cL1, color: '#60a5fa' },
    { label: 'C L2', value: cL2, color: '#93c5fd' },
    { label: 'D L1', value: dL1, color: '#f59e0b' },
    { label: 'D L2', value: dL2, color: '#fbbf24' }
  ]

  const gridLeft = 40
  const gridTop = 20
  const cell = 80
  const gridCols = 4
  const gridRows = 3

  const originX = gridLeft
  const originY = gridTop + gridRows * cell
  const destinationX = gridLeft + gridCols * cell
  const destinationY = gridTop

  const l2MidX = (originX + destinationX) / 2
  const l2MidY = (originY + destinationY) / 2

  const toX = (u: number) => originX + u * cell
  const toY = (v: number) => originY - v * cell

  return (
    <section className="max-w-[900px] space-y-12 text-[#f9fafb]">
      <div className="space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.35 }}
          className="text-base leading-8"
        >
          There is another way to measure size. Instead of squaring and taking a square root, just add up the absolute
          values.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="font-mono text-base text-[#93c5fd]"
        >
          ||v||_1 = |v1| + |v2| + ... + |vn|
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.35, delay: 0.14 }}
          className="text-sm leading-7 text-[#cbd5e1]"
        >
          This is the L1 norm. Also called the Manhattan distance, or taxicab distance.
        </motion.p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[#dbeafe]">City grid intuition</h3>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 460 320" className="h-auto w-full max-w-[620px]" role="img" aria-label="L1 vs L2 city grid">
            {Array.from({ length: gridCols + 1 }).map((_, i) => {
              const x = gridLeft + i * cell
              return (
                <line key={`v-${i}`} x1={x} y1={gridTop} x2={x} y2={gridTop + gridRows * cell} stroke="#1f2937" strokeWidth="1" />
              )
            })}

            {Array.from({ length: gridRows + 1 }).map((_, i) => {
              const y = gridTop + i * cell
              return (
                <line
                  key={`h-${i}`}
                  x1={gridLeft}
                  y1={y}
                  x2={gridLeft + gridCols * cell}
                  y2={y}
                  stroke="#1f2937"
                  strokeWidth="1"
                />
              )
            })}

            <circle cx={originX} cy={originY} r="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
            <text
              x={originX - 12}
              y={originY + 16}
              fill="#cbd5e1"
              fontSize="13"
              fontFamily="Inter, sans-serif"
              textAnchor="end"
            >
              Origin
            </text>

            <circle cx={destinationX} cy={destinationY} r="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
            <text
              x={destinationX}
              y={destinationY - 10}
              fill="#cbd5e1"
              fontSize="13"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
            >
              Destination
            </text>

            <line x1={originX} y1={originY} x2={destinationX} y2={destinationY} stroke="#1a56db" strokeWidth="2" />

            <polyline
              points={`${toX(0)},${toY(0)} ${toX(1)},${toY(0)} ${toX(2)},${toY(0)} ${toX(3)},${toY(0)} ${toX(4)},${toY(0)} ${toX(4)},${toY(1)} ${toX(4)},${toY(2)} ${toX(4)},${toY(3)}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />

            <text
              x={l2MidX - 8}
              y={l2MidY + 28}
              fill="#93c5fd"
              fontSize="13"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
            >
              L2: straight line, 5.0
            </text>

            <text
              x={l2MidX + 24}
              y={l2MidY + 52}
              fill="#fbbf24"
              fontSize="13"
              fontFamily="Inter, sans-serif"
              dominantBaseline="middle"
            >
              L1: city blocks, 7.0
            </text>
          </svg>
        </div>

        <p className="text-sm leading-7 text-[#cbd5e1]">
          In a city you cannot walk through buildings. You travel along axes. L1 measures that kind of distance.
        </p>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-medium text-[#dbeafe]">Same vectors, different answer</h3>

        <div className="overflow-x-auto">
          <table className="min-w-[540px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[#93c5fd]">
                <th className="pb-2 pr-6 font-medium">Vector</th>
                <th className="pb-2 pr-6 font-medium">L2 norm</th>
                <th className="pb-2 font-medium">L1 norm</th>
              </tr>
            </thead>
            <tbody className="text-[#e2e8f0]">
              <tr>
                <td className="py-1 pr-6 font-mono">A=[3,0,0]</td>
                <td className="py-1 pr-6 font-mono">3.0</td>
                <td className="py-1 font-mono">3.0</td>
              </tr>
              <tr>
                <td className="py-1 pr-6 font-mono">B=[1,1,1]</td>
                <td className="py-1 pr-6 font-mono">1.732</td>
                <td className="py-1 font-mono">3.0</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm leading-7 text-[#cbd5e1]">Under L1, A and B are the same size. Under L2, A is bigger.</p>

        <div className="border-l-2 pl-4" style={{ borderColor: '#a78bfa' }}>
          <p className="text-sm leading-7 text-[#ddd6fe]">
            The norm you choose changes what counts as large. This is not a detail. It determines what your model
            learns to care about.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-medium text-[#dbeafe]">Pause and predict</h3>

        <div className="space-y-2 font-mono text-sm text-[#dbeafe]">
          <p>C = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]</p>
          <p>D = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]</p>
        </div>

        <p className="text-sm text-[#cbd5e1]">Which has a larger L1 norm? Which has a larger L2 norm?</p>

        <div className="flex flex-wrap gap-4">
          {choices.map((choice) => {
            const isSelected = selected === choice
            return (
              <button
                key={choice}
                type="button"
                onClick={() => setSelected(choice)}
                className="text-sm transition-colors"
                style={{
                  color: isSelected ? '#60a5fa' : '#cbd5e1',
                  textDecoration: isSelected ? 'underline' : 'none',
                  textUnderlineOffset: '3px'
                }}
              >
                {choice}
              </button>
            )
          })}
        </div>

        {selected && !isCorrect && (
          <p className="text-sm text-[#fca5a5]">Not quite. Check each norm separately, then compare C and D again.</p>
        )}

        {isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="space-y-2 font-mono text-sm text-[#93c5fd]">
              <p>C: L1 = 1.0, L2 = 0.316</p>
              <p>D: L1 = 1.0, L2 = 1.0</p>
            </div>

            <div className="overflow-x-auto">
              <svg viewBox="0 0 420 240" className="h-auto w-full max-w-[520px]" role="img" aria-label="Norm comparison bar chart">
                <line x1="40" y1="200" x2="390" y2="200" stroke="#64748b" strokeWidth="1" />
                <line x1="40" y1="30" x2="40" y2="200" stroke="#64748b" strokeWidth="1" />

                {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                  const y = 200 - tick * 150
                  return (
                    <g key={tick}>
                      <line x1="36" y1={y} x2="40" y2={y} stroke="#64748b" strokeWidth="1" />
                      <text x="10" y={y + 4} fill="#94a3b8" fontSize="11">
                        {tick.toFixed(2)}
                      </text>
                    </g>
                  )
                })}

                {bars.map((bar, index) => {
                  const barWidth = 52
                  const gap = 26
                  const x = 70 + index * (barWidth + gap)
                  const height = (bar.value / 1.1) * 150
                  const y = 200 - height

                  return (
                    <g key={bar.label}>
                      <motion.rect
                        initial={{ height: 0, y: 200 }}
                        animate={{ height, y }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={height}
                        fill={bar.color}
                        opacity="0.9"
                      />
                      <text x={x + 8} y={220} fill="#cbd5e1" fontSize="11">
                        {bar.label}
                      </text>
                      <text x={x + 8} y={y - 6} fill="#e2e8f0" fontSize="11">
                        {bar.value.toFixed(3)}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            <p className="text-sm leading-7 text-[#cbd5e1]">
              L1 treats ten small values the same as one large one. L2 punishes the large value much more. This
              asymmetry is exactly why the two norms produce different models when used in regularization.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default L1Norm
