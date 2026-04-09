import { motion, Variants } from 'framer-motion'
import { useMemo } from 'react'

const openingContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.3 } }
}

const paragraphVariant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }
}

const cardsContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

const cardVariant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }
}

type DataPoint = {
  x: number
  y: number
}

const chartData: DataPoint[] = Array.from({ length: 10 }, (_, i) => {
  const x = i + 1
  return { x, y: Math.pow(10, x) }
})

const curses = [
  {
    eyebrow: 'CURSE 01',
    title: 'Distances become uninformative',
    body: `As dimensions grow, the ratio of the maximum
to minimum distance between points approaches 1.
Every point is approximately equidistant from
every other. Nearest neighbor search degrades to
random selection.`,
    consequence: `Affects: k-NN classifiers, retrieval systems,
any distance-based similarity metric.`
  },
  {
    eyebrow: 'CURSE 02',
    title: 'Data becomes impossibly sparse',
    body: `The volume of a high-dimensional space grows
exponentially with dimension. A fixed dataset covers
an exponentially smaller fraction of the space with
each added dimension. The model sees almost none
of the space it needs to generalize over.`,
    consequence: `Affects: any model that needs to
interpolate between training examples, which is
all of them.`
  },
  {
    eyebrow: 'CURSE 03',
    title: 'Optimization landscapes become harder',
    body: `In high dimensions, the number of saddle
points grows exponentially relative to local minima.
Early neural network research mistakenly blamed
local minima for training failures. The real problem
was saddle points, which are a high-dimensional
geometric phenomenon.`,
    consequence: `Affects: gradient descent in
deep networks, why momentum and adaptive learning
rates help.`
  }
]

