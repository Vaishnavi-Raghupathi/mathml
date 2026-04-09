import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  onComplete?: () => void
}

type QuizQuestion = {
  id: 'q1' | 'q2' | 'q3' | 'q4'
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  requiresReasoning?: boolean
}

type AnswerState = {
  selectedIndex: number | null
  reasoning: string
  optionsShown: boolean
}

const questions: QuizQuestion[] = [
  {
    id: 'q1',
    text: `You are building a nearest-neighbor retrieval system.
In testing with 1,000 documents it works well. At
1 million documents the quality collapses. The top
results all have nearly identical similarity scores.
What is the most likely geometric cause?`,
    options: [
      'A) The embedding model needs to be retrained on more data',
      'B) Distance concentration: in high dimensions all pairwise distances converge, making nearest neighbor selection nearly arbitrary',
      'C) The similarity metric should be switched from cosine to Euclidean distance',
      'D) The index needs to be rebuilt with a larger number of neighbors k'
    ],
    correctIndex: 1,
    explanation: `The symptom, similar scores for all
top results, is the signature of distance concentration.
As the number of documents grows, more points crowd
into the high-dimensional space and distances
converge. The retrieval math is working correctly.
The geometry is the problem. Switching metrics does
not fix this because all metrics concentrate in high
dimensions. The fix is dimensionality reduction
before indexing so that the space has fewer dimensions
and distances remain discriminative.`
  },
  {
    id: 'q2',
    text: `A colleague claims that adding more features to
a dataset always improves or at worst maintains
model performance, because more information is
always available. What is wrong with this reasoning
in the context of k-NN classifiers specifically?`,
    options: [
      'A) More features increase training time, reducing practical performance',
      'B) In high dimensions, irrelevant features add noise to every distance calculation, making the nearest neighbors in high-D space no longer the semantically nearest neighbors',
      'C) k-NN requires normalized features and more features make normalization harder',
      'D) More features cause the model to overfit to the training set'
    ],
    correctIndex: 1,
    explanation: `The information argument ignores
geometry. Each added dimension contributes to
every pairwise distance calculation equally,
regardless of whether it carries signal. Irrelevant
dimensions dilute the influence of relevant ones.
The nearest neighbors in the full feature space
are no longer the nearest neighbors in the
informative subspace. The model is making decisions
based on proximity in a space polluted by noise
dimensions. This is the curse of dimensionality
entering through feature engineering.`,
    requiresReasoning: true
  },
  {
    id: 'q3',
    text: `Xavier initialization scales weights by 1/sqrt(n)
where n is the number of input units. A colleague
says this is just an empirical trick with no
theoretical justification. What is the actual
geometric justification?`,
    options: [
      'A) It prevents weights from being exactly zero at initialization',
      'B) A random vector in n dimensions has expected L2 norm of sqrt(n), so dividing by sqrt(n) normalizes the expected activation magnitude to unit scale',
      'C) It matches the scale of the gradient updates during early training',
      'D) It is derived from the central limit theorem applied to weight distributions'
    ],
    correctIndex: 1,
    explanation: `If each weight is drawn from a standard
normal distribution, the sum of n such weights
has expected magnitude sqrt(n) by the properties
of the L2 norm in high dimensions. Without scaling,
the activations in each layer have magnitude
proportional to sqrt(n). As signals pass through
depth, these magnitudes compound and either explode
or vanish. Dividing by sqrt(n) normalizes the
expected activation to unit scale at every layer.
This is a direct application of high-dimensional
sphere geometry, not an empirical observation.`
  },
  {
    id: 'q4',
    text: `The Johnson-Lindenstrauss lemma says you can
project n points from high dimensions to
k = O(log(n) / epsilon^2) dimensions while
preserving distances within epsilon error.
A dataset has 1 million points (log = 20) and
you need 10% distance preservation error.
Approximately how many dimensions do you need
and what does this tell you about the relationship
between the original dimension and the required k?`,
    options: [
      'A) k depends on the original dimension, so you need to know it to answer',
      'B) k is approximately 2000, and it depends only on the number of points and error tolerance, not on the original dimension',
      'C) k is approximately 200, and it scales linearly with the log of the original dimension',
      'D) k cannot be determined without knowing the data distribution'
    ],
    correctIndex: 1,
    explanation: `k = log(n) / epsilon^2 = 20 / 0.01 = 2000.
The striking fact is that the original dimension
does not appear in this formula. Whether your data
starts in 768 dimensions or 100,000 dimensions,
the number of dimensions needed to preserve
pairwise distances depends only on how many points
you have and how much error you can tolerate.
This is why random projections are so powerful:
the compression target is independent of the
starting dimension. You can project a 100,000
dimensional space down to 2,000 dimensions and
preserve all pairwise distances within 10%.`
  }
]

