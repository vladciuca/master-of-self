import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, Users, Edit3 } from "lucide-react";
import { FaRegCompass } from "react-icons/fa";

const cardData = [
  {
    title: "Pre-Made",
    icon: <Box size={28} />,
    description:
      "Dive into our curated set of disciplines designed to help you build strong habits from day one.",
    href: "/community?page=built-in",
  },
  {
    title: "Community Picks",
    icon: <Users size={28} />,
    description:
      "Discover what others are doing—gain insight, spark ideas, and tailor a discipline that fits your style.",
    href: "/community?page=disciplines",
  },
  {
    title: "Build Your Own",
    icon: <Edit3 size={28} />,
    description:
      "Start fresh with a blank slate. Design a discipline that aligns with your personal goals and values.",
    href: "/create-discipline",
  },
];

export default function ExploreDisciplines() {
  const getCardStyles = (index: number) => {
    switch (index) {
      case 0:
        return "border-l-6 border-l-primary border-transparent";
      case 1:
        return "border-l-6 border-transparent relative";
      case 2:
        return "border-transparent relative";
      default:
        return "border-transparent";
    }
  };

  const renderCard = (cardInfo: (typeof cardData)[0], index: number) => {
    const { href, title, icon, description } = cardInfo;

    if (index === 0) {
      // First card with white left border
      return (
        <Link key={index} href={href}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l"></div>
            <Card className="cursor-pointer bg-muted/30 p-2 py-4 sm:py-6 flex flex-col justify-center items-center border-transparent ml-1.5">
              <CardTitle className="mb-1 text-base sm:text-lg text-center">
                {title}
              </CardTitle>
              <CardDescription className="text-center text-sm">
                {description}
              </CardDescription>
            </Card>
          </div>
        </Link>
      );
    }

    if (index === 1) {
      // Second card with left rainbow border (keep as is)
      return (
        <Link key={index} href={href}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 rounded-l"></div>
            <Card className="cursor-pointer bg-muted/30 p-2 py-4 sm:py-6 flex flex-col justify-center items-center border-transparent ml-1.5">
              <CardTitle className="mb-1 text-base sm:text-lg text-center">
                {title}
              </CardTitle>
              <CardDescription className="text-center text-sm">
                {description}
              </CardDescription>
            </Card>
          </div>
        </Link>
      );
    }

    if (index === 2) {
      // Third card with full rainbow border, no background
      return (
        <Link key={index} href={href}>
          <div className="p-1.5 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 rounded-lg">
            <div className="cursor-pointer bg-background p-2 py-4 sm:py-6 flex flex-col justify-center items-center rounded-sm">
              <CardTitle className="mb-1 text-base sm:text-lg text-center">
                {title}
              </CardTitle>
              <CardDescription className="text-center text-sm">
                {description}
              </CardDescription>
            </div>
          </div>
        </Link>
      );
    }

    return null;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="pt-6 h-[13vh] sm:h-[20vh] flex flex-col justify-center items-center space-y-6">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
          Explore Disciplines
        </h1>
        <FaRegCompass size={40} />
      </div>
      <div className="flex-grow px-4">
        <div className="h-full flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          {cardData.map((cardInfo, index) => renderCard(cardInfo, index))}
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
