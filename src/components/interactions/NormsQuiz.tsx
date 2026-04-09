import { useState } from 'react'

type QuizItem = {
  id: string
  question: string
  answer: string
}

const questions: QuizItem[] = [
  {
    id: 'norms-q1',
    question: `A weight vector w = [0.01, 0.02, 4.7, 0.03] has been trained without regularization.

What does the large value 4.7 tell you, and why might this be a problem?`,
    answer: `The model has learned to rely almost entirely on the third feature.
The large weight means a small change in feature 3 produces a large
change in the output. If feature 3 is noisy or absent in new data,
the model fails badly. Large norm = fragility. This is why we regularize.`
  },
  {
    id: 'norms-q2',
    question: `You apply L2 regularization with λ = 0.
What happens?

You then increase λ to 1000.
What happens?

What does this tell you about how to choose λ?`,
    answer: `λ = 0: no regularization. The model only minimizes prediction error.
       Risk: overfitting.

λ = 1000: the regularization term dominates. The model pushes all
          weights toward zero regardless of data. Risk: underfitting,
          the model learns nothing.

λ must be chosen so the model fits the data without memorizing it.
This is a hyperparameter — you set it before training and tune it
using a validation set.`
  },
  {
    id: 'norms-q3',
    question: `Two engineers are building a spam filter.
Engineer A uses L2 regularization.
Engineer B uses L1 regularization.

Engineer B's model ends up ignoring 950 out of 1000 word features.
Engineer A's model uses all 1000 features with small weights.

Which model is easier to interpret and why?
Which model might be more robust to irrelevant features being added?`,
    answer: `Engineer B's model is easier to interpret. If 950 weights are exactly
zero, you can look at the 50 nonzero weights and say: these are the
words the model considers important for spam detection.

Engineer B's model is also more robust to new irrelevant features being
added — L1 will push those new weights to zero automatically.

Engineer A's model uses everything, which can lead to many small
dependencies on noise. L2 keeps things small but not silent.

Neither is always better. L1 for interpretability and feature selection.
L2 for general-purpose regularization.`
  }
]

const mono = '"IBM Plex Mono", monospace'

const NormsQuiz = () => {
  const [openById, setOpenById] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => {
    setOpenById((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="w-full max-w-[680px]">
      <div className="flex flex-col gap-12">
        {questions.map((item) => {
          const isOpen = openById[item.id] === true

          return (
            <div key={item.id}>
              <p className="m-0 whitespace-pre-line text-[18px] text-text-primary">{item.question}</p>

              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="mt-4 border border-border-strong px-3 py-2 text-[13px] text-text-muted hover:text-text-primary"
                style={{ fontFamily: mono }}
              >
                {isOpen ? 'Hide answer' : 'Reveal answer'}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'mt-4 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div>
                  <p className="m-0 whitespace-pre-line text-[17px] text-text-secondary">{item.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default NormsQuiz
