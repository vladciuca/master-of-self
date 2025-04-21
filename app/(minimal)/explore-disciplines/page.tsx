import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Compass, Users, PenTool } from "lucide-react";
import { Button } from "@components/ui/button";

const cardData = [
  {
    title: "Custom Disciplines",
    description:
      "Dive into our curated set of disciplines designed to help you build strong habits from day one.",
    href: "/default",
    // color: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
    color: "bg-muted/30",
    hoverColor: "hover:shadow-blue-200/50 hover:border-primary",
    icon: <Compass className="h-8 w-8 text-primary mb-2" />,
  },
  {
    title: "Community Inspirations",
    description:
      "Discover what others are doing—gain insight, spark ideas, and tailor a discipline that fits your style.",
    href: "/explore",
    // color: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
    color: "bg-muted/30",
    hoverColor: "hover:shadow-purple-200/50 hover:border-purple-500",
    icon: <Users className="h-8 w-8 text-purple-500 mb-2" />,
  },
  {
    title: "Create Your Own",
    description:
      "Start fresh with a blank slate. Design a discipline that aligns with your personal goals and values.",
    href: "/create-discipline",
    // color:
    //   "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200",
    color: "bg-muted/30",
    // hoverColor: "hover:shadow-emerald-200/50 hover:border-emerald-500",
    hoverColor:
      "group-hover:bg-gradient-to-r from-amber-500 via-lime-500 via-sky-500 to-purple-400",
    icon: <PenTool className="h-8 w-8 text-emerald-500 mb-2" />,
  },
];

// export default function ExploreDisciplines() {
//   return (
//     <div className="flex flex-col justify-center items-center px-6 sm:px-8 max-w-6xl mx-auto h-[10vh]">
//       <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center mb-6 h-[10vh]">
//         Explore Disciplines
//       </h1>

//       <div className="grid grid-cols-1 gap-6 w-full h-[80vh]">
//         {cardData.map(
//           ({ title, description, href, color, hoverColor, icon }, idx) => (
//             // <Link key={idx} href={href} className="w-full">
//             //   <Card
//             //     className={`p-6 ${color} border transition-all duration-300 cursor-pointer flex flex-col items-center ${hoverColor} hover:scale-105 h-full`}
//             //   >
//             //     {icon}
//             //     <CardTitle className="mb-3">{title}</CardTitle>
//             //     <CardDescription className="text-center">
//             //       {description}
//             //     </CardDescription>
//             //   </Card>
//             // </Link>
//             <Link key={idx} href={href} className="w-full group">
//               <div className="relative p-[2px] rounded-xl transition-all duration-300 group-hover:bg-gradient-to-r from-amber-500 via-lime-500 via-sky-500 to-purple-400">
//                 <Card
//                   className={`h-full w-full p-4 md:p-6 ${color} border border-transparent rounded-xl group-hover:border-transparent transition-all duration-300 flex flex-col items-center justify-start`}
//                 >
//                   {icon}
//                   <CardTitle className="mb-2 text-base md:text-lg text-center">
//                     {title}
//                   </CardTitle>
//                   <CardDescription className="text-center text-sm">
//                     {description}
//                   </CardDescription>
//                 </Card>
//               </div>
//             </Link>
//           )
//         )}
//       </div>
//       <div className="w-full h-[10vh]">
//         <Button variant="secondary" className="w-full">
//           Cancel
//         </Button>
//       </div>
//     </div>
//   );
// }
export default function ExploreDisciplines() {
  return (
    <div className="h-full flex flex-col">
      <div className="h-[15vh] flex justify-center items-center">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
          Explore Disciplines
        </h1>
      </div>
      <div className="flex-grow px-6">
        <div className="h-full flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          {cardData.map(({ href, color, icon, title, description }, index) => (
            <Link key={index} href={href}>
              <Card
                className={`p-2 sm:py-4 flex flex-col justify-center items-center`}
              >
                {icon}
                <CardTitle className="mb-2 text-base md:text-lg text-center">
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
      <div className="h-[10vh] flex justify-center items-center px-6">
        <Button variant="secondary" className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  );
}
