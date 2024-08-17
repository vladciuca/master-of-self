"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Target, Compass } from "lucide-react";
import { FaMoon, FaSun } from "react-icons/fa6";
import { Button } from "@components/ui/button";

const JournalNav = () => {
  const [isAM, setIsAM] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      setIsAM(hours < 12);

      // Calculate remaining time until next 12-hour mark (either 12:00 or 00:00)
      const next12HourMark = new Date(now);
      next12HourMark.setHours(hours < 12 ? 12 : 24, 0, 0, 0);
      const diff = next12HourMark - now;

      const remainingHours = Math.floor(diff / (1000 * 60 * 60));
      const remainingMinutes = Math.floor(
        (diff % (1000 * 60 * 60)) / (1000 * 60)
      );

      setTimeRemaining(
        `${String(remainingHours).padStart(2, "0")}:${String(
          remainingMinutes
        ).padStart(2, "0")}`
      );
    };

    updateClock();
    const intervalId = setInterval(updateClock, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <nav className="flex h-full justify-around items-center w-full">
      <Link href="/missions">
        <Button
          variant="ghost"
          className="flex flex-col items-center hover: rounded-full h-16 px-10"
        >
          <Compass size={"2.4rem"} />
          <div className="text-xs mt-1">Missions</div>
        </Button>
      </Link>

      <Link href="/journal">
        <Button
          variant="ghost"
          className="flex flex-col items-center hover: rounded-full h-16 px-10"
        >
          {isAM ? <FaSun size={"2.4rem"} /> : <FaMoon size={"2.4rem"} />}
          <div className="text-xs mt-1">{timeRemaining}</div>
        </Button>
      </Link>

      <Link href="/habits">
        <Button
          variant="ghost"
          className="flex flex-col items-center hover: rounded-full h-16 px-10"
        >
          <Target size={"2.4rem"} />
          <div className="text-xs mt-1">Habits</div>
        </Button>
      </Link>
    </nav>
  );
};

export default JournalNav;
