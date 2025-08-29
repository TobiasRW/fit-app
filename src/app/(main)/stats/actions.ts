// import { checkAuthentication } from "@/utils/helpers/helpers";
import { Streak } from "@/app/types";
import { checkAuthentication } from "@/utils/helpers/helpers";
import { createServiceClient } from "@/utils/supabase/service-client";
import { getDay } from "date-fns";
import { unstable_cache } from "next/cache";

export async function getTotalCompletedWorkouts(): Promise<
  number | { error: string }
> {
  {
    const { user } = await checkAuthentication();

    const getCachedData = unstable_cache(
      async () => {
        const supabase = await createServiceClient();

        const { count, error } = await supabase
          .from("completed_workouts")
          .select("user_id", { count: "exact" })
          .eq("user_id", user.id);

        if (error) {
          return { error: "Failed to load your completed workouts" };
        }

        return count ? count : 0;
      },
      [`total-completed-workouts-${user.id}`],
      {
        tags: [`user-${user.id}`, `${user.id}-total-completed-workouts`],
        revalidate: 3600,
      },
    );

    return getCachedData();
  }
}

type DayOfWeekCount = {
  day: number; // 0 = Sunday, 1 = Monday, etc.
  count: number; // number of times user worked out on that weekday
};

export async function getUserDayOfWeekCounts(): Promise<
  DayOfWeekCount[] | { error: string }
> {
  const { user } = await checkAuthentication();

  const getCachedData = unstable_cache(
    async () => {
      const supabase = await createServiceClient();

      // timeout to simulate error 50% of the time
      if (Math.random() < 0.5) {
        return { streak: 0, error: "Failed to load current streak" };
      }

      // Fetch all completed workouts
      const { data, error } = await supabase
        .from("completed_workouts")
        .select("completed_date")
        .eq("user_id", user.id);

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
    },
    [`user-day-of-week-counts-${user.id}`],
    {
      tags: [`user-${user.id}`, `${user.id}-day-percentages`],
      revalidate: 3600,
    },
  );

  return getCachedData();
}

// Get current streak
export async function getCurrentStreak(): Promise<Streak> {
  const { user } = await checkAuthentication();
  const getCachedData = unstable_cache(
    async () => {
      const supabase = await createServiceClient();

      const { data, error } = await supabase.rpc("get_current_streak", {
        user_id_param: user.id,
      });

      if (error) return { streak: 0, error: "Failed to load current streak" };
      return { streak: data || 0 };
    },
    [`user-current-streak-${user.id}`],
    {
      tags: [`user-${user.id}`, `${user.id}-current-streak`],
      revalidate: 3600,
    },
  );

  return getCachedData();
}

// Get longest streak
export async function getLongestStreak(): Promise<Streak> {
  const { user } = await checkAuthentication();
  const getCachedData = unstable_cache(
    async () => {
      const supabase = await createServiceClient();

      const { data, error } = await supabase.rpc("get_longest_streak", {
        user_id_param: user.id,
      });

      if (error) return { streak: 0, error: "Failed to load longest streak" };
      return { streak: data || 0 };
    },
    [`user-longest-streak-${user.id}`],
    {
      tags: [`user-${user.id}`, `${user.id}-longest-streak`],
      revalidate: 3600,
    },
  );

  return getCachedData();
}

export async function getUserBenchPressPR(): Promise<
  number | { error: string } | null
> {
  const { user } = await checkAuthentication();
  const getCachedData = unstable_cache(
    async () => {
      const supabase = await createServiceClient();

      const benchPressId = "e09e6102-0cd4-4b11-8774-4a7251b146a4";

      // Get all completed_exercise IDs for bench press
      const { data: exercises, error: exercisesError } = await supabase
        .from("completed_exercises")
        .select("id")
        .eq("user_id", user.id)
        .eq("exercise_id", benchPressId);

      if (exercisesError) {
        return { error: "Failed to load bench press exercises." };
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
        return { error: "Failed to load Bench Press PR." };
      }
      if (!sets || sets.length === 0) {
        return null; // No PR yet
      }

      return Number(sets[0].weight);
    },
    [`user-bench-press-pr-${user.id}`],
    {
      tags: [`user-${user.id}`, `${user.id}-bench-press-pr`],
      revalidate: 3600,
    },
  );

  return getCachedData();
}

// Squat PR
export async function getUserSquatPR(): Promise<
  number | { error: string } | null
> {
  const { user } = await checkAuthentication();

  const getCachedData = unstable_cache(
    async () => {
      const supabase = await createServiceClient();

      const squatId = "8ec9d613-55e8-4598-b37b-7bb45ad0ab20";

      // Get all completed_exercise IDs for squat
      const { data: exercises, error: exercisesError } = await supabase
        .from("completed_exercises")
        .select("id")
        .eq("user_id", user.id)
        .eq("exercise_id", squatId);

      if (exercisesError) {
        return { error: "Failed to load squat exercises." };
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
        return { error: "Failed to load Squat PR." };
      }
      if (!sets || sets.length === 0) {
        return null; // No PR yet
      }

      return Number(sets[0].weight);
    },
    [`user-squat-pr-${user.id}`],
    { tags: [`user-${user.id}`, `${user.id}-squat-pr`], revalidate: 3600 },
  );

  return getCachedData();
}

// Deadlift pr
export async function getUserDeadliftPR(): Promise<
  number | { error: string } | null
> {
  const { user } = await checkAuthentication();

  const getCachedData = unstable_cache(
    async () => {
      const supabase = await createServiceClient();

      const deadliftId = "aa9ccfd3-d333-40cc-a3df-ad6d3ce5c800";

      // Get all completed_exercise IDs for deadlift
      const { data: exercises, error: exercisesError } = await supabase
        .from("completed_exercises")
        .select("id")
        .eq("user_id", user.id)
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
    },
    [`user-deadlift-pr-${user.id}`],
    { tags: [`user-${user.id}`, `${user.id}-deadlift-pr`], revalidate: 3600 },
  );

  return getCachedData();
}
