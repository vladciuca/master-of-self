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

  // Format the creation date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

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
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {roadmapData.totalMonths} months
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {roadmapData.roadmap.length} milestones
          </Badge>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-4">
        <div className="space-y-4">
          {/* Journey metadata */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Created on {formatDate(createdAt)}
            </div>
            <div className="flex gap-2">
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
            </div>
          </div>

          {/* Roadmap - Now using the shared component */}
          <RoadmapDisplay
            roadmapData={roadmapData}
            showHeader={false}
            showFooter={false}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
