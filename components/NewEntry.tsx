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
  description: string;
  buttonText: string;
}

const NewEntry: React.FC<NewEntryProps> = ({
  symbol,
  title,
  description,
  buttonText,
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex">
          {symbol}
          <span>{title}</span>
        </CardTitle>
        <CardDescription className="mt-1 mr-4">{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href="/create-habit">
          <Button size="sm" className="py-3">
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default NewEntry;
