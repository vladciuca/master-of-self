import { SectionHeader } from "@components/SectionHeader";
// import { SkeletonHabitCard } from "@components/skeletons/SkeletonHabitCard";
import { Shell } from "lucide-react";

const SECTION_HEADER_PAGE_DETAILS = {
  symbol: <Shell size={"2.6rem"} />,
  title: "Masteries",
  linkTo: "/create-mastery",
};

// const skeletonCards = Array.from({ length: 3 }, (_, index) => (
//   <SkeletonHabitCard key={index} />
// ));

export function UserMasteries() {
  return (
    <div>
      <SectionHeader
        symbol={SECTION_HEADER_PAGE_DETAILS.symbol}
        title={SECTION_HEADER_PAGE_DETAILS.title}
        linkTo={SECTION_HEADER_PAGE_DETAILS.linkTo}
        numberOfEntries={1}
      />
      <div></div>UserMasteries
    </div>
  );
}
