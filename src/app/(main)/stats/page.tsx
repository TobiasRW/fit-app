import { getUserWeekStreak } from "../actions";
import { getTotalCompletedWorkouts, getUserDayOfWeekCounts } from "./actions";
import ErrorCard from "@/app/components/error-card";

export default async function Page() {
  const dayCounts = await getUserDayOfWeekCounts();

  if (!Array.isArray(dayCounts)) {
    return (
      <div className="h-40 w-full">
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
    <>
      <main className="mx-auto mt-10 w-11/12">
        <h1 className="text-4xl font-bold">Your Stats</h1>

        <section className="mt-10">
          <div className="flex justify-between">
            <TotalSquare />
            <StreakSquare />
          </div>
          <div className="mt-10">
            <h3 className="mb-4 text-lg font-semibold">Most active days</h3>
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
        </section>
        {/* <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" /> */}
      </main>
    </>
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
    <div className="bg-gray text-foreground flex h-40 w-40 flex-col items-center justify-between rounded-lg p-2 shadow-lg">
      <p className="text-lg">Week streak</p>
      <p className="text-5xl">{streak.streak}</p>
      <p className="text-3xl">
        {streak?.streak && streak.streak > 0 ? "🔥" : "❄️"}
      </p>
    </div>
  );
}
