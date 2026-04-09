import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type QuizQuestion = {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  requiresReflection?: boolean
}

type AnswerState = {
  selectedIndex: number | null
  reflection: string
  optionsShown: boolean
}

const questions: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'You are building a model with 1000 input features. You suspect that only 20 or 30 of them actually carry useful signal. Which regularization norm should you use and why?',
    options: [
      'A) L2, because it shrinks all weights uniformly',
      'B) L1, because it tends to zero out irrelevant features entirely',
      'C) Neither, regularization hurts performance',
      'D) L2, because it has a smoother gradient'
    ],
    correctIndex: 1,
    explanation:
      'L1 regularization produces sparse solutions. In a problem where most features are irrelevant, you want a norm that forces irrelevant weights to exactly zero. L2 would keep all 1000 features with small nonzero weights, which is slower to serve and harder to interpret. The norm choice is a prior belief about the structure of your problem.',
    requiresReflection: true
  },
  {
    id: 'q2',
    text: 'Two vectors: A = [0, 0, 10] and B = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]. Under L2, A has norm 10 and B has norm 9.49. Under L1, A has norm 10 and B has norm 30. A regularization system using L1 would penalize B much more heavily than A. Is this behavior desirable or not? It depends on what?',
    options: [
      'A) It depends on how many dimensions the data has',
      'B) It depends on whether you want to encourage sparse solutions or distributed ones',
      'C) It depends on the learning rate',
      'D) It depends on whether the features are normalized'
    ],
    correctIndex: 1,
    explanation:
      'L1 penalizes B heavily because B spreads magnitude across many dimensions. If you want your model to use a few features strongly, L1 encourages A-like weight patterns. If you want your model to use many features weakly, L2 is more appropriate. Neither is universally correct. It is a structural assumption about how the answer lives in your feature space.'
  },
  {
    id: 'q3',
    text: 'A teammate proposes normalizing all input vectors to unit length as a preprocessing step. What is the one question you must ask before agreeing?',
    options: [
      'A) What is the dimensionality of the vectors',
      'B) Does the magnitude of the vectors carry any signal we care about',
      'C) What norm are we using for normalization',
      'D) Will this slow down training'
    ],
    correctIndex: 1,
    explanation:
      'Normalizing removes magnitude from every comparison. If two documents differ mainly in length, or two signals differ mainly in amplitude, normalization destroys that information. The question is always: is direction the only thing that matters here? If magnitude carries signal, do not normalize it away.'
  },
  {
    id: 'q4',
    text: 'A model trains fine for 10 epochs then the loss becomes NaN on epoch 11. The most likely cause is an exploding gradient. What is the fastest fix and what does it do geometrically?',
    options: [
      'A) Reduce the learning rate, which shrinks all weight updates uniformly',
      'B) Add gradient clipping, which rescales the gradient vector when its norm exceeds a threshold',
      'C) Switch from L2 to L1 regularization',
      'D) Increase batch size to stabilize gradient estimates'
    ],
    correctIndex: 1,
    explanation:
      'Gradient clipping computes the L2 norm of the gradient and if it exceeds a threshold, rescales the gradient so its norm equals the threshold exactly. Geometrically: the gradient vector is projected onto a sphere of radius equal to the threshold. The direction is preserved, only the magnitude is bounded. This is faster to try than reducing learning rate and addresses the root cause directly.'
  }
]

