import { Module } from './types'
import VectorDemo from '../components/demos/VectorDemo'

const module1Vectors: Module = {
  id: 'vectors',
  title: 'Vectors and Vector Spaces',
  pillar: 'linear-algebra',
  order: 1,
  intuition:
    'Think of a vector as an arrow that tells you both direction and strength at once. If you walk three steps east and two steps north, that movement can be captured by one vector. Vector spaces are the playgrounds where these arrows live and combine predictably. You can scale a vector to make it longer or shorter, and you can add vectors tip-to-tail to combine effects. This is powerful because many real systems behave this way: forces, motion, and even meaning in language models. Once you see vectors as reusable movement instructions, linear algebra feels less like symbols and more like a visual toolkit for describing patterns, transformations, and relationships in high-dimensional data.',
  formalMath: [
    '\\vec{v} = (v_x, v_y)',
    '|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}',
    '\\vec{a} + \\vec{b} = (a_x + b_x, a_y + b_y)'
  ],
  mathAnnotations: [
    'A vector is written as its horizontal and vertical components.',
    'The magnitude formula gives the vector\'s length using the Pythagorean idea.',
    'Vector addition combines matching components to form a new direction and size.'
  ],
  challengePrompt: 'Try making the two vectors point in opposite directions...',
  challengeAnswer:
    'When vectors point in opposite directions, their components cancel each other. As their magnitudes become similar, the sum vector shrinks. If they are exactly equal and opposite, the result is the zero vector.',
  mlConnection:
    'Embeddings represent words or concepts as vectors, and vector addition captures semantic relationships. A famous example is king - man + woman, which lands near queen because directional differences encode meaning.',
  mlExample: 'Word embeddings in language models like GPT',
  Demo: VectorDemo
}

export default module1Vectors
