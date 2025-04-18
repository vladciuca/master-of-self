import { DisciplineProgressBar } from "@components/disciplines/DisciplineProgressBar";
import { AddNewButton } from "@components/profile/AddNewButton";
import { FaPersonCircleQuestion } from "react-icons/fa6";

export function NewDisciplineCard() {
  return (
    <div className="flex flex-row w-full border rounded-md pt-5 pb-3 px-2 mb-4">
      {/* Icon section */}
      <div className="w-2/12 flex items-center justify-center mb-0">
        {/* Define the SVG filter for the rainbow gradient */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(245, 158, 11)" />
              <stop offset="35%" stopColor="rgb(132, 204, 22)" />
              <stop offset="50%" stopColor="rgb(14, 165, 233)" />
              <stop offset="100%" stopColor="rgb(192, 132, 252)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Icon with the rainbow gradient applied */}
        <FaPersonCircleQuestion
          size={45}
          className="[&>*]:fill-[url(#rainbow)]"
        />
      </div>

      {/* Content section */}
      <div className="w-8/12 px-2">
        {/* Level Bar */}
        <div className="-mt-2">
          <DisciplineProgressBar
            xp={0}
            projectedXp={0}
            name={"New Discipline"}
            showXpMetrics={true}
            height={3}
            color={"primary"}
          />
        </div>
      </div>

      {/* AddNewButton */}
      <div className="w-2/12 flex items-center justify-center mt-0">
        <AddNewButton
          title="Create New Discipline"
          linkTo="/create-discipline"
        />
      </div>
    </div>
  );
}
