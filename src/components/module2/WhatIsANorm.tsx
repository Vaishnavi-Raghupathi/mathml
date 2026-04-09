import { motion } from 'framer-motion'
import { useState } from 'react'

const openingLines = [
  'A norm is a function that takes a vector and returns a single number representing its size.',
  'That sounds simple. It is simple. But the word size is doing a lot of work here, and there is more than one way to define it.'
]

const l2Formula = '‖v‖₂ = √(v₁² + v₂² + ... + vₙ²)'

const animationDelays = {
  step1: 0.15,
  step2: 0.2,
  step3: 0.25,
  step4: 0.3
}

const WhatIsANorm = () => {
  const [visibleSteps, setVisibleSteps] = useState(1)

  const canAdvance = visibleSteps < 4

  return (
    <section className="max-w-[860px] space-y-12 text-[#f9fafb]">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.28 } }
        }}
        className="space-y-5"
      >
        {openingLines.map((line) => (
          <motion.p
            key={line}
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-base leading-8 text-[#f9fafb]"
          >
            {line}
          </motion.p>
        ))}

        <motion.div
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="border-l-2 pl-4"
          style={{ borderColor: '#a78bfa' }}
        >
          <p className="text-sm leading-7 text-[#ddd6fe]">
            A norm is not the length of the vector in the sense of how many elements it has. It is a measure of
            magnitude, how far the vector reaches from the origin.
          </p>
        </motion.div>
      </motion.div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[#dbeafe]">Vector as an arrow from origin</h3>
        <div className="overflow-x-auto">
          <svg viewBox="0 0 420 320" className="h-auto w-full max-w-[560px]" role="img" aria-label="2D vector plot">
            <defs>
              <marker id="vector-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#60a5fa" />
              </marker>
            </defs>

            <rect x="0" y="0" width="420" height="320" fill="transparent" />

            {Array.from({ length: 9 }).map((_, i) => {
              const x = 50 + i * 40
              const y = 20 + i * 35
              return (
                <g key={i}>
                  <line x1={x} y1={20} x2={x} y2={300} stroke="#1f2937" strokeWidth="1" />
                  <line x1={50} y1={y} x2={370} y2={y} stroke="#1f2937" strokeWidth="1" />
                </g>
              )
            })}

            <line x1={50} y1={160} x2={370} y2={160} stroke="#6b7280" strokeWidth="1.3" />
            <line x1={210} y1={20} x2={210} y2={300} stroke="#6b7280" strokeWidth="1.3" />

            <line
              x1={210}
              y1={160}
              x2={330}
              y2={90}
              stroke="#60a5fa"
              strokeWidth="3"
              markerEnd="url(#vector-arrow)"
            />

            <line x1={330} y1={90} x2={330} y2={160} stroke="#93c5fd" strokeDasharray="5 5" strokeWidth="1.5" />
            <line x1={210} y1={90} x2={330} y2={90} stroke="#93c5fd" strokeDasharray="5 5" strokeWidth="1.5" />

            <text x={336} y={84} fill="#dbeafe" fontSize="14">
              v = [3, 2]
            </text>
            <text x={266} y={177} fill="#bfdbfe" fontSize="13">
              3
            </text>
            <text x={196} y={126} fill="#bfdbfe" fontSize="13">
              2
            </text>

            <text x={375} y={165} fill="#9ca3af" fontSize="11">
              x
            </text>
            <text x={214} y={14} fill="#9ca3af" fontSize="11">
              y
            </text>
          </svg>
        </div>
        <p className="text-sm text-[#cbd5e1]">The norm answers one question: how long is this arrow?</p>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-medium text-[#dbeafe]">The L2 Norm (Euclidean)</h3>

        <div className="space-y-4">
          {visibleSteps >= 1 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <p className="text-sm text-[#cbd5e1]">Step 1: Square each component.</p>
              <div className="font-mono text-base text-[#e2e8f0]">
                <span>[3, 2]</span>
                <span className="px-2 text-[#64748b]">→</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: animationDelays.step1 }}
                >
                  [
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: animationDelays.step1 + 0.1 }}
                  className="text-[#93c5fd]"
                >
                  9
                </motion.span>
                <span>, </span>
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: animationDelays.step1 + 0.2 }}
                  className="text-[#93c5fd]"
                >
                  4
                </motion.span>
                <span>]</span>
              </div>
            </motion.div>
          )}

          {visibleSteps >= 2 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <p className="text-sm text-[#cbd5e1]">Step 2: Sum the squares.</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: animationDelays.step2 }}
                className="font-mono text-base text-[#93c5fd]"
              >
                9 + 4 = 13
              </motion.p>
            </motion.div>
          )}

          {visibleSteps >= 3 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <p className="text-sm text-[#cbd5e1]">Step 3: Take the square root.</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: animationDelays.step3 }}
                className="font-mono text-base text-[#93c5fd]"
              >
                √13 = 3.606
              </motion.p>
            </motion.div>
          )}

          {visibleSteps >= 4 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <p className="text-sm text-[#cbd5e1]">Step 4:</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: animationDelays.step4 }}
                className="font-mono text-base text-[#60a5fa]"
              >
                {l2Formula}
              </motion.p>
              <p className="text-sm leading-7 text-[#cbd5e1]">
                This is the straight-line distance from the origin to the tip of the vector. The same formula you used
                to compute distance between movies in module 1, just applied to a single vector measured from zero.
              </p>
            </motion.div>
          )}
        </div>

        <button
          type="button"
          disabled={!canAdvance}
          onClick={() => setVisibleSteps((current) => Math.min(current + 1, 4))}
          className="text-sm transition-colors disabled:cursor-not-allowed"
          style={{ color: canAdvance ? '#60a5fa' : '#64748b' }}
        >
          {canAdvance ? 'Next Step' : 'All steps shown'}
        </button>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-medium text-[#dbeafe]">Back to pause and predict</h3>

        <div className="grid gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35 }}
            className="space-y-2"
          >
            <p className="font-mono text-base text-[#dbeafe]">A = [3, 0, 0]</p>
            <p className="font-mono text-sm text-[#93c5fd]">
              {'‖A‖'}
              <sub>2</sub> = √(3<sup>2</sup> + 0<sup>2</sup> + 0<sup>2</sup>) = √9 = 3.0
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="space-y-2"
          >
            <p className="font-mono text-base text-[#dbeafe]">B = [1, 1, 1]</p>
            <p className="font-mono text-sm text-[#93c5fd]">
              {'‖B‖'}
              <sub>2</sub> = √(1<sup>2</sup> + 1<sup>2</sup> + 1<sup>2</sup>) = √3 = 1.732
            </p>
          </motion.div>
        </div>

        <p className="text-sm leading-7 text-[#cbd5e1]">
          A is bigger by L2. All of A&apos;s magnitude is concentrated in one direction. B spreads it evenly across three.
          Same intuition as before, now with a number attached.
        </p>

        <p className="text-base text-[#e2e8f0]">
          But is concentrated magnitude always bigger in a meaningful sense? That depends on what you are trying to
          measure.
        </p>

        <p className="text-sm text-[#93c5fd]">Next: L1</p>
      </div>
    </section>
  )
}

export default WhatIsANorm
