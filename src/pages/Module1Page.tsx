import ModuleLayout from '../components/ui/ModuleLayout'
import VectorBuilder from '../components/demos/VectorBuilder'
import VectorSpacePlot from '../components/demos/VectorSpacePlot'
import QuizSection, { type QuizQuestion } from '../components/ui/QuizSection'
import MLCodeBlock from '../components/ui/MLCodeBlock'
import ExecutionTask from '../components/ui/ExecutionTask'
import ConceptCheckpoint from '../components/ui/ConceptCheckpoint'

const module1Questions: QuizQuestion[] = [
  {
    id: 'm1-q1',
    text: 'You build a movie recommendation system using 3-dimensional vectors (romance, action, comedy). A user loves The Notebook. Your system recommends Titanic. The user hates the recommendation. What is the most likely cause?',
    type: 'multiple-choice',
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
    id: 'm1-q2',
    text: 'Classic word embedding models like word2vec assign one vector to the word bank regardless of whether it means a river bank or a financial institution. Why is this a problem, and what does it reveal about the representation?',
    type: 'reveal',
    explanation:
      'Word2vec assigns one vector per word type, not per word usage. The same token gets one point in space regardless of context. This collapses different meanings into a single representation; the vector for bank is an average of all its usages, faithful to none of them. Modern models like BERT fix this by making embeddings context-dependent: the same word gets a different vector depending on the sentence it appears in.'
  },
  {
    id: 'm1-q3',
    text: 'Two news articles cover the same political event from opposite ideological perspectives. A word-frequency vector representation places them very close together in vector space. What does this tell you?',
    type: 'multiple-choice',
    options: [
      'A) The distance metric is wrong',
      'B) Word frequency captures surface similarity, not semantic or argumentative similarity',
      'C) The articles are actually similar',
      'D) The vector dimensions need to be normalized'
    ],
    correctIndex: 1,
    explanation:
      'The representation is correct about what it measures. It is measuring the wrong thing for the task. Articles about the same event use similar words. But the meaning, including the argument, framing, and conclusion, can be opposite. Word-frequency vectors cannot see this. This is not a bug. It is a fundamental limit of the representation choice.'
  }
]

