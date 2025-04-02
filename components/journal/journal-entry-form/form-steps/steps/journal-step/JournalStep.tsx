import { useFormContext } from "react-hook-form";
import { JournalStepTemplate } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { StepScoreDisplay } from "../../StepScoreDisplay";
import type { JournalEntry, JournalStep } from "@models/types";

export function JournalStep({
  type,
  category,
  title,
  description,
}: JournalStep) {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const entryCategory = category === "day" ? "dayEntry" : "nightEntry";
  const formPath = `${entryCategory}.${type}` as const;
  const items = watch(formPath);

  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue(formPath, newEntries, {
      shouldDirty: true,
    });
  };

  return (
    <JournalStepTemplate
      title={title}
      description={description}
      scoreSection={
        <StepScoreDisplay
          items={items ?? []}
          scoreName={type.charAt(0).toUpperCase() + type.slice(1)}
        />
      }
    >
      <TextAreaList
        entryList={items ?? []}
        onChange={handleTextAreaListChange}
      />
    </JournalStepTemplate>
  );
}
