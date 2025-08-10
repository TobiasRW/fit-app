"use server";
import { CompletedWorkout, InitialState } from "@/app/types";
import { checkAuthentication } from "@/utils/helpers/helpers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Function to get the users goal
export async function getUserGoal() {
  try {
    const supabase = await createClient();
    // const { supabase, user } = await checkAuthentication();

    const { data, error } = await supabase
      .from("user_settings")
      .select("workout_goal_per_week")
      .single();

    if (error) {
      return { error: "Failed to load user goal" };
    }

    if (!data) {
      return { error: "No goal set." };
    }

    return data;
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

  revalidatePath("/profile");

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
  const supabase = await createClient();

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
    .order("completed_at", { ascending: false })
    .order("saved_at", {
      referencedTable: "completed_exercises",
      ascending: false,
    });

  if (error) {
    console.error("Error fetching workout history:", error);
    return { error: "Failed to load workout history" };
  }

  return data as unknown as CompletedWorkout[];
}

// Function to get the user's workout plans
export async function getAllPlans() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workout_plans")
    .select("id, name, slug, is_active, deleted_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching workout plans:", error);
    return { error: "Failed to load workout plans" };
  }

  return data || [];
}
