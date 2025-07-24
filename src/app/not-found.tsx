import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center p-6">
      <div className=" rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-[#0a0a0a] mb-4">
          404 - Not Found
        </h1>
        <p className="text-[#0a0a0a] mb-6">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#1db954] hover:bg-[#14833e] text-white font-semibold py-2 px-4 rounded-full transition duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
