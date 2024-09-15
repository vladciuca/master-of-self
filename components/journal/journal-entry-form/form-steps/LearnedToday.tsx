import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
// import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";

type LearnedTodayProps = {
  learnedToday: string;
  onChange: (value: string) => void;
};

export function LearnedToday({ learnedToday, onChange }: LearnedTodayProps) {
  return (
    <FormStepTemplate
      title="What am I feeling grateful for?"
      description="Use details to describe what you're feeling grateful for to generate Willpower."
    >
      {/* <div className="h-full">
        <Textarea
          value={learnedToday}
          onChange={(e) => onChange(e.target.value)}
          // className="p-0 text-base resize-none flex-grow h-full border-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          className="p-0 text-base resize-none flex-grow border-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div> */}

      <div className="flex-grow h-full overflow-y-auto mx-4">
        <Textarea
          value={learnedToday}
          onChange={(e) => onChange(e.target.value)}
          className="p-0 text-base resize-none flex-grow h-full border-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </FormStepTemplate>
  );
  // return (
  // <div className="h-full flex flex-col">
  //   <Label className="w-full flex flex-col h-full mt-2">
  //     <div className="mb-4 text-center sticky top-0 bg-background z-10">
  //       <div className="leading-relaxed text-muted-foreground mx-4">
  //         {
  //           "If you could go back in time and change something, what would it be?"
  //         }
  //       </div>
  //     </div>

  //     <div className="flex-grow h-full overflow-y-auto mx-9">
  //       <Textarea
  //         value={learnedToday}
  //         onChange={(e) => onChange(e.target.value)}
  //         className="p-0 text-base resize-none flex-grow h-full border-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
  //       />
  //     </div>
  //   </Label>
  // </div>
  // );
}
