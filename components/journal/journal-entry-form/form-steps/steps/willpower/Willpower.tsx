import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { WillpowerScoreDisplay } from "@components/journal/journal-entry-form/form-steps/WillpowerScoreDisplay";
import { JOURNAL_COLORS } from "@lib/colors";
import type { JournalEntry } from "@models/types";

export function Willpower() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const bonusWillpower = watch("bonusWillpower");
  const dailyWillpower = watch("dailyWillpower");

  return (
    <FormStepTemplate
      title="Congratulations!"
      description="Willpower earned from building disciplines"
      scoreSection={
        <WillpowerScoreDisplay
          willpower={bonusWillpower + dailyWillpower}
          color={JOURNAL_COLORS.day}
        />
      }
    >
      <div>WP</div>
    </FormStepTemplate>
  );
}
