"use client";

import { useState, useEffect } from "react";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { FaBoltLightning } from "react-icons/fa6";

init({ data });

const JournalSkill = ({ habitWillpower }) => {
  const [habitDetails, setHabitDetails] = useState({});
  const habitIdList = Object.keys(habitWillpower);

  const getHabitDetails = async (id) => {
    try {
      const response = await fetch(`api/habit/${id}`);
      const habitData = await response.json();
      console.log("===DATA_HABIT", habitData);
      setHabitDetails((prevDetails) => ({
        ...prevDetails,
        [id]: habitData.icon,
      }));
    } catch (error) {
      console.error("Error fetching habit details:", error);
    }
  };

  useEffect(() => {
    habitIdList.forEach((id) => {
      if (!id) return;
      getHabitDetails(id);
    });
  }, []);

  console.log("habitDetails:", habitDetails);

  return (
    <div className="flex items-center space-x-4">
      {Object.entries(habitWillpower).map(([id, willpower]) => {
        if (!id || !habitDetails[id]) return null;
        return (
          <div className="flex items-center">
            <em-emoji key={id} id={habitDetails[id]} size="2rem" />
            <span className="ml-1 text-lg flex items-center">
              + {willpower} <FaBoltLightning size="0.8rem" />
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default JournalSkill;
