import { BlockMath } from 'react-katex'
import NormExplorer from '../components/interactions/NormExplorer'
import NormsQuiz from '../components/interactions/NormsQuiz'
import RegularizationSlider from '../components/interactions/RegularizationSlider'
import ModuleLayout from '../components/ui/ModuleLayout'

const Module1Sub2Page = () => {
  return (
    <ModuleLayout moduleNumber="01" moduleTitle="Norms">
      <div className="flex flex-col gap-16">
        <section className="max-w-[680px]">
          <p className="whitespace-pre-line">
            {`You have a vector.

v = [3, 4]

How big is it?

Not the components. The whole thing.
How much information is it carrying?
How far is it from nothing?

This question has multiple valid answers.
Which one you use changes how your model learns.`}
          </p>
        </section>

        <section className="max-w-[680px]">
          <p className="whitespace-pre-line">
            {`Draw that vector as an arrow from the origin to the point (3, 4).

The length of that arrow is 5.

You know this already — it's the Pythagorean theorem.
The two legs are 3 and 4. The hypotenuse is 5.

√(3² + 4²) = √(9 + 16) = √25 = 5

That length is the L2 norm of the vector.
Also called the Euclidean norm.
Also called the magnitude.
Three names for one thing.`}
          </p>

          <div className="mt-8 w-full overflow-x-auto">
            <svg
              viewBox="0 0 640 300"
              className="mx-auto block h-auto w-full max-w-[640px]"
              role="img"
              aria-label="Vector norm diagram showing vector from origin to (3,4) with right triangle"
            >
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#7C3AED" />
                </marker>
              </defs>

              <line x1="80" y1="240" x2="600" y2="240" stroke="var(--border-strong)" strokeWidth="1" />
              <line x1="80" y1="240" x2="80" y2="30" stroke="var(--border-strong)" strokeWidth="1" />

              <line x1="80" y1="240" x2="320" y2="240" stroke="var(--border)" strokeWidth="1" strokeDasharray="5 5" />
              <line x1="320" y1="240" x2="320" y2="80" stroke="var(--border)" strokeWidth="1" strokeDasharray="5 5" />

              <line x1="80" y1="240" x2="320" y2="80" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#arrowhead)" />

              <text x="208" y="152" fill="var(--text-primary)" fontSize="14" fontFamily='"IBM Plex Mono", monospace'>
                v
              </text>
              <text x="200" y="230" fill="var(--text-secondary)" fontSize="13" fontFamily='"IBM Plex Mono", monospace'>
                3
              </text>
              <text x="332" y="165" fill="var(--text-secondary)" fontSize="13" fontFamily='"IBM Plex Mono", monospace'>
                4
              </text>
              <text x="210" y="170" fill="var(--text-secondary)" fontSize="13" fontFamily='"IBM Plex Mono", monospace'>
                5
              </text>
            </svg>
          </div>

          <div className="mt-6 w-full overflow-x-auto text-center text-text-secondary">
            <BlockMath math={'\\|v\\|_2 = \\sqrt{v_1^2 + v_2^2} = \\sqrt{3^2 + 4^2} = 5'} />
          </div>
        </section>

        <section className="max-w-[680px]">
          <p className="whitespace-pre-line">
            {`That formula works for any number of dimensions.

v = [v₁, v₂, ..., vₙ]

‖v‖₂ = √(v₁² + v₂² + ... + vₙ²)

You cannot draw a 768-dimensional arrow.
But you can still compute its length.
The formula doesn't care how many dimensions there are.

In ML, this number — the L2 norm — is how you measure
the size of a weight vector, an embedding, a gradient.

When someone says 'normalize your vectors,' they mean:
divide by this number so the length becomes exactly 1.`}
          </p>

          <div className="mt-6 w-full overflow-x-auto text-center text-text-secondary">
            <BlockMath math={'\\|v\\|_2 = \\sqrt{\\sum_i v_i^2}'} />
          </div>
        </section>

  <NormExplorer />

        <section className="max-w-[680px]">
          <p className="whitespace-pre-line">
            {`In a trained model, large weights mean strong influence.

If a weight vector w has a large norm,
it means the model is relying heavily on certain features.
Small variations in input produce large variations in output.

This is not always good.

A model that has learned to rely very strongly on a few features
is fragile. It fits the training data. It fails on new data.
This is called overfitting.

One way to prevent it: penalize large norms during training.
Force the weights to stay small.
This is called regularization.`}
          </p>
        </section>

        <section className="max-w-[680px]">
          <p className="whitespace-pre-line">
            {`During training, your model minimizes a loss function.
Something like:

Loss = prediction error

With L2 regularization, you change what you're minimizing:

Loss = prediction error + λ · ‖w‖₂²

λ (lambda) is a small constant you set.

Now the model has two competing goals:
- Fit the training data well (reduce prediction error)
- Keep the weights small (reduce ‖w‖₂²)

The tension between these two goals is what prevents overfitting.
The model cannot just memorize the training data,
because doing so would require large weights,
which the second term punishes.`}
          </p>

          <div className="mt-6 w-full overflow-x-auto text-center text-text-secondary">
            <BlockMath math={'L_{reg} = L_{task} + \\lambda \\|w\\|_2^2'} />
          </div>

          <p className="mt-4 whitespace-pre-line">
            {`This is called L2 regularization. Also called weight decay.
It is in almost every trained model you will encounter.
Now you know what it's actually doing.`}
          </p>
        </section>

        <section className="max-w-[680px]">
          <div className="text-[12px] uppercase tracking-[0.1em] text-text-muted" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
            EXERCISE 02
          </div>

          <p className="mt-4 text-[1em] italic leading-[1.8] text-text-secondary">
            Below are two weight vectors — before and after L2 regularization.

            Drag the lambda slider.
            Watch what happens to the weights.
          </p>

          <RegularizationSlider />
        </section>

        <section className="max-w-[680px]">
          <p className="whitespace-pre-line">
            {`L2 is not the only norm.

L1 norm: add the absolute values of the components.

‖v‖₁ = |v₁| + |v₂| + ... + |vₙ|

For v = [3, 4]:   ‖v‖₁ = 3 + 4 = 7
For v = [3, 4]:   ‖v‖₂ = 5

Different definitions of 'how big.'`}
          </p>
        </section>

        <section className="max-w-[760px]">
          <div className="w-full overflow-x-auto">
            <svg
              viewBox="0 0 820 360"
              className="mx-auto block h-auto w-full max-w-[760px]"
              role="img"
              aria-label="Comparison of L2 straight-line norm and L1 city-block norm for vector (3,4)"
            >
              <defs>
                <marker id="arrowhead-l2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#7C3AED" />
                </marker>
                <marker id="arrowhead-l1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#7C3AED" />
                </marker>
              </defs>

              <g>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <line key={`l1-v-${i}`} x1={90 + i * 40} y1="30" x2={90 + i * 40} y2="210" stroke="var(--border)" strokeWidth="1" />
                ))}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={`l1-h-${i}`} x1="90" y1={210 - i * 45} x2="330" y2={210 - i * 45} stroke="var(--border)" strokeWidth="1" />
                ))}
                <line x1="90" y1="210" x2="330" y2="210" stroke="var(--border-strong)" strokeWidth="1" />
                <line x1="90" y1="210" x2="90" y2="30" stroke="var(--border-strong)" strokeWidth="1" />

                <line x1="90" y1="210" x2="210" y2="30" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#arrowhead-l2)" />
                <text x="152" y="122" fill="var(--text-primary)" fontSize="13" fontFamily='"IBM Plex Mono", monospace'>
                  5
                </text>
                <text x="210" y="312" textAnchor="middle" fill="var(--text-secondary)" fontSize="13" fontFamily='"IBM Plex Serif", serif'>
                  L2: straight-line distance.
                </text>
              </g>

              <g>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <line key={`l2-v-${i}`} x1={470 + i * 40} y1="30" x2={470 + i * 40} y2="210" stroke="var(--border)" strokeWidth="1" />
                ))}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={`l2-h-${i}`} x1="470" y1={210 - i * 45} x2="710" y2={210 - i * 45} stroke="var(--border)" strokeWidth="1" />
                ))}
                <line x1="470" y1="210" x2="710" y2="210" stroke="var(--border-strong)" strokeWidth="1" />
                <line x1="470" y1="210" x2="470" y2="30" stroke="var(--border-strong)" strokeWidth="1" />

                <line x1="470" y1="210" x2="590" y2="210" stroke="#7C3AED" strokeWidth="2" />
                <line x1="590" y1="210" x2="590" y2="30" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#arrowhead-l1)" />
                <text x="525" y="198" fill="var(--text-primary)" fontSize="13" fontFamily='"IBM Plex Mono", monospace'>
                  3
                </text>
                <text x="602" y="125" fill="var(--text-primary)" fontSize="13" fontFamily='"IBM Plex Mono", monospace'>
                  4
                </text>
                <text x="548" y="116" fill="var(--text-primary)" fontSize="13" fontFamily='"IBM Plex Mono", monospace'>
                  7
                </text>
                <text x="590" y="312" textAnchor="middle" fill="var(--text-secondary)" fontSize="13" fontFamily='"IBM Plex Serif", serif'>
                  L1: city block distance.
                </text>
              </g>
            </svg>
          </div>

          <p className="mt-6 whitespace-pre-line">
            {`L2 penalizes large individual values heavily (because of squaring).
L1 penalizes all values equally and tends to push small weights
all the way to exactly zero.

L1 regularization produces sparse models —
most weights become zero, a few remain large.

L2 regularization produces small models —
all weights shrink, but rarely reach exactly zero.

In practice: L2 is the default. L1 is used when you want the model
to explicitly ignore most features and rely on a few.`}
          </p>

          <div className="mt-6 w-full overflow-x-auto text-center text-text-secondary">
            <BlockMath math={'\\text{L1:}\\;L_{reg} = L_{task} + \\lambda \\|w\\|_1'} />
            <BlockMath math={'\\text{L2:}\\;L_{reg} = L_{task} + \\lambda \\|w\\|_2^2'} />
          </div>
        </section>

        <section className="max-w-[680px]">
          <h2>Precisely</h2>

          <p>The p-norm of a vector v ∈ ℝⁿ is defined as:</p>

          <div className="mt-6 w-full overflow-x-auto text-center text-text-secondary">
            <BlockMath math={'\\|v\\|_p = \\left(\\sum_i |v_i|^p\\right)^{1/p}'} />
          </div>

          <p className="whitespace-pre-line">
            {`p = 2 gives L2 (Euclidean). This is the default.
p = 1 gives L1 (Manhattan/taxicab).
p → ∞ gives L∞ (maximum absolute component).

You will almost always use p = 2.
Knowing p = 1 exists and what it does is enough for now.`}
          </p>
        </section>

        <NormsQuiz />
      </div>
    </ModuleLayout>
  )
}

export default Module1Sub2Page
