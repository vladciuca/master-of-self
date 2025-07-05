import { RoadmapHeader } from "./RoadmapHeader";
import { RoadmapMonthCard } from "./RoadmapMonthCard";

interface RoadmapMonth {
  month: number;
  title: string;
  focus: string;
  milestones: string[];
  actionPoints: string[];
}

interface RoadmapData {
  title: string;
  description: string;
  totalMonths: number;
  roadmap: RoadmapMonth[];
}

interface RoadmapDisplayProps {
  roadmapData: RoadmapData;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function RoadmapDisplay({
  roadmapData,
  showHeader = true,
  showFooter = true,
  className,
}: RoadmapDisplayProps) {
  return (
    <div className={className}>
      {/* Header */}
      {showHeader && (
        <RoadmapHeader
          title={roadmapData.title}
          description={roadmapData.description}
          totalMonths={roadmapData.totalMonths}
          totalMilestones={roadmapData.roadmap.length}
        />
      )}

      {/* Roadmap Items */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg text-primary">Roadmap</h4>
        <div className="space-y-4">
          {roadmapData.roadmap.map((month) => (
            <RoadmapMonthCard key={month.month} month={month} />
          ))}
        </div>
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-primary text-sm font-medium">
            🎯 Stay consistent and celebrate your progress along the way!
          </p>
        </div>
      )}
    </div>
  );
}
