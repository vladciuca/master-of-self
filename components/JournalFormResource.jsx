import { FaBoltLightning } from "react-icons/fa6";

const JournalFormResource = ({ currentStep, willpower }) => {
  return (
    <div>
      {(currentStep === 0 || currentStep === 1) && (
        <div className="flex justify-center items-center">
          <h1 className="text-6xl font-bold tracking-tight text-center mr-2">
            {willpower}
          </h1>
          <FaBoltLightning size={"3rem"} />
        </div>
      )}
    </div>
  );
};

export default JournalFormResource;
