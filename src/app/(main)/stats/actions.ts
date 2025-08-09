// import { checkAuthentication } from "@/utils/helpers/helpers";
import { createClient } from "@/utils/supabase/server";
import { getDay } from "date-fns";

export async function getTotalCompletedWorkouts(): Promise<
  number | { error: string }
> {
  {
    const supabase = await createClient();
    // const { supabase, user } = await checkAuthentication();

    const { count, error } = await supabase
      .from("completed_workouts")
      .select("user_id", { count: "exact" });

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
  const supabase = await createClient();
  // const { supabase, user } = await checkAuthentication();

  // Fetch all completed workouts
  const { data, error } = await supabase
    .from("completed_workouts")
    .select("completed_date");

  if (error) {
    console.error("Error fetching completed workouts:", error);
    return { error: "Failed to load your day of week stats" };
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

  return results;
}

export async function getUserBenchPressPR(): Promise<
  number | { error: string } | null
> {
  const supabase = await createClient();
  // const { supabase, user } = await checkAuthentication();
  const benchPressId = "e09e6102-0cd4-4b11-8774-4a7251b146a4";

  // Get all completed_exercise IDs for bench press
  const { data: exercises, error: exercisesError } = await supabase
    .from("completed_exercises")
    .select("id")
    .eq("exercise_id", benchPressId);

  if (exercisesError) {
    return { error: "Failed to load deadlift exercises." };
  }
  if (!exercises || exercises.length === 0) {
    return null; // No PR yet
  }

  const exerciseIds = exercises.map((ex: { id: string }) => ex.id);

  // Get the max weight from completed_sets for those exercises
  const { data: sets, error: setsError } = await supabase
    .from("completed_sets")
    .select("weight")
    .in("completed_exercise_id", exerciseIds)
    .order("weight", { ascending: false })
    .limit(1);

  if (setsError) {
    return { error: "Failed to load deadlift PR." };
  }
  if (!sets || sets.length === 0) {
    return null; // No PR yet
  }

  return Number(sets[0].weight);
}

// Squat PR
export async function getUserSquatPR(): Promise<
  number | { error: string } | null
> {
  const supabase = await createClient();
  // const { supabase, user } = await checkAuthentication();
  const squatId = "8ec9d613-55e8-4598-b37b-7bb45ad0ab20";

  // Get all completed_exercise IDs for squat
  const { data: exercises, error: exercisesError } = await supabase
    .from("completed_exercises")
    .select("id")
    .eq("exercise_id", squatId);

  if (exercisesError) {
    return { error: "Failed to load deadlift exercises." };
  }
  if (!exercises || exercises.length === 0) {
    return null; // No PR yet
  }

  const exerciseIds = exercises.map((ex: { id: string }) => ex.id);

  // Get the max weight from completed_sets for those exercises
  const { data: sets, error: setsError } = await supabase
    .from("completed_sets")
    .select("weight")
    .in("completed_exercise_id", exerciseIds)
    .order("weight", { ascending: false })
    .limit(1);
  if (setsError) {
    return { error: "Failed to load deadlift PR." };
  }
  if (!sets || sets.length === 0) {
    return null; // No PR yet
  }

  return Number(sets[0].weight);
}

// Deadlift pr
export async function getUserDeadliftPR(): Promise<
  number | { error: string } | null
> {
  const supabase = await createClient();
  // const { supabase, user } = await checkAuthentication();
  const deadliftId = "aa9ccfd3-d333-40cc-a3df-ad6d3ce5c800";

  // Get all completed_exercise IDs for deadlift
  const { data: exercises, error: exercisesError } = await supabase
    .from("completed_exercises")
    .select("id")
    .eq("exercise_id", deadliftId);

  if (exercisesError) {
    return { error: "Failed to load deadlift exercises." };
  }
  if (!exercises || exercises.length === 0) {
    return null; // No PR yet
  }

  const exerciseIds = exercises.map((ex: { id: string }) => ex.id);

  // Get the max weight from completed_sets for those exercises
  const { data: sets, error: setsError } = await supabase
    .from("completed_sets")
    .select("weight")
    .in("completed_exercise_id", exerciseIds)
    .order("weight", { ascending: false })
    .limit(1);

  if (setsError) {
    return { error: "Failed to load deadlift PR." };
  }
  if (!sets || sets.length === 0) {
    return null; // No PR yet
  }

  return Number(sets[0].weight);
}
