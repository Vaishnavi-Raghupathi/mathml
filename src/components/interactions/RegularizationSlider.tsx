import { useMemo, useState } from 'react'
import * as math from 'mathjs'

const BASE_WEIGHTS = [2.1, -3.4, 0.8, 1.9, -0.3, 2.7]
const mono = '"IBM Plex Mono", monospace'

const PANEL_WIDTH = 240
const PANEL_HEIGHT = 220
const ZERO_Y = PANEL_HEIGHT / 2
const TOP_BOTTOM_PADDING = 20
const BAR_WIDTH = 22
const BAR_GAP = 12
const MAX_ABS = Math.max(...BASE_WEIGHTS.map((w) => Math.abs(w)))
const HALF_RANGE_PX = ZERO_Y - TOP_BOTTOM_PADDING

const format = (value: number, digits = 2) => value.toFixed(digits)

const RegularizationSlider = () => {
  const [lambda, setLambda] = useState(0)

  const beforeNorm = useMemo(() => Number(math.norm(BASE_WEIGHTS, 2)), [])

  const regularizedWeights = useMemo(() => {
    return BASE_WEIGHTS.map((w) => Number(math.divide(w, 1 + lambda)))
  }, [lambda])

  const afterNorm = useMemo(() => Number(math.norm(regularizedWeights, 2)), [regularizedWeights])

  const shouldShowHighLambdaNote = lambda > 2

  const renderBars = (weights: number[], keyPrefix: string) => {
    return weights.map((w, idx) => {
      const barHeight = (Math.abs(w) / MAX_ABS) * HALF_RANGE_PX
      const x = 18 + idx * (BAR_WIDTH + BAR_GAP)
      const y = w >= 0 ? ZERO_Y - barHeight : ZERO_Y

      return <rect key={`${keyPrefix}-${idx}`} x={x} y={y} width={BAR_WIDTH} height={barHeight} fill="#5B6FAF" opacity="0.85" />
    })
  }

  return (
    <section className="mt-5 w-full max-w-[760px]">
      <div className="w-full overflow-x-auto">
        <div className="grid min-w-[540px] grid-cols-2 gap-6">
          <div>
            <div className="mb-2 text-[12px] text-text-muted" style={{ fontFamily: mono }}>
              Before regularization
            </div>
            <svg viewBox={`0 0 ${PANEL_WIDTH} ${PANEL_HEIGHT}`} className="h-auto w-full max-w-[240px]" role="img" aria-label="Before regularization weights bar chart">
              <line x1={0} y1={ZERO_Y} x2={PANEL_WIDTH} y2={ZERO_Y} stroke="var(--border-strong)" strokeWidth="1" />
              {renderBars(BASE_WEIGHTS, 'before')}
            </svg>
          </div>

          <div>
            <div className="mb-2 text-[12px] text-text-muted" style={{ fontFamily: mono }}>
              After regularization
            </div>
            <svg viewBox={`0 0 ${PANEL_WIDTH} ${PANEL_HEIGHT}`} className="h-auto w-full max-w-[240px]" role="img" aria-label="After regularization weights bar chart">
              <line x1={0} y1={ZERO_Y} x2={PANEL_WIDTH} y2={ZERO_Y} stroke="var(--border-strong)" strokeWidth="1" />
              {renderBars(regularizedWeights, 'after')}
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="lambda-slider" className="mb-2 block text-[13px] text-text-secondary" style={{ fontFamily: mono }}>
          λ (lambda)
        </label>
        <input
          id="lambda-slider"
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={lambda}
          onChange={(e) => setLambda(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mt-4 whitespace-pre-line text-[15px] text-text-primary" style={{ fontFamily: mono }}>
        {`λ = ${format(lambda, 1)}
‖w‖₂ before: ${format(beforeNorm, 2)}
‖w‖₂ after:  ${format(afterNorm, 2)}`}
      </div>

      <p
        className={`mt-4 whitespace-pre-line text-[15px] italic text-text-secondary transition-opacity duration-300 ${
          shouldShowHighLambdaNote ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {`At high lambda, all weights approach zero.
The model has 'forgotten' the training data.
This is underfitting — the other failure mode.

Regularization is a dial between memorization and forgetting.
The right lambda is somewhere in between.`}
      </p>
    </section>
  )
}

export default RegularizationSlider
