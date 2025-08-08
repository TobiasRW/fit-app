"use server";

import { checkAuthentication } from "@/utils/helpers/helpers";
import { CompletedWorkout, Streak, UpcomingWorkout } from "../types";
import { startOfWeek, endOfWeek, getISOWeek, getYear } from "date-fns";

export async function getNextWorkout(): Promise<UpcomingWorkout> {
  const { supabase, user } = await checkAuthentication();

  const { data, error } = await supabase.rpc("get_upcoming_workout", {
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
}

// Function to get completed workouts in this week
export async function getWeeklyCompletedWorkouts(): Promise<
  CompletedWorkout[] | { error: string }
> {
  const { supabase, user } = await checkAuthentication();

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
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
    .eq("user_id", user.id)
    .gte("completed_at", weekStart)
    .lte("completed_at", weekEnd)
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
}

// Function to get the users week streak based on their completed workouts goal
export async function getUserWeekStreak(): Promise<Streak | { error: string }> {
  const { supabase, user } = await checkAuthentication();

  // Get user's weekly goal
  const { data: settings, error: settingsError } = await supabase
    .from("user_settings")
    .select("workout_goal_per_week")
    .eq("id", user.id)
    .single();

  if (settingsError) {
    console.error("Error fetching user settings:", settingsError);
    return { error: "Failed to load your goal" };
  }

  const goal = settings?.workout_goal_per_week;

  // Fetch all completed workouts for the user
  const { data, error } = await supabase
    .from("completed_workouts")
    .select("completed_at")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching completed workouts:", error);
    return { error: "Failed to load completed workouts for this week" };
  }

  // Group workouts by ISO week and year
  const weekCounts: Record<string, number> = {};
  for (const workout of data) {
    const date = new Date(workout.completed_at);
    const week = getISOWeek(date);
    const year = getYear(date);
    const key = `${year}-${week}`;
    weekCounts[key] = (weekCounts[key] || 0) + 1;
  }

  // Sort weeks descending (most recent first)
  const sortedWeeks = Object.keys(weekCounts).sort((a, b) => {
    const [yearA, weekA] = a.split("-").map(Number);
    const [yearB, weekB] = b.split("-").map(Number);
    if (yearA !== yearB) return yearB - yearA;
    return weekB - weekA;
  });

  // Calculate streak
  let streak = 0;
  for (const key of sortedWeeks) {
    if (weekCounts[key] >= goal) {
      streak++;
    } else {
      break;
    }
  }

  return { streak, goal };
}
