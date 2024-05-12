"use client";

import { useEffect, useState } from "react";
import JournalFormNavigation from "./JournalFormNavigation";
import JournalChannelForm from "./JournalChannelForm";
import JournalConcentrateForm from "./JournalConcentrateForm";
import JournalFormSummary from "./JournalFormSummary";
import { Title } from "./ui/tipography";
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

const JournalForm = ({ session, submitting, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  // list of grateful items
  const [gratefulItems, setGratefulItems] = useState([]);
  // list of habits
  const [habits, setHabits] = useState([]);
  const [habitsLoaded, setHabitsLoaded] = useState(false);
  // list of willpower into skills
  const [habitWillpower, setHabitWillpower] = useState({});

  useEffect(() => {
    const fetchHabits = async () => {
      setHabitsLoaded(false);
      try {
        const response = await fetch(`/api/users/${session?.user.id}/habits`);
        const data = await response.json();
        setHabits(data.reverse());
      } catch (error) {
        console.error("Failed to fetch habits", error);
      } finally {
        setHabitsLoaded(true);
      }
    };

    if (session?.user.id) {
      fetchHabits();
    }
  }, [session]);

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

  const handleSubmit = () => {
    console.log("===VAL IN SUBMIT FORM", gratefulItems);
    //dont submit if gratefulItems/length <= 0
    onSubmit(gratefulItems);
  };

  return (
    <div className="grid grid-rows-[auto,1fr] h-full">
      <div class="mb-3">
        <div className="text-center mb-4">
          {currentStep === 0 && <Title text={"Channel Willpower"} />}
          {currentStep === 1 && <Title text={"Concentrate Willpower"} />}
          {currentStep === 2 && <Title text={"GG GL HF"} />}
        </div>
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
            gratefulItems={gratefulItems}
            addGratefulItem={addGratefulItem}
          />
        )}
        {currentStep === 1 && (
          <JournalConcentrateForm
            gratefulItems={gratefulItems}
            habitWillpower={habitWillpower}
            setHabitWillpower={setHabitWillpower}
            habits={habits}
            setHabits={setHabits}
            habitsLoaded={habitsLoaded}
          />
        )}
        {currentStep === 2 && (
          <>
            <JournalFormSummary
              gratefulItems={gratefulItems}
              habits={habits}
              habitWillpower={habitWillpower}
              submitting={submitting}
              handleSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default JournalForm;
