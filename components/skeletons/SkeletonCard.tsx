import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Skeleton } from "../ui/skeleton";

const SkeletonCard = () => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-1/2 h-[35px]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <Skeleton className="w-full h-[25px]" />
        </p>
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;
