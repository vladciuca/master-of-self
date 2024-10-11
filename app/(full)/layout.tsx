import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { PageContent } from "@components/PageContent";
import { Layout } from "@app/types/types";

export default function FullLayout({ children }: Layout) {
  return (
    <>
      <div className="fixed top-0 w-full h-20">
        <Header />
      </div>
      <div className="my-20 px-4 h-full w-full overflow-scroll border rounded-3xl">
        <PageContent children={children} />
      </div>
      <div className="fixed bottom-0 w-full h-20">
        <Footer />
      </div>
    </>
  );
}
