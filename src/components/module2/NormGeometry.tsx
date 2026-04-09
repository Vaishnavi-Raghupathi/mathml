import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

type ViewMode = 'L1' | 'L2' | 'Both'

const toPlot = (value: number) => 180 + value * 100
const toPlotY = (value: number) => 180 - value * 100

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

const NormGeometry = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('Both')
  const [l1Penalty, setL1Penalty] = useState(0)
  const [l2Penalty, setL2Penalty] = useState(0)

  const initialWeights = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const sign = i % 2 === 0 ? 1 : -1
      const magnitude = 0.25 + seededRandom(i + 1) * 0.75
      return sign * magnitude
    })
  }, [])

  const l1Weights = useMemo(() => {
    return initialWeights.map((weight, i) => {
      const threshold = 0.22 + i * 0.045
      const shrunk = Math.sign(weight) * Math.max(Math.abs(weight) - l1Penalty * threshold * 2.4, 0)
      return Math.abs(shrunk) < 0.025 ? 0 : shrunk
    })
  }, [initialWeights, l1Penalty])

  const l2Weights = useMemo(() => {
    return initialWeights.map((weight) => {
      const softened = weight * (1 - 0.88 * l2Penalty)
      return softened
    })
  }, [initialWeights, l2Penalty])

  const l1NonZero = l1Weights.filter((weight) => Math.abs(weight) > 0.01).length
  const l2AvgMagnitude = l2Weights.reduce((sum, weight) => sum + Math.abs(weight), 0) / l2Weights.length

  return (
    <section className="max-w-[940px] space-y-12 text-[#f9fafb]">
      <div className="space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.35 }}
          className="text-base leading-8"
        >
          Every norm draws a different shape around the origin. The shape tells you which vectors the norm considers
          equally large.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="text-sm leading-7 text-[#cbd5e1]"
        >
          These shapes are called unit balls, the set of all vectors with norm equal to 1.
        </motion.p>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap gap-4">
          {(['L1', 'L2', 'Both'] as ViewMode[]).map((mode) => {
            const isActive = viewMode === mode
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className="text-sm transition-colors"
                style={{
                  color: isActive ? '#60a5fa' : '#cbd5e1',
                  textDecoration: isActive ? 'underline' : 'none',
                  textUnderlineOffset: '3px'
                }}
              >
                {mode}
              </button>
            )
          })}
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 420 360"
            className="h-auto w-full max-w-[560px]"
            role="img"
            aria-label="L1 and L2 unit ball comparison"
          >
            {Array.from({ length: 7 }).map((_, i) => {
              const offset = -1.5 + i * 0.5
              const x = toPlot(offset)
              const y = toPlotY(offset)
              return (
                <g key={offset}>
                  <line x1={x} y1={30} x2={x} y2={330} stroke="#1f2937" strokeWidth="1" />
                  <line x1={30} y1={y} x2={390} y2={y} stroke="#1f2937" strokeWidth="1" />
                </g>
              )
            })}

            <line x1={30} y1={180} x2={390} y2={180} stroke="#6b7280" strokeWidth="1.2" />
            <line x1={180} y1={30} x2={180} y2={330} stroke="#6b7280" strokeWidth="1.2" />

            {(viewMode === 'L2' || viewMode === 'Both') && (
              <motion.circle
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                cx="180"
                cy="180"
                r="100"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="3"
              />
            )}

            {(viewMode === 'L1' || viewMode === 'Both') && (
              <motion.polygon
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                points="180,80 280,180 180,280 80,180"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
              />
            )}

            {viewMode === 'L2' && (
              <text x="40" y="345" fill="#93c5fd" fontSize="12">
                L2 unit ball, all points at distance 1 from origin.
              </text>
            )}

            {viewMode === 'L1' && (
              <text x="40" y="345" fill="#fbbf24" fontSize="12">
                L1 unit ball.
              </text>
            )}

            {viewMode === 'Both' && (
              <g>
                <text x="40" y="345" fill="#93c5fd" fontSize="12">
                  L2 (blue) and L1 (orange) overlaid
                </text>
              </g>
            )}
          </svg>
        </div>

        <p className="text-sm leading-7 text-[#cbd5e1]">
          The L2 ball is round because it treats all directions equally. The L1 ball is a diamond because it favors
          axis-aligned directions.
        </p>
      </div>

      <div className="space-y-5">
        <p className="text-base leading-8 text-[#f9fafb]">
          These shapes matter because regularization works by constraining your model&apos;s weights to live near these
          balls.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-base font-medium text-[#dbeafe]">L2 regularization</h3>
            <svg viewBox="0 0 240 220" className="h-auto w-full max-w-[280px]" role="img" aria-label="L2 panel">
              <line x1="20" y1="110" x2="220" y2="110" stroke="#334155" strokeWidth="1" />
              <line x1="120" y1="20" x2="120" y2="200" stroke="#334155" strokeWidth="1" />
              <circle cx="120" cy="110" r="72" fill="none" stroke="#60a5fa" strokeWidth="2.6" />
              <circle cx="170" cy="60" r="4" fill="#93c5fd" />
              <text x="176" y="62" fill="#cbd5e1" fontSize="10">
                model weights
              </text>
            </svg>
            <p className="text-sm leading-7 text-[#cbd5e1]">
              Weights are small in all directions. No weight dominates. The model spreads influence across all
              features.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-medium text-[#dbeafe]">L1 regularization</h3>
            <svg viewBox="0 0 240 220" className="h-auto w-full max-w-[280px]" role="img" aria-label="L1 panel">
              <line x1="20" y1="110" x2="220" y2="110" stroke="#334155" strokeWidth="1" />
              <line x1="120" y1="20" x2="120" y2="200" stroke="#334155" strokeWidth="1" />
              <polygon points="120,38 192,110 120,182 48,110" fill="none" stroke="#f59e0b" strokeWidth="2.6" />
              <circle cx="120" cy="38" r="4" fill="#fbbf24" />
              <text x="127" y="35" fill="#fef3c7" fontSize="10">
                model weights
              </text>
            </svg>
            <p className="text-sm leading-7 text-[#cbd5e1]">
              Solutions tend to land at corners of the diamond. Corners have zeros. L1 regularization produces sparse
              models, most weights become exactly zero.
            </p>
          </div>
        </div>

        <div className="border-l-2 pl-4" style={{ borderColor: '#a78bfa' }}>
          <p className="text-sm leading-7 text-[#ddd6fe]">
            L1 regularization is how you build a model that ignores most of its input features entirely. That is not a
            bug. For high-dimensional data it is often exactly what you want.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-[#dbeafe]">Watch sparsity emerge</h3>

        <div className="space-y-4">
          <label className="block text-sm text-[#cbd5e1]" htmlFor="l1-penalty">
            L1 penalty strength: {l1Penalty.toFixed(2)}
          </label>
          <input
            id="l1-penalty"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={l1Penalty}
            onChange={(event) => setL1Penalty(clamp(Number(event.target.value), 0, 1))}
            className="w-full accent-[#60a5fa]"
          />

          <label className="block text-sm text-[#cbd5e1]" htmlFor="l2-penalty">
            L2 penalty strength: {l2Penalty.toFixed(2)}
          </label>
          <input
            id="l2-penalty"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={l2Penalty}
            onChange={(event) => setL2Penalty(clamp(Number(event.target.value), 0, 1))}
            className="w-full accent-[#f59e0b]"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm text-[#93c5fd]">L1 effect</p>
            <svg viewBox="0 0 360 290" className="h-auto w-full" role="img" aria-label="L1 sparsity bars">
              <line x1="20" y1="246" x2="340" y2="246" stroke="#475569" strokeWidth="1" />
              {l1Weights.map((weight, i) => {
                const width = 22
                const gap = 9
                const x = 24 + i * (width + gap)
                const maxHeight = 210
                const absWeight = Math.abs(weight)
                const isNonZero = absWeight > 0.01
                const rawHeight = absWeight * maxHeight
                const height = isNonZero ? Math.max(Math.min(rawHeight, 222), 8) : 2
                const y = Math.max(20, 246 - height)

                return (
                  <motion.rect
                    key={`l1-${i}`}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="#60a5fa"
                    animate={{ y, height }}
                    transition={{ duration: 0.2, ease: 'linear' }}
                    opacity={isNonZero ? 0.92 : 0.15}
                  />
                )
              })}
            </svg>
            <p className="text-sm text-[#cbd5e1]">Nonzero weights: {l1NonZero}/10</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-[#fbbf24]">L2 effect</p>
            <svg viewBox="0 0 360 290" className="h-auto w-full" role="img" aria-label="L2 shrinkage bars">
              <line x1="20" y1="246" x2="340" y2="246" stroke="#475569" strokeWidth="1" />
              {l2Weights.map((weight, i) => {
                const width = 22
                const gap = 9
                const x = 24 + i * (width + gap)
                const maxHeight = 210
                const absWeight = Math.abs(weight)
                const isActive = absWeight > 0.002
                const rawHeight = absWeight * maxHeight
                const height = isActive ? Math.max(Math.min(rawHeight, 222), 6) : 2
                const y = Math.max(20, 246 - height)

                return (
                  <motion.rect
                    key={`l2-${i}`}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="#f59e0b"
                    animate={{ y, height }}
                    transition={{ duration: 0.2, ease: 'linear' }}
                    opacity={isActive ? 0.92 : 0.15}
                  />
                )
              })}
            </svg>
            <p className="text-sm text-[#cbd5e1]">All weights active, average magnitude: {l2AvgMagnitude.toFixed(3)}</p>
          </div>
        </div>

        <p className="text-sm leading-7 text-[#cbd5e1]">
          L1 kills features. L2 shrinks them. Same goal, different geometry, different outcome.
        </p>
      </div>
    </section>
  )
}

export default NormGeometry
