import Skeleton from "./skeleton";

export default function LoadingStatsSection() {
  return (
    <div className="">
      <div className="mx-auto flex w-11/12 items-center justify-between pt-4">
        <div className="">
          <p className="text-gray dark:text-dark-gray animate-pulse text-center text-6xl font-medium">
            3/3
          </p>
          <Skeleton
            offsetTop={8}
            offsetBottom={8}
            height={8}
            centered
            width={118}
          />
        </div>

        <div className="">
          <p className="text-gray dark:text-dark-gray animate-pulse text-center text-6xl font-medium opacity-25">
            🔥
          </p>
          <Skeleton
            offsetTop={8}
            offsetBottom={8}
            height={8}
            centered
            width={90}
          />
        </div>
      </div>
      <div className="mt-6">
        <h3 className="mb-4 text-xl">This weeks completed workouts:</h3>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={48} />
          ))}
        </div>
      </div>
    </div>
  );
}
