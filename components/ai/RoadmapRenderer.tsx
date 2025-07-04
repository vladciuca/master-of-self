import React from "react";

interface RoadmapData {
  title: string;
  description: string;
  totalMonths: number;
  roadmap: Array<{
    month: number;
    title: string;
    focus: string;
    milestones: string[];
    actionPoints: string[];
  }>;
}

interface RoadmapRendererProps {
  roadmapData: RoadmapData;
}

export function RoadmapRenderer({ roadmapData }: RoadmapRendererProps) {
  if (!roadmapData)
    return <p className="text-muted-foreground">No roadmap data available.</p>;

  return (
    <div className="bg-background text-primary">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">{roadmapData.title}</h2>
        <p className="text-muted-foreground mb-4">{roadmapData.description}</p>
        <div className="inline-flex items-center px-3 py-1 bg-indigo-500 text-white rounded-full text-sm">
          {roadmapData.totalMonths} Month Journey
        </div>
      </div>

      {/* Roadmap Items */}
      <div className="space-y-6">
        {roadmapData.roadmap.map((month, index) => (
          <div
            key={month.month}
            className="bg-background rounded-lg p-6 shadow-sm border"
          >
            {/* Month Header */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 mr-6">
                <div className="w-10 h-10 bg-indigo-500 text-primary rounded-full flex items-center justify-center font-semibold text-lg">
                  {month.month}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary">
                  {month.title}
                </h3>
                <p className="text-indigo-500 text-sm font-medium">
                  Focus: {month.focus}
                </p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-8">
              {/* Milestones */}
              <div>
                <h4 className="text-primary font-medium mb-3">Milestones</h4>
                <div className="space-y-2">
                  {month.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="bg-indigo-500 h-2 w-2 rounded-full mt-[7.5px] mr-3" />
                      <span className="text-primary text-sm leading-relaxed">
                        {milestone}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Points */}
              <div>
                <h4 className="text-primary font-medium mb-3">Action Points</h4>
                <div className="space-y-2">
                  {month.actionPoints.map((action, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="text-green-500 mr-3 mt-0.5">→</span>
                      <span className="text-primary text-sm leading-relaxed">
                        {action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 p-4 rounded-lg text-center">
        <p className="text-primary text-sm">
          Stay consistent and celebrate your progress along the way!
        </p>
      </div>
    </div>
  );
}
