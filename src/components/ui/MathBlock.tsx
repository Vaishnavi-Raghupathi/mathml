import { BlockMath, InlineMath } from 'react-katex'

type MathBlockProps = {
  math: string
  display?: boolean
}

const MathBlock = ({ math, display = false }: MathBlockProps) => {
  try {
    return display ? <BlockMath math={math} /> : <InlineMath math={math} />
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return <span>{message}</span>
  }
}

export default MathBlock