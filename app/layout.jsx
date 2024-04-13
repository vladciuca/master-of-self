import "@styles/global.css";
import Header from "@components/Header";
import Footer from "@components/Footer";
import Provider from "@components/Provider";

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
          <main>{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
