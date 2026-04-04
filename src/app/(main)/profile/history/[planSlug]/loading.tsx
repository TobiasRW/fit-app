import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import LoadingWorkoutHistory from "@/app/components/loaders/loading-workout-history";

export default function Loading() {
  return (
    <main className="mx-auto mt-10 w-11/12 pb-20">
      <section>
        <Link href="/profile/history" className="my-2 flex items-center">
          <CaretLeftIcon size={20} className="text-green" /> Back
        </Link>
        <h1 className="text-4xl font-bold">Workout History</h1>
      </section>
      <LoadingWorkoutHistory />
    </main>
  );
}
