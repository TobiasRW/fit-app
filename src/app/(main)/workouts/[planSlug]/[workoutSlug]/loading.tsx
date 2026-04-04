import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import LoadingExercises from "@/app/components/loaders/loading-exercises";

export default function Loading() {
  return (
    <main className="mx-auto mt-10 w-11/12 pb-40">
      <Link href="/workouts" className="my-2 flex items-center">
        <CaretLeftIcon size={20} className="text-green" /> Back
      </Link>
      <LoadingExercises />
    </main>
  );
}
