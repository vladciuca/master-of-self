import { PracticeCard } from "@components/practices/PracticeCard";
import { IconRenderer } from "@components/IconRenderer";
import { stepIconMap } from "@components/ui/constants";
import type { PracticePageItem } from "@models/types";

export function BaseDisciplineCard({ page }: { page: PracticePageItem }) {
  return (
    <PracticeCard
      step={page}
      title="Commit & Review"
      expandedContent={
        <div className="px-2 mt-2 text-sm text-muted-foreground space-y-3">
          <p>
            Write your commitments each morning, then check them off as you go. In
            the evening, reflect on what you completed and choose what to carry
            forward into tomorrow.
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconRenderer
                iconName={stepIconMap.day}
                size={16}
                className="text-journal-day"
              />
              <span>How will I make today great?</span>
            </div>
            <div className="flex items-center gap-2">
              <IconRenderer
                iconName={stepIconMap.night}
                size={16}
                className="text-journal-night"
              />
              <span>How great was today?</span>
            </div>
          </div>
        </div>
      }
      showDescription={false}
    />
  );
}