const Module1Page = () => {
  return (
    <ModuleLayout moduleNumber="01" moduleTitle="Vectors as Representations">
      <div className="flex flex-col gap-16">
        <section className="max-w-[680px]">
          <p className="text-[1.15em] italic leading-[1.8] text-text-secondary">
            Spotify knows you'll like a song before you hear it. Netflix recommended something you ended up loving. Your email client knows this message is spam.
          </p>

          <p className="text-[1.15em] italic leading-[1.8] text-text-secondary">
            None of these systems understand music, or storytelling, or language. They don't. They only know numbers.
          </p>

          <p className="text-[1.15em] italic leading-[1.8] text-text-secondary">
            The entire trick is that they turn the thing into numbers first. That list of numbers is a vector. Understanding what that means, not the formula but the actual idea, is what this section is about.
          </p>
        </section>

        <section className="max-w-[680px]">
          <h2>What is a vector</h2>

          <p>
            Imagine describing a movie to someone who has never seen it. You might say: lots of romance, almost no action, some comedy.
          </p>

          <p>
            Now do something strange: replace words with numbers. Romance: 0.9. Action: 0.1. Comedy: 0.4.
          </p>

          <p>You just built a vector: (0.9, 0.1, 0.4).</p>

          <p>
            This is not a metaphor. Netflix's actual recommendation system does something exactly like this. Each movie exists as a point in a space with hundreds of dimensions. Each dimension is a learned feature, not always interpretable but always numerical.
          </p>

          <p>
            The key insight: a vector is not fundamentally an arrow. An arrow is one way to visualize it in 2D. A vector is an ordered list of numbers where each position means something specific.
          </p>

          <div className="ml-4 border-l border-border-strong pl-4 text-[15px] text-text-secondary" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
            v = (v₁, v₂, ..., vₙ) where each vᵢ is a coordinate and n is the number of dimensions
          </div>
        </section>

        <MLCodeBlock
          sectionLabel="in real ml code"
          context="This is what a vector looks like the moment it enters a machine learning system. Before any math happens, before any model sees it, your data is this."
          language="python"
          code={`import numpy as np
# A movie described as a vector
movie = np.array([0.88, 0.35, 0.20])  # romance, action, comedy
# Another movie
other = np.array([0.82, 0.12, 0.55])
# Distance between them, how similar are they?
distance = np.linalg.norm(movie - other)
# The model's question: which stored vector is closest to this one?
library = np.array([[0.88, 0.35, 0.20],
[0.15, 0.92, 0.18],
[0.82, 0.12, 0.55],
[0.08, 0.97, 0.10]])
distances = np.linalg.norm(library - movie, axis=1)
most_similar = np.argmin(distances)`}
          lineAnnotations={[
            {
              lineNumber: 3,
              annotation: 'This is Titanic. Three numbers. That is the entire object as far as the model is concerned.'
            },
            {
              lineNumber: 5,
              annotation: 'La La Land. Same three dimensions, different values.'
            },
            {
              lineNumber: 7,
              annotation: 'np.linalg.norm computes Euclidean distance. This one line is the core of nearest-neighbor search.'
            },
            {
              lineNumber: 9,
              annotation: 'Every movie in the system, stacked as rows. A matrix of representations.'
            },
            {
              lineNumber: 13,
              annotation: 'axis=1 means: compute the norm of each row. One distance per movie, in one call.'
            },
            {
              lineNumber: 14,
              annotation: 'argmin returns the index of the smallest distance. That index is the recommendation.'
            }
          ]}
          closingLine="a recommendation engine is this, scaled to millions of rows"
        />

        <ExecutionTask
          taskNumber="01"
          title="Build and examine a vector"
          setup="Before the math, the object. Run this in any Python environment, such as a Jupyter notebook, Google Colab, or a terminal with NumPy installed. The goal is not to produce a correct answer. The goal is to see what a vector looks like when you actually hold it."
          steps={[
            'Create a NumPy array of three numbers representing a movie you know. Choose the numbers yourself; do not copy the example.',
            'Print the array and its shape. Notice what shape returns.',
            'Compute the distance between your vector and the Titanic vector [0.88, 0.35, 0.20] using np.linalg.norm.',
            "Now add a fourth dimension to both vectors: 'dialogue-heavy' rated from 0 to 1. Recompute the distance. Did it change significantly?",
            'Try setting all three of your values to 0.5. What movie does that represent? What does it mean to be equidistant from everything?'
          ]}
          codeScaffold={`import numpy as np
# your movie, fill in your own values
my_movie = np.array([?, ?, ?])  # romance, action, comedy
titanic = np.array([0.88, 0.35, 0.20])
# step 2: examine the object
print(my_movie)
print(my_movie.shape)
# step 3: compute distance
distance = np.linalg.norm(my_movie - titanic)
print(f"distance from Titanic: {distance:.4f}")
# step 4: add a dimension
my_movie_4d = np.append(my_movie, ?)  # dialogue-heavy score
titanic_4d = np.append(titanic, 0.65)
distance_4d = np.linalg.norm(my_movie_4d - titanic_4d)
print(f"distance in 4D: {distance_4d:.4f}")
# step 5: the center of the space
center = np.array([0.5, 0.5, 0.5])
all_movies = np.array([[0.88, 0.35, 0.20],
[0.15, 0.92, 0.18],
[0.82, 0.12, 0.55],
[0.08, 0.97, 0.10],
[0.75, 0.45, 0.80]])
distances_from_center = np.linalg.norm(all_movies - center, axis=1)
print(distances_from_center)`}
          observations={[
            'shape returns (3,): a 1D array of 3 elements. That is your vector.',
            'Adding a fourth dimension changes the distance even if the new values are similar. Every dimension contributes.',
            'The center vector [0.5, 0.5, 0.5] is roughly equidistant from everything. It is the most ambiguous representation possible.',
            'Your chosen values were a design decision. Someone else would have chosen differently for the same movie. Both are valid vectors.'
          ]}
          hint="If you're unsure what values to use for your movie, pick something you have a strong opinion about, like a film you either love or hate. Strong opinions tend to produce extreme values (close to 0 or 1), which make the distances more interesting."
        />

  <VectorBuilder />

        <section className="max-w-[680px]">
          <h2>The geometry of representation</h2>

          <p>
            Here is what makes vectors powerful. Once you have turned things into numbers, geometry becomes meaningful.
          </p>

          <p>
            Two movies with similar vectors are close together in space. Close is not a metaphor; you can literally compute the distance. The model treats closeness as similarity.
          </p>

          <p>
            This is not obvious. Why should closeness in a made-up numerical space correspond to similarity in the real world? It doesn't automatically. You have to design your representation so that it does. That design is most of what machine learning engineering actually is.
          </p>

          <p>
            One more thing: the numbers do not have to make intuitive sense on their own. Word embeddings have 300 or 768 dimensions. No single dimension means happiness or past tense. But the spatial relationships between words encode grammar, meaning, and analogy. The meaning is in the structure of the space, not in individual coordinates.
          </p>
        </section>

  <VectorSpacePlot />

        <section className="max-w-[680px]">
          <h2>The formal definition</h2>

          <p>
            Formally, a vector in ℝⁿ is an ordered tuple of n real numbers. We write it as v = (v₁, v₂, ..., vₙ).
          </p>

          <p>Each vᵢ is a coordinate. The space ℝⁿ is the set of all possible such tuples.</p>

          <p>
            In machine learning, n is usually large. Sentence embeddings in BERT use n = 768. Image embeddings might use n = 2048. You cannot visualize these spaces directly. But the structure of distance, angle, and direction still exists and is still meaningful.
          </p>

          <p>
            One thing that is easy to miss: the vector is not the object. The movie is not its vector. The vector is a lossy, designed representation of the object. This distinction matters when your model makes wrong predictions, and often the representation is wrong, not the math.
          </p>
        </section>

        <ConceptCheckpoint
          items={[
            "explain what a vector is without using the word 'arrow'",
            'describe why two different people could build different valid vectors for the same object',
            'reason about why adding dimensions changes distances even when the new values are similar',
            "identify when a representation might be the cause of a model's wrong prediction, not the math",
            'explain why the meaning in an embedding space comes from relationships between vectors, not from individual coordinate values'
          ]}
          reflection="If someone handed you a 768-dimensional vector and told you it represented a sentence, what would you need to know before you could say anything meaningful about it?"
        />

        <section className="max-w-[680px]">
          <h2>When representations fail</h2>

          <p>Vectors can fail in specific, predictable ways.</p>

          <p>
            Bias in the representation. Word embeddings trained on internet text encode the biases in that text. In some classic embeddings, doctor ends up closer to man than to woman. The vector faithfully represents the training data. The data is biased. So the vector is biased.
          </p>

          <p>
            Loss of nuance. When you compress a complex thing into a fixed-length vector, you lose information. A 768-dimensional vector cannot capture everything about a sentence. The model only knows what survived compression.
          </p>

          <p>
            Metric mismatch. Two things can be close in vector space but far apart in ways that matter. Two news articles about the same event from opposite political perspectives might have nearly identical word embeddings. The geometry does not know about perspective.
          </p>

          <p>
            These are not edge cases. They are the central problems in applied machine learning. Knowing they exist, and knowing they come from the representation step, is what separates engineers who debug well from those who do not.
          </p>
        </section>

        <QuizSection questions={module1Questions} />
      </div>
    </ModuleLayout>
  )
}

export default Module1Page
