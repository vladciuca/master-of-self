import React, { useState } from "react";
import JournalFormNavigation from "@components/JournalFormNavigation";
import { Title } from "@components/ui/tipography";
import { GiLightningTrio, GiInternalInjury, GiAura } from "react-icons/gi";

const formSteps = [
  {
    name: "STEP_1",
    icon: <GiInternalInjury size={"3rem"} className="mt-2" />,
  },
  {
    name: "STEP_2",
    icon: <GiLightningTrio size={"2.5rem"} />,
  },
  {
    name: "STEP_3",
    icon: <GiAura size={"3.5rem"} />,
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
        <div className="text-center mb-4">
          {currentStep === 0 && <Title text={"Channel Willpower"} />}
          {currentStep === 1 && <Title text={"Concentrate Willpower"} />}
          {currentStep === 2 && <Title text={"GL HF"} />}
        </div>
        <JournalFormNavigation
          formSteps={formSteps}
          currentStep={currentStep}
          //   setCurrentStep={setCurrentStep}
          prev={prev}
          next={next}
        />
      </div>

      <div className="overflow-y-auto">
        {currentStep === 0 && <>STEP 1</>}
        {currentStep === 1 && <>STEP 2</>}
        {currentStep === 2 && <>STEP 3</>}
      </div>
    </div>
  );
};

export default FormStepController;
