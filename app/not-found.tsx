import FullLayout from "./(full)/layout";

export default function NotFound() {
  return (
    <FullLayout>
      <div className="flex-grow flex items-center justify-center h-full">
        <section className="text-center -mt-24">
          <h1 className="scroll-m-20 text-4xl font-bold mb-10">404</h1>
          <p className="leading-7 mt-6 mx-8">
            Sorry, the page you are looking for does not exist.
          </p>
        </section>
      </div>
    </FullLayout>
  );
}
