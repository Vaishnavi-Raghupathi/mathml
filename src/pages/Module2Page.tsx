import ModuleLayout from '../components/ui/ModuleLayout'

const PlaceholderDemo = () => <div>Dot Product Demo</div>

const Module2Page = () => {
  return (
    <ModuleLayout
      moduleNumber={2}
      title=""
      description=""
      Demo={PlaceholderDemo}
      stats={<div />}
      intuition=""
      formalMath={[]}
      challengePrompt=""
      mlConnection=""
    />
  )
}

export default Module2Page