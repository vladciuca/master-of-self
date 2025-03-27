import Image from "next/image";
import { ScrollArea } from "@components/ui/scroll-area";
import { MobileScreenBorder } from "./MobileScreenBorder";

export function JournalPage() {
  return (
    <ScrollArea className="h-full p-4">
      <div className="w-full items-center justify-center text-center text-4xl">
        Journal Disciplines
      </div>
      <div>Steps you engage in journaling award Discipline Points</div>
      <div>
        Steps allow you to individually target and track your disciplines
      </div>
      <MobileScreenBorder>
        <Image
          src="/assets/landing-page/discipline_1.png"
          alt="Journal Image"
          width={300}
          height={522}
        />
      </MobileScreenBorder>

      <MobileScreenBorder>
        <Image
          src="/assets/landing-page/discipline_2.png"
          alt="Journal Image"
          width={300}
          height={522}
        />
      </MobileScreenBorder>

      <div className="w-full items-center justify-center text-center text-4xl">
        Track these daily
      </div>
      <MobileScreenBorder>
        <Image
          src="/assets/landing-page/discipline_3.png"
          alt="Journal Image"
          width={300}
          height={522}
        />
      </MobileScreenBorder>
      <div className="w-full items-center justify-center text-center text-4xl">
        Track these via bars
      </div>
      <MobileScreenBorder>
        <Image
          src="/assets/landing-page/discipline_4.png"
          alt="Journal Image"
          width={300}
          height={522}
        />
      </MobileScreenBorder>
    </ScrollArea>
  );
}
