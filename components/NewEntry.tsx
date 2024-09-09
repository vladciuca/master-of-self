import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@components/ui/card";
import { Button } from "@components/ui/button";

type NewEntryProps = {
  symbol: JSX.Element;
  title: string;
  description: JSX.Element;
  buttonText: string;
  linkTo: string;
  numberOfEntries: number;
};

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
            <div className="text-3xl flex items-center">
              {symbol}
              {title}
            </div>
          </div>
        </CardTitle>
        <CardDescription className="mt-1 mr-4">
          You have
          <span className="mx-1 font-light text-foreground">
            {numberOfEntries}
          </span>
          active {title}. {description}
        </CardDescription>
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
