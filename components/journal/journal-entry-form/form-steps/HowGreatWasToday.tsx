import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { Checkbox } from "@components/ui/checkbox";
type HowGreatWasTodayProps = {
  greatToday: string[];
};

export function HowGreatWasToday({ greatToday }: HowGreatWasTodayProps) {
  return (
    <FormStepTemplate
      title="What will I do to make today great?"
      description="Write down meaningful and achievable goals for the day to generate Willpower."
    >
      <ol className="list-decimal py-2 mx-4 space-y-3">
        {greatToday.map((item, index) => (
          <li className="flex items-top justify-between">
            <div className="flex items-top text-base">
              <div>{index + 1}.</div>
              <span className="mx-1">{item}</span>
            </div>

            <Checkbox className="h-8 w-8" />
          </li>
        ))}
      </ol>
    </FormStepTemplate>
  );
}
