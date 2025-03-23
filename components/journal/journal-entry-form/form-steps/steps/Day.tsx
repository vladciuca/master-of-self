import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { StepScoreDisplay } from "../StepScoreDisplay";
// import { calculateStepScore } from "@lib/score";
import type { JournalEntry } from "@models/types";

export function Day() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const greatToday = watch("dayEntry.greatToday");

  // const score = calculateStepScore(greatToday || []);

  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue("dayEntry.greatToday", newEntries, {
      shouldDirty: true,
    });
  };

  return (
    <FormStepTemplate
      title="What will I do to make today great?"
      description="Write down meaningful and achievable goals for the day to build motivation and generate Willpower."
      scoreSection={
        <StepScoreDisplay items={greatToday ?? []} scoreName="Motivation" />
      }
    >
      <TextAreaList
        entryList={greatToday ?? []}
        onChange={handleTextAreaListChange}
      />
    </FormStepTemplate>
  );
}
