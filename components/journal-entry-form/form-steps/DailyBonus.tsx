import React from "react";
import { FaBoltLightning } from "react-icons/fa6";

const DailyBonus = ({ bonusWillpower }: { bonusWillpower: number }) => {
  return (
    <div>
      <div className="text-center mt-20">
        <div className="my-6 flex items-center justify-center">
          <FaBoltLightning size={"3.5rem"} />

          <span className="text-6xl text-green-500 font-semibold">
            {bonusWillpower}
          </span>
        </div>
        Earned from yesterday's highlights!
      </div>
    </div>
  );
};

export default DailyBonus;
