import { Badge } from "@/components/ui/badge";
import { Calendar, Target, MapPin } from "lucide-react";
import { RoadmapData } from "@models/types";

type RoadmapHeaderProps = {
  roadmapData: RoadmapData;
  showIcon?: boolean;
};

export function RoadmapHeader({
  roadmapData,
  showIcon = true,
}: RoadmapHeaderProps) {
  const {
    title,
    description,
    totalMilestones,
    timeUnit,
    totalDuration,
    milestones,
  } = roadmapData;

  // Calculate total objectives for the badge
  const totalObjectives = milestones.reduce(
    (acc, milestone) => acc + milestone.objectives.length,
    0
  );

  // Calculate total tasks for a badge (optional, but good for granularity)
  const totalTasks = milestones.reduce(
    (acc, milestone) =>
      acc +
      milestone.objectives.reduce(
        (objAcc, obj) => objAcc + obj.tasks.length,
        0
      ),
    0
  );

  const durationLabel = timeUnit === "weeks" ? "weeks" : "months";

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        {showIcon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
        )}
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
      </div>

      <p className="text-muted-foreground mb-4">{description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        {" "}
        {/* flex-wrap for smaller screens */}
        <Badge variant="secondary" className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {totalMilestones} Milestones {/* Clearly "Major Milestones" */}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          {totalObjectives} Objectives {/* New badge for objectives */}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {/* Using MapPin for tasks */}
          {totalTasks} Tasks {/* New badge for tasks */}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          Overall: {totalDuration} {durationLabel}{" "}
          {/* Clear overall duration */}
        </Badge>
      </div>
    </div>
  );
}
