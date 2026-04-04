import Skeleton from "../components/loaders/skeleton";
import LoadingStatsSection from "../components/loaders/loading-stats-section";
import { getISOWeek } from "date-fns";

export default function Loading() {
  const currentWeekNumber = getISOWeek(new Date());

  return (
    <main className="mx-auto mt-10 w-11/12 pb-20">
      <section>
        <h1 className="text-4xl font-bold">
          Hey, <span className="text-green">...</span>
        </h1>
      </section>

      <section className="relative mt-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-medium">Next Workout</h2>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>
        <Skeleton height={104} />
      </section>

      <section className="relative mt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium">Weekly Stats</h2>
            <p>{`Week ${currentWeekNumber}`}</p>
          </div>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>
        <LoadingStatsSection />
      </section>
    </main>
  );
}
