import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, MapPin } from "lucide-react";

interface RoadmapMonth {
  month: number;
  title: string;
  focus: string;
  milestones: string[];
  actionPoints: string[];
}

interface RoadmapMonthCardProps {
  month: RoadmapMonth;
  className?: string;
}

export function RoadmapMonthCard({ month, className }: RoadmapMonthCardProps) {
  return (
    <Card key={month.month} className={`border ${className || ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center text-primary">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-3">
              {month.month}
            </div>
            {month.title}
          </CardTitle>
          <Badge variant="outline">Month {month.month}</Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          <strong>Focus:</strong> {month.focus}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-4">
          {/* Milestones */}
          <div>
            <h5 className="font-medium mb-2 flex items-center gap-1 text-primary">
              <Target className="w-4 h-4" />
              Milestones
            </h5>
            <ul className="space-y-1">
              {month.milestones.map((milestone, idx) => (
                <li
                  key={idx}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  {milestone}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Points */}
          <div>
            <h5 className="font-medium mb-2 flex items-center gap-1 text-primary">
              <MapPin className="w-4 h-4" />
              Action Points
            </h5>
            <ul className="space-y-1">
              {month.actionPoints.map((action, idx) => (
                <li
                  key={idx}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
