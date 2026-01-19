import { getWorkoutTimeStats } from "@/app/(main)/stats/actions";
import ErrorCard from "../cards/error-card";
import { toZonedTime } from "date-fns-tz";

export async function TimeOfDayPercentage() {
  const timeOfDayStats = await getWorkoutTimeStats();

  if ("error" in timeOfDayStats) {
    return (
      <div className="mt-4 h-26 w-full">
        <ErrorCard
          errorText={"Failed to load your workout time stats"}
          variant="secondary"
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
      const startTime = new Date(workout.workout_start_time);
      const endTime = new Date(workout.completed_at);

      // Calculate midpoint of the workout
      const midpoint = new Date((startTime.getTime() + endTime.getTime()) / 2);
      const localMidpoint = toZonedTime(midpoint, "Europe/Copenhagen");
      const hour = localMidpoint.getHours();

      return hour >= interval.start && hour <= interval.end;
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
