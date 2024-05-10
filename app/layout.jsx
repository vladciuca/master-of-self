import "@styles/global.css";
import Header from "@components/Header";
import Footer from "@components/Footer";
import LandingPage from "@components/LandingPage";
import Provider from "@components/Provider";
import { ThemeProvider } from "@components/theme-provider";
// import { Aclonica } from "next/font/google";
// import { Silkscreen } from "next/font/google";
// import { DotGothic16 } from "next/font/google";
import { Poppins } from "next/font/google";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Master of Self",
  description: "Take control of your life",
  // viewport: "width=device-width, initial-scale=1.0",
};

const RootLayout = ({ children }) => {
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
            <div className="phone_container fixed sm:border-2 sm:rounded-3xl flex flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto flex items-center justify-center w-full max-w-[450px] sm:max-h-[800px] h-screen overflow-hidden">
              <div className="fixed top-0 w-full h-24">
                <Header />
              </div>

              <div className="my-24 p-4 h-full w-full overflow-scroll border rounded-3xl">
                <LandingPage children={children} />
              </div>

              <div className="fixed bottom-0 w-full h-24">
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
