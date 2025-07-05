import { Badge } from "@/components/ui/badge";
import { Calendar, Target, MapPin } from "lucide-react";

interface RoadmapHeaderProps {
  title: string;
  description: string;
  totalMonths: number;
  totalMilestones: number;
  showIcon?: boolean;
}

export function RoadmapHeader({
  title,
  description,
  totalMonths,
  totalMilestones,
  showIcon = true,
}: RoadmapHeaderProps) {
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

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {totalMonths} months
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          {totalMilestones} milestones
        </Badge>
      </div>
    </div>
  );
}
