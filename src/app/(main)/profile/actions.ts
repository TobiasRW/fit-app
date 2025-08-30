"use server";
import { CompletedWorkout, InitialState, UserGoal } from "@/app/types";
import { checkAuthentication } from "@/utils/helpers/helpers";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/service-client";
import { revalidateTag, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

// Function to get the users goal
export async function getUserGoal(): Promise<UserGoal | { error: string }> {
  try {
    const { user } = await checkAuthentication();

    const getCachedData = unstable_cache(
      async () => {
        const supabase = await createServiceClient();

        const { data, error } = await supabase
          .from("user_settings")
          .select("workout_goal_per_week")
          .eq("id", user.id)
          .single();

        if (error) {
          return { error: "Failed to load your goal" };
        }

        if (!data) {
          return { error: "No goal set." };
        }

        return data;
      },
      [`user-goal-${user.id}`],
      { tags: [`user-${user.id}`, `${user.id}-goal`], revalidate: 3600 },
    );

    return getCachedData();
  } catch (err) {
    console.error("Error fetching user goal:", err);
    return { error: "An unexpected error occurred" };
  }
}

// Function to update the user's goal
export async function updateUserGoal(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const { supabase, user } = await checkAuthentication();

  const newGoal = formData.get("goal");

  if (!newGoal) {
    return { error: "Goal is required" };
  }

  const { error } = await supabase
    .from("user_settings")
    .update({ workout_goal_per_week: newGoal })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return { error: "Failed to update user goal" };
  }

  // Update current week's streak event with new goal
  const { error: streakError } = await supabase.rpc(
    "update_weekly_streak_event",
    {
      user_id_param: user.id,
      completed_at_param: new Date().toISOString(), // the rpc function automatically finds the current week based on this date
    },
  );

  if (streakError) {
    console.error("Failed to update streak after goal change:", streakError);
    // Don't return error here since the main job is to update the goal, and it succeeded.
    // The streak update is secondary and will update when the user next saves a workout
  }

  revalidateTag(`user-${user.id}`);

  return { success: true };
}

// Function to sign out the user
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
    return { error: "Failed to sign out" };
  }

  redirect("/login");
}

// Function to get workout history
export async function getWorkoutHistory(
  planSlug: string,
): Promise<CompletedWorkout[] | { error: string }> {
  const { user } = await checkAuthentication();

  const getCachedData = unstable_cache(
    async () => {
      const supabase = await createServiceClient();

      const { data, error } = await supabase
        .from("completed_workouts")
        .select(
          `
      id,
      user_id,
      workout_id,
      completed_at,
      completed_date,
      workouts!inner (
        name,
        slug,
        plan_id,
        id,
        workout_plans!inner (
          name,
          slug,
          id
        )
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
        .eq("workouts.workout_plans.slug", planSlug)
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .order("saved_at", {
          referencedTable: "completed_exercises",
          ascending: true,
        });

      if (error) {
        console.error("Error fetching workout history:", error);
        return { error: "Failed to load workout history" };
      }

      return data as unknown as CompletedWorkout[];
    },
    [`workout-history-${planSlug}`],
    { tags: [`user-${user.id}`, `${user.id}-history`], revalidate: 3600 },
  );
  return getCachedData();
}

// Function to get the user's workout plans
export async function getAllPlans() {
  const { user } = await checkAuthentication();

  const getCachedData = unstable_cache(
    async () => {
      const supabase = await createServiceClient();

      const { data, error } = await supabase
        .from("workout_plans")
        .select("id, name, slug, is_active, deleted_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching workout plans:", error);
        return { error: "Failed to load workout plans" };
      }

      return data || [];
    },
    [`workout-plans-${user.id}`],
    { tags: [`user-${user.id}`, `${user.id}-workout-plans`], revalidate: 3600 },
  );
  return getCachedData();
}
