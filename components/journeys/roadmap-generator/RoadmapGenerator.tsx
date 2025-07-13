import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoadmapDisplay } from "@components/journeys/roadmap-card/RoadmapDisplay";
import { RoadmapData } from "@models/types";
import { getToday } from "@/lib/time";
import { TimePeriodSelect } from "./TimePeriodSelect";
import { MilestoneSlider } from "./MilestoneSlider";
import { LoadingScreen } from "@/components/skeletons/LoadingScreen";

interface RoadmapGeneratorProps {
  userId?: string;
}

export function RoadmapGenerator({ userId }: RoadmapGeneratorProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    "input" | "loading" | "result" | "saving"
  >("input");
  const [input, setInput] = useState("");
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("1m");

  // Renamed to reflect 'totalMilestones' now directly means number of major phases
  const [numberOfMajorMilestones, setNumberOfMajorMilestones] =
    useState<number>(2);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const timePeriods = [
    {
      value: "1m",
      label: "1 Month",
      fullLabel: "1 month",
      description: "Perfect for quick skills",
    },
    {
      value: "3m",
      label: "3 Months",
      fullLabel: "3 months",
      description: "Perfect for focused learning",
    },
    {
      value: "6m",
      label: "6 Months",
      fullLabel: "6 months",
      description: "Perfect for comprehensive growth",
    },
    {
      value: "12m",
      label: "1 Year",
      fullLabel: "12 months",
      description: "Perfect for mastery & expertise",
    },
  ];

  const getMilestoneSliderProps = () => {
    switch (selectedPeriod) {
      case "1m": // 1 month = 4 weeks total
        return { min: 2, max: 4, step: 1, default: 3 }; // 2, 3, 4 milestones only, default to middle (3)
      case "3m": // 3 months total
        return { min: 2, max: 6, step: 1, default: 4 }; // 2-6 milestones, default to middle (4)
      case "6m": // 6 months total
        return { min: 3, max: 9, step: 1, default: 6 }; // 3-9 milestones, default to middle (6)
      case "12m": // 12 months total
        return { min: 4, max: 12, step: 1, default: 8 }; // 4-12 milestones, default to middle (8)
      default:
        return { min: 2, max: 4, step: 1, default: 3 }; // Fallback
    }
  };

  React.useEffect(() => {
    const { default: defaultMilestones } = getMilestoneSliderProps();
    setNumberOfMajorMilestones(defaultMilestones);
  }, [selectedPeriod]);

  // Handle navigation after saving
  React.useEffect(() => {
    if (currentStep === "saving") {
      // Add a small delay to show the saving screen briefly
      const timer = setTimeout(() => {
        handleSaveAndNavigate();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleGenerate = async () => {
    setCurrentStep("loading");
    setError("");

    let timeUnit: "months" | "weeks"; // corresponds to new RoadmapData.timeUnit
    let totalDuration: number; // corresponds to new RoadmapData.totalDuration

    if (selectedPeriod === "1m") {
      timeUnit = "weeks";
      totalDuration = 4; // 1 month = 4 weeks
    } else {
      timeUnit = "months";
      totalDuration = parseInt(selectedPeriod.replace("m", ""));
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
          startDate: getToday().toISOString().split("T")[0], // Pass start date for AI to use in its response
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
    router.push("/profile");
  };

  console.log("====roadmapData", roadmapData);

  return (
    <div className="h-full bg-background">
      {/* Input Step */}
      {currentStep === "input" && (
        <div className="flex flex-col h-full justify-between">
          {/* Fixed Header Section */}
          <div className="space-y-6 mt-8 mb-4">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
              Create Roadmap
            </h1>
            <p className="text-muted-foreground text-center">
              Create a personalized learning journey tailored to your goals
            </p>
          </div>

          {/* Scrollable Middle Section */}
          <ScrollArea className="px-4 flex-grow">
            <div className="space-y-8 px-1">
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center">
                  <XCircle className="h-5 w-5 text-destructive mr-3" />
                  <span className="text-destructive">{error}</span>
                </div>
              )}

              {/* Time Period Selection */}
              <TimePeriodSelect
                timePeriods={timePeriods}
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
              />

              {/* Slider for Number of Milestones (Major Phases) */}
              <MilestoneSlider
                numberOfMajorMilestones={numberOfMajorMilestones}
                setNumberOfMajorMilestones={setNumberOfMajorMilestones}
                min={getMilestoneSliderProps().min}
                max={getMilestoneSliderProps().max}
                step={getMilestoneSliderProps().step}
              />

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
            </div>
          </ScrollArea>

          {/* Fixed Footer Section */}
          <div className="flex flex-col justify-center items-center mt-2 px-4">
            <Button
              onClick={handleGenerate}
              disabled={!input.trim()}
              className="w-full mt-3 mb-4 text-md font-medium"
            >
              Generate{" "}
              {timePeriods.find((p) => p.value === selectedPeriod)?.label}{" "}
              Roadmap
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/profile")}
              className="w-full mb-4"
            >
              Cancel
            </Button>
          </div>
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

      {/* Saving Step */}
      {currentStep === "saving" && <LoadingScreen />}

      {/* Result Step */}
      {currentStep === "result" && roadmapData && (
        <div className="flex flex-col h-full justify-between">
          {/* Fixed Header Section */}
          <div className="space-y-6 mt-8 mb-4">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
              Your Roadmap
            </h1>
          </div>

          {/* Scrollable Middle Section */}
          <ScrollArea className="px-4 flex-grow">
            <div className="px-1">
              <RoadmapDisplay roadmapData={roadmapData} />
            </div>
          </ScrollArea>

          {/* Fixed Footer Section */}
          <div className="flex flex-col justify-center items-center mt-2 px-4">
            <RoadmapSaveButton
              roadmapData={roadmapData}
              userId={userId}
              saveState={saveState}
              setSaveState={setSaveState}
              onSaveSuccess={() => setCurrentStep("saving")}
            />
            <Button
              variant="outline"
              onClick={handleBackToInput}
              disabled={saveState === "saving"}
              className="flex items-center gap-2 w-full mt-3 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Generator
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Save Button Component
function RoadmapSaveButton({
  roadmapData,
  userId,
  saveState,
  setSaveState,
  onSaveSuccess,
}: {
  roadmapData: RoadmapData;
  userId?: string;
  saveState: "idle" | "saving" | "success" | "error";
  setSaveState: React.Dispatch<
    React.SetStateAction<"idle" | "saving" | "success" | "error">
  >;
  onSaveSuccess: () => void;
}) {
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
      // Call onSaveSuccess immediately to show saving screen
      onSaveSuccess();
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
        : "Save Journey"}
    </Button>
  );
}
