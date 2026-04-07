import ModuleLayout from '../components/ui/ModuleLayout'

const PlaceholderDemo = () => <div>Matrix Transform Demo</div>

const Module3Page = () => {
  return (
    <ModuleLayout
      moduleNumber={3}
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

export default Module3Page