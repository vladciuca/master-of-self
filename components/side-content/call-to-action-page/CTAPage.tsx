import React from "react";

export function CTAPage() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-12 max-w-2xl px-6 mx-auto">
      <h1 className="text-5xl md:text-6xl font-bold leading-loose text-primary bg-clip-text text-center">
        What thoughts do you put in your head?
      </h1>

      <span>
        <p className="text-lg md:text-xl text-muted-foreground font-light text-center px-12">
          Create daily prompts, track your growth, and discover how others stay
          disciplined — all in one shared journaling space.
        </p>
        <p className="text-lg md:text-xl text-muted-foreground font-light text-center pt-6 pb-12 px-12">
          The questions shape you. The answers fuel you. Start writing.
        </p>
      </span>

      <button className="flex items-center justify-center font-semibold py-5 px-10 rounded-full text-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white bg-[linear-gradient(to_right,_#fbbe25_50%,_#8a5cf7_50%)]">
        Build My Discipline
        <svg
          className="ml-2"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
