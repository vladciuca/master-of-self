import Header from "@components/Header";
import Footer from "@components/Footer";
import SectionContent from "@components/SectionContent";
import { ReactNode } from "react";

interface FullLayoutProps {
  children: ReactNode;
}

const FullLayout = ({ children }: FullLayoutProps) => {
  return (
    <>
      <div className="fixed top-0 w-full h-20">
        <Header />
      </div>
      <div className="my-20 p-4 h-full w-full overflow-scroll border rounded-3xl">
        <SectionContent children={children} />
      </div>
      <div className="fixed bottom-0 w-full h-20">
        <Footer />
      </div>
    </>
  );
};

export default FullLayout;
