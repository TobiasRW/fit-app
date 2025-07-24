import { PlusIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

export default function CreateWorkout() {
  return (
    <>
      <Link
        href="workouts/create"
        className="bg-faded-green mt-4 flex items-center justify-center rounded-lg px-4 py-6 drop-shadow-md"
      >
        <PlusIcon size={32} className="text-white" />
      </Link>
    </>
  );
}
