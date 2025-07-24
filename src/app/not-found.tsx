import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbfbfb] p-6">
      <div className="max-w-md rounded-2xl p-8 text-center">
        <h1 className="mb-4 text-4xl font-bold text-[#0a0a0a]">
          404 - Not Found
        </h1>
        <p className="mb-6 text-[#0a0a0a]">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-[#1db954] px-4 py-2 font-semibold text-white transition duration-200 hover:bg-[#14833e]"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
