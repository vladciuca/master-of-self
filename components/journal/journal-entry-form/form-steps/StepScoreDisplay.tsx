import { calculateStepScore } from "@lib/score";

type StepScoreDisplay = { items: string[]; scoreName: string };

export function StepScoreDisplay({ items, scoreName }: StepScoreDisplay) {
  const score = calculateStepScore(
    (items ?? []).filter((item) => item.trim() !== "")
  );
  return (
    <div>
      <span
        className={`${
          score > 0 ? "text-journal-score" : "text-primary"
        }`}
      >
        +
      </span>
      {score > 0 ? (
        <span className="mr-2 text-journal-score">{score}</span>
      ) : (
        <></>
      )}
      {scoreName}
    </div>
  );
}
