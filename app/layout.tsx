import "@styles/global.css";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@lib/authOptions";
import { Provider } from "@context/provider";
import { ThemeProvider } from "@context/theme-provider";
import { SideContentProvider } from "@context/SideContentContext";
import { UserProfileProvider } from "@context/UserProfileContext";
import { Poppins } from "next/font/google";
import { Layout } from "@models/types";
import { SideContent } from "components/side-content/SideContent";

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
            <UserProfileProvider>
              <SideContentProvider>
                <div className="w-full phone_container sm:h-screen flex bg-background relative">
                  <div className="absolute inset-0 opacity-35 bg-gradient-to-br from-[#a6d9ff] via-[#bcb4ff] to-purple-300"></div>

                  {/* Side Content */}
                  <SideContent />

                  <div className="w-full h-full flex items-center justify-center relative z-10">
                    <div className="phone_container relative bg-background sm:border-8 sm:border-muted sm:rounded-[40px] sm:shadow-xl sm:shadow-gray-950 mx-auto flex flex-col items-center justify-center w-full max-w-[450px] sm:max-h-[800px] overflow-hidden">
                      {/* Notch */}
                      <div className="hidden md:block bg-muted absolute left-1/2 top-0 h-4 w-40 -translate-x-1/2 rounded-b-3xl"></div>
                      {children}
                    </div>
                  </div>
                </div>
              </SideContentProvider>
            </UserProfileProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
