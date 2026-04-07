type MLConnectionProps = {
  text: string
}

const MLConnection = ({ text }: MLConnectionProps) => {
  return (
    <section className="border-l-4 border-green bg-card p-5">
      <h3 className="font-bold text-green">In Machine Learning:</h3>
      <p className="mt-2 text-text-primary">{text}</p>
    </section>
  )
}

export default MLConnection