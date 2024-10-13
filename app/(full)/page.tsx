import { GiEmbrassedEnergy } from "react-icons/gi";

export default function Home() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-10 pb-4">
      <GiEmbrassedEnergy size={"20rem"} />
      <p className="italic">"In this moment I have everything I need!"</p>
    </div>
  );
}
