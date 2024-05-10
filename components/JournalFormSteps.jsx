import { Title, Info } from "./ui/tipography";
import { FaBoltLightning } from "react-icons/fa6";

const JournalFormSteps = ({ currentStep, willpower }) => {
  return (
    <div className="h-44">
      <div className="text-center">
        {currentStep === 0 && (
          <>
            <Title text={"Channel Willpower"} />
            <Info
              text={
                "Channel positive energy by thinking about the things you are grateful for. For each thing you generate Willpower."
              }
            />
          </>
        )}
        {currentStep === 1 && (
          <>
            <Title text={"Direct Willpower"} />
            <Info
              text={
                "Infuse Willpower in your Habits to increase their power. Increasing their power level unlocks additional perks."
              }
            />
          </>
        )}
        {currentStep === 2 && (
          <>
            <Title text={"GG"} />
            <Info text={"Wipity WIP"} />
          </>
        )}
      </div>

      {(currentStep === 0 || currentStep === 1) && (
        <div className="flex justify-center items-center my-3">
          <h1 className="text-6xl font-bold tracking-tight text-center mr-2">
            {willpower}
          </h1>
          <FaBoltLightning size={"3rem"} />
        </div>
      )}
    </div>
  );
};

export default JournalFormSteps;
