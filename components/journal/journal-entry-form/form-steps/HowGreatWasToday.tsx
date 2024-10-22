import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { Checkbox } from "@components/ui/checkbox";
type HowGreatWasTodayProps = {
  greatToday: string[];
};

export function HowGreatWasToday({ greatToday }: HowGreatWasTodayProps) {
  return (
    <FormStepTemplate
      title="How great was today?"
      description="Add any completed daily goals as highlights for today."
    >
      <ol className="list-decimal py-2 mt-2 mx-4 space-y-3">
        {greatToday.map((item, index) => (
          <li className="flex items-top justify-between">
            <div className="flex items-top text-base">
              <div>{index + 1}.</div>
              <span className="ml-1 mr-2">{item}</span>
            </div>

            <Checkbox className="h-8 w-8" />
          </li>
        ))}
      </ol>
    </FormStepTemplate>
  );
}
