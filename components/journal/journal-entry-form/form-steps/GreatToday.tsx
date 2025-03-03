import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { FaBoltLightning } from "react-icons/fa6";
import { JOURNAL_COLORS } from "@lib/colors";
import type { JournalEntry } from "@models/types";

export function GreatToday() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const dailyWillpower = watch("dailyWillpower");
  const greatToday = watch("dayEntry.greatToday");

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
        <>
          <span className={`text-${JOURNAL_COLORS.day}`}>{dailyWillpower}</span>
          <FaBoltLightning className="ml-2 text-3xl" />
        </>
      }
    >
      <TextAreaList
        entryList={greatToday || []}
        onChange={handleTextAreaListChange}
      />
    </FormStepTemplate>
  );
}
