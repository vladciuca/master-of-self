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
    <div className="flex flex-col h-screen">
      <PageHeader
        symbol={PAGE_HEADER_DETAILS.symbol}
        title={PAGE_HEADER_DETAILS.title}
        linkTo={PAGE_HEADER_DETAILS.linkTo}
        numberOfEntries={0}
        disabled={true}
      />
      <div className="flex-grow flex items-center justify-center mb-44">
        <section className="text-center">
          <h1 className="scroll-m-20 text-4xl font-bold">COMING SOON</h1>
          <p className="leading-7 mt-6">
            Until then you can track your Habits!
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
