import Image from "next/image";
import { MobileScreenBorder } from "./MobileScreenBorder";

export function JournalEntriesSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center mt-28">
      <div className="text-center text-4xl font-bold">Journal Entries</div>
      <MobileScreenBorder>
        <Image
          src="/assets/landing-page/discipline_3.png"
          alt="Journal Image"
          fill
          sizes="(max-width: 300px) 100vw, 300px"
          className="object-contain"
        />
      </MobileScreenBorder>
      <div className="text-muted-foreground text-center mt-4 px-6 max-w-[600px]">
        Each day represents a new challenge and you can track how well you
        prepare by earning points in disciplines like "Motivation".
      </div>
    </section>
  );
}
