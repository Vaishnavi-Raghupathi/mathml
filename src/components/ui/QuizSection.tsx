import { useEffect, useState } from 'react'

export type QuizQuestion = {
  id: string
  text: string
  type: 'multiple-choice' | 'reveal'
  options?: string[]
  correctIndex?: number
  explanation: string
}

type QuizSectionProps = {
  questions: QuizQuestion[]
}

const mono = '"IBM Plex Mono", monospace'

const FadeInExplanation = ({ text }: { text: string }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <p
      className={`mt-3 text-[15px] italic text-text-secondary transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ fontFamily: '"IBM Plex Serif", serif' }}
    >
      {text}
    </p>
  )
}

const QuizSection = ({ questions }: QuizSectionProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const answerQuestion = (questionId: string, optionIndex: number) => {
    if (selectedAnswers[questionId] !== undefined) {
      return
    }

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  const revealQuestion = (questionId: string) => {
    if (revealed[questionId]) {
      return
    }

    setRevealed((prev) => ({ ...prev, [questionId]: true }))
  }

  return (
    <section className="w-full">
      <hr className="border-0 border-t border-border" />

      <div className="pt-4">
        <div className="mb-10 text-[11px] uppercase tracking-widest text-text-muted" style={{ fontFamily: mono }}>
          CHECK YOUR UNDERSTANDING
        </div>

        <div className="flex flex-col gap-10">
          {questions.map((question, index) => {
            const questionNumber = String(index + 1).padStart(2, '0')
            const answeredIndex = selectedAnswers[question.id]
            const isLocked = answeredIndex !== undefined
            const isRevealVisible = revealed[question.id] === true

            return (
              <div key={question.id}>
                <div className="mb-4 flex items-start gap-3">
                  <span className="pt-[2px] text-[13px] text-text-muted" style={{ fontFamily: mono }}>
                    {questionNumber}.
                  </span>
                  <p className="m-0 max-w-none text-left text-[17px] text-text-primary">{question.text}</p>
                </div>

                {question.type === 'multiple-choice' ? (
                  <>
                    <div className="flex flex-col gap-3">
                      {(question.options ?? []).map((option, optionIndex) => {
                        const isCorrect = optionIndex === question.correctIndex
                        const isSelected = optionIndex === answeredIndex

                        let borderClass = 'border-border'
                        let textClass = 'text-text-secondary'

                        if (isLocked) {
                          if (isCorrect) {
                            borderClass = 'border-success'
                            textClass = 'text-success'
                          } else if (isSelected && !isCorrect) {
                            borderClass = 'border-error'
                            textClass = 'text-error'
                          } else {
                            borderClass = 'border-border'
                            textClass = 'text-text-muted'
                          }
                        }

                        return (
                          <button
                            key={`${question.id}-${optionIndex}`}
                            type="button"
                            onClick={() => answerQuestion(question.id, optionIndex)}
                            disabled={isLocked}
                            className={`w-full border bg-transparent px-4 py-3 text-left text-[14px] ${borderClass} ${textClass} ${
                              isLocked ? 'cursor-default' : 'cursor-pointer hover:border-border-strong hover:text-text-primary'
                            }`}
                            style={{ fontFamily: mono }}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>

                    {isLocked ? <FadeInExplanation text={question.explanation} /> : null}
                  </>
                ) : (
                  <>
                    {!isRevealVisible ? (
                      <button
                        type="button"
                        onClick={() => revealQuestion(question.id)}
                        className="p-0 text-[13px] text-text-muted hover:text-text-primary"
                        style={{ fontFamily: mono }}
                      >
                        reveal answer →
                      </button>
                    ) : null}

                    {isRevealVisible ? <FadeInExplanation text={question.explanation} /> : null}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default QuizSection
