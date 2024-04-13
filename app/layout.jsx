import "@styles/global.css";
import Header from "@components/Header";
import Footer from "@components/Footer";
import Provider from "@components/Provider";
import { Suspense } from "react";

export const metadata = {
  title: "Master of Self",
  description: "Take control of your life",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg-white-200 dark:bg-gray-800 antialiased">
        <Provider>
          <Header />
          <Suspense fallback={<div>Loading...</div>}>
            <main>{children}</main>
          </Suspense>
          <Footer />
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
