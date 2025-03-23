import { calculateStepScore } from "@lib/score";

type StepScoreDisplay = { items: string[]; scoreName: string };

export function StepScoreDisplay({ items, scoreName }: StepScoreDisplay) {
  const score = calculateStepScore(items ?? []);
  return (
    <div>
      <span className={`${score > 0 ? "text-green-500" : "text-primary"}`}>
        +
      </span>
      {score > 0 ? (
        <span className={"mr-2 text-green-500"}>{score}</span>
      ) : (
        <></>
      )}
      {scoreName}
    </div>
  );
}
