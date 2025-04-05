import { useFormContext } from "react-hook-form";
import { JournalStepTemplate } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { StepScoreDisplay } from "../StepScoreDisplay";
import type { JournalEntry } from "@models/types";

export function Day() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const day = watch("dayEntry.day");

  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue("dayEntry.day", newEntries, {
      shouldDirty: true,
    });
  };

  return (
    <JournalStepTemplate
      title="What will I do to make today great?"
      description="Write down meaningful and achievable goals for the day to build Motivation."
      scoreSection={
        <StepScoreDisplay items={day ?? []} scoreName="Motivation" />
      }
    >
      <TextAreaList entryList={day ?? []} onChange={handleTextAreaListChange} />
    </JournalStepTemplate>
  );
}
