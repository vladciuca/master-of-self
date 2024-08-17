import { CardTitle } from "@components/ui/tipography";
import { GiAllSeeingEye } from "react-icons/gi";

const Home = () => {
  return (
    <section className="flex flex-col h-full items-center justify-center">
      <div className="text-center mt-10">
        <CardTitle text="In this moment I have" />
        <CardTitle text="everything I need" />
      </div>
      <div className="h-full flex items-center justify-center">
        <GiAllSeeingEye size={"20rem"} />
      </div>
    </section>
  );
};

export default Home;
