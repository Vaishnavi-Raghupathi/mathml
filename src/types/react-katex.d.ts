declare module 'react-katex' {
  import { FC, ReactNode } from 'react'

  type BaseProps = {
    math: string
    errorColor?: string
    renderError?: (error: Error) => ReactNode
  }

  export const BlockMath: FC<BaseProps>
  export const InlineMath: FC<BaseProps>
}