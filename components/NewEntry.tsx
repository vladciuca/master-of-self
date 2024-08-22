import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@components/ui/card";
import { Button } from "./ui/button";

interface NewEntryProps {
  symbol: JSX.Element;
  title: string;
  description: JSX.Element;
  buttonText: string;
  linkTo: string;
  numberOfEntries: number;
}

const NewEntry = ({
  symbol,
  title,
  description,
  buttonText,
  linkTo,
  numberOfEntries,
}: NewEntryProps) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <div>
            <span className="font-normal text-muted-foreground text-xl">
              You have
              <span className="mx-2 font-light text-foreground">
                {numberOfEntries}
              </span>
              active
            </span>

            <div className="my-4 text-3xl flex items-center">
              {symbol}
              {title}
            </div>
          </div>
        </CardTitle>
        <CardDescription className="mt-1 mr-4">{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={`${linkTo}`}>
          <Button size="sm" className="py-3">
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default NewEntry;
