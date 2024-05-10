import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

const JournalFormNavigation = ({ formSteps, currentStep, prev, next }) => {
  return (
    <div className="flex items-center pb-4">
      <button type="button" size="sm" onClick={prev}>
        <RxChevronLeft className="mr-1" size="2rem" />
      </button>
      <ol className="flex items-center w-full px-5">
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
      <button type="button" size="sm" onClick={next}>
        <RxChevronRight className="ml-1" size="2rem" />
      </button>
    </div>
  );
};

export default JournalFormNavigation;
