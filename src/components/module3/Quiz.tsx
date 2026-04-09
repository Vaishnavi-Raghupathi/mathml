import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

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
    text: 'A neural network layer takes a 512-dimensional input and produces a 64-dimensional output. Geometrically, what is this layer doing?',
    options: [
      'A) Compressing information by discarding dimensions',
      'B) Computing 64 linear combinations of the 512 input values',
      'C) Averaging groups of 8 input dimensions together',
      'D) Selecting the 64 most important input dimensions'
    ],
    correctIndex: 1,
    explanation:
      'Each of the 64 output neurons computes a weighted sum of all 512 inputs. That weighted sum is a linear combination. The layer is not selecting or averaging. It is producing 64 different linear combinations, each with learned scalar weights. The geometry: the layer projects the input from a 512-dimensional space into a 64-dimensional space, where each output dimension is one learned direction in the input space.'
  },
  {
    id: 'q2',
    text: 'You train a word embedding model. After training, you notice that the vectors for Monday, Tuesday, Wednesday, Thursday and Friday are all nearly parallel. Is this a problem?',
    options: [
      'A) Yes, because parallel vectors span only a line and the model cannot distinguish between the days',
      'B) No, because days of the week are semantically similar so parallel vectors are correct',
      'C) Yes, because the training loss must have been too high',
      'D) No, because similarity should be represented by proximity not direction'
    ],
    correctIndex: 0,
    explanation:
      'Parallel vectors are nearly indistinguishable under any operation that uses their linear combinations or dot products. A model that receives Monday as input will produce nearly identical outputs to one that receives Friday. The days are semantically related, yes, but they are also distinct. A good representation should be able to express both the similarity and the distinction. Parallel embeddings collapse the distinction entirely. The span of these five vectors is a line, not the rich subspace you need to reason about days separately.',
    requiresReasoning: true
  },
  {
    id: 'q3',
    text: 'A colleague stacks 6 linear layers with no activation functions between them, arguing that more layers means more expressive power. What is wrong with this?',
    options: [
      'A) 6 layers will cause vanishing gradients',
      'B) The composition of linear transformations is a single linear transformation, so all 6 layers together have no more expressive power than 1',
      'C) Linear layers require normalization between them',
      'D) The model needs at least one nonlinear layer at the end to produce useful outputs'
    ],
    correctIndex: 1,
    explanation:
      'If layer 1 computes Ax and layer 2 computes B(Ax) = BAx, the result is one matrix BA applied to x. Every additional linear layer just multiplies another matrix into this product. The final result is always one linear transformation of the input. No depth of linear layers can express a nonlinear function. Activation functions are not optional aesthetic choices. They are the mechanism that makes depth meaningful.'
  },
  {
    id: 'q4',
    text: 'You are building a retrieval system. Users submit a query vector and the system returns the most similar document. You notice the system consistently returns the same three documents regardless of the query. Using what you know about span, diagnose the most likely cause.',
    options: [
      'A) The similarity metric is computing distances incorrectly',
      'B) The document embeddings have collapsed and span a very narrow subspace, so almost all queries land nearest to the same few documents',
      'C) The query encoder needs more training data',
      'D) The index needs to be rebuilt'
    ],
    correctIndex: 1,
    explanation:
      'If document embeddings span only a narrow region of the embedding space, the nearest neighbor of almost any query will be one of the few documents at the edges of that region. The retrieval math is working correctly. The representation geometry is wrong. This is representational collapse applied to retrieval. The fix is not retraining the retrieval mechanism. It is fixing the embedding model so that documents span a richer subspace where genuine distinctions between documents correspond to distinguishable directions in space.'
  }
]

const baseAnswerStyle: React.CSSProperties = {
  borderWidth: '1.5px',
  borderStyle: 'solid',
  borderColor: 'var(--border)',
  color: 'var(--text-primary)',
  background: 'transparent'
}

