import { Layout } from "@app/types/types";

const MinimalLayout = ({ children }: Layout) => {
  return <div className="h-screen w-full overflow-scroll">{children}</div>;
};

export default MinimalLayout;
