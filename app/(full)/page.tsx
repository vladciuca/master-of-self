import PageLogo from "@components/PageLogo";

const Home = () => {
  return (
    <section className="flex flex-col h-full items-center justify-center">
      <div className="text-center mt-10">
        <span className="italic">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {"In this moment I have"}
          </h3>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {"everything I need"}
          </h3>
        </span>
      </div>
      <PageLogo />
    </section>
  );
};

export default Home;
