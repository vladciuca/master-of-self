import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { StepScoreDisplay } from "../StepScoreDisplay";
import { TextAreaList } from "@components/ui/textarea-list";
// import { calculateStepScore } from "@lib/score";
import type { JournalEntry } from "@models/types";

export function Reflection() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const learnedToday = watch("nightEntry.learnedToday");

  // const score = calculateStepScore(learnedToday || []);

  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue("nightEntry.learnedToday", newEntries, {
      shouldDirty: true,
    });
  };

  return (
    <FormStepTemplate
      title="What have I learned today?"
      description="If you could go back in time and change something, what would it be?"
      scoreSection={
        <StepScoreDisplay items={learnedToday ?? []} scoreName="Resilience" />
      }
    >
      <TextAreaList
        entryList={learnedToday ?? []}
        onChange={handleTextAreaListChange}
      />
    </FormStepTemplate>
  );
}
