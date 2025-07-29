"use server";

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

// Define the initial state type
type initialState = {
  error?: string;
  success?: boolean;
};

// Function to get the user's workout plans
export async function getUserWorkoutPlans() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  const { data: workoutPlans, error } = await supabase
    .from("workout_plans")
    .select("id, name")
    .eq("user_id", user.data.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch workout plans");
  }

  return workoutPlans || [];
}

// Function to get a specific workout plan by ID
export async function getWorkoutPlan(id: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  const { data: workoutPlan, error } = await supabase
    .from("workout_plans")
    .select(
      `
      id, 
      name,
      workouts (
        id,
        name,
        order_index
      )
    `,
    )
    .eq("id", id)
    .eq("user_id", user.data.user.id)
    .single();

  if (error || !workoutPlan) {
    notFound();
  }

  return workoutPlan;
}

// Function to create a new workout plan
export async function createWorkoutPlan(
  prevState: initialState,
  formData: FormData,
): Promise<initialState> {
  try {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const user = await supabase.auth.getUser();

    // Validate user and name
    if (!user.data.user) {
      return { error: "User not authenticated" };
    }

    if (!name || name.trim() === "") {
      return { error: "Workout plan name is required" };
    }

    // Insert the new workout plan into the database
    const { error } = await supabase
      .from("workout_plans")
      .insert({
        user_id: user.data.user.id,
        name: name.trim(),
      })
      .select()
      .single();

    // Handle potential errors
    if (error) {
      // Check for duplicate name error
      if (error.code === "23505") {
        return {
          error: "A workout plan with this name already exists",
        };
      }

      // Handle all other database errors
      throw new Error(`Database error: ${error.message}`);
    }

    revalidatePath("/workouts");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error creating workout plan:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Function to add a workout to a specific workout plan
export async function addWorkoutToPlan(
  prevState: initialState,
  formData: FormData,
): Promise<initialState> {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { error: "User not authenticated" };
    }

    const planId = formData.get("planId") as string;
    const workoutName = formData.get("workoutName") as string;

    if (!workoutName) {
      return { error: "Workout name is required" };
    }

    // Get current workout count for order_index
    const { count } = await supabase
      .from("workouts")
      .select("*", { count: "exact", head: true })
      .eq("plan_id", planId);

    // Insert new workout
    const { error } = await supabase.from("workouts").insert({
      plan_id: planId,
      name: workoutName,
      order_index: (count || 0) + 1,
    });

    if (error) {
      if (error.code === "23505") {
        return {
          error: "A workout with this name already exists in this plan",
        };
      }
      return { error: "Failed to create workout. Please try again." };
    }

    revalidatePath(`/workouts/${planId}`);
    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// Function to get all exercises from the database
export async function getAllExercises() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  const { data: exercises, error } = await supabase
    .from("exercises")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Failed to fetch exercises");
  }

  return exercises || [];
}
