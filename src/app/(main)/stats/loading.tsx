import Skeleton from "@/app/components/loaders/skeleton";
import LoadingTimeOfDay from "@/app/components/loaders/loading-time-of-day";
import LoadingGoalCompletion from "@/app/components/loaders/loading-goal-completion";
import LoadingBarChart from "@/app/components/loaders/loading-bar-chart";

export default function Loading() {
  return (
    <main className="mx-auto mt-10 w-11/12 pb-30">
      <h1 className="text-4xl font-bold">Your Stats</h1>

      <section className="mt-6">
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
            <Skeleton height={160} />
            <Skeleton height={160} />
          </div>
          <Skeleton height={56} />
        </div>
        <LoadingBarChart />
      </section>

      <section className="mt-10">
        <h3 className="mb-2 text-xl font-medium">Time of Day</h3>
        <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        <p className="text-foreground/50 mt-1 text-xs italic">
          This is determined by the midpoint of your workouts.
        </p>
        <LoadingTimeOfDay />
      </section>

      <section className="mt-10">
        <h3 className="mb-2 text-xl font-medium">This year</h3>
        <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        <LoadingGoalCompletion />
      </section>

      <section className="mt-10">
        <h3 className="mb-2 text-xl font-medium">Your PR&#39;s</h3>
        <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        <div className="mt-4 flex items-center justify-between gap-4">
          <Skeleton height={104} />
          <Skeleton height={104} />
          <Skeleton height={104} />
        </div>
      </section>
    </main>
  );
}
