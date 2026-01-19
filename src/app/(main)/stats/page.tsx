import { Suspense } from "react";
import {
  getUserBenchPressPR,
  getUserDeadliftPR,
  getUserSquatPR,
} from "./actions";
import LoadingTimeOfDay from "@/app/components/loaders/loading-time-of-day";
import Skeleton from "@/app/components/loaders/skeleton";
import LoadingGoalCompletion from "@/app/components/loaders/loading-goal-completion";
import LoadingBarChart from "@/app/components/loaders/loading-bar-chart";
import { PRSquare } from "@/app/components/stats/pr-square";
import { YearlyWorkoutCompletion } from "@/app/components/stats/yearly-workout-completion";
import { TimeOfDayPercentage } from "@/app/components/stats/time-of-day-percentage";
import { WeekdayPercentage } from "@/app/components/stats/weekday-percentage";
import { TotalWorkouts } from "@/app/components/stats/total-workouts";
import { Streak } from "@/app/components/stats/streak";
import { LongestStreak } from "@/app/components/stats/longest-streak";

const prDefinitions = [
  { name: "Bench Press", fetch: getUserBenchPressPR },
  { name: "Squat", fetch: getUserSquatPR },
  { name: "Deadlift", fetch: getUserDeadliftPR },
];

export default async function Page() {
  return (
    <>
      <main className="mx-auto mt-10 w-11/12 pb-30">
        <h1 className="text-4xl font-bold">Your Stats</h1>

        <section className="mt-6">
          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              <Suspense fallback={<Skeleton height={160} />}>
                <TotalWorkouts />
              </Suspense>
              <Suspense fallback={<Skeleton height={160} />}>
                <Streak />
              </Suspense>
            </div>
            <Suspense fallback={<Skeleton height={56} />}>
              <LongestStreak />
            </Suspense>
          </div>
          <Suspense fallback={<LoadingBarChart />}>
            <WeekdayPercentage />
          </Suspense>
        </section>
        <section className="mt-10">
          <h3 className="mb-2 text-xl font-medium"> Time of Day</h3>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
          <p className="text-foreground/50 mt-1 text-xs italic">
            This is determined by the midpoint of your workouts.
          </p>
          <Suspense fallback={<LoadingTimeOfDay />}>
            <TimeOfDayPercentage />
          </Suspense>
        </section>
        <section className="mt-10">
          <h3 className="mb-2 text-xl font-medium"> This year</h3>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
          <Suspense fallback={<LoadingGoalCompletion />}>
            <YearlyWorkoutCompletion />
          </Suspense>
        </section>

        <section className="mt-10">
          <h3 className="mb-2 text-xl font-medium">Your PR&#39;s</h3>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
          <div className="mt-4 flex items-center justify-between gap-4">
            {prDefinitions.map((def) => (
              <Suspense key={def.name} fallback={<Skeleton height={104} />}>
                <PRSquare name={def.name} fetch={def.fetch} />
              </Suspense>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
