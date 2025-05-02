import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Compass } from "lucide-react";
import { Button } from "@components/ui/button";

const cardData = [
  {
    title: "Custom Disciplines",
    description:
      "Dive into our curated set of disciplines designed to help you build strong habits from day one.",
    href: "/community?page=built-in",
  },
  {
    title: "Community Inspirations",
    description:
      "Discover what others are doing—gain insight, spark ideas, and tailor a discipline that fits your style.",
    href: "/community?page=disciplines",
  },
  {
    title: "Create Your Own",
    description:
      "Start fresh with a blank slate. Design a discipline that aligns with your personal goals and values.",
    href: "/create-discipline",
  },
];

export default function ExploreDisciplines() {
  return (
    <div className="h-full flex flex-col">
      <div className="h-[20vh] flex flex-col justify-center items-center">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
          Explore Disciplines
        </h1>
        <Compass className="h-10 w-10 text-primary mt-4" />
      </div>
      <div className="flex-grow px-6">
        <div className="h-full flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          {cardData.map(({ href, title, description }, index) => (
            <Link key={index} href={href}>
              <Card
                className={`cursor-pointer bg-muted/30 p-2 py-4 sm:py-6 flex flex-col justify-center items-center border-transparent`}
              >
                <CardTitle className="mb-2 text-base sm:text-lg text-center">
                  {title}
                </CardTitle>
                <CardDescription className="text-center text-sm">
                  {description}
                </CardDescription>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <div className="h-[10vh] flex justify-center items-center px-4">
        <Link href="profile?page=disciplines" className="w-full">
          <Button variant="secondary" className="w-full">
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}
