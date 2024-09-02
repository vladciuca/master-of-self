import "@styles/global.css";
import Header from "@components/Header";
import Footer from "@components/Footer";
import LandingPage from "@components/LandingPage";
import Provider from "@components/Provider";
import { ThemeProvider } from "@components/theme-provider";
import { Poppins } from "next/font/google";
// import { Silkscreen } from "next/font/google";
import { ReactNode } from "react";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

// const font = Silkscreen({
//   weight: ["400"],
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Master of Self",
  description: "Take control of your life",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`relative ${font.className}`}>
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="phone_container fixed sm:border-2 sm:rounded-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto flex flex-col items-center justify-center w-full max-w-[450px] sm:max-h-[800px] h-screen overflow-hidden">
              <div className="fixed top-0 w-full h-20">
                <Header />
              </div>

              <div className="my-20 p-4 h-full w-full overflow-scroll border rounded-3xl">
                <LandingPage children={children} />
              </div>

              <div className="fixed bottom-0 w-full h-20">
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
