import { getUserDayOfWeekCounts } from "@/app/(main)/stats/actions";
import ErrorCard from "../cards/error-card";

export async function WeekdayPercentage() {
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

  // Find the maximum percentage to scale all bars relative to it
  const maxPercentage = Math.max(...dayPercentages.map((d) => d.percentage));

  return (
    <div className="mt-10 flex h-40 flex-col justify-between">
      <h2 className="text-lg font-semibold">Most active days</h2>
      <div className="">
        <div className="relative mx-auto flex h-32 w-full items-end justify-between gap-2">
          {dayPercentages.map((day, i) => (
            <div
              key={day.day}
              className="flex h-full flex-col items-center justify-end"
            >
              <div className="mb-2 flex h-full flex-col items-center justify-end">
                <p className="text-background absolute text-center text-xs font-normal italic">
                  {day.percentage.toFixed(0)}%
                </p>
                <div
                  className="bg-green w-8 rounded"
                  style={{
                    height: `${maxPercentage > 0 ? (day.percentage / maxPercentage) * 100 : 0}%`,
                  }}
                  title={`${day.percentage.toFixed(1)}%`}
                />
              </div>
              <div className="">
                <span className="mt-2 text-xs font-light">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
