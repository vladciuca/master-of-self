import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoadmapDisplay } from "@components/journeys/roadmap-card/RoadmapDisplay";
// Ensure correct import path for the new types
import { RoadmapData } from "@models/types";

interface RoadmapGeneratorProps {
  userId?: string;
}

export function RoadmapGenerator({ userId }: RoadmapGeneratorProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    "input" | "loading" | "result"
  >("input");
  const [input, setInput] = useState("");
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("1m");

  // Renamed to reflect 'totalMilestones' now directly means number of major phases
  const [numberOfMajorMilestones, setNumberOfMajorMilestones] =
    useState<number>(2);

  const timePeriods = [
    { value: "1m", label: "1 Month", fullLabel: "1 month" },
    { value: "3m", label: "3 Months", fullLabel: "3 months" },
    { value: "6m", label: "6 Months", fullLabel: "6 months" },
    { value: "12m", label: "1 Year", fullLabel: "12 months" },
  ];

  const getMilestoneSliderProps = () => {
    switch (selectedPeriod) {
      case "1m": // 1 month = 4 weeks total
        return { min: 1, max: 4, step: 1, default: 2 }; // e.g., 2 milestones (Week 1-2, Week 3-4), or 4 (Week 1, Week 2, etc.)
      case "3m": // 3 months total
        return { min: 2, max: 6, step: 1, default: 3 }; // e.g., 3 milestones (Month 1, Month 2, Month 3)
      case "6m": // 6 months total
        return { min: 3, max: 9, step: 1, default: 6 };
      case "12m": // 12 months total
        return { min: 4, max: 12, step: 1, default: 12 };
      default:
        return { min: 2, max: 4, step: 1, default: 2 }; // Fallback
    }
  };

  React.useEffect(() => {
    const { default: defaultMilestones } = getMilestoneSliderProps();
    setNumberOfMajorMilestones(defaultMilestones);
  }, [selectedPeriod]);

  const handleGenerate = async () => {
    setCurrentStep("loading");
    setError("");

    const selectedTimePeriod = timePeriods.find(
      (p) => p.value === selectedPeriod
    );

    let timeUnit: "months" | "weeks"; // corresponds to new RoadmapData.timeUnit
    let totalDuration: number; // corresponds to new RoadmapData.totalDuration
    let periodDescriptionForAI: string;

    if (selectedPeriod === "1m") {
      timeUnit = "weeks";
      totalDuration = 4; // 1 month = 4 weeks
      periodDescriptionForAI = "4 weeks";
    } else {
      timeUnit = "months";
      totalDuration = parseInt(selectedPeriod.replace("m", ""));
      periodDescriptionForAI =
        selectedTimePeriod?.fullLabel || "the selected period";
    }

    // Pass direct values for AI to use in its calculations and response structure
    const enhancedMessage = `${input} over a total period of ${totalDuration} ${timeUnit}. Provide a roadmap broken down into exactly ${numberOfMajorMilestones} major milestones.`;

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: enhancedMessage,
          timeUnit: timeUnit, // Pass timeUnit for AI's response type
          totalMilestones: numberOfMajorMilestones, // Pass total number of major milestones requested by user
          totalDuration: totalDuration, // Pass total duration for AI to calculate timeframe ranges
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setCurrentStep("input");
        console.error("API Error:", data.rawResponse);
      } else {
        setRoadmapData(data.reply);
        setCurrentStep("result");
      }
    } catch (err) {
      setError("Failed to generate roadmap. Please try again.");
      setCurrentStep("input");
      console.error("Request failed:", err);
    }
  };

  const handleBackToInput = () => {
    setCurrentStep("input");
    setRoadmapData(null);
    setError("");
    const { default: defaultMilestones } = getMilestoneSliderProps();
    setNumberOfMajorMilestones(defaultMilestones);
  };

  const handleSaveAndNavigate = () => {
    window.location.href = "/profile";
  };

  const { min, max, step } = getMilestoneSliderProps();

  return (
    <div className="h-full bg-background">
      {/* Input Step */}
      {currentStep === "input" && (
        <div className="flex items-center justify-center h-full">
          <Card className="border-none">
            <CardHeader className="text-center pb-6">
              <CardTitle className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
                Create Roadmap
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Create a personalized learning journey tailored to your goals
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center">
                  <XCircle className="h-5 w-5 text-destructive mr-3" />
                  <span className="text-destructive">{error}</span>
                </div>
              )}

              {/* Time Period Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-primary">
                  Select your journey timeframe:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {timePeriods.map((period) => (
                    <Button
                      key={period.value}
                      variant={
                        selectedPeriod === period.value ? "default" : "outline"
                      }
                      onClick={() => setSelectedPeriod(period.value)}
                      className=""
                    >
                      {period.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Slider for Number of Milestones (Major Phases) */}
              <div className="space-y-3">
                <label
                  htmlFor="num-milestones-slider"
                  className="text-sm font-medium text-primary flex items-baseline justify-between"
                >
                  <span>Number of Major Milestones:</span>
                  <span className="text-lg font-bold">
                    {numberOfMajorMilestones}
                  </span>
                </label>
                <input
                  type="range"
                  id="num-milestones-slider"
                  min={min}
                  max={max}
                  step={step}
                  value={numberOfMajorMilestones}
                  onChange={(e) =>
                    setNumberOfMajorMilestones(parseInt(e.target.value))
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{min}</span>
                  <span>{max}</span>
                </div>
              </div>

              {/* Goal Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-primary">
                  What's your goal?
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., 'I want to get hired as a frontend developer', 'Learn data science', 'Master digital marketing'..."
                  className="w-full p-4 bg-background border border-input rounded-lg focus:border-primary focus:outline-none resize-none transition-colors text-primary placeholder:text-muted-foreground"
                  rows={4}
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!input.trim()}
                className="w-full text-md font-medium"
              >
                Generate{" "}
                {timePeriods.find((p) => p.value === selectedPeriod)?.label}{" "}
                Roadmap
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/profile")}
                className="w-full"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading Step */}
      {currentStep === "loading" && (
        <div className="flex items-center justify-center h-full">
          <Card className="border-none">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary mb-2">
                    Generating Your Roadmap...
                  </h2>
                  <p className="text-muted-foreground">
                    Creating a personalized{" "}
                    {
                      timePeriods.find((p) => p.value === selectedPeriod)
                        ?.fullLabel
                    }{" "}
                    journey
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Result Step */}
      {currentStep === "result" && roadmapData && (
        <div className="max-w-4xl mx-auto p-4">
          <div className="space-y-4">
            {/* Roadmap Content - Now using the shared component */}
            <Card className="border-none">
              <div className="p-6 pt-12">
                <RoadmapDisplay roadmapData={roadmapData} />
              </div>
            </Card>

            {/* Action Bar */}
            <Card className="border-none">
              <CardContent className="p-4 pt-8">
                <div className="flex flex-col items-center space-y-4">
                  <RoadmapSaveButton
                    roadmapData={roadmapData}
                    userId={userId}
                    onSaveSuccess={handleSaveAndNavigate}
                  />
                  <Button
                    variant="outline"
                    onClick={handleBackToInput}
                    className="flex items-center gap-2 w-full"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Generator
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// Save Button Component (unchanged)
function RoadmapSaveButton({
  roadmapData,
  userId,
  onSaveSuccess,
}: {
  roadmapData: RoadmapData;
  userId?: string;
  onSaveSuccess: () => void;
}) {
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const handleSave = async () => {
    setSaveState("saving");

    try {
      const response = await fetch(`/api/journey/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roadmapData }),
      });

      if (!response.ok) throw new Error("Failed to save journey");

      setSaveState("success");
      setTimeout(() => {
        onSaveSuccess();
      }, 1000);
    } catch (error) {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  return (
    <Button
      onClick={handleSave}
      disabled={saveState === "saving"}
      variant={
        saveState === "success"
          ? "default"
          : saveState === "error"
          ? "destructive"
          : "default"
      }
      className="flex items-center gap-2 w-full"
    >
      {saveState === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
      {saveState === "success" && <CheckCircle className="h-4 w-4" />}
      {saveState === "error" && <XCircle className="h-4 w-4" />}
      {saveState === "idle" && <Save className="h-4 w-4" />}

      {saveState === "saving"
        ? "Saving..."
        : saveState === "success"
        ? "Saved!"
        : saveState === "error"
        ? "Error"
        : "Save & Go to Profile"}
    </Button>
  );
}
