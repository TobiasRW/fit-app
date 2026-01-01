import { PencilIcon } from "@phosphor-icons/react/dist/ssr";
import Skeleton from "./skeleton";

export default function LoadingExercises() {
  return (
    <>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton width={200} height={40} rounded={4} />
        <PencilIcon size={20} className="text-green" />
      </div>

      {/* Exercises skeleton */}
      <div className="mt-4">
        <h2 className="text-2xl font-semibold">Exercises</h2>
        <div className="mt-4 flex flex-col gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} width="full" height={84} />
          ))}
        </div>
      </div>
    </>
  );
}
