import { useFormContext } from "react-hook-form";
import { JournalStepTemplate } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { StepScoreDisplay } from "../StepScoreDisplay";
import type { JournalEntry } from "@models/types";

export function Highlights() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const highlights = watch("nightEntry.highlights");

  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue("nightEntry.highlights", newEntries, {
      shouldDirty: true,
    });
  };

  return (
    <JournalStepTemplate
      title="Highlights of the day"
      description="What were today's highlights"
      scoreSection={
        <StepScoreDisplay items={highlights ?? []} scoreName="Motivation" />
      }
    >
      <TextAreaList
        entryList={highlights ?? []}
        onChange={handleTextAreaListChange}
      />
    </JournalStepTemplate>
  );
}
