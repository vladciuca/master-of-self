import Image from "next/image";
import { MobileScreenBorder } from "./MobileScreenBorder";

export function DisciplineScoresSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center mt-24">
      <div className="text-center text-4xl font-bold">Discipline Scores</div>
      <MobileScreenBorder>
        <Image
          src="/assets/landing-page/discipline_4.png"
          alt="Journal Image"
          width={300}
          height={522}
        />
      </MobileScreenBorder>
      <div className="text-muted-foreground text-center mt-4 mb-12 px-6 max-w-[600px]">
        You can rank up disciplines you engage in during your Morning and
        Evening journaling.
      </div>
    </section>
  );
}
