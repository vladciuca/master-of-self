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
          <Skeleton className="w-1/2 h-[45px]" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="w-1/4 h-[20px] rounded-full" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <Skeleton className="w-full h-[20px]" />
        </p>
      </CardContent>
      <CardFooter>
        <Skeleton className="w-1/6 h-[30px] mr-3" />
        <Skeleton className="w-1/6 h-[30px]" />
      </CardFooter>
    </Card>
  );
};

export default SkeletonCard;