const Quiz = () => {
  const [visibleCards, setVisibleCards] = useState(1)
  const [showReflectionHint, setShowReflectionHint] = useState(false)

  const [answers, setAnswers] = useState<Record<QuizQuestion['id'], AnswerState>>({
    q1: { selectedIndex: null, reasoning: '', optionsShown: true },
    q2: { selectedIndex: null, reasoning: '', optionsShown: false },
    q3: { selectedIndex: null, reasoning: '', optionsShown: true },
    q4: { selectedIndex: null, reasoning: '', optionsShown: true }
  })

  const q4Answered = answers.q4.selectedIndex !== null

  useEffect(() => {
    if (!q4Answered) return
    const timeout = window.setTimeout(() => setShowReflectionHint(true), 3000)
    return () => window.clearTimeout(timeout)
  }, [q4Answered])

  const answerStyleFor = useMemo(() => {
    return (question: QuizQuestion, optionIndex: number): React.CSSProperties => {
      const state = answers[question.id]
      if (state.selectedIndex === null) {
        return baseAnswerStyle
      }

      if (optionIndex === question.correctIndex) {
        return {
          ...baseAnswerStyle,
          borderColor: '#1a56db',
          color: '#1a56db'
        }
      }

      if (state.selectedIndex === optionIndex) {
        return {
          ...baseAnswerStyle,
          borderColor: '#e07b39',
          color: '#e07b39'
        }
      }

      return baseAnswerStyle
    }
  }, [answers])

  const selectAnswer = (question: QuizQuestion, optionIndex: number) => {
    const state = answers[question.id]
    if (state.selectedIndex !== null) return

    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        ...prev[question.id],
        selectedIndex: optionIndex
      }
    }))
  }

  const revealNextQuestion = (index: number) => {
    setVisibleCards((prev) => Math.max(prev, index + 2))
  }

  return (
    <section className="max-w-[860px]">
      <div className="space-y-8">
        {questions.map((question, index) => {
          if (index + 1 > visibleCards) return null

          const state = answers[question.id]
          const answered = state.selectedIndex !== null
          const isLast = index === questions.length - 1
          const isCurrentFrontCard = visibleCards === index + 1

          return (
            <article
              key={question.id}
              className="mx-auto w-full max-w-[680px] space-y-5 rounded-[4px] border p-8"
              style={{ background: 'transparent', borderColor: 'var(--border)' }}
            >
              <p className="text-[15px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>{question.text}</p>

              {question.requiresReasoning && (
                <div className="space-y-3">
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
                    className="min-h-24 w-full rounded-[4px] border p-3 text-sm outline-none placeholder:text-var(--text-secondary)"
                    style={{ borderColor: 'var(--border)', background: 'transparent', color: 'var(--text-primary)' }}
                  />

                  {!state.optionsShown && (
                    <button
                      type="button"
                      className="btn-ghost text-sm underline underline-offset-4"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: {
                            ...prev[question.id],
                            optionsShown: true
                          }
                        }))
                      }
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
                      onClick={() => selectAnswer(question, optionIndex)}
                      disabled={answered}
                      className="block w-full rounded-[4px] px-3 py-2 text-left text-sm"
                      style={answerStyleFor(question, optionIndex)}
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
                  transition={{ duration: 0.25, delay: 0.3 }}
                  className="text-[14px] leading-[1.8]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {question.explanation}
                </motion.p>
              )}

              {answered && !isLast && isCurrentFrontCard && (
                <button
                  type="button"
                  onClick={() => revealNextQuestion(index)}
                  className="rounded-[4px] px-4 py-2 text-sm font-medium text-white"
                  style={{ background: 'var(--accent)' }}
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
            className="mx-auto w-full max-w-[680px] space-y-4"
          >
            <p
              className="text-[17px] italic leading-[1.8] text-center"
              style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)' }}
            >
              Every operation in a transformer, every neuron in a feedforward layer, every similarity score in a
              retrieval system, is a linear combination. You now have the geometric language to read those operations
              as spatial relationships rather than numerical recipes.
            </p>

            {showReflectionHint && (
                <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--text-secondary)' }}
              >
                Think about: what scalars is the model learning, what vectors is it combining, and whether the span of
                those vectors is rich enough to express the outputs you need.
              </motion.p>
            )}
          </motion.div>
        )}

        {q4Answered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="mx-auto w-full max-w-[680px] space-y-4 rounded-[4px] border p-6"
            style={{ borderColor: 'var(--border)', background: 'transparent' }}
          >
            <p className="text-[15px] leading-[1.8] text-[#1e2d42]">
              We have been building and combining vectors. But we have not asked a more fundamental question: given a
              set of vectors, are any of them redundant? Can some be built from combinations of the others? If so,
              they are not adding new directions to your space.
            </p>

            <p className="text-[15px] leading-[1.8] text-[#1e2d42]">
              That question, which vectors are truly independent, is what the next module is about.
            </p>

            <Link
              to="/module/1/5"
              className="inline-flex items-center rounded-[4px] bg-[#1a56db] px-4 py-2 text-sm font-medium text-white no-underline"
            >
              Continue to High-Dimensional Geometry
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Quiz
