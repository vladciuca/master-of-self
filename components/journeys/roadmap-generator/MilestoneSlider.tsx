import React from "react";

type MilestoneSliderProps = {
  numberOfMajorMilestones: number;
  setNumberOfMajorMilestones: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label?: string;
  description?: string;
};

export function MilestoneSlider({
  numberOfMajorMilestones,
  setNumberOfMajorMilestones,
  min,
  max,
  step,
  label = "Number of Major Milestones:",
  description,
}: MilestoneSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-primary">{label}</label>
        <div className="flex items-center">
          <div className="bg-primary/10 text-primary px-5 py-1 rounded-full font-bold text-lg min-w-[2.5rem] text-center">
            {numberOfMajorMilestones}
          </div>
        </div>
      </div>

      {/* Custom Slider with Visual Indicators */}
      <div className="relative px-2">
        <div className="relative">
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
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer 
                   [&::-webkit-slider-thumb]:appearance-none 
                   [&::-webkit-slider-thumb]:w-5 
                   [&::-webkit-slider-thumb]:h-5 
                   [&::-webkit-slider-thumb]:rounded-full 
                   [&::-webkit-slider-thumb]:bg-primary
                   [&::-webkit-slider-thumb]:border-2
                   [&::-webkit-slider-thumb]:border-white
                   [&::-webkit-slider-thumb]:shadow-md
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:transition-all
                   [&::-webkit-slider-thumb]:hover:scale-110
                   [&::-moz-range-thumb]:w-5
                   [&::-moz-range-thumb]:h-5
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-primary
                   [&::-moz-range-thumb]:border-2
                   [&::-moz-range-thumb]:border-white
                   [&::-moz-range-thumb]:shadow-md
                   [&::-moz-range-thumb]:cursor-pointer
                   focus:outline-none
                   focus:ring-2
                   focus:ring-primary/20"
            style={{
              background: `linear-gradient(to right, 
            hsl(var(--primary)) 0%, 
            hsl(var(--primary)) ${
              ((numberOfMajorMilestones - min) / (max - min)) * 100
            }%, 
            hsl(var(--muted)) ${
              ((numberOfMajorMilestones - min) / (max - min)) * 100
            }%, 
            hsl(var(--muted)) 100%)`,
            }}
          />
        </div>

        {/* Slider tick marks */}
        <div className="flex justify-between mt-3 px-1">
          {Array.from({ length: max - min + 1 }, (_, i) => {
            const value = min + i;
            const isActive = value <= numberOfMajorMilestones;
            const isCurrent = value === numberOfMajorMilestones;
            return (
              <div
                key={value}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => setNumberOfMajorMilestones(value)}
              >
                <div
                  className={`w-2 h-2 rounded-full mb-1 transition-all group-hover:scale-125 ${
                    isCurrent
                      ? "bg-primary scale-125"
                      : isActive
                      ? "bg-primary/70"
                      : "bg-muted-foreground/40"
                  }`}
                />
                <span
                  className={`text-xs transition-all ${
                    isCurrent
                      ? "font-bold text-primary scale-110"
                      : isActive
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Description */}
      <div className="bg-muted/30 p-3 rounded-lg border border-muted">
        <p className="text-sm text-muted-foreground">
          {description ||
            `Your roadmap will be divided into ${numberOfMajorMilestones} major milestone${
              numberOfMajorMilestones !== 1 ? "s" : ""
            }, each representing a significant phase in your learning journey.`}
        </p>
      </div>
    </div>
  );
}
