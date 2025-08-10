import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md rounded-2xl p-8 text-center">
        <h1 className="text-foreground mb-4 text-4xl font-bold">
          404 - Not Found
        </h1>
        <p className="text-foreground mb-6">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Link
          href="/"
          className="bg-green inline-block rounded-full px-4 py-2 font-semibold text-white"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
