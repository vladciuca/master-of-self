import { PageHeader } from "@components/PageHeader";
import { Target } from "lucide-react";

const PAGE_HEADER_DETAILS = {
  symbol: <Target size={"2rem"} />,
  title: "Goals",
  linkTo: "/create-goal",
};

export default function Goals() {
  return (
    <div>
      <PageHeader
        symbol={PAGE_HEADER_DETAILS.symbol}
        title={PAGE_HEADER_DETAILS.title}
        linkTo={PAGE_HEADER_DETAILS.linkTo}
        numberOfEntries={0}
      />
    </div>
  );
}
