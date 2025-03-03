import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { FaBoltLightning } from "react-icons/fa6";
import { JOURNAL_COLORS } from "@lib/colors";
import type { JournalEntry } from "@models/types";

export function GratefulFor() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const dailyWillpower = watch("dailyWillpower");
  const gratefulFor = watch("dayEntry.gratefulFor");

  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue("dayEntry.gratefulFor", newEntries, {
      // NOTE: tracks user interactions, letting react-hook-form if changes were made and to what field
      shouldDirty: true,
      // This option marks the field as "dirty" (modified by the user) after its value is updated programmatically.

      // - A "dirty" field means the user has changed its value from the initial state.
      // - This is important for tracking which fields have been modified.
      // - It affects the form's `isDirty` state, which can be used to enable/disable submit buttons or show warnings about unsaved changes.
      // - Without this option, fields updated via `setValue` would not be considered "dirty" by default.

      //**`shouldDirty: true`** makes sure that when a user adds or edits items in the list,
      // the form recognizes these changes as user modifications, which is important for:
      // - Tracking unsaved changes
      // - Enabling/disabling save buttons based on whether the form has changed
      // - Showing "unsaved changes" warnings if the user tries to navigate away
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
        onChange={handleTextAreaListChange}
      />
    </FormStepTemplate>
  );
}
