import PageLogo from "@components/PageLogo";
import { CardTitle } from "@components/ui/tipography";

const Home = () => {
  return (
    <section className="flex flex-col h-full items-center justify-center">
      <div className="text-center mt-10">
        <CardTitle text="In this moment I have" />
        <CardTitle text="everything I need" />
      </div>
      <PageLogo />
    </section>
  );
};

export default Home;
