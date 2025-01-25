import FullLayout from "./(full)/layout";

export default function NotFound() {
  return (
    <FullLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl font-bold mb-4">404</h2>
        <p className="mb-4 text-center">
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </FullLayout>
  );
}
