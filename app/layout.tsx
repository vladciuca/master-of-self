import "@styles/global.css";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@lib/authOptions";
import { Provider } from "@context/provider";
import { ThemeProvider } from "@context/theme-provider";
import { SideContentProvider } from "@context/SideContentContext";
import { Poppins } from "next/font/google";
import { Layout } from "@app/types/types";
import { SideContent } from "components/SideContent";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Master of Self",
  description: "Take control of your life",
};

export default async function RootLayout({ children }: Layout) {
  // let session;

  // try {
  //   session = await getServerSession(authOptions);
  // } catch (error) {
  //   console.error("Error fetching session:", error);
  //   session = null; // Fallback in case of error
  // }

  // bg-gradient-to-br from-purple-600 via-pink-500 to-red-500
  // bg-gradient-to-br from-[#a6d9ff] via-[#bcb4ff] to-pink-500
  // bg-gradient-to-r from-[#bcb4ff] to-[#a6d9ff] via-[#a6d9ff] via-48%

  return (
    <html lang="en">
      <body className={`relative ${font.className}`}>
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SideContentProvider>
              <div className="w-full h-screen flex bg-background relative">
                <div className="absolute inset-0 opacity-35 bg-gradient-to-br from-[#a6d9ff] via-[#bcb4ff] to-purple-300"></div>

                {/* Side Content */}
                <SideContent />

                <div className="w-full h-full flex items-center justify-center relative z-10">
                  <div className="relative bg-background phone_container sm:border-8 sm:border-muted sm:rounded-[40px] sm:shadow-xl sm:shadow-gray-950 mx-auto flex flex-col items-center justify-center w-full max-w-[450px] sm:max-h-[800px] h-[90vh] overflow-hidden">
                    {/* Notch */}
                    <div className="hidden md:block bg-muted absolute left-1/2 top-0 h-4 w-40 -translate-x-1/2 rounded-b-3xl"></div>
                    {children}
                  </div>
                </div>
              </div>
            </SideContentProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
