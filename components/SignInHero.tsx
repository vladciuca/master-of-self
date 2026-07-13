"use client";

import { GiKey } from "react-icons/gi";

type SignInHeroProps = {
  className?: string;
};

export function SignInHero({ className }: SignInHeroProps) {
  return (
    <div
      className={`relative w-full h-full flex flex-col items-center text-white ${className ?? ""}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_55%)] pointer-events-none z-0" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/[0.10] blur-[80px] animate-[pulse_5s_ease-in-out_infinite] pointer-events-none z-0" />

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 animate-[spin_22s_linear_infinite]">
          <div className="absolute top-0 left-1/4 w-1 h-1 rounded-full bg-white/50" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 animate-[spin_30s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 animate-[spin_26s_linear_infinite_reverse]">
          <div className="absolute top-1/4 right-0 w-1 h-1 rounded-full bg-white/45" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 animate-[spin_40s_linear_infinite_reverse]">
          <div className="absolute top-0 right-1/4 w-2 h-2 rounded-full bg-white/30" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 animate-[spin_34s_linear_infinite]">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/35" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 animate-[spin_50s_linear_infinite]">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 rounded-full bg-white/50" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-[80%] w-full px-4">
        <div className="animate-[float_6s_ease-in-out_infinite]">
          <GiKey
            size="8rem"
            className="text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.45)]"
          />
        </div>

        <div className="mt-4 text-center">
          <span className="inline-block uppercase tracking-[0.25em] text-xs sm:text-sm font-normal text-white/80">
            You hold the Key
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>
    </div>
  );
}
