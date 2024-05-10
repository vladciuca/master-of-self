"use client";

import { useEffect, useState } from "react";
import JournalFormSteps from "./JournalFormSteps";
import JournalFormNavigation from "./JournalFormNavigation";
import JournalChannelForm from "./JournalChannelForm";
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

const JournalForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [willpower, setWillpower] = useState(0);
  const [gratefulItems, setGratefulItems] = useState([]);

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

  const addGratefulItem = (item) => {
    setGratefulItems((prevItems) => [...prevItems, item]);
  };

  useEffect(() => {
    setWillpower(gratefulItems.length);
  }, [gratefulItems]);

  return (
    <div className="grid grid-rows-[auto,auto,1fr] h-full">
      <div>
        <JournalFormSteps
          formSteps={formSteps}
          currentStep={currentStep}
          willpower={willpower}
        />
      </div>
      <div class="border-b mb-2">
        <JournalFormNavigation
          formSteps={formSteps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          prev={prev}
          next={next}
        />
      </div>
      <div class="overflow-y-auto">
        {currentStep === 0 && (
          <JournalChannelForm
            willpower={willpower}
            gratefulItems={gratefulItems}
            addGratefulItem={addGratefulItem}
          />
        )}
      </div>
    </div>
  );
};

export default JournalForm;
