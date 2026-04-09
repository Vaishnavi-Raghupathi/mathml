import { motion, Variants } from 'framer-motion'
import { useMemo, useState } from 'react'

const openingContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3
    }
  }
}

const paragraphFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
}

const statsAnchors: Array<[number, number]> = [
  [2, 18],
  [10, 65],
  [50, 92],
  [100, 99]
]

const interpolateNearSurface = (n: number) => {
  if (n <= statsAnchors[0][0]) return statsAnchors[0][1]
  if (n >= statsAnchors[statsAnchors.length - 1][0]) return statsAnchors[statsAnchors.length - 1][1]

  for (let i = 0; i < statsAnchors.length - 1; i += 1) {
    const [n1, p1] = statsAnchors[i]
    const [n2, p2] = statsAnchors[i + 1]
    if (n >= n1 && n <= n2) {
      const t = (n - n1) / (n2 - n1)
      return p1 + (p2 - p1) * t
    }
  }

  return 99
}

const SphereEmpties = () => {
  const [dimensions, setDimensions] = useState(2)

  const sliderFillPercent = useMemo(() => ((dimensions - 2) / (100 - 2)) * 100, [dimensions])

  // Shell thickness that contains 99% of volume:
  // t = R * (1 - 0.99^(1/n))
  const shellFraction = useMemo(() => 1 - Math.pow(0.99, 1 / dimensions), [dimensions])

  const radius = 280
  const shellThicknessPx = radius * shellFraction
  const innerRadius = Math.max(0, radius - shellThicknessPx)

  const nearSurfacePct = useMemo(() => interpolateNearSurface(dimensions), [dimensions])
  const interiorPct = Math.max(0, 100 - nearSurfacePct)

  return (
    <section style={{ background: '#0a0f1e', padding: '48px 20px', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        .sphere-empties-range {
          -webkit-appearance: none;
          appearance: none;
          width: min(680px, 100%);
          height: 6px;
          border-radius: 999px;
          outline: none;
        }

        .sphere-empties-range::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: transparent;
        }

        .sphere-empties-range::-moz-range-track {
          height: 6px;
          border-radius: 999px;
          background: transparent;
        }

        .sphere-empties-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #0a0f1e;
          border: 2px solid #3b82f6;
          margin-top: -6px;
          cursor: pointer;
        }

        .sphere-empties-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #0a0f1e;
          border: 2px solid #3b82f6;
          cursor: pointer;
        }
      `}</style>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* PART 1 - Opening */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={openingContainer}>
          <motion.p variants={paragraphFade} style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
            Here is a second way high dimensions break
            intuition. Take a hypersphere of radius 1. Ask: what
            fraction of its volume sits in the interior, away
            from the surface?
          </motion.p>

          <motion.p variants={paragraphFade} style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 24 }}>
            In 2D the answer is: most of it.
            In 3D: still most of it. By 100 dimensions: almost
            none. Nearly all the volume of a high-dimensional
            sphere is concentrated in a thin shell near the surface.
            The interior is essentially empty.
          </motion.p>
        </motion.div>

        <div
          style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: 4,
            padding: 20,
            marginBottom: 42
          }}
        >
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#94a3b8' }}>
            In 2D, if you pick a random point inside a circle, it will probably land somewhere in the interior, away
            from the edge. Do you think the same is true in 100 dimensions?
          </p>
          <p style={{ margin: '14px 0 0 0', fontSize: 15, lineHeight: 1.7, color: '#e2e8f0' }}>
            No, probably near the edge. In 100 dimensions,
            over 99% of the volume sits within 5% of the radius
            from the surface. Your intuition from 3D is exactly
            wrong at scale.
          </p>
        </div>

        {/* PART 2 - Shell volume visualization */}
        <h3 style={{ color: '#f9fafb', fontSize: 28, lineHeight: 1.2, marginBottom: 24 }}>
          Volume near the surface vs interior
        </h3>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 620 620" role="img" aria-label="Hypersphere shell versus interior visualization" style={{ width: '100%', maxWidth: 620 }}>
            {/* shell region */}
            <circle cx="310" cy="310" r={radius} fill="rgba(59, 130, 246, 0.4)" />
            {/* interior region */}
            <circle cx="310" cy="310" r={innerRadius} fill="#1e3a5f" />
            {/* outer boundary stroke */}
            <circle cx="310" cy="310" r={radius} fill="none" stroke="#3b82f6" strokeWidth="1.5" />
          </svg>
        </div>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label htmlFor="sphere-dimensions" style={{ fontSize: 14, color: '#e2e8f0', marginBottom: 10 }}>
            Dimensions: {dimensions}
          </label>

          <input
            id="sphere-dimensions"
            className="sphere-empties-range"
            type="range"
            min={2}
            max={100}
            step={1}
            value={dimensions}
            onChange={(event) => setDimensions(Number(event.target.value))}
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${sliderFillPercent}%, #1e293b ${sliderFillPercent}%, #1e293b 100%)`
            }}
          />

          <div
            style={{
              marginTop: 20,
              display: 'flex',
              gap: 28,
              flexWrap: 'wrap',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 24, color: '#3b82f6' }}>
              {nearSurfacePct.toFixed(0)}% of volume near surface
            </div>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 24, color: '#94a3b8' }}>
              {interiorPct.toFixed(0)}% in interior
            </div>
          </div>

          <p style={{ marginTop: 14, fontSize: 13, lineHeight: 1.6, color: '#94a3b8', textAlign: 'center' }}>
            The shell thickness shown contains 99% of the volume.
            The interior contains almost nothing.
          </p>
        </div>

        {/* PART 3 - What this means for random initialization */}
        <div style={{ marginTop: 46 }}>
          <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
            This is why neural network weight
            initialization matters so much. If you initialize
            weights by sampling uniformly from a hypercube in
            high dimensions, nearly all your initial weight
            vectors land near the surface of the hypersphere,
            at roughly the same magnitude. The interior is
            empty. You are not getting diverse starting points.
            You are getting a shell.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 24 }}>
            Xavier and He initialization are solutions
            to this problem. They scale the initial weights by
            a factor that accounts for the number of dimensions,
            so the activations neither explode nor vanish as
            signals pass through the network. The scaling factor
            is derived from the geometry of high-dimensional spheres.
          </p>

          <div
            style={{
              background: '#1e3a5f',
              borderLeft: '3px solid #3b82f6',
              padding: '20px 24px'
            }}
          >
            <p style={{ margin: 0, color: '#e2e8f0', fontSize: 15, lineHeight: 1.7 }}>
              The formula 1/sqrt(n) in Xavier initialization is
              not a tuned hyperparameter. It is the geometric
              correction for the fact that random vectors in
              n dimensions have expected L2 norm of sqrt(n).
              Dividing by sqrt(n) normalizes them back to unit scale.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SphereEmpties
