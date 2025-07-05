import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, MapPin, CheckCircle2 } from "lucide-react"; // Added CheckCircle2 for objectives
// Ensure correct import path for the new types
import { Milestone, Objective } from "@models/types";

type MilestoneCardProps = {
  milestone: Milestone; // Renamed prop from unitItem
  className?: string;
};

export function MilestoneCard({ milestone, className }: MilestoneCardProps) {
  return (
    <Card
      key={milestone.number} // Use milestone.number
      className={`border ${className || ""} p-0 border-none`}
    >
      <CardHeader className="pb-3 px-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center text-primary">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-3">
              {milestone.number} {/* Use milestone.number */}
            </div>
            {milestone.title} {/* Use milestone.title */}
          </CardTitle>
          <Badge variant="outline" className="shrink-0">
            {milestone.timeframe} {/* Display timeframe directly */}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground px-0">
          <strong>Focus:</strong> {milestone.focus} {/* Use milestone.focus */}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 px-0 space-y-4">
        {" "}
        {/* Added space-y-4 for gap between objectives */}
        {milestone.objectives.map((objective: Objective, objIdx: number) => (
          <div key={objIdx}>
            <h5 className="font-medium mb-2 flex items-center gap-1 text-primary">
              <CheckCircle2 className="w-4 h-4" /> {/* Icon for objectives */}
              {objective.title}
            </h5>
            <ul className="space-y-1">
              {objective.tasks.map((task: string, taskIdx: number) => (
                <li
                  key={taskIdx}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