const baseOptionStyle: React.CSSProperties = {
  border: '1.5px solid #1e293b',
  color: '#e2e8f0',
  background: 'transparent'
}

const Quiz = ({ onComplete }: Props) => {
  const [visibleCards, setVisibleCards] = useState(1)
  const [showReflectionHint, setShowReflectionHint] = useState(false)
  const completionEmittedRef = useRef(false)

  const [answers, setAnswers] = useState<Record<QuizQuestion['id'], AnswerState>>({
    q1: { selectedIndex: null, reasoning: '', optionsShown: true },
    q2: { selectedIndex: null, reasoning: '', optionsShown: false },
    q3: { selectedIndex: null, reasoning: '', optionsShown: true },
    q4: { selectedIndex: null, reasoning: '', optionsShown: true }
  })

  const q4Answered = answers.q4.selectedIndex !== null

  useEffect(() => {
    if (!q4Answered) {
      setShowReflectionHint(false)
      return
    }

    const timeout = window.setTimeout(() => {
      setShowReflectionHint(true)
    }, 3000)

    return () => window.clearTimeout(timeout)
  }, [q4Answered])

  useEffect(() => {
    if (!q4Answered || completionEmittedRef.current) return
    completionEmittedRef.current = true
    onComplete?.()
  }, [q4Answered, onComplete])

  const styleForOption = useMemo(() => {
    return (question: QuizQuestion, optionIndex: number): React.CSSProperties => {
      const answer = answers[question.id]

      if (answer.selectedIndex === null) return baseOptionStyle

      if (optionIndex === question.correctIndex) {
        return {
          ...baseOptionStyle,
          border: '1.5px solid #3b82f6',
          color: '#3b82f6'
        }
      }

      if (answer.selectedIndex === optionIndex) {
        return {
          ...baseOptionStyle,
          border: '1.5px solid #f59e0b',
          color: '#f59e0b'
        }
      }

      return baseOptionStyle
    }
  }, [answers])

  const selectAnswer = (question: QuizQuestion, optionIndex: number) => {
    const answer = answers[question.id]
    if (answer.selectedIndex !== null) return

    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        ...prev[question.id],
        selectedIndex: optionIndex
      }
    }))
  }

  const revealNextQuestion = (index: number) => {
    setVisibleCards((current) => Math.max(current, index + 2))
  }

  return (
    <section className="mx-auto w-full max-w-[860px]" style={{ color: '#e2e8f0', background: '#0a0f1e' }}>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.3 } } }}
        className="mb-8"
      >
        <motion.p
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } } }}
          className="text-[17px] leading-[1.8]"
          style={{ color: '#e2e8f0' }}
        >
          High-dimensional geometry is not abstract theory. It shows up as concrete failures in retrieval, classification,
          and training stability. This checkpoint tests whether you can diagnose those failures from geometric first
          principles.
        </motion.p>
      </motion.div>

      <div className="space-y-8">
        {questions.map((question, index) => {
          if (index + 1 > visibleCards) return null

          const state = answers[question.id]
          const answered = state.selectedIndex !== null
          const isLast = index === questions.length - 1
          const isFront = visibleCards === index + 1

          return (
            <article
              key={question.id}
              className="w-full max-w-[680px] rounded-[4px] border p-8"
              style={{ background: '#111827', borderColor: '#1e293b' }}
            >
              <p className="whitespace-pre-line text-[15px] leading-[1.8]" style={{ color: '#e2e8f0' }}>
                {question.text}
              </p>

              {question.requiresReasoning && (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={state.reasoning}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: {
                          ...prev[question.id],
                          reasoning: event.target.value
                        }
                      }))
                    }
                    placeholder="Write your reasoning before seeing options."
                    className="min-h-[96px] w-full rounded-[4px] border p-3 text-sm outline-none"
                    style={{ borderColor: '#1e293b', background: 'transparent', color: '#e2e8f0' }}
                  />

                  {!state.optionsShown && (
                    <button
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: {
                            ...prev[question.id],
                            optionsShown: true
                          }
                        }))
                      }
                      className="text-sm underline underline-offset-4"
                      style={{ color: '#94a3b8', background: 'transparent' }}
                    >
                      Show options
                    </button>
                  )}
                </div>
              )}

              {state.optionsShown && (
                <div className="mt-5 space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectAnswer(question, optionIndex)}
                      disabled={answered}
                      className="block w-full rounded-[4px] px-3 py-2 text-left text-sm"
                      style={styleForOption(question, optionIndex)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {answered && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="mt-4 whitespace-pre-line text-[14px] leading-[1.8]"
                  style={{ color: '#94a3b8' }}
                >
                  {question.explanation}
                </motion.p>
              )}

              {answered && !isLast && isFront && (
                <button
                  type="button"
                  onClick={() => revealNextQuestion(index)}
                  className="mt-5 rounded-[4px] px-4 py-2 text-sm font-medium text-white"
                  style={{ background: '#3b82f6' }}
                >
                  Next question
                </button>
              )}
            </article>
          )
        })}

        {q4Answered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[680px]"
          >
            <p
              className="whitespace-pre-line text-[17px] italic leading-[1.8]"
              style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}
            >
              Every embedding model you will ever use is fighting
              the curse of dimensionality. The training process,
              the initialization scheme, the dimensionality choice,
              the retrieval architecture, all of these are
              geometric decisions made in response to the specific
              ways high-dimensional space breaks.
            </p>

            {showReflectionHint && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-4 whitespace-pre-line text-[13px] leading-[1.7]"
                style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}
              >
                Think about: what is the intrinsic dimension of
                your data, how does your system behave as the
                number of indexed points grows, and whether the
                distances you are computing are still discriminative
                at your operating scale.
              </motion.p>
            )}
          </motion.div>
        )}

        {q4Answered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="w-full max-w-[680px] space-y-4 rounded-[4px] border p-6"
            style={{ borderColor: '#1e293b', background: '#111827' }}
          >
            <p className="whitespace-pre-line text-[17px] leading-[1.8]" style={{ color: '#e2e8f0' }}>
              We have now covered the full geometry of individual
              vectors and the spaces they live in. The next section
              moves to the relationship between two vectors:
              not how big they are or where they live, but how
              aligned they are. That relationship is the dot product,
              and it is the single most important operation in
              modern machine learning.
            </p>

            <p className="text-[17px] leading-[1.8]" style={{ color: '#e2e8f0' }}>
              Attention mechanisms, similarity search,
              neural network forward passes, all reduce to dot
              products at their core. That is where we are going next.
            </p>

            <Link
              to="/module/2/1"
              className="inline-flex items-center rounded-[4px] px-4 py-2 text-sm font-medium text-white no-underline"
              style={{ background: '#3b82f6' }}
            >
              Continue to Module 2: Inner Products and Similarity
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Quiz
