import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { StepScoreDisplay } from "../StepScoreDisplay";
import type { JournalEntry } from "@models/types";

type JournalStepProps = {
  //type is the discipline
  type: string;
  category: string;
  title: string;
  description: string;
};

export function JournalStep({
  type,
  category,
  title,
  description,
}: JournalStepProps) {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const entryCategory = category === "day" ? "dayEntry" : "nightEntry";
  const items = watch(`${entryCategory}.${type}`);

  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue(`${entryCategory}.${type}`, newEntries, {
      shouldDirty: true,
    });
  };

  return (
    <FormStepTemplate
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
    </FormStepTemplate>
  );
}
