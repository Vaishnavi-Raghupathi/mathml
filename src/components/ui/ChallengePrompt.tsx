type ChallengePromptProps = {
  prompt: string
}

const ChallengePrompt = ({ prompt }: ChallengePromptProps) => {
  return (
    <section className="border-l-4 border-gold bg-card p-5">
      <h3 className="font-bold text-gold">Challenge:</h3>
      <p className="mt-2 text-text-primary">{prompt}</p>
    </section>
  )
}

export default ChallengePrompt