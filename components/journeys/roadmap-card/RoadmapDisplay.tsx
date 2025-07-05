import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RoadmapData } from "@models/types";
import { RoadmapHeader } from "./RoadmapHeader";
import { MilestoneCard } from "./MilestoneCard";

interface RoadmapDisplayProps {
  roadmapData: RoadmapData;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function RoadmapDisplay({
  roadmapData,
  showHeader = true,
  showFooter = false,
}: RoadmapDisplayProps) {
  if (!roadmapData || !roadmapData.milestones) {
    return <p>No roadmap data to display.</p>;
  }

  return (
    <div className="space-y-6">
      {showHeader && <RoadmapHeader roadmapData={roadmapData} />}

      <div className="space-y-4">
        {roadmapData.milestones.map((milestone, index) => (
          <MilestoneCard
            key={milestone.number} // Using milestone.number as key
            milestone={milestone}
          />
        ))}
      </div>
      {showFooter && (
        <Card className="border-none shadow-lg mt-6">
          <CardContent className="p-4 text-center text-muted-foreground">
            End of your journey!
          </CardContent>
        </Card>
      )}
    </div>
  );
}
