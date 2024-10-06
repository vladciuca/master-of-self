import Link from "next/link";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";

type NewEntryProps = {
  symbol: JSX.Element;
  title: string;
  description: JSX.Element;
  buttonText: string;
  linkTo: string;
  numberOfEntries: number | string;
};

export function NewEntry({
  symbol,
  title,
  linkTo,
  numberOfEntries,
}: NewEntryProps) {
  return (
    <div className="px-2 py-4 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight flex items-center">
            {title}
          </h1>
          <Link href={`${linkTo}`}>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full mx-3"
              // disabled={true}
              // onClick={handleIncrease}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add new {title}</span>
            </Button>
          </Link>
        </div>
        <div className="text-5xl flex items-center font-semibold">
          <span className="mr-2">{symbol}</span>
          {numberOfEntries}
        </div>
      </div>
    </div>
  );
}
