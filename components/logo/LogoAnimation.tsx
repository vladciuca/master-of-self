import { ReactNode } from "react";

interface LogoAnimationProps {
  children: ReactNode;
}

export function LogoAnimation({ children }: LogoAnimationProps) {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-black text-white rounded-md text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_55%)] pointer-events-none z-0" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(110vmin,32rem)] aspect-square rounded-full bg-white/[0.10] blur-[120px] animate-[pulse_5s_ease-in-out_infinite] pointer-events-none z-0" />

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[min(70vmin,18rem)] aspect-square rounded-full border border-white/[0.35] animate-[spin_80s_linear_infinite]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[min(90vmin,24rem)] aspect-square rounded-full border border-white/[0.28] animate-[spin_60s_linear_infinite_reverse]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg
            className="w-[min(110vmin,30rem)] h-[min(110vmin,30rem)] animate-[spin_45s_linear_infinite]"
            viewBox="0 0 200 200"
            aria-hidden="true"
            shapeRendering="geometricPrecision"
          >
            <circle
              cx="100"
              cy="100"
              r="99"
              fill="none"
              className="stroke-purple-500 stroke-1"
              pathLength="100"
              strokeDasharray="50 50"
              strokeDashoffset="0"
              transform="rotate(-90 100 100)"
            />
            <circle
              cx="100"
              cy="100"
              r="99"
              fill="none"
              className="stroke-yellow-500 stroke-1"
              pathLength="100"
              strokeDasharray="50 50"
              strokeDashoffset="50"
              transform="rotate(-90 100 100)"
            />
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[min(130vmin,36rem)] aspect-square rounded-full border border-white/[0.22] animate-[spin_35s_linear_infinite_reverse]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[min(150vmin,42rem)] aspect-square rounded-full border border-white/[0.18] animate-[spin_25s_linear_infinite]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[min(170vmin,48rem)] aspect-square rounded-full border border-white/[0.15] animate-[spin_20s_linear_infinite_reverse]" />
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(60vmin,15rem)] aspect-square animate-[spin_22s_linear_infinite]">
          <div className="absolute top-0 left-1/4 w-1 h-1 rounded-full bg-white/50" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(75vmin,20rem)] aspect-square animate-[spin_30s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(85vmin,22rem)] aspect-square animate-[spin_26s_linear_infinite_reverse]">
          <div className="absolute top-1/4 right-0 w-1 h-1 rounded-full bg-white/45" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(95vmin,26rem)] aspect-square animate-[spin_40s_linear_infinite_reverse]">
          <div className="absolute top-0 right-1/4 w-2 h-2 rounded-full bg-white/30" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(105vmin,28rem)] aspect-square animate-[spin_34s_linear_infinite]">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/35" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(115vmin,32rem)] aspect-square animate-[spin_50s_linear_infinite]">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 rounded-full bg-white/50" />
        </div>
      </div>

      {children}
    </div>
  );
}
