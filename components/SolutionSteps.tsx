export default function SolutionSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => <li key={i}><span className="stepNum">{i + 1}</span><span className="stepText">{s}</span></li>)}
    </ol>
  );
}
