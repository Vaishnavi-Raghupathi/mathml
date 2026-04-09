import { motion } from 'framer-motion'
import { useState } from 'react'

type HookProps = {
  onComplete: () => void
}

type Choice = 'A is bigger' | 'B is bigger' | 'They are the same size'

const paragraphs = [
  'You have two models. Both trained on the same data. Both achieve similar accuracy on the test set.',
  'You deploy the first one. It works well for a few weeks, then starts making increasingly confident wrong predictions on new data. The second one degrades more slowly. It generalizes better.',
  'The only difference between them: one was trained with a penalty on the size of its weights. The other was not.',
  'That penalty is called regularization. And it is just arithmetic on the size of a vector.',
  'Before we get there, what does size even mean for a vector?'
]

const choices: Choice[] = ['A is bigger', 'B is bigger', 'They are the same size']

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
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const
    }
  }
}

const Hook = ({ onComplete }: HookProps) => {
  const [selected, setSelected] = useState<Choice | null>(null)

  return (
    <section className="max-w-[680px] text-[#f9fafb]">
      <div className="space-y-10">
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-5">
          {paragraphs.map((text) => (
            <motion.p key={text} variants={itemVariants} className="text-base leading-8 text-[#f9fafb]">
              {text}
            </motion.p>
          ))}
        </motion.div>

        <div className="space-y-5">
          <div className="grid gap-2 text-base text-[#f9fafb] md:grid-cols-2">
            <p className="font-mono text-[#dbeafe]">A = [3, 0, 0]</p>
            <p className="font-mono text-[#dbeafe]">B = [1, 1, 1]</p>
          </div>

          <p className="text-base leading-7 text-[#f9fafb]">
            Which one is bigger? Do not calculate. Just intuition first.
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

          {selected && (
            <div className="space-y-3">
              <p className="text-sm text-[#cbd5e1]">Hold that answer. We will come back to it.</p>
              <button
                type="button"
                onClick={onComplete}
                className="text-sm text-[#60a5fa] underline underline-offset-4"
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
