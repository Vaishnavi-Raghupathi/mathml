import { motion } from 'framer-motion'
import { useState } from 'react'

type HookProps = {
  onComplete: () => void
}

type Choice = 'A vector pointing up-right' | 'A vector pointing right' | 'A vector pointing up'

const openingParagraphs = [
  'In 2013, a researcher at Google typed three words into a system that had never been taught arithmetic, grammar, or meaning.',
  'The result pointed almost exactly at queen.',
  'In module 1.1 we said this without being able to explain it. Now we can. That result is vector addition. And understanding it changes how you read every embedding, every attention mechanism, and every latent representation you will ever work with.'
] as const

const choices: Choice[] = ['A vector pointing up-right', 'A vector pointing right', 'A vector pointing up']

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const
    }
  }
}

const paragraphStaggerSeconds = 0.3
const paragraphFadeSeconds = 0.3
const equationElementFadeSeconds = 0.2
const equationElementStaggerSeconds = 0.15
const equationStartDelaySeconds = paragraphStaggerSeconds + paragraphFadeSeconds + 0.6
const lastEquationElementFinishSeconds =
  equationStartDelaySeconds + equationElementStaggerSeconds * 6 + equationElementFadeSeconds
const captionDelaySeconds = lastEquationElementFinishSeconds + 0.3

const EquationCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div
    className="flex h-[100px] w-[100px] flex-col items-center justify-center gap-2 rounded"
    style={{
      border: '1px solid var(--border)',
      background: 'transparent'
    }}
  >
    {children}
    <span
      style={{
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '12px',
        color: 'var(--text-primary)',
        lineHeight: 1
      }}
    >
      {label}
    </span>
  </div>
)

const EquationOperator = ({ symbol }: { symbol: string }) => (
  <span
    aria-hidden="true"
    style={{
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '28px',
      color: 'var(--text-secondary)',
      lineHeight: 1
    }}
  >
    {symbol}
  </span>
)

const CrownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 18H20" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 18L8 10L12 6L16 10L20 18" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const QueenIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 18H20" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 18L8 10L12 10L16 10L20 18" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="7" r="1.5" stroke="var(--accent)" strokeWidth="1.5" />
  </svg>
)

const ManIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="3" stroke="var(--accent)" strokeWidth="1.5" />
    <path d="M6.5 18C7.8 14.8 10 13.2 12 13.2C14 13.2 16.2 14.8 17.5 18" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const WomanIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="3" stroke="var(--accent)" strokeWidth="1.5" />
    <path d="M5.8 18C7.1 14.4 9.5 12.8 12 12.8C14.5 12.8 16.9 14.4 18.2 18" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 11.2V17" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const equationElements = [
  {
    key: 'king',
    content: (
      <EquationCard label="king">
        <CrownIcon />
      </EquationCard>
    )
  },
  { key: 'minus', content: <EquationOperator symbol="−" /> },
  {
    key: 'man',
    content: (
      <EquationCard label="man">
        <ManIcon />
      </EquationCard>
    )
  },
  { key: 'plus', content: <EquationOperator symbol="+" /> },
  {
    key: 'woman',
    content: (
      <EquationCard label="woman">
        <WomanIcon />
      </EquationCard>
    )
  },
  { key: 'approx', content: <EquationOperator symbol="≈" /> },
  {
    key: 'queen',
    content: (
      <EquationCard label="queen">
        <QueenIcon />
      </EquationCard>
    )
  }
] as const

const Hook = ({ onComplete }: HookProps) => {
  const [selected, setSelected] = useState<Choice | null>(null)

  return (
    <section className="max-w-[680px]" style={{ color: 'var(--text-primary)' }}>
      <div className="space-y-10">
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-5">
          {openingParagraphs.map((text) => (
            <motion.p key={text} variants={itemVariants} className="text-base leading-8 text-[#f9fafb]">
              {text}
            </motion.p>
          ))}

          <motion.div
            className="mx-auto my-12 flex max-w-[600px] items-center justify-center gap-3"
            style={{ marginTop: '48px', marginBottom: '48px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }}
          >
            {equationElements.map((element, index) => (
              <motion.div
                key={element.key}
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: equationElementFadeSeconds,
                  ease: 'easeOut',
                  delay: equationStartDelaySeconds + index * equationElementStaggerSeconds
                }}
              >
                {element.content}
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            className="text-center italic"
            style={{
              marginTop: '32px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              color: 'var(--text-secondary)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut', delay: captionDelaySeconds }}
          >
            No one programmed that relationship. It fell out of the geometry.
          </motion.p>
        </motion.div>

        <div className="space-y-5 rounded-xl border p-6" style={{ borderColor: 'var(--border-strong)' }}>
          <p
            className="text-[11px] font-bold uppercase"
            style={{
              color: 'var(--success)',
              letterSpacing: '1.5px'
            }}
          >
            BEFORE WE START
          </p>

          <p className="text-base leading-8" style={{ color: 'var(--text-primary)' }}>
            You have two vectors. A = [1, 0] pointing right. B = [0, 1] pointing up. What does A + B produce? Do not
            calculate. Draw it in your head.
          </p>

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
                        color: isSelected ? 'var(--success)' : 'var(--text-secondary)',
                        textDecoration: isSelected ? 'underline' : 'none',
                        textUnderlineOffset: '3px'
                  }}
                >
                  {choice}
                </button>
              )
            })}
          </div>

          {selected && (
            <div className="space-y-3">
              <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>Hold that. We will make it precise in a moment.</p>
              <button
                type="button"
                onClick={onComplete}
                className="text-sm underline underline-offset-4"
                style={{ color: 'var(--success)' }}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hook
