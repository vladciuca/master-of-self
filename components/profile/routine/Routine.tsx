"use client";

import { RoutineStep } from "./RoutineStep";
import { Card, CardDescription, CardTitle } from "@components/ui/card";
import {
  GiPrayer,
  GiAura,
  GiBackup,
  // GiPlayerTime
} from "react-icons/gi";
import { RoutineStepProps } from "@models/types";

export function Routine() {
  const routineSteps: RoutineStepProps[] = [
    {
      icon: <GiPrayer size={"2.7rem"} />,
      title: "Gratitude",
      description:
        "Unlock this step in your daily morning routine to gain Positivity.",
      stepKey: "gratefulStep",
    },
    {
      icon: <GiAura size={"3.5rem"} />,
      title: "Affirmations",
      description:
        "Unlock this step in your daily morning routine to gain Confidence.",
      stepKey: "affirmationsStep",
    },
    {
      icon: <GiBackup size={"2.7rem"} />,
      title: "Reflection",
      description:
        "Unlock this step in your daily evening routine to gain Resilience.",
      stepKey: "reflectionStep",
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
