import { GiSecretBook } from "react-icons/gi";
import { LogoAnimation } from "./logo/LogoAnimation";

export function PageLogo() {
  return (
    <LogoAnimation>
      <div className="relative z-10 flex justify-center animate-float">
        <GiSecretBook
          size="14rem"
          className="text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.45)] max-w-[50vw] mt-4"
        />
      </div>
      <div className="absolute bottom-8 left-0 right-0 z-10 px-6 text-center">
        <span className="inline-block uppercase tracking-[0.25em] text-xs sm:text-sm font-normal text-white/80">
          Unlock your Potential
        </span>
      </div>
    </LogoAnimation>
  );
}
