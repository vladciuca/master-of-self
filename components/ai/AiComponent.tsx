"use client";
import { useState } from "react";
import { RoadmapRenderer } from "./RoadmapRenderer";

export function AiComponent() {
  const [input, setInput] = useState("");
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("6m");

  const timePeriods = [
    { value: "1m", label: "1 Month", fullLabel: "1 month" },
    { value: "3m", label: "3 Months", fullLabel: "3 months" },
    { value: "6m", label: "6 Months", fullLabel: "6 months" },
    { value: "12m", label: "1 Year", fullLabel: "12 months" },
  ];

  async function sendMessage() {
    setLoading(true);
    setRoadmapData(null);
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
        console.error("API Error:", data.rawResponse);
      } else {
        console.log("====================roadmap data", data.reply);
        setRoadmapData(data.reply);
      }
    } catch (err) {
      setError("Failed to send message");
      console.error("Request failed:", err);
    }

    setLoading(false);
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">AI Roadmap Generator</h1>

      {/* Show input form only when not loading and no roadmap data */}
      {!loading && !roadmapData && (
        <>
          {/* Time Period Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select your journey timeframe:
            </label>
            <div className="flex flex-wrap gap-2">
              {timePeriods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedPeriod === period.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your goal (e.g., 'I want to get hired as a programmer')..."
            className="w-full p-2 border rounded"
            rows={3}
          />
          <button
            onClick={sendMessage}
            disabled={!input}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Generate{" "}
            {timePeriods.find((p) => p.value === selectedPeriod)?.label} Roadmap
          </button>
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Generating Your Roadmap...
            </h3>
            <p className="text-muted-foreground">
              Creating a personalized{" "}
              {timePeriods.find((p) => p.value === selectedPeriod)?.fullLabel}{" "}
              journey for your goal
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-3 border rounded bg-red-100 text-red-700">
          <strong>Error:</strong> {error}
          <button
            onClick={() => {
              setError("");
              setRoadmapData(null);
            }}
            className="ml-4 text-sm underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Roadmap Results with "Create New" button */}
      {roadmapData && (
        <>
          <div className="flex justify-between items-center">
            {/* <h2 className="text-lg font-semibold text-gray-800">
              Your Roadmap
            </h2> */}
            {/* <button
              onClick={() => {
                setRoadmapData(null);
                setInput("");
                setError("");
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Create New Roadmap
            </button> */}
          </div>
          <RoadmapRenderer roadmapData={roadmapData} />
        </>
      )}
    </div>
  );
}
