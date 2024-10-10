import Link from "next/link";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";

type PageHeaderProps = {
  symbol: JSX.Element;
  title: string;
  linkTo: string;
  numberOfEntries: number | string;
};

export function PageHeader({
  symbol,
  title,
  linkTo,
  numberOfEntries,
}: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background px-2 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight flex items-center">
            {title}
          </h1>
          <Link href={`${linkTo}`}>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full mx-3"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add new {title}</span>
            </Button>
          </Link>
        </div>
        <div className="text-4xl flex items-center font-bold">
          <span className="mr-2">{symbol}</span>
          {numberOfEntries}
        </div>
      </div>
    </div>
  );
}
