import {
  //   AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { AddNewButton } from "@components/profile/AddNewButton";

type NewJourneyCardProps = {
  onboarding?: boolean;
};

export function NewJourneyCard({ onboarding = false }: NewJourneyCardProps) {
  return (
    <AccordionItem
      value="new-journey"
      className="border rounded-lg mb-4 bg-gradient-to-r from-primary/5 to-secondary/5"
    >
      <AccordionTrigger className="py-4 hover:no-underline text-left w-full">
        <div className="flex items-center justify-between w-full">
          <div className="grid grid-cols-[auto_1fr] items-center gap-6">
            <div>
              <h3 className="font-semibold text-lg">Create A New Journey</h3>
              <p className="text-sm text-muted-foreground">
                Start a new personal development journey to achieve any goal.
              </p>
            </div>
          </div>

          <div>
            <AddNewButton
              title="Create New Journey"
              linkTo="/create-journey"
              size={8}
            />
          </div>
        </div>
      </AccordionTrigger>

      {/* <AccordionContent className="px-4 pb-4">
      </AccordionContent> */}
    </AccordionItem>
  );
}
