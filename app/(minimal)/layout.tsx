import { Layout } from "@app/types/types";

const MinimalLayout = ({ children }: Layout) => {
  return <div className="h-screen w-full overflow-scroll p-4">{children}</div>;
};

export default MinimalLayout;
