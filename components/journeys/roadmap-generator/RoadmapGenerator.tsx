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
import { RoadmapData } from "@models/types";

interface RoadmapGeneratorProps {
  userId?: string;
}

// Main Generator Component
export function RoadmapGenerator({ userId }: RoadmapGeneratorProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    "input" | "loading" | "result"
  >("input");
  const [input, setInput] = useState("");
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("6m");

  const timePeriods = [
    { value: "1m", label: "1 Month", fullLabel: "1 month" },
    { value: "3m", label: "3 Months", fullLabel: "3 months" },
    { value: "6m", label: "6 Months", fullLabel: "6 months" },
    { value: "12m", label: "1 Year", fullLabel: "12 months" },
  ];

  const handleGenerate = async () => {
    setCurrentStep("loading");
    setError("");

    const selectedTimePeriod = timePeriods.find(
      (p) => p.value === selectedPeriod
    );
    const enhancedMessage = `${input} within ${selectedTimePeriod?.fullLabel}`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: enhancedMessage }),
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
  };

  const handleSaveAndNavigate = () => {
    window.location.href = "/profile";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        {/* Input Step */}
        {currentStep === "input" && (
          <Card className="border-none shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-primary">
                AI Roadmap Generator
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
                      className="h-12 font-medium"
                    >
                      {period.label}
                    </Button>
                  ))}
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
                className="w-full h-12 text-lg font-medium"
              >
                Generate{" "}
                {timePeriods.find((p) => p.value === selectedPeriod)?.label}{" "}
                Roadmap
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/profile")}
                className="w-full h-12 text-lg font-medium"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading Step */}
        {currentStep === "loading" && (
          <Card className="border-none shadow-lg">
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
        )}

        {/* Result Step */}
        {currentStep === "result" && roadmapData && (
          <div className="space-y-4">
            {/* Action Bar */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handleBackToInput}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Generator
                  </Button>

                  <RoadmapSaveButton
                    roadmapData={roadmapData}
                    userId={userId}
                    onSaveSuccess={handleSaveAndNavigate}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Roadmap Content - Now using the shared component */}
            <Card className="border-none shadow-lg">
              <div className="p-6">
                <RoadmapDisplay roadmapData={roadmapData} />
              </div>
            </Card>
          </div>
        )}
      </div>
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
      className="flex items-center gap-2"
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
