import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { PageContent } from "@components/PageContent";
import { Layout } from "@app/types/types";

export default function FullLayout({ children }: Layout) {
  return (
    <div className="flex flex-col w-full h-full relative sm:pt-2">
      <div className="min-h-20 flex items-center justify-center py-2 sm:mt-1 sm:mb-2">
        <Header />
      </div>
      <div className="flex-grow overflow-hidden border rounded-3xl">
        <div className="h-full px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <PageContent>{children}</PageContent>
        </div>
      </div>
      <div className="min-h-20">
        <Footer />
      </div>
    </div>
  );
}
