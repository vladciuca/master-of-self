import { useFormContext } from "react-hook-form";
import { JournalStepTemplate } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { StepScoreDisplay } from "../../StepScoreDisplay";
import type { JournalEntry, JournalStep } from "@models/types";

//NOTE: consider restructuring JournalStep types
//to include _id at base layer
type JournalStepWithId = JournalStep & {
  _id: string;
};

export function JournalStep({
  _id,
  discipline,
  type,
  title,
  description,
}: JournalStepWithId) {
  const { watch, setValue } = useFormContext<JournalEntry>();

  if (type === "other") return;
  const formPath = `${type}.${_id}` as const;
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
          scoreName={discipline.charAt(0).toUpperCase() + discipline.slice(1)}
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
