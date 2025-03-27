"use client";

import React from "react";
import { RoutineStep } from "./RoutineStep";
import { Card, CardDescription, CardTitle } from "@components/ui/card";
import { stepIconMap, mergeIconProps } from "@components/ui/constants";
import { RoutineStepProps } from "@models/types";

export function Routine() {
  const routineSteps: RoutineStepProps[] = [
    {
      icon: mergeIconProps(stepIconMap.gratitude as React.ReactElement, {
        className: "mb-0",
        size: "2.3rem",
      }),
      title: "Gratitude",
      description:
        "Unlock this step in your daily morning routine to gain Positivity.",
      stepKey: "gratitude",
    },
    {
      icon: mergeIconProps(stepIconMap.affirmations as React.ReactElement, {
        className: "mb-0",
        size: "2.5rem",
      }),
      title: "Affirmations",
      description:
        "Unlock this step in your daily morning routine to gain Confidence.",
      stepKey: "affirmations",
    },
    {
      icon: mergeIconProps(stepIconMap.reflection as React.ReactElement, {
        size: "2rem",
      }),
      title: "Reflection",
      description:
        "Unlock this step in your daily evening routine to gain Resilience.",
      stepKey: "reflection",
    },
  ];

  return (
    <div>
      <div className="mx-1 mb-4">
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {"Daily Routine"}
        </CardTitle>
        <CardDescription>{"Configure your daily routine."}</CardDescription>
      </div>

      <Card>
        <div className="px-4 flex flex-col items-center w-full">
          {routineSteps.map((step, index) => (
            <RoutineStep
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              stepKey={step.stepKey}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
