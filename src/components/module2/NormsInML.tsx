import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

const magnitude = (x: number, y: number) => Math.sqrt(x * x + y * y)
const distance = (a: [number, number], b: [number, number]) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

const normalize = (v: [number, number]): [number, number] => {
  const m = magnitude(v[0], v[1])
  if (m === 0) return [0, 0]
  return [v[0] / m, v[1] / m]
}

const interactiveToX = (x: number) => 180 + x * 48
const interactiveToY = (y: number) => 170 - y * 48

const gradientToX = (x: number) => 190 + x * 24
const gradientToY = (y: number) => 160 - y * 24

const NormsInML = () => {
  const [scale, setScale] = useState(1)
  const [normalizeBoth, setNormalizeBoth] = useState(false)

  const baseDirection = useMemo<[number, number]>(() => [0.6, 0.8], [])
  const referenceVector = useMemo<[number, number]>(() => [0.72, 0.96], [])

  const scaledVector = useMemo<[number, number]>(() => [baseDirection[0] * scale, baseDirection[1] * scale], [baseDirection, scale])

  const shownA = normalizeBoth ? normalize(scaledVector) : scaledVector
  const shownB = normalizeBoth ? normalize(referenceVector) : referenceVector

  const shownDistance = distance(shownA, shownB)

  const gradVector = useMemo<[number, number]>(() => [5.3, 1.7], [])
  const threshold = 3
  const gradNorm = magnitude(gradVector[0], gradVector[1])
  const clippingScale = gradNorm > threshold ? threshold / gradNorm : 1
  const clippedGradient: [number, number] = [gradVector[0] * clippingScale, gradVector[1] * clippingScale]

  return (
    <section className="max-w-[940px] space-y-12 text-[#f9fafb]">
      <div className="space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.35 }}
          className="text-base leading-8"
        >
          Norms appear in three places in almost every ML system you will ever build. Not as theory. As decisions that
          change what your model learns.
        </motion.p>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-medium text-[#dbeafe]">1. Regularization</h3>

        <p className="text-sm leading-7 text-[#cbd5e1]">
          When you train a model, you minimize a loss function. Regularization adds a norm of the weights to that
          loss.
        </p>

        <p className="font-mono text-base text-[#93c5fd]">Total loss = prediction error + lambda * ||weights||</p>

        <p className="text-sm leading-7 text-[#cbd5e1]">
          Lambda controls the tradeoff. Larger lambda means you penalize large weights more heavily. The model is
          forced to find a solution that is both accurate and small.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#dbeafe]">L2 regularization (Ridge)</p>
            <p className="text-sm text-[#cbd5e1]">use when you think all features matter a little</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-[#dbeafe]">L1 regularization (Lasso)</p>
            <p className="text-sm text-[#cbd5e1]">use when you think most features are irrelevant</p>
          </div>
        </div>

        <p className="text-sm leading-7 text-[#cbd5e1]">
          This is not a hyperparameter to tune blindly. It is a statement about your belief about the structure of the
          problem.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-[#dbeafe]">2. Normalization</h3>

        <p className="text-sm leading-7 text-[#cbd5e1]">
          Before feeding data to a model, you often divide each vector by its norm. This is called normalizing.
        </p>

        <div className="space-y-3">
          <svg viewBox="0 0 500 250" className="h-auto w-full max-w-[620px]" role="img" aria-label="Vector normalization [3,4] to [0.6,0.8]">
            <line x1="40" y1="200" x2="220" y2="200" stroke="#475569" strokeWidth="1.2" />
            <line x1="130" y1="30" x2="130" y2="220" stroke="#475569" strokeWidth="1.2" />

            <line x1="130" y1="200" x2="184" y2="128" stroke="#60a5fa" strokeWidth="3" />
            <circle cx="184" cy="128" r="4" fill="#60a5fa" />
            <text x="192" y="124" fill="#bfdbfe" fontSize="12">
              [3, 4]
            </text>

            <text x="246" y="122" fill="#cbd5e1" fontSize="12">
              divide by ‖v‖₂ = 5.0
            </text>
            <text x="246" y="144" fill="#93c5fd" fontSize="12">
              [0.6, 0.8]
            </text>

            <line x1="320" y1="200" x2="470" y2="200" stroke="#475569" strokeWidth="1.2" />
            <line x1="395" y1="30" x2="395" y2="220" stroke="#475569" strokeWidth="1.2" />
            <circle cx="395" cy="200" r="60" fill="none" stroke="#334155" strokeDasharray="4 4" />
            <line x1="395" y1="200" x2="431" y2="152" stroke="#f59e0b" strokeWidth="3" />
            <circle cx="431" cy="152" r="4" fill="#f59e0b" />
          </svg>

          <p className="text-sm leading-7 text-[#cbd5e1]">
            After normalization, all vectors live on the unit sphere. Only direction matters, not magnitude. This
            matters when your features have very different scales, or when you care about the angle between vectors
            more than the distance.
          </p>
        </div>

        <div className="space-y-4">
          <label htmlFor="magnitude-scale" className="block text-sm text-[#cbd5e1]">
            Change magnitude (direction fixed): {scale.toFixed(2)}
          </label>
          <input
            id="magnitude-scale"
            type="range"
            min={0.35}
            max={3}
            step={0.01}
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
            className="w-full accent-[#60a5fa]"
          />

          <button
            type="button"
            onClick={() => setNormalizeBoth((current) => !current)}
            className="text-sm transition-colors"
            style={{ color: normalizeBoth ? '#60a5fa' : '#cbd5e1', textDecoration: normalizeBoth ? 'underline' : 'none', textUnderlineOffset: '3px' }}
          >
            normalize both
          </button>

          <div className="overflow-x-auto">
            <svg viewBox="0 0 380 340" className="h-auto min-w-[360px] w-full max-w-[460px]" role="img" aria-label="Distance with optional normalization">
              <line x1="20" y1="170" x2="360" y2="170" stroke="#475569" strokeWidth="1" />
              <line x1="180" y1="20" x2="180" y2="320" stroke="#475569" strokeWidth="1" />

              <motion.line
                x1={180}
                y1={170}
                x2={interactiveToX(shownA[0])}
                y2={interactiveToY(shownA[1])}
                stroke="#60a5fa"
                strokeWidth="3"
                animate={{ x2: interactiveToX(shownA[0]), y2: interactiveToY(shownA[1]) }}
                transition={{ duration: 0.25 }}
              />
              <motion.line
                x1={180}
                y1={170}
                x2={interactiveToX(shownB[0])}
                y2={interactiveToY(shownB[1])}
                stroke="#f59e0b"
                strokeWidth="3"
                animate={{ x2: interactiveToX(shownB[0]), y2: interactiveToY(shownB[1]) }}
                transition={{ duration: 0.25 }}
              />

              <line
                x1={interactiveToX(shownA[0])}
                y1={interactiveToY(shownA[1])}
                x2={interactiveToX(shownB[0])}
                y2={interactiveToY(shownB[1])}
                stroke="#cbd5e1"
                strokeDasharray="4 4"
              />

              <text x={16} y={326} fill="#cbd5e1" fontSize="12">
                Distance: {shownDistance.toFixed(3)}
              </text>
            </svg>
          </div>

          <p className="text-sm text-[#cbd5e1]">Normalization removes magnitude from the comparison entirely.</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-[#dbeafe]">3. Gradient Clipping</h3>

        <p className="text-sm leading-7 text-[#cbd5e1]">
          During training, gradients can become very large. When the L2 norm of the gradient exceeds a threshold, you
          scale the whole gradient down so its norm equals the threshold.
        </p>

        <p className="font-mono text-sm leading-7 text-[#93c5fd]">
          {'if ‖gradient‖'}
          <sub>2</sub> &gt; threshold: gradient = gradient × (threshold / {'‖gradient‖'}
          <sub>2</sub>)
        </p>

        <p className="text-sm leading-7 text-[#cbd5e1]">
          This is just norm computation followed by rescaling. It prevents a single bad batch from destroying your
          model&apos;s weights.
        </p>

        <svg viewBox="0 0 380 320" className="h-auto w-full max-w-[460px]" role="img" aria-label="Gradient clipping visual">
          <line x1="20" y1="160" x2="360" y2="160" stroke="#475569" strokeWidth="1" />
          <line x1="190" y1="20" x2="190" y2="300" stroke="#475569" strokeWidth="1" />

          <circle cx="190" cy="160" r="96" fill="none" stroke="#334155" strokeDasharray="4 4" />
          <text x="292" y="160" fill="#94a3b8" fontSize="11">
            threshold
          </text>

          <line
            x1="190"
            y1="160"
            x2={gradientToX(gradVector[0])}
            y2={gradientToY(gradVector[1])}
            stroke="#f87171"
            strokeWidth="3"
          />

          <motion.line
            x1="190"
            y1="160"
            initial={{ x2: gradientToX(gradVector[0]), y2: gradientToY(gradVector[1]) }}
            animate={{ x2: gradientToX(clippedGradient[0]), y2: gradientToY(clippedGradient[1]) }}
            transition={{ duration: 0.8, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', repeatDelay: 0.7 }}
            stroke="#60a5fa"
            strokeWidth="3"
          />
        </svg>

        <p className="text-sm text-[#cbd5e1]">
          Gradient clipping is why training deep networks does not explode. It is a norm check happening thousands of
          times per second.
        </p>
      </div>
    </section>
  )
}

export default NormsInML
