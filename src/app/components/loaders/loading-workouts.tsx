import { PencilIcon } from "@phosphor-icons/react/dist/ssr";
import Skeleton from "./skeleton";

export default function LoadingWorkouts() {
  return (
    <>
      <div className="flex items-center justify-between">
        <Skeleton width={200} height={40} rounded={4} />
        <PencilIcon size={20} className="text-green" />
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} width="full" height={96} />
          ))}
        </div>
      </div>
    </>
  );
}
