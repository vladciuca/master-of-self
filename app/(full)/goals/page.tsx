import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Shell, Target } from "lucide-react";

const PAGE_HEADER_DETAILS = {
  symbol: <Target size={"2rem"} />,
  title: "Goals",
  linkTo: "/create-goal",
};

export default function Goals() {
  return (
    <div className="flex flex-col">
      <PageHeader
        symbol={PAGE_HEADER_DETAILS.symbol}
        title={PAGE_HEADER_DETAILS.title}
        linkTo={PAGE_HEADER_DETAILS.linkTo}
        numberOfEntries={0}
        disabled={true}
      />
      <div className="flex-grow flex items-center justify-center">
        <section className="text-center mt-24">
          <h1 className="scroll-m-20 text-4xl font-bold mb-10">COMING SOON</h1>
          <p className="leading-7 mt-6 mx-3">
            Until then you can track your habits!
          </p>
          <Link href="/habits">
            <Button className="mt-5">
              <Shell className="mr-2" />
              Go To Habits
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
