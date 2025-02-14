import { Layout } from "@models/types";

export default function MinimalLayout({ children }: Layout) {
  return (
    <>
      <div className="h-screen w-full overflow-scroll">{children}</div>
    </>
  );
}
