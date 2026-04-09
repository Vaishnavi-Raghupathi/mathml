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

const questions: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'You build a movie recommendation system using 3-dimensional vectors (romance, action, comedy). A user loves The Notebook. Your system recommends Titanic. The user hates the recommendation. What is the most likely cause?',
    options: [
      'A) The distance calculation has a bug',
      'B) The three dimensions do not capture enough of what the user actually cares about',
      'C) The vectors should store more decimal places',
      "D) Titanic's reference vector is incorrect"
    ],
    correctIndex: 1,
    explanation:
      'The geometry is working correctly on a bad representation. The user might care about pacing, tone, or whether the ending is hopeful, none of which exist in a 3-dimensional romance-action-comedy space. This is a representation design failure, not a math failure.'
  },
  {
    id: 'q2',
    text: 'Classic word embedding models like word2vec assign one vector to the word bank regardless of whether it means a river bank or a financial institution. Why is this a problem, and what does it reveal about the representation?',
    options: [
      'A) One static vector collapses multiple meanings; context-dependent embeddings are needed',
      'B) The embedding dimensionality is too low',
      'C) The optimizer is not converging',
      'D) Euclidean distance cannot be used for words'
    ],
    correctIndex: 0,
    explanation:
      'Word2vec assigns one vector per word type, not per word usage. The same token gets one point in space regardless of context. This collapses different meanings into a single representation; the vector for bank is an average of all its usages, faithful to none of them. Modern models like BERT fix this by making embeddings context-dependent: the same word gets a different vector depending on the sentence it appears in.',
    requiresReflection: true
  },
  {
    id: 'q3',
    text: 'Two news articles cover the same political event from opposite ideological perspectives. A word-frequency vector representation places them very close together in vector space. What does this tell you?',
    options: [
      'A) The distance metric is wrong',
      'B) Word frequency captures surface similarity, not semantic or argumentative similarity',
      'C) The articles are actually similar',
      'D) The vector dimensions need to be normalized'
    ],
    correctIndex: 1,
    explanation:
      'The representation is correct about what it measures. It is measuring the wrong thing for the task. Articles about the same event use similar words. But the meaning, including the argument, framing, and conclusion, can be opposite. Word-frequency vectors cannot see this. This is not a bug. It is a fundamental limit of the representation choice.'
  },
  {
    id: 'q4',
    text: 'A hiring model ranks one university above equally skilled candidates from other universities, even though explicit school ranking was removed. What is the best diagnosis?',
    options: [
  'A) Representation bias via proxy features, correlated variables still encode prestige',
      'B) The model needs more epochs',
      'C) The labels are random noise',
      'D) L2 regularization always causes this behavior'
    ],
    correctIndex: 0,
    explanation:
      'Even when explicit sensitive or prestige-like fields are removed, proxy variables remain: internship patterns, recommendation language, zip-code signals, extracurricular distributions, and historical pipeline effects. The model can reconstruct the missing signal through correlations. This is the proxy bias mechanism: bias re-enters through representation, not explicit feature names.'
  }
]

