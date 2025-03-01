import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { FaBoltLightning } from "react-icons/fa6";
import { JOURNAL_COLORS } from "@lib/colors";
import type { JournalEntry } from "@models/types";

export function GratefulFor() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  // Watch the gratefulFor field & willpower
  const dailyWillpower = watch("dailyWillpower");
  const gratefulFor = watch("dayEntry.gratefulFor");

  // Handle changes from TextAreaList
  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue("dayEntry.gratefulFor", newEntries, {
      // shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <FormStepTemplate
      title="What am I feeling grateful for?"
      description="Use details to describe what you're feeling grateful for and generate Willpower."
      scoreSection={
        <>
          <span className={`text-${JOURNAL_COLORS.day}`}>{dailyWillpower}</span>
          <FaBoltLightning className="ml-2 text-3xl" />
        </>
      }
    >
      <TextAreaList
        entryList={gratefulFor || []}
        // empty [""] here to prevent rendering issues for when gratefulFor is undefined or null
        // NOTE: could add this to the default state
        // value={gratefulFor || [""]}
        onChange={handleTextAreaListChange}
      />
    </FormStepTemplate>
  );
}
