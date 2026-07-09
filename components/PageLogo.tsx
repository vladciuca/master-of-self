import { GiSecretBook } from "react-icons/gi";

export function PageLogo() {
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
          <div className="w-[min(110vmin,30rem)] aspect-square rounded-full border border-dashed border-white/[0.25] animate-[spin_45s_linear_infinite]" />
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

      <div className="relative z-10 flex justify-center animate-[float_6s_ease-in-out_infinite]">
        <GiSecretBook
          size="18rem"
          className="text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.45)] max-w-[50vw]"
        />
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10 px-6 text-center">
        <span className="inline-block uppercase tracking-[0.25em] text-xs sm:text-sm font-normal text-white/80">
          Unlock your Potential
        </span>
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
