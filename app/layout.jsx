import "@styles/global.css";
import Header from "@components/Header";
import Footer from "@components/Footer";
import Section from "@components/Section";
import Provider from "@components/Provider";
// import { Suspense } from "react";
import { ThemeProvider } from "@components/theme-provider";

export const metadata = {
  title: "Master of Self",
  description: "Take control of your life",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative container">
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="fixed sm:border-2 sm:rounded-3xl flex flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto flex items-center justify-center w-full max-w-[450px] sm:max-h-[800px] h-screen overflow-hidden">
              <div className="fixed top-0 w-full h-24">
                <Header />
              </div>
              <div className="my-24 p-4 h-full w-full overflow-scroll border rounded-3xl">
                <Section children={children} />
              </div>
              <div className="fixed bottom-0 w-full h-24">
                <Footer />
              </div>
            </div>
          </ThemeProvider>
          {/* <Suspense fallback={<div>Loading...</div>}>
            <main>{children}</main>
          </Suspense> */}
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
