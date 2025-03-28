import { calculateStepScore } from "@lib/score";
import { JOURNAL_COLORS } from "@lib/colors";

type StepScoreDisplay = { items: string[]; scoreName: string };

export function StepScoreDisplay({ items, scoreName }: StepScoreDisplay) {
  const score = calculateStepScore(items ?? []);
  return (
    <div>
      <span
        className={`${
          score > 0 ? `text-${JOURNAL_COLORS.score}` : "text-primary"
        }`}
      >
        +
      </span>
      {score > 0 ? (
        <span className={`mr-2 text-${JOURNAL_COLORS.score}`}>{score}</span>
      ) : (
        <></>
      )}
      {scoreName}
    </div>
  );
}
