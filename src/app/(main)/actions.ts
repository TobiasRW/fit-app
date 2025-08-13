"use server";

import { CompletedWorkout, Streak, UpcomingWorkout } from "../types";
import {
  startOfWeek,
  endOfWeek,
  getISOWeek,
  getYear,
  startOfISOWeek,
} from "date-fns";
import { checkAuthentication } from "@/utils/helpers/helpers";
import { unstable_cache } from "next/cache";
import { createServiceClient } from "@/utils/supabase/service-client";

export async function getNextWorkout(): Promise<UpcomingWorkout> {
  // const supabase = await createClient();
  const { user } = await checkAuthentication();

  const getCachedData = unstable_cache(
    async () => {
      console.log("Fetching from Supabase...");
      const supabase = await createServiceClient();
      // Update get_upcoming_workout function to take user_id as a parameter
      const { data, error } = await supabase.rpc("get_next_workout", {
        user_uuid: user.id,
      });

      if (!data || data.length === 0) {
        return null;
      }

      if (error) {
        return { error: "Failed to load your next workout" };
      }

      const workout = data[0];

      return {
        id: workout.workout_id,
        workoutName: workout.workout_name,
        workoutSlug: workout.workout_slug,
        planName: workout.plan_name,
        planSlug: workout.plan_slug,
        progress: `${workout.current_position} of ${workout.total_workouts}`,
        completed: workout.completed,
      };
    },
    [`next-workout-${user.id}`],
    { tags: [`user-${user.id}`], revalidate: 3600 },
  );

  return getCachedData();
}

// Function to get completed workouts in this week
export async function getWeeklyCompletedWorkouts(): Promise<
  CompletedWorkout[] | { error: string }
> {
  const { user } = await checkAuthentication();
  const supabase = await createServiceClient();
  // const { supabase, user } = await checkAuthentication();

  const getCachedData = unstable_cache(
    async () => {
      console.log("Fetching from Supabase...");
      const weekStart = startOfWeek(new Date(), {
        weekStartsOn: 1,
      }).toISOString();
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();

      const { data, error } = await supabase
        .from("completed_workouts")
        .select(
          `
      id,
      user_id,
      workout_id,
      completed_at,
      completed_date,
      workouts (
        name,
        slug,
        id
      ),
      completed_exercises (
        id,
        exercise_id,
        notes,
        saved_at,
        exercises (
          id,
          name,
          slug
        ),
        completed_sets (
          id,
          set_number,
          reps,
          weight
        )
      )
    `,
        )
        .gte("completed_at", weekStart)
        .lte("completed_at", weekEnd)
        .eq("user_id", user.id)
        .order("completed_at", { ascending: true })
        .order("saved_at", {
          referencedTable: "completed_exercises",
          ascending: true,
        });

      if (error) {
        console.error("Error fetching weekly completed workouts:", error);
        return { error: "Failed to load completed workouts for this week" };
      }

      return data as unknown as CompletedWorkout[];
    },
    [`weekly-completed-workouts-${user.id}`],
    { tags: [`user-${user.id}`], revalidate: 3600 },
  );

  return getCachedData();
}

// Function to get the users week streak based on their completed workouts goal
export async function getUserWeekStreak(): Promise<Streak | { error: string }> {
  const { user } = await checkAuthentication();
  const supabase = await createServiceClient();

  const getCachedData = unstable_cache(
    async () => {
      console.log("Fetching from Supabase...");
      // 1. Get goal
      const { data: settings, error: settingsError } = await supabase
        .from("user_settings")
        .select("workout_goal_per_week")
        .eq("id", user.id)
        .single();

      if (settingsError) {
        console.error("Error fetching user settings:", settingsError);
        return { error: "Failed to load your goal" };
      }
      const goal = settings?.workout_goal_per_week || 0;

      // 2. Get all completed workouts
      const { data, error } = await supabase
        .from("completed_workouts")
        .select("completed_at")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching completed workouts:", error);
        return { error: "Failed to load completed workouts" };
      }

      // 3. Count per ISO week
      const weekCounts: Record<string, number> = {};
      for (const workout of data) {
        const date = new Date(workout.completed_at);
        const week = getISOWeek(date);
        const year = getYear(date);
        const key = `${year}-${week}`;
        weekCounts[key] = (weekCounts[key] || 0) + 1;
      }

      // 4. Start from current week, walk backward
      let streak = 0;
      const datePointer = startOfISOWeek(new Date());

      while (true) {
        const week = getISOWeek(datePointer);
        const year = getYear(datePointer);
        const key = `${year}-${week}`;

        if ((weekCounts[key] || 0) >= goal) {
          streak++;
          // move back a week
          datePointer.setDate(datePointer.getDate() - 7);
        } else {
          break;
        }
      }
      return { streak, goal };
    },
    [`user-week-streak-${user.id}`],
    { tags: [`user-${user.id}`], revalidate: 3600 },
  );

  return getCachedData();
}
