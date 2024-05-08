"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GiLightningTrio, GiInternalInjury, GiAura } from "react-icons/gi";

const formSteps = [
  {
    name: "STEP_1",
    icon: <GiInternalInjury size={"3rem"} />,
  },
  { name: "STEP_2", icon: <GiLightningTrio size={"3.5rem"} /> },
  { name: "STEP_3", icon: <GiAura size={"3.5rem"} /> },
];

const JournalEntryForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };
  return (
    <div>
      {/*TRACKER */}
      <ol className="flex items-center w-full mb-4 sm:mb-5 px-12 py-6">
        {formSteps.map((step, index) => (
          <li
            key={index}
            className={`flex items-center relative after:h-0.5 ${
              index < formSteps.length - 1
                ? "w-full after:content-[''] after:w-full after:block"
                : ""
            } ${
              index <= currentStep ? "after:bg-primary " : "after:bg-border "
            }`}
          >
            <div
              className={`w-16 h-16 border-2 flex items-center justify-center rounded-full shrink-0 ${
                index <= currentStep
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-primary-foreground text-primary"
              }`}
            >
              {step.icon}
            </div>
          </li>
        ))}
      </ol>

      <div className="flex justify-center items-center">
        {currentStep === 0 && (
          <div>
            <h2 className="mt-18 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              Generate Willpower
            </h2>
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <h2 className="mt-18 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              Channel Willpower
            </h2>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-center">
              Congratulations!
            </h1>
            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              You are all Charged Up
            </h2>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-evenly w-full py-6 fixed bottom-24 left-0 border-t">
        <Button type="button" size="sm" onClick={prev}>
          <FaChevronLeft className="mr-1" size="0.7rem" />
          Prev
        </Button>

        <Button type="button" size="sm" variant="ghost" onClick={prev}>
          Cancel
        </Button>

        <Button type="button" size="sm" onClick={next}>
          Next
          <FaChevronRight className="ml-1" size="0.7rem" />
        </Button>
      </div>
    </div>
  );
};

export default JournalEntryForm;
