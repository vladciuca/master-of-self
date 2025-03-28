import Image from "next/image";
import { MobileScreenBorder } from "./MobileScreenBorder";
import { FaSun, FaMoon } from "react-icons/fa6";

export function JournalStepsSection() {
  return (
    <section>
      <div className="w-full flex flex-col items-center justify-center mt-12">
        <div className="text-center text-4xl font-bold">Journal Steps</div>
        <div className="text-muted-foreground text-center mt-4 px-6 max-w-[600px]">
          Each journal step contributes to a specific discipline, granting it
          score points.
        </div>
      </div>

      <div>
        <div className="w-full flex justify-center mt-6">
          <FaSun className="text-secondary" size={40} />
        </div>
        <MobileScreenBorder>
          <Image
            src="/assets/landing-page/discipline_1.png"
            alt="Journal Image"
            width={300}
            height={522}
          />
        </MobileScreenBorder>
      </div>

      <div>
        <div className="w-full flex justify-center mt-6">
          <FaMoon className="text-secondary" size={40} />
        </div>
        <MobileScreenBorder>
          <Image
            src="/assets/landing-page/discipline_2.png"
            alt="Journal Image"
            width={300}
            height={522}
          />
        </MobileScreenBorder>
      </div>
    </section>
  );
}
