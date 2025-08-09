"use server";

import { CurrentWorkout, InitialState } from "@/app/types";
import { checkAuthentication } from "@/utils/helpers/helpers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

//_____________________ READ FUNCTIONS (GET) _____________________

//function to get the upcoming workout info (and last of that workouts info)
export async function getCurrentWorkout(
  workoutSlug: string,
): Promise<CurrentWorkout | { error: string }> {
  const supabase = await createClient();
  // const { supabase, user } = await checkAuthentication();

  const { data, error } = await supabase.rpc(
    "get_workout_with_last_performance",
    {
      workout_slug_param: workoutSlug,
    },
  );

  if (error) {
    console.error("RPC error:", error);
    return { error: "Database error occurred" };
  }

  if (!data || data === null) {
    return { error: "Workout not found or you don't have access to it" };
  }

  // Check if workout has no exercises
  if (!data.exercises || data.exercises.length === 0) {
    return { error: "This workout has no exercises configured" };
  }

  return data;
}

//_____________________ WRITE FUNCTIONS (POST) _____________________

export async function saveCompletedExercise(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase, user } = await checkAuthentication();

    const exerciseId = formData.get("exerciseId") as string;
    const notes = formData.get("notes") as string;

    if (!exerciseId) {
      return { error: "Exercise ID is required" };
    }

    // Get sets data from formData
    const setNumbers = formData.getAll("setNumber").map(Number);
    const reps = formData.getAll("reps").map(Number);
    const weights = formData.getAll("weight").map(Number);
    const workoutSlug = formData.get("workoutSlug") as string;

    const setsData = setNumbers
      .map((setNum, index) => ({
        set_number: setNum,
        reps: Number(reps[index]) || 0,
        weight: Number(weights[index]) || 0,
      }))
      .filter((set) => set.reps > 0);

    if (setsData.length === 0) {
      return { error: "Please fill in reps for at least one set" };
    }

    // Call RPC function
    const { data, error } = await supabase.rpc("save_completed_exercise", {
      exercise_id_param: exerciseId,
      user_id_param: user.id,
      sets_data: setsData,
      notes_param: notes || null,
    });

    if (error) throw error;

    if (data?.success) {
      revalidatePath(`/session/${workoutSlug}`);
      return { success: data.message };
    } else {
      return { error: data?.error || "Failed to save exercise" };
    }
  } catch (error) {
    console.error("Error saving completed exercise:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to save exercise",
    };
  }
}

// Function to save the completed workout
export async function saveCompletedWorkout(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase, user } = await checkAuthentication();

    const workoutId = formData.get("workoutId") as string;
    const workoutSlug = formData.get("workoutSlug") as string;

    const { data, error } = await supabase.rpc("save_completed_workout", {
      user_id_param: user.id,
      workout_id_param: workoutId,
    });

    if (error) throw error;

    if (!data || data === null) {
      return { error: "Workout not found or you don't have access to it" };
    }

    if (data.success) {
      revalidatePath(`/session/${workoutSlug}`);
      return { success: "Workout saved successfully" };
    } else {
      return { error: data.error || "Failed to save workout" };
    }
  } catch (error) {
    console.error("Error saving completed workout:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to save workout",
    };
  }
}
