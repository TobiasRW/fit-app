import { Suspense } from "react";
import { getUserGoal } from "../profile/actions";
import {
  getCurrentStreak,
  getLongestStreak,
  getTotalCompletedWorkouts,
  getUserBenchPressPR,
  getUserDayOfWeekCounts,
  getUserDeadliftPR,
  getUserSquatPR,
  getWorkoutTimeStats,
} from "./actions";
import ErrorCard from "@/app/components/error-card";
import { toZonedTime } from "date-fns-tz";

const prDefinitions = [
  { name: "Bench Press", fetch: getUserBenchPressPR, tag: "bench-press-pr" },
  { name: "Squat", fetch: getUserSquatPR, tag: "squat-pr" },
  { name: "Deadlift", fetch: getUserDeadliftPR, tag: "deadlift-pr" },
];

export default async function Page() {
  return (
    <>
      <main className="mx-auto mt-10 w-11/12 pb-30">
        <h1 className="text-4xl font-bold">Your Stats</h1>

        <section className="mt-6">
          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              <Suspense fallback={<LoadingTotalSquare />}>
                <TotalSquare />
              </Suspense>
              <Suspense fallback={<LoadingStreakSquare />}>
                <StreakSquare />
              </Suspense>
            </div>
            <Suspense fallback={<LoadingLongestStreak />}>
              <LongestStreak />
            </Suspense>
          </div>
          <Suspense fallback={<LoadingBarChart />}>
            <BarChart />
          </Suspense>
        </section>
        <section className="mt-10">
          <h3 className="mb-2 text-xl font-medium"> Time of Day</h3>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
          <Suspense fallback={<LoadingTimeOfDayChart />}>
            <TimeOfDayChart />
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
                <PRCard name={def.name} fetch={def.fetch} tag={def.tag} />
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
  tag,
}: {
  name: string;
  fetch: () => Promise<number | { error: string } | null>;
  tag: string;
}) {
  const pr = await fetch();

  if (typeof pr === "object" && pr !== null && "error" in pr) {
    return (
      <div className="h-26 w-full">
        <ErrorCard
          errorText={"Failed to Load PR"}
          variant="secondary"
          tag={tag}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray dark:bg-dark-gray text-foreground flex h-26 w-full flex-col items-center justify-between rounded-lg p-2 shadow-lg">
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
          tag="total-completed-workouts"
        />
      </div>
    );
  }
  if ("error" in goal) {
    return (
      <div className="mt-10 h-24 w-full">
        <ErrorCard
          errorText={"Failed to load your goal"}
          variant="secondary"
          tag="goal"
        />
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

async function TimeOfDayChart() {
  const timeOfDayStats = await getWorkoutTimeStats();

  if ("error" in timeOfDayStats) {
    return (
      <div className="mt-4 h-26 w-full">
        <ErrorCard
          errorText={"Failed to load your workout time stats"}
          variant="secondary"
          tag="workout-time-stats"
        />
      </div>
    );
  }

  const timeIntervals = [
    { label: "Early Morning", start: 5, end: 8 },
    { label: "Morning", start: 9, end: 11 },
    { label: "Afternoon", start: 12, end: 17 },
    { label: "Evening", start: 18, end: 20 },
    { label: "Late Evening", start: 21, end: 23 },
    { label: "Night", start: 0, end: 4 },
  ];

  // calculate percentages of each time interval
  const totalWorkouts = timeOfDayStats.length;
  const intervalData = timeIntervals.map((interval) => {
    const count = timeOfDayStats.filter((workout) => {
      const localDate = toZonedTime(workout.completed_at, "Europe/Copenhagen");
      const hour = localDate.getHours();

      return hour >= interval.start && hour < interval.end;
    }).length;

    return {
      ...interval,
      count,
      percentage: totalWorkouts > 0 ? (count / totalWorkouts) * 100 : 0,
    };
  });

  // Filter out intervals with 0 workouts for cleaner display
  const activeIntervals = intervalData.filter((interval) => interval.count > 0);

  return (
    <div className="mt-4 w-10/12">
      {totalWorkouts > 0 ? (
        <div className="space-y-3">
          {activeIntervals.map((interval) => (
            <div key={interval.label} className="">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {interval.label}{" "}
                  <span className="text-xs italic">
                    ({interval.start}:00 - {interval.end}:59)
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="h-3 rounded bg-green-500"
                  style={{ width: `${interval.percentage}%` }}
                />
                <span className="text-sm font-light italic">
                  {interval.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-foreground/50 py-4 text-center">
          No workouts completed yet.
        </p>
      )}
    </div>
  );
}

async function BarChart() {
  const dayCounts = await getUserDayOfWeekCounts();
  if (!Array.isArray(dayCounts)) {
    return (
      <div className="mt-10 h-40 w-full">
        <ErrorCard
          errorText={dayCounts.error}
          variant="secondary"
          tag="day-percentages"
        />
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
      <div className="h-40 w-full">
        <ErrorCard
          errorText={totalWorkouts.error ?? "An unknown error occurred."}
          variant="secondary"
          tag="total-completed-workouts"
        />
      </div>
    );
  }
  return (
    <div className="bg-green flex h-40 w-full flex-col items-center justify-between rounded-lg p-2 text-white shadow-lg">
      <p className="text-lg">Total Workouts</p>
      <p className="text-6xl">{totalWorkouts.toString() || "0"}</p>
      <p className="text-3xl">💪</p>
    </div>
  );
}

async function StreakSquare() {
  const streak = await getCurrentStreak();

  if ("error" in streak) {
    return (
      <div className="h-40 w-full">
        <ErrorCard
          errorText={streak.error ?? "An unknown error occurred."}
          variant="secondary"
          tag="current-streak"
        />
      </div>
    );
  }

  return (
    <div className="bg-gray dark:bg-dark-gray text-foreground flex h-40 w-full flex-col items-center justify-between rounded-lg p-2 shadow-lg">
      <p className="text-lg">Week streak</p>
      <p className="text-5xl">{streak.streak}</p>
      <p className="text-3xl">
        {streak?.streak && streak.streak > 0 ? "🔥" : "😴"}
      </p>
    </div>
  );
}

async function LongestStreak() {
  const streak = await getLongestStreak();

  if ("error" in streak) {
    return (
      <div className="h-20 w-full">
        <ErrorCard
          errorText={streak.error ?? "An unknown error occurred."}
          variant="secondary"
          tag="longest-streak"
        />
      </div>
    );
  }

  return (
    <div className="bg-gray dark:bg-dark-gray text-foreground flex h-14 items-center justify-between rounded-lg px-4 shadow-lg">
      <p className="text-lg">Longest Streak: </p>
      <p className="text-3xl">
        {streak.streak}{" "}
        <span className="ml-2">
          {streak?.streak && streak.streak > 0 ? "🏆" : "😴"}
        </span>
      </p>
    </div>
  );
}

function LoadingTimeOfDayChart() {
  const labels = [
    { label: "Morning" },
    { label: "Afternoon" },
    { label: "Evening" },
    { label: "Night" },
  ];

  return (
    <div className="mt-4 w-10/12 animate-pulse">
      <div className="space-y-3">
        {labels.map((interval, i) => (
          <div key={i} className="">
            <div className="text-foreground/50 flex items-center justify-between text-sm">
              <span className="font-medium">{interval.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="bg-gray dark:bg-dark-gray h-3 rounded"
                style={{ width: `${Math.random() * 80 + 20}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingLongestStreak() {
  return (
    <div className="bg-gray/50 dark:bg-dark-gray/50 h-14 w-full animate-pulse rounded-lg" />
  );
}

function LoadingPR() {
  return (
    <div className="bg-gray/50 dark:bg-dark-gray/50 h-26 w-full animate-pulse rounded-lg" />
  );
}

function LoadingStreakSquare() {
  return (
    <div className="bg-gray/50 dark:bg-dark-gray/50 h-40 w-full animate-pulse rounded-lg" />
  );
}

function LoadingTotalSquare() {
  return (
    <div className="bg-faded-green h-40 w-full animate-pulse rounded-lg" />
  );
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
