import "@styles/global.css";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@lib/authOptions";
import { Provider } from "@context/provider";
import { ThemeProvider } from "@context/theme-provider";
import { Poppins } from "next/font/google";
import { Layout } from "@app/types/types";

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
              {children}
            </div>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
