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
import { revalidateTag, unstable_cache } from "next/cache";
import { createServiceClient } from "@/utils/supabase/service-client";

export async function getNextWorkout(): Promise<UpcomingWorkout> {
  // const supabase = await createClient();
  const { user } = await checkAuthentication();

  const getCachedData = unstable_cache(
    async () => {
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
    { tags: [`user-${user.id}`, `${user.id}-next-workout`], revalidate: 3600 },
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
        .order("completed_at", { ascending: false })
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
    {
      tags: [`user-${user.id}`, `${user.id}-weekly-completed-workouts`],
      revalidate: 3600,
    },
  );

  return getCachedData();
}

// Function to get the users week streak based on their completed workouts goal
export async function getUserWeekStreak(): Promise<Streak | { error: string }> {
  const { user } = await checkAuthentication();
  const supabase = await createServiceClient();

  const getCachedData = unstable_cache(
    async () => {
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

      // 4. Start from current week, but only count if goal is met
      let streak = 0;
      const now = new Date();
      const datePointer = startOfISOWeek(now);

      while (true) {
        const week = getISOWeek(datePointer);
        const year = getYear(datePointer);
        const key = `${year}-${week}`;
        const weekCount = weekCounts[key] || 0;

        if (weekCount >= goal) {
          streak++;
          // move back a week
          datePointer.setDate(datePointer.getDate() - 7);
        } else {
          // If this is the current week and goal isn't met yet, don't break the streak
          // Only break if it's a past week that didn't meet the goal
          const isCurrentWeek =
            getISOWeek(now) === week && getYear(now) === year;

          if (isCurrentWeek) {
            // Current week doesn't meet goal yet, but don't break - check previous weeks
            datePointer.setDate(datePointer.getDate() - 7);
            continue;
          } else {
            // Past week didn't meet goal, break the streak
            break;
          }
        }
      }

      return { streak, goal };
    },
    [`user-week-streak-${user.id}`],
    { tags: [`user-${user.id}`], revalidate: 3600 },
  );

  return getCachedData();
}

// Function to revalidate user data
export async function revalidateCache(tag: string) {
  const { user } = await checkAuthentication();

  revalidateTag(`${user.id}-${tag}`);
}
