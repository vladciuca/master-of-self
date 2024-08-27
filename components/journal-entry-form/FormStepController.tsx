import React, { useState } from "react";
import FormStepProgressBar from "./FormStepProgressBar";
import { Button } from "@components/ui/button";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

const formSteps = [
  {
    name: "STEP_1",
  },
  {
    name: "STEP_2",
  },
  {
    name: "STEP_3",
  },
  {
    name: "STEP_4",
  },
];

const FormStepController = () => {
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
    <div className="grid grid-rows-[auto,1fr] h-full">
      <div className="mb-3">
        <FormStepProgressBar
          steps={formSteps}
          currentStep={currentStep}
          prev={prev}
          next={next}
        />
      </div>

      <div className="overflow-y-auto">
        {currentStep === 0 && <>STEP 1</>}
        {currentStep === 1 && <>STEP 2</>}
        {currentStep === 2 && <>STEP 3</>}
      </div>
      <div className="flex justify-around items-center mb-4">
        <Button className="w-1/3" type="button" onClick={prev}>
          <RxChevronLeft />
          Prev
        </Button>
        <Button className="w-1/3" type="button" onClick={next}>
          Next
          <RxChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default FormStepController;
