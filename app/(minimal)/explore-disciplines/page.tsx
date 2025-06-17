import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@components/ui/button";
import { FiBox, FiUsers, FiEdit3 } from "react-icons/fi";

const cardData = [
  {
    title: "Pre-Made",
    icon: <FiBox size={28} />,
    description:
      "Dive into our curated set of disciplines designed to help you build strong habits from day one.",
    href: "/community?page=built-in",
  },
  {
    title: "Community Picks",
    icon: <FiUsers size={28} />,
    description:
      "Discover what others are doing—gain insight, spark ideas, and tailor a discipline that fits your style.",
    href: "/community?page=disciplines",
  },
  {
    title: "Build Your Own",
    icon: <FiEdit3 size={28} />,
    description:
      "Start fresh with a blank slate. Design a discipline that aligns with your personal goals and values.",
    href: "/create-discipline",
  },
];

export default function ExploreDisciplines() {
  return (
    <div className="h-full flex flex-col">
      <div className="h-[13vh] sm:h-[20vh] flex flex-col justify-center items-center">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
          Explore Disciplines
        </h1>
        {/* <Compass className="h-10 w-10 text-primary mt-4" /> */}
      </div>
      <div className="flex-grow px-4">
        <div className="h-full flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          {cardData.map(({ href, title, icon, description }, index) => (
            <Link key={index} href={href}>
              <Card
                className={`cursor-pointer bg-muted/30 p-2 py-4 sm:py-6 flex flex-col justify-center items-center border-transparent`}
              >
                <CardTitle className="mb-1 text-base sm:text-lg text-center">
                  {title}
                </CardTitle>
                <span className="text-primary mb-2">{icon}</span>
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
