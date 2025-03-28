// export function MobileScreenBorder({ img }: React.ReactNode) {
//   return (
//     <div className="h-auto w-auto relative bg-background sm:border-4 sm:border-muted sm:rounded-3xl sm:shadow-xl sm:shadow-gray-950 mx-auto flex flex-col items-center justify-center max-w-[450px] sm:max-h-[800px] overflow-hidden">
//       {/* Notch */}
//       <div className="hidden md:block bg-muted absolute left-1/2 top-0 h-2 w-20 -translate-x-1/2 rounded-b-3xl">
//         {img}
//       </div>
//     </div>
//   );
// "use client"

import type React from "react";

interface MobileScreenBorderProps {
  children?: React.ReactNode;
  //   img?: React.ReactNode;
}

export function MobileScreenBorder({
  children,
}: // img
MobileScreenBorderProps) {
  const content = children;
  //   || img
  return (
    <div className="my-6 h-[522px] w-[295px] relative bg-background sm:border-4 sm:border-muted sm:rounded-3xl sm:shadow-xl sm:shadow-gray-950 mx-auto flex flex-col items-center justify-center max-w-[450px] sm:max-h-[800px] overflow-hidden">
      {/* Notch */}
      <div className="hidden md:block bg-muted absolute left-1/2 top-0 h-2 w-20 -translate-x-1/2 rounded-b-3xl z-10"></div>

      {/* Content */}
      <div className="relative w-full h-full">{content}</div>
    </div>
  );
}
