import ModuleLayout from '../components/ui/ModuleLayout'

const PlaceholderDemo = () => <div>Vector Demo</div>

const Module1Page = () => {
  return (
    <ModuleLayout
      moduleNumber={1}
      title=""
      description=""
      Demo={PlaceholderDemo}
      stats={<div />}
      intuition=""
      formalMath={[{ eq: '\\vec{v} = (v_x, v_y)', annotation: 'KaTeX placeholder' }]}
      challengePrompt=""
      mlConnection=""
    />
  )
}

export default Module1Page