type AnswerState = {
  selectedIndex: number | null
  unlocked: boolean
  reflection: string
  optionsShown: boolean
}

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showReflectionHint, setShowReflectionHint] = useState(false)
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() =>
    Object.fromEntries(
      questions.map((q, index) => [
        q.id,
        {
          selectedIndex: null,
          unlocked: index === 0,
          reflection: '',
          optionsShown: !q.requiresReflection
        }
      ])
    )
  )

  const active = questions[currentQuestion]
  const activeState = answers[active.id]

  const isAnswered = activeState.selectedIndex !== null
  const isCorrect = isAnswered && activeState.selectedIndex === active.correctIndex

  useEffect(() => {
    const q4 = answers.q4
    if (!q4 || q4.selectedIndex === null) return

    const timeout = window.setTimeout(() => setShowReflectionHint(true), 3000)
    return () => window.clearTimeout(timeout)
  }, [answers.q4])

  const handleSelect = (index: number) => {
    if (isAnswered) return

    setAnswers((prev) => ({
      ...prev,
      [active.id]: {
        ...prev[active.id],
        selectedIndex: index
      }
    }))
  }

  const goNext = () => {
    if (!isAnswered) return

    const nextIndex = currentQuestion + 1
    if (nextIndex >= questions.length) return

    const nextId = questions[nextIndex].id
    setAnswers((prev) => ({
      ...prev,
      [nextId]: {
        ...prev[nextId],
        unlocked: true
      }
    }))
    setCurrentQuestion(nextIndex)
  }

  const answerButtonClass = useMemo(() => {
    return (optionIndex: number) => {
      if (!isAnswered) {
        return 'module11-choice-btn border-border bg-transparent text-text-primary hover:border-border-strong'
      }

      if (optionIndex === active.correctIndex) {
        return 'module11-choice-btn border-green-500 text-green-300 bg-transparent'
      }

      if (optionIndex === activeState.selectedIndex) {
        return 'module11-choice-btn border-red-500 text-red-300 bg-transparent'
      }

      return 'module11-choice-btn border-border text-text-muted bg-transparent opacity-60'
    }
  }, [active.correctIndex, activeState.selectedIndex, isAnswered])

  const canShowFinalReflection = answers.q4?.selectedIndex !== null

  return (
    <section className="max-w-[680px]">
      <div className="space-y-8">
        {questions.map((question, index) => {
          const state = answers[question.id]
          if (!state?.unlocked) return null

          const answered = state.selectedIndex !== null
          const showingOptions = state.optionsShown

          return (
            <article key={question.id} className="border border-border p-5">
              <p className="mb-4 text-[1.05em] leading-[1.8] text-text-secondary">{question.text}</p>

              {question.requiresReflection && (
                <div className="mb-4 space-y-3">
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
                    className="min-h-24 w-full border border-border bg-transparent p-3 text-sm text-text-primary outline-none placeholder:text-text-muted"
                  />

                  {!showingOptions && (
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
                      className="text-sm text-text-primary underline underline-offset-4 disabled:opacity-40"
                    >
                      Show options →
                    </button>
                  )}
                </div>
              )}

              {showingOptions && (
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={option}
                      type="button"
                      data-selected={state.selectedIndex === optionIndex}
                      data-correct={answered && optionIndex === question.correctIndex}
                      data-wrong={answered && state.selectedIndex === optionIndex && optionIndex !== question.correctIndex}
                      disabled={answered}
                      onClick={() => handleSelect(optionIndex)}
                      className={`block w-full border px-3 py-2 text-left text-sm transition ${answerButtonClass(optionIndex)}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {question.id === 'q2' && showingOptions && (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="border border-border p-3">
                    <p className="text-xs uppercase tracking-wide text-text-muted">word2vec</p>
                    <svg viewBox="0 0 240 120" className="mt-2 h-auto w-full">
                      <circle cx="120" cy="58" r="8" fill="#a78bfa" />
                      <text x="120" y="42" textAnchor="middle" fontSize="10" fill="#cbd5e1">
                        bank (fixed)
                      </text>
                    </svg>
                  </div>

                  <div className="border border-border p-3">
                    <p className="text-xs uppercase tracking-wide text-text-muted">BERT</p>
                    <svg viewBox="0 0 240 120" className="mt-2 h-auto w-full">
                      <circle cx="74" cy="56" r="8" fill="#38bdf8" />
                      <circle cx="166" cy="60" r="8" fill="#f472b6" />
                      <text x="74" y="40" textAnchor="middle" fontSize="10" fill="#bae6fd">
                        bank (river)
                      </text>
                      <text x="166" y="44" textAnchor="middle" fontSize="10" fill="#fbcfe8">
                        bank (finance)
                      </text>
                    </svg>
                  </div>
                </div>
              )}

              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4"
                >
                  <p className="text-sm text-text-secondary">{question.explanation}</p>
                </motion.div>
              )}

              {question.id === 'q4' && answered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 border border-border p-3"
                >
                  <p className="text-sm text-text-secondary">
                    Representation bias is rarely explicit. It lives in correlations between what you included and what you didn&apos;t.
                  </p>
                </motion.div>
              )}

              {answered && index < questions.length - 1 && currentQuestion === index && (
                <button
                  type="button"
                  onClick={goNext}
                  className="mt-4 text-sm text-text-primary underline underline-offset-4"
                >
                  Next Question →
                </button>
              )}

              {answered && (
                <p className={`mt-3 text-xs ${isCorrect && currentQuestion === index ? 'text-green-400' : 'text-text-muted'}`}>
                  {state.selectedIndex === question.correctIndex ? 'Correct' : 'Answer locked'}
                </p>
              )}
            </article>
          )
        })}

        {canShowFinalReflection && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4 border border-border p-5">
            <p className="italic text-text-secondary">
              You have a 768-dimensional vector. Someone tells you it represents a sentence. What would you need to know before you could say anything meaningful about it?
            </p>

            {showReflectionHint && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="text-sm text-text-muted">
                Think about: what model produced it, what it was trained on, what the axes represent, and whether the distance metric used downstream matches the geometry of this space.
              </motion.p>
            )}
          </motion.div>
        )}

        {canShowFinalReflection && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.05 }} className="space-y-4 border border-border p-5">
            <p className="whitespace-pre-line text-text-secondary">
              {`L2 is not the only norm.

L1 norm: add the absolute values of the components.

‖v‖₁ = |v₁| + |v₂| + ... + |vₙ|

For v = [3, 4]:   ‖v‖₁ = 3 + 4 = 7
For v = [3, 4]:   ‖v‖₂ = 5

Different definitions of 'how big.'`}
            </p>

            <Link
              to="/module/1/2"
              className="inline-flex items-center rounded bg-[#7c3aed] px-4 py-2 text-sm font-medium text-white no-underline transition hover:bg-[#6d28d9]"
            >
              Continue to Norms →
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