const CurseOfDimensionality = () => {
  const chartGeometry = useMemo(() => {
    const width = 760
    const height = 380

    const margin = {
      top: 26,
      right: 30,
      bottom: 52,
      left: 70
    }

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const xToPx = (x: number) => margin.left + ((x - 1) / 9) * innerWidth
    const yToPx = (value: number) => {
      const logMin = 1 // 10^1
      const logMax = 10 // 10^10
      const logValue = Math.log10(value)
      const t = (logValue - logMin) / (logMax - logMin)
      return margin.top + innerHeight - t * innerHeight
    }

    const linePath = chartData
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xToPx(point.x)} ${yToPx(point.y)}`)
      .join(' ')

    const yLabels = [10, 100, 1000, 10000, 100000]

    return { width, height, margin, innerWidth, innerHeight, xToPx, yToPx, linePath, yLabels }
  }, [])

  return (
    <section style={{ background: '#0a0f1e', padding: '48px 20px', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* PART 1 - Opening */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={openingContainer}>
          <motion.p variants={paragraphVariant} style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
            Both effects we just saw, distance
            concentration and the empty interior, are facets
            of the same underlying phenomenon. It has a name:
            the curse of dimensionality.
          </motion.p>

          <motion.p variants={paragraphVariant} style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 36 }}>
            The curse is not a single theorem.
            It is a collection of geometric facts about
            high-dimensional spaces that all point in the same
            direction: the more dimensions you add, the more
            data you need to cover the space, the less
            informative distances become, and the harder
            it is to generalize from examples.
          </motion.p>
        </motion.div>

        {/* PART 2 - Data requirement visualization */}
        <h3 style={{ color: '#f9fafb', fontSize: 28, lineHeight: 1.2, marginBottom: 12 }}>How much data to cover the space?</h3>

        <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 22 }}>
          Suppose you want your training data
          to cover 10% of the range of each input feature.
          How many data points do you need as dimensions grow?
        </p>

        <div style={{ marginBottom: 12 }}>
          <svg
            viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`}
            role="img"
            aria-label="Data points needed to cover 10 percent in increasing dimensions"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {/* axes */}
            <line
              x1={chartGeometry.margin.left}
              y1={chartGeometry.margin.top + chartGeometry.innerHeight}
              x2={chartGeometry.margin.left + chartGeometry.innerWidth}
              y2={chartGeometry.margin.top + chartGeometry.innerHeight}
              stroke="#1e293b"
              strokeWidth="1"
            />
            <line
              x1={chartGeometry.margin.left}
              y1={chartGeometry.margin.top}
              x2={chartGeometry.margin.left}
              y2={chartGeometry.margin.top + chartGeometry.innerHeight}
              stroke="#1e293b"
              strokeWidth="1"
            />

            {/* x ticks and labels 1..10 */}
            {Array.from({ length: 10 }, (_, i) => i + 1).map((x) => {
              const px = chartGeometry.xToPx(x)
              const yAxisBase = chartGeometry.margin.top + chartGeometry.innerHeight
              return (
                <g key={`x-${x}`}>
                  <line x1={px} y1={yAxisBase} x2={px} y2={yAxisBase + 5} stroke="#1e293b" strokeWidth="1" />
                  <text
                    x={px}
                    y={yAxisBase + 19}
                    textAnchor="middle"
                    style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fill: '#475569' }}
                  >
                    {x}
                  </text>
                </g>
              )
            })}

            {/* y ticks and labels */}
            {chartGeometry.yLabels.map((value) => {
              const py = chartGeometry.yToPx(value)
              return (
                <g key={`y-${value}`}>
                  <line x1={chartGeometry.margin.left - 5} y1={py} x2={chartGeometry.margin.left} y2={py} stroke="#1e293b" strokeWidth="1" />
                  <text
                    x={chartGeometry.margin.left - 9}
                    y={py + 4}
                    textAnchor="end"
                    style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fill: '#475569' }}
                  >
                    {value}
                  </text>
                </g>
              )
            })}

            {/* animated line */}
            <motion.path
              d={chartGeometry.linePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: 'linear' }}
            />

            {/* points */}
            {chartData.map((point) => (
              <circle key={`point-${point.x}`} cx={chartGeometry.xToPx(point.x)} cy={chartGeometry.yToPx(point.y)} r="3" fill="#3b82f6" />
            ))}
          </svg>
        </div>

        <p style={{ fontSize: 13, lineHeight: 1.6, color: '#94a3b8', marginBottom: 36 }}>
          Covering 10% of a 10-dimensional space requires
          10 billion points. This is not a data engineering
          problem. It is a geometry problem.
        </p>

        {/* PART 3 - Three curse cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={cardsContainer}
          style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}
        >
          {curses.map((curse) => (
            <motion.article
              key={curse.eyebrow}
              variants={cardVariant}
              style={{
                width: '100%',
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: 4,
                padding: '28px 32px'
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: '#3b82f6',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontWeight: 600
                }}
              >
                {curse.eyebrow}
              </p>

              <h3 style={{ marginTop: 10, marginBottom: 14, color: '#f9fafb', fontSize: 26, lineHeight: 1.2 }}>{curse.title}</h3>

              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: '#e2e8f0', whiteSpace: 'pre-line' }}>{curse.body}</p>

              <p style={{ marginTop: 14, marginBottom: 0, fontSize: 14, lineHeight: 1.6, color: '#94a3b8', whiteSpace: 'pre-line' }}>
                {curse.consequence}
              </p>
            </motion.article>
          ))}
        </motion.div>

        {/* PART 4 - Why ML works anyway */}
        <div style={{ background: '#1e3a5f', borderLeft: '3px solid #3b82f6', padding: '20px 24px' }}>
          <p style={{ margin: 0, color: '#e2e8f0', fontSize: 15, lineHeight: 1.75 }}>
            If high dimensions are so hostile, why does deep
            learning work at all? Because real data does not
            fill high-dimensional space uniformly. Natural
            images, sentences, audio, molecular structures,
            all live on low-dimensional manifolds inside
            high-dimensional spaces. A 768-dimensional sentence
            embedding looks terrifying geometrically. But the
            sentences humans actually write occupy a tiny,
            structured corner of that space. Learning is
            possible because the data has structure that
            the curse cannot touch.
          </p>
        </div>
      </div>
    </section>
  )
}

export default CurseOfDimensionality
