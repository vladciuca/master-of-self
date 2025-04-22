import { UserOverview } from "@components/profile/UserOverview";
import { DaySplit } from "@components/profile/DaySplit";
import { ThemeToggle } from "@components/profile/ThemeToggle";
import { SignOut } from "@components/profile/SignOut";

export default function Settings() {
  return (
    <div className="flex flex-col space-y-10 pb-4 mt-4">
      <UserOverview />
      <DaySplit />
      <ThemeToggle />
      <SignOut />
    </div>
  );
}
