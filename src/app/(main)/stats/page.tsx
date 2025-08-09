import { Suspense } from "react";
import { getUserWeekStreak } from "../actions";
import { getUserGoal } from "../profile/actions";
import {
  getTotalCompletedWorkouts,
  getUserBenchPressPR,
  getUserDayOfWeekCounts,
  getUserDeadliftPR,
  getUserSquatPR,
} from "./actions";
import ErrorCard from "@/app/components/error-card";

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
          <div className="flex justify-between">
            <Suspense fallback={<LoadingTotalSquare />}>
              <TotalSquare />
            </Suspense>
            <Suspense fallback={<LoadingStreakSquare />}>
              <StreakSquare />
            </Suspense>
          </div>
          <Suspense fallback={<LoadingBarChart />}>
            <BarChart />
          </Suspense>
        </section>
        <section className="mt-10">
          <h3 className="mb-2 text-xl font-medium"> This year</h3>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
          <Suspense fallback={<LoadingWorkoutCompletion />}>
            <WorkoutYearCompletion />
          </Suspense>
        </section>

        <section className="mt-10">
          <h3 className="mb-2 text-xl font-medium">Your PR&#39;s</h3>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
          <div className="mt-4 flex items-center justify-between gap-4">
            {prDefinitions.map((def) => (
              <Suspense key={def.name} fallback={<LoadingPR />}>
                <PRCard name={def.name} fetch={def.fetch} />
              </Suspense>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

async function PRCard({
  name,
  fetch,
}: {
  name: string;
  fetch: () => Promise<number | { error: string } | null>;
}) {
  const pr = await fetch();

  if (typeof pr === "object" && pr !== null && "error" in pr) {
    return (
      <div className="h-26 w-26">
        <ErrorCard errorText={"Failed to Load PR"} variant="secondary" />
      </div>
    );
  }

  return (
    <div className="bg-gray dark:bg-dark-gray text-foreground flex h-26 w-26 flex-col items-center justify-between rounded-lg p-2 shadow-lg">
      <div className="justify-center text-center">
        <p className="mb-4 text-sm">{name}</p>
        <p className={`text-4xl ${!pr ? "text-lg" : ""}`}>
          {pr?.toString() || "No PR Yet"}
        </p>
      </div>
    </div>
  );
}

async function WorkoutYearCompletion() {
  const totalWorkouts = await getTotalCompletedWorkouts();
  const goal = await getUserGoal();

  if (typeof totalWorkouts === "object" && "error" in totalWorkouts) {
    return (
      <div className="mt-10 h-24 w-full">
        <ErrorCard
          errorText={"Failed to load your total workouts completed"}
          variant="secondary"
        />
      </div>
    );
  }
  if ("error" in goal) {
    return (
      <div className="mt-10 h-24 w-full">
        <ErrorCard errorText={"Failed to load your goal"} variant="secondary" />
      </div>
    );
  }

  const totalYearGoal = goal.workout_goal_per_week * 52;

  return (
    <div className="mt-4">
      <p className="mb-2 font-light italic">
        {totalWorkouts} / {totalYearGoal} workouts completed
      </p>
      <div className="bg-faded-green relative h-3 w-full rounded-sm">
        <div
          className="bg-green absolute inset-0 rounded-sm"
          style={{ width: `${(totalWorkouts / totalYearGoal) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

async function BarChart() {
  const dayCounts = await getUserDayOfWeekCounts();
  if (!Array.isArray(dayCounts)) {
    return (
      <div className="mt-10 h-40 w-full">
        <ErrorCard errorText={dayCounts.error} variant="secondary" />
      </div>
    );
  }
  // Calculate percentages
  const totalWorkouts = dayCounts.reduce((sum, d) => sum + d.count, 0);
  const dayPercentages = dayCounts.map((d) => ({
    ...d,
    percentage: totalWorkouts > 0 ? (d.count / totalWorkouts) * 100 : 0,
  }));

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-lg font-semibold">Most active days</h2>
      <div className="">
        <div className="relative mx-auto flex max-h-80 w-full items-end justify-between gap-2">
          {dayPercentages.map((day, i) => (
            <div
              key={day.day}
              className="flex h-full flex-col items-center justify-end"
            >
              <div className="mb-2">
                <p className="text-center text-xs font-light italic">
                  {day.percentage.toFixed(0)}%
                </p>
                <div
                  className="bg-green w-8 rounded-t"
                  style={{
                    height: `${day.percentage * 1.5}px`,
                    minHeight: "0px",
                  }}
                  title={`${day.percentage.toFixed(1)}%`}
                />
              </div>
              <div className="-rotate-45">
                <span className="mt-2 text-xs font-light">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            </div>
          ))}
          <div className="border-green absolute bottom-8 w-full border-b"></div>
        </div>
      </div>
    </div>
  );
}

async function TotalSquare() {
  const totalWorkouts = await getTotalCompletedWorkouts();

  if (
    typeof totalWorkouts === "object" &&
    totalWorkouts !== null &&
    "error" in totalWorkouts
  ) {
    return (
      <div className="h-40 w-40">
        <ErrorCard
          errorText={totalWorkouts.error ?? "An unknown error occurred."}
          variant="secondary"
        />
      </div>
    );
  }
  return (
    <div className="bg-green flex h-40 w-40 flex-col items-center justify-between rounded-lg p-2 text-white shadow-lg">
      <p className="text-lg">Total Workouts</p>
      <p className="text-6xl">{totalWorkouts.toString() || "0"}</p>
      <p className="text-3xl">💪</p>
    </div>
  );
}

async function StreakSquare() {
  const streak = await getUserWeekStreak();

  if ("error" in streak) {
    return (
      <div className="h-40 w-40">
        <ErrorCard
          errorText={streak.error ?? "An unknown error occurred."}
          variant="secondary"
        />
      </div>
    );
  }

  return (
    <div className="bg-gray dark:bg-dark-gray text-foreground flex h-40 w-40 flex-col items-center justify-between rounded-lg p-2 shadow-lg">
      <p className="text-lg">Week streak</p>
      <p className="text-5xl">{streak.streak}</p>
      <p className="text-3xl">
        {streak?.streak && streak.streak > 0 ? "🔥" : "❄️"}
      </p>
    </div>
  );
}

function LoadingPR() {
  return (
    <div className="bg-gray/50 dark:bg-dark-gray/50 h-26 w-26 animate-pulse rounded-lg" />
  );
}

function LoadingStreakSquare() {
  return (
    <div className="bg-gray/50 dark:bg-dark-gray/50 h-40 w-40 animate-pulse rounded-lg" />
  );
}

function LoadingTotalSquare() {
  return <div className="bg-faded-green h-40 w-40 animate-pulse rounded-lg" />;
}

function LoadingBarChart() {
  return (
    <div className="mt-10 h-40 w-full animate-pulse rounded-lg">
      <div className="relative flex h-full items-end justify-between p-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex h-full flex-col items-center justify-end"
          >
            <div className="mb-2">
              <div
                className="bg-gray dark:bg-dark-gray w-8 rounded-t"
                style={{
                  height: `${Math.random() * 100}px`,
                  minHeight: "0px",
                }}
                title={`${Math.random().toFixed(1)}%`}
              />
            </div>
            <div className="border-gray dark:border-dark-gray absolute bottom-4 w-full border-b"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingWorkoutCompletion() {
  return (
    <div className="mt-4 animate-pulse">
      <p className="text-gray dark:text-dark-gray mb-2 font-light italic">
        25 / 156 workouts completed
      </p>
      <div className="bg-foreground/10 relative h-3 w-full rounded-sm">
        <div
          className="bg-gray dark:bg-dark-gray absolute inset-0 rounded-sm"
          style={{ width: `${Math.floor(Math.random() * 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
