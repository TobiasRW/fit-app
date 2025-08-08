import { CompletedWorkout } from "@/app/types";
import { checkAuthentication } from "@/utils/helpers/helpers";
import { startOfWeek, endOfWeek, getISOWeek, getYear, getDay } from "date-fns";

export async function getTotalCompletedWorkouts(): Promise<
  number | { error: string }
> {
  {
    const { supabase, user } = await checkAuthentication();

    const { count, error } = await supabase
      .from("completed_workouts")
      .select("user_id", { count: "exact" })
      .eq("user_id", user.id);

    if (error) {
      return { error: "Failed to load your completed workouts" };
    }

    return count ? count : 0;
  }
}

type DayOfWeekCount = {
  day: number; // 0 = Sunday, 1 = Monday, etc.
  count: number; // number of times user worked out on that weekday
};

export async function getUserDayOfWeekCounts(): Promise<
  DayOfWeekCount[] | { error: string }
> {
  const { supabase, user } = await checkAuthentication();

  // Fetch all completed workouts
  const { data, error } = await supabase
    .from("completed_workouts")
    .select("completed_date")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching completed workouts:", error);
    return { error: "Failed to load completed workouts" };
  }

  // Count workouts by day of week
  const dayCounts: Record<number, number> = {};
  for (const workout of data) {
    if (!workout.completed_date) continue;
    const dayIndex = getDay(new Date(workout.completed_date)); // 0 = Sunday
    dayCounts[dayIndex] = (dayCounts[dayIndex] || 0) + 1;
  }

  // Ensure all days are represented (even if count is 0)
  const results: DayOfWeekCount[] = Array.from({ length: 7 }, (_, i) => {
    // i: 0 = Monday, ..., 6 = Sunday
    const day = (i + 1) % 7; // 1 = Monday, ..., 0 = Sunday
    return {
      day,
      count: dayCounts[day] || 0,
    };
  });

  console.log("Day counts:", results);

  return results;
}
