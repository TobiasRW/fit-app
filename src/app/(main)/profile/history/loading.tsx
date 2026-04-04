import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import LoadingPlansHistory from "@/app/components/loaders/loading-plans-history";

export default function Loading() {
  return (
    <main className="mx-auto mt-10 w-11/12 pb-20">
      <section>
        <Link href="/profile" className="my-2 flex items-center">
          <CaretLeftIcon size={20} className="text-green" /> Back
        </Link>
        <h1 className="text-4xl font-bold">Your Workout History</h1>
      </section>

      <section className="relative mt-6 space-y-4">
        <LoadingPlansHistory />
      </section>
    </main>
  );
}
