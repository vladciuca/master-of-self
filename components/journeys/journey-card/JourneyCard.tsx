import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Calendar, Target, MapPin } from "lucide-react";
import { Journey } from "@models/mongodb";
import { RoadmapDisplay } from "@components/journeys/roadmap-card/RoadmapDisplay";

type JourneyCardProps = {
  journey: Journey;
  handleEdit: (journey: Journey) => void;
  handleView: (journey: Journey) => void;
};

export function JourneyCard({
  journey,
  handleEdit,
  handleView,
}: JourneyCardProps) {
  const { roadmapData, createdAt } = journey;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  // Ensure roadmapData and roadmapData.milestones exist before trying to reduce
  const hasMilestones = roadmapData && Array.isArray(roadmapData.milestones);

  const totalObjectives = hasMilestones
    ? roadmapData.milestones.reduce(
        (acc, milestone) => acc + milestone.objectives.length,
        0
      )
    : 0; // Default to 0 if milestones is not an array or undefined

  const totalTasks = hasMilestones
    ? roadmapData.milestones.reduce(
        (acc, milestone) =>
          acc +
          milestone.objectives.reduce(
            (objAcc, obj) => objAcc + obj.tasks.length,
            0
          ),
        0
      )
    : 0; // Default to 0 if milestones is not an array or undefined

  const durationLabel = roadmapData.timeUnit === "weeks" ? "weeks" : "months";

  // Also add checks for roadmapData itself
  if (!roadmapData) {
    console.warn("JourneyCard received journey without roadmapData:", journey);
    return null; // Or render a placeholder/error state
  }

  return (
    <AccordionItem
      value={String(journey._id)}
      className="border rounded-lg mb-4"
    >
      <AccordionTrigger className="p-0 py-4 hover:no-underline text-left w-full flex flex-col items-start gap-4">
        {/* Title Row with Icon */}
        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">{roadmapData.title}</h3>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground font-normal">
          {roadmapData.description}
        </p>

        {/* Badges Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Check totalMilestones before rendering */}
          {typeof roadmapData.totalMilestones === "number" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {roadmapData.totalMilestones} Milestones
            </Badge>
          )}
          {/* Check if objectives were calculated before rendering */}
          {totalObjectives > 0 && ( // Only show if there are objectives
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {totalObjectives} Objectives
            </Badge>
          )}
          {/* Check if tasks were calculated before rendering */}
          {totalTasks > 0 && ( // Only show if there are tasks
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {totalTasks} Tasks
            </Badge>
          )}
          {/* Check totalDuration before rendering */}
          {typeof roadmapData.totalDuration === "number" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Overall: {roadmapData.totalDuration} {durationLabel}
            </Badge>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-4">
        <div className="space-y-4">
          {/* Journey metadata */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Created on {formatDate(createdAt)}
            </div>
            {/* <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleView(journey)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(journey)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div> */}
          </div>

          {/* Roadmap - Only render if roadmapData and milestones exist */}
          {hasMilestones && (
            <RoadmapDisplay
              roadmapData={roadmapData}
              showHeader={false}
              showFooter={false}
            />
          )}
          {!hasMilestones && (
            <div className="text-center text-muted-foreground p-4">
              Roadmap details are not available or are in an old format.
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
