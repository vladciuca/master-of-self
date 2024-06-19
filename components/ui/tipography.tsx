export const BigTitle = ({ text }: { text: String }) => {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {text}
    </h1>
  );
};

export const Title = ({ text }: { text: String }) => {
  return (
    <h2 className="mt-18 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      {text}
    </h2>
  );
};

export const CardTitle = ({ text }: { text: String }) => {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {text}
    </h3>
  );
};

export const SubTitle = () => {};

export const Info = ({ text }: { text: String }) => {
  return <p className="text-sm mt-2 text-muted-foreground">{text}</p>;
};