export default function Quiz() {
  const [visibleCards, setVisibleCards] = useState(1)
  const [showReflectionHint, setShowReflectionHint] = useState(false)
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() =>
    Object.fromEntries(
      questions.map((q) => [
        q.id,
        {
          selectedIndex: null,
          reflection: '',
          optionsShown: !q.requiresReflection
        }
      ])
    )
  )

  useEffect(() => {
    const q4 = answers.q4
    if (!q4 || q4.selectedIndex === null) return

    const timeout = window.setTimeout(() => setShowReflectionHint(true), 3000)
    return () => window.clearTimeout(timeout)
  }, [answers.q4])

  const onSelect = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex]
    if (answers[question.id].selectedIndex !== null) return

    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        ...prev[question.id],
        selectedIndex: optionIndex
      }
    }))

    if (questionIndex < questions.length - 1) {
      window.setTimeout(() => {
        setVisibleCards((current) => Math.max(current, questionIndex + 2))
      }, 220)
    }
  }

  const answerButtonClass = useMemo(() => {
    return (question: QuizQuestion, selectedIndex: number | null, optionIndex: number) => {
      if (selectedIndex === null) {
        return 'border-[#334155] text-[#e2e8f0] hover:border-[#60a5fa]'
      }

      if (optionIndex === question.correctIndex) {
        return 'border-green-500 text-green-300'
      }

      if (optionIndex === selectedIndex) {
        return 'border-red-500 text-red-300'
      }

      return 'border-[#334155] text-[#94a3b8] opacity-70'
    }
  }, [])

  const showPostQuiz = answers.q4?.selectedIndex !== null

  return (
    <section className="max-w-[860px]">
      <div className="space-y-8">
        {questions.map((question, index) => {
          if (index + 1 > visibleCards) return null

          const state = answers[question.id]
          const isAnswered = state.selectedIndex !== null

          return (
            <article key={question.id} className="space-y-4 border border-[#334155] p-5">
              <p className="text-[1.02em] leading-[1.8] text-[#cbd5e1]">{question.text}</p>

              {question.requiresReflection && (
                <div className="space-y-3">
                  <textarea
                    value={state.reflection}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: {
                          ...prev[question.id],
                          reflection: event.target.value
                        }
                      }))
                    }
                    placeholder="Write your thought first..."
                    className="min-h-24 w-full border border-[#334155] bg-transparent p-3 text-sm text-[#f8fafc] outline-none placeholder:text-[#94a3b8]"
                  />

                  {!state.optionsShown && (
                    <button
                      type="button"
                      disabled={state.reflection.trim().length === 0}
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: {
                            ...prev[question.id],
                            optionsShown: true
                          }
                        }))
                      }
                      className="text-sm text-[#e2e8f0] underline underline-offset-4 disabled:opacity-40"
                    >
                      Show options
                    </button>
                  )}
                </div>
              )}

              {state.optionsShown && (
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={option}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => onSelect(index, optionIndex)}
                      className={`block w-full border px-3 py-2 text-left text-sm transition ${answerButtonClass(
                        question,
                        state.selectedIndex,
                        optionIndex
                      )}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {isAnswered && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm leading-7 text-[#cbd5e1]"
                >
                  {question.explanation}
                </motion.p>
              )}
            </article>
          )
        })}

        {showPostQuiz && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4 border border-[#334155] p-5">
            <p className="italic text-[#cbd5e1]">
              You have a model that is underperforming. You suspect it is memorizing noise. Before you change the
              architecture, what two norm-related questions would you ask first?
            </p>

            {showReflectionHint && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="text-sm text-[#94a3b8]"
              >
                Think about: whether regularization is applied and which norm, whether input vectors are normalized and
                whether they should be, and whether training is stable or showing signs of gradient issues.
              </motion.p>
            )}
          </motion.div>
        )}

        {showPostQuiz && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.05 }} className="space-y-4 border border-[#334155] p-5">
            <p className="text-[#cbd5e1]">
              We have been measuring the size of a single vector. But what about the relationship between two vectors?
              Not how big they are, but how aligned they are. Two vectors can be the same size and point in completely
              opposite directions. That relationship, the angle between vectors, is what the dot product measures.
            </p>
            <p className="text-[#cbd5e1]">That is where we are going next.</p>

            <Link
              to="/module/1/3"
              className="inline-flex items-center rounded bg-[#7c3aed] px-4 py-2 text-sm font-medium text-white no-underline transition hover:bg-[#6d28d9]"
            >
              Continue to Dot Product
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
