import { ComponentType } from 'react'

export type Module = {
  id: string
  title: string
  pillar: 'linear-algebra'
  order: number
  intuition: string
  formalMath: string[]
  mathAnnotations: string[]
  Demo: ComponentType
  challengePrompt: string
  challengeAnswer: string
  mlConnection: string
  mlExample: string
}