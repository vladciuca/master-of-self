import { ReactNode } from "react";

interface MinimalLayoutProps {
  children: ReactNode;
}

const MinimalLayout = ({ children }: MinimalLayoutProps) => {
  return (
    <div className="h-screen w-full overflow-scroll border rounded-3xl p-4">
      {children}
    </div>
  );
};

export default MinimalLayout;
