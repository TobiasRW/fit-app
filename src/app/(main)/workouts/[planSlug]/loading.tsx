import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import LoadingWorkouts from "@/app/components/loaders/loading-workouts";

export default function Loading() {
  return (
    <main className="mx-auto mt-10 w-11/12 pb-20">
      <Link href="/workouts" className="my-2 flex items-center">
        <CaretLeftIcon size={20} className="text-green" /> Back
      </Link>
      <LoadingWorkouts />
    </main>
  );
}
