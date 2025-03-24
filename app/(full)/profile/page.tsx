import { TotalWillpower } from "@components/profile/TotalWillpower";
import { WeeklyWillpowerChart } from "@components/profile/weekly-willpower-chart/WeeklyWillpowerChart";
import { Routine } from "@components/profile/routine/Routine";
import { DaySplit } from "@components/profile/DaySplit";
import { ThemeToggle } from "@components/profile/ThemeToggle";
import { SignOut } from "@components/profile/SignOut";

export default function Profile() {
  return (
    <div className="flex flex-col space-y-10 pb-4 mt-4">
      <TotalWillpower />
      <WeeklyWillpowerChart />
      <Routine />
      <DaySplit />
      <ThemeToggle />
      <SignOut />
    </div>
  );
}
