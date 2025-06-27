import { PageLogo } from "@components/PageLogo";
import { HeaderTitle } from "@components/HeaderTitle";

export function LoadingScreen() {
  return (
    <div className="flex flex-col w-full h-full relative sm:pt-2">
      <div className="min-h-20 flex items-center justify-center py-2 sm:mt-1 sm:mb-2">
        <HeaderTitle />
      </div>
      <div className="flex-grow overflow-hidden border rounded-3xl">
        <div className="h-full px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <PageLogo />
        </div>
      </div>
      <div className="min-h-20">
        <div className="w-full h-full flex justify-center items-center">
          <div className="loader" />
        </div>
      </div>
    </div>
  );
}
