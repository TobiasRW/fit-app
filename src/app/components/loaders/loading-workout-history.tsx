import Skeleton from "./skeleton";

export default function LoadingWorkoutHistory() {
  return (
    <div className="mt-8 flex flex-col gap-4">
      {Array.from({ length: 15 }).map((_, i) => (
        <Skeleton key={i} width="full" height={48} rounded={8} />
      ))}
    </div>
  );
}
