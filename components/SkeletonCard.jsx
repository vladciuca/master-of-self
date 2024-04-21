import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

const SkeletonCard = () => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-1/2 h-[35px]" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="w-1/6 h-[20px] rounded-full" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <Skeleton className="w-full h-[25px]" />
        </p>
      </CardContent>
      <CardFooter>
        <Skeleton className="w-1/6 h-[40px] mr-3" />
        <Skeleton className="w-1/6 h-[40px]" />
      </CardFooter>
    </Card>
  );
};

export default SkeletonCard;
