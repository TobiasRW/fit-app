"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { WorkoutExercise, InitialState } from "@/app/types";
import { checkAuthentication, generateSlug } from "@/utils/helpers/helpers";
import { createClient } from "@/utils/supabase/server";

//_____________________ READ FUNCTIONS (GET) _____________________

// Function to get all the user's workout plans
export async function getUserWorkoutPlans() {
  const supabase = await createClient();
  // const { supabase } = await checkAuthentication();

  const { data: workoutPlans, error } = await supabase
    .from("workout_plans")
    .select("id, name, slug, is_active")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: "Failed to load workout plans" };
  }

  return workoutPlans || [];
}

// Function to get a specific workout plan by slug
export async function getWorkoutPlan(slug: string) {
  const { supabase } = await checkAuthentication();

  const { data: workoutPlan, error } = await supabase
    .from("workout_plans")
    .select(
      `
      id, 
      name,
      slug,
      workouts (
        id,
        name,
        slug,
        order_index
      )
    `,
    )
    .eq("slug", slug)
    .order("order_index", { referencedTable: "workouts", ascending: true })
    .single();

  if (error) {
    return { error: "Failed to load workout plan" };
  }

  if (!workoutPlan) {
    notFound();
  }

  return workoutPlan;
}

// Function to get a specific workout in a plan
export async function getWorkoutFromPlan(
  planSlug: string,
  workoutSlug: string,
) {
  const supabase = await createClient();
  // const { supabase } = await checkAuthentication();

  const { data: workout, error } = await supabase
    .from("workouts")
    .select(
      `
      id, 
      name, 
      slug, 
      order_index,
      workout_plans!inner()
    `,
    )
    .eq("slug", workoutSlug)
    .eq("workout_plans.slug", planSlug)
    .single();

  if (error) {
    return { error: "Failed to load workout" };
  }

  if (!workout) {
    notFound();
  }

  return workout;
}

// Function to get exercises from a workout
export async function getExercisesFromWorkout(workoutId: string) {
  const supabase = await createClient();
  // const { supabase } = await checkAuthentication();

  const { data: workoutExercises, error } = await supabase
    .from("workout_exercises")
    .select(
      `
      id,
      order_index,
      exercises!inner (
        id,
        name
      ),
      sets (
        id,
        set_number,
        target_reps
      )
    `,
    )
    .eq("workout_id", workoutId)
    .order("order_index", { ascending: true })
    .overrideTypes<WorkoutExercise[]>();

  if (error) {
    return { error: "Failed to load exercises" };
  }

  // Sort sets by set_number and return the result
  return (
    workoutExercises?.map((exercise) => ({
      ...exercise,
      sets: exercise.sets?.sort((a, b) => a.set_number - b.set_number) || [],
    })) || []
  );
}
// Function to get all exercises from the database
export async function getAllExercises() {
  const supabase = await createClient();

  const { data: exercises, error } = await supabase
    .from("exercises")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Failed to fetch exercises");
  }

  return exercises || [];
}

//_____________________ CREATE FUNCTIONS (POST) _____________________

// Function to create a new workout plan for the user
export async function createWorkoutPlan(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase, user } = await checkAuthentication();

    const name = formData.get("name") as string;

    if (!name || name.trim() === "") {
      return { error: "Workout plan name is required" };
    }

    // Generate a slug from the name
    const slug = generateSlug(name);

    // Insert the new workout plan into the database
    const { error } = await supabase
      .from("workout_plans")
      .insert({
        user_id: user.id,
        name: name.trim(),
        slug: slug,
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
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase } = await checkAuthentication();

    const planId = formData.get("planId") as string;
    const planSlug = formData.get("planSlug") as string;
    const workoutName = formData.get("workoutName") as string;

    if (!workoutName) {
      return { error: "Workout name is required" };
    }

    const slug = generateSlug(workoutName);

    // Get current workout count for order_index
    const { error } = await supabase.rpc("add_workout_to_plan", {
      p_plan_id: planId,
      p_name: workoutName,
      p_slug: slug,
    });

    if (error) {
      if (error.code === "23505") {
        return {
          error: "A workout with this name already exists in this plan",
        };
      }
      return { error: "Failed to create workout. Please try again." };
    }

    revalidatePath(`/workouts/${planSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error adding workout to plan:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// Function to add a exercise to a workout
export async function addExerciseToWorkout(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase } = await checkAuthentication();

    // get data from form
    const workoutId = formData.get("workoutId") as string;
    const planSlug = formData.get("planSlug") as string;
    const workoutSlug = formData.get("workoutSlug") as string;
    const exerciseId = formData.get("exerciseId") as string;

    // Get all the setReps values as an array
    const setReps = formData
      .getAll("setReps")
      .map((rep) => parseInt(rep as string));

    // Use RPC function with the new order index
    const { error } = await supabase.rpc("add_exercise_with_sets", {
      p_workout_id: workoutId,
      p_exercise_id: exerciseId,
      p_set_reps: setReps,
    });

    if (error) {
      return { error: "Failed to add exercise to workout. Please try again." };
    }

    revalidatePath(`/workouts/${planSlug}/${workoutSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error adding exercise to workout:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

//_____________________ UPDATE FUNCTIONS (PUT) _____________________

// Functions to update a workout plan's exercise
export async function updateExercise(
  InitialState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase } = await checkAuthentication();

    const workoutExerciseId = formData.get("workoutExerciseId") as string;
    const planSlug = formData.get("planSlug") as string;
    const workoutSlug = formData.get("workoutSlug") as string;

    if (!workoutExerciseId) {
      return { error: "Workout exercise ID is required" };
    }

    // Get all the setReps values as an array
    const setReps = formData
      .getAll("setReps")
      .map((rep) => parseInt(rep as string))
      .filter((rep) => !isNaN(rep) && rep > 0);

    if (setReps.length === 0) {
      return { error: "At least one valid set is required" };
    }

    // Use RPC function to update exercise sets
    // RLS will ensure user can only update their own exercises
    const { error: updateError } = await supabase.rpc("update_exercise_sets", {
      p_workout_exercise_id: workoutExerciseId,
      p_set_reps: setReps,
    });

    if (updateError) {
      console.error("Update exercise error:", updateError);
      return { error: "Failed to update exercise. Please try again." };
    }

    revalidatePath(`/workouts/${planSlug}/${workoutSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating exercise:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Function to update a workout plan's name
export async function updateWorkoutPlan(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const { supabase } = await checkAuthentication();
  const planId = formData.get("planId") as string;
  const newName = formData.get("name") as string;

  const slug = generateSlug(newName);
  try {
    // Update the workout plan's name
    const { error: updateError } = await supabase
      .from("workout_plans")
      .update({ name: newName, slug })
      .eq("id", planId)
      .single();

    if (updateError) {
      console.error("Update workout plan error:", updateError);
      return { error: "Failed to update workout plan. Please try again." };
    }
  } catch (error) {
    console.error("Unexpected error updating workout plan:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
  redirect(`/workouts/${slug}`);
}

// Function to update a workout's name
export async function updateWorkoutName(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const { supabase } = await checkAuthentication();
  const workoutId = formData.get("workoutId") as string;
  const newName = formData.get("name") as string;
  const planSlug = formData.get("planSlug") as string;
  const slug = generateSlug(newName);

  try {
    // Update the workout's name
    const { error: updateError } = await supabase
      .from("workouts")
      .update({ name: newName, slug })
      .eq("id", workoutId)
      .single();

    if (updateError) {
      console.error("Update workout error:", updateError);
      return { error: "Failed to update workout. Please try again." };
    }
  } catch (error) {
    console.error("Unexpected error updating workout:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
  redirect(`/workouts/${planSlug}/${slug}`);
}

// Function to set an active workout plan
export async function setActivePlan(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase, user } = await checkAuthentication();

    const planId = formData.get("planId") as string;

    if (!planId) {
      return { error: "Plan ID is required" };
    }

    // Use RPC to atomically set one plan as active and others as inactive
    const { error } = await supabase.rpc("set_active_plan", {
      p_user_id: user.id,
      p_plan_id: planId,
    });

    if (error) {
      console.error("Set active plan error:", error);
      return { error: "Failed to set active plan. Please try again." };
    }

    revalidatePath("/workouts");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error setting active plan:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Function to deactivate a workout plan
export async function deactivatePlan(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase, user } = await checkAuthentication();
    const planId = formData.get("planId") as string;

    if (!planId) {
      return { error: "Plan ID is required" };
    }

    // Update the plan to set is_active to false
    const { error } = await supabase
      .from("workout_plans")
      .update({ is_active: false })
      .eq("id", planId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Deactivate workout plan error:", error);
      return { error: "Failed to deactivate workout plan. Please try again." };
    }

    revalidatePath("/workouts");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error deactivating workout plan:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

//_________________________ DELETE FUNCTIONS (DELETE) _____________________

// Function to delete an exercise from a workout
export async function deleteExerciseFromWorkout(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase } = await checkAuthentication();

    const workoutExerciseId = formData.get("workoutExerciseId") as string;
    const workoutId = formData.get("workoutId") as string;
    const planSlug = formData.get("planSlug") as string;
    const workoutSlug = formData.get("workoutSlug") as string;

    if (!workoutExerciseId) {
      return { error: "Workout exercise ID is required" };
    }

    // Delete the workout exercise and reorder (sets will be deleted automatically via CASCADE)
    const { error: deleteError } = await supabase.rpc(
      "delete_exercise_and_reorder",
      {
        p_workout_exercise_id: workoutExerciseId,
        p_workout_id: workoutId,
      },
    );

    if (deleteError) {
      console.log("Delete error:", deleteError);
      return { error: "Failed to delete exercise. Please try again." };
    }

    revalidatePath(`/workouts/${planSlug}/${workoutSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting exercise from workout:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Function to delete a workout
export async function deleteWorkout(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase } = await checkAuthentication();

    const workoutId = formData.get("workoutId") as string;
    const planId = formData.get("planId") as string;
    const planSlug = formData.get("planSlug") as string;

    if (!workoutId) {
      return { error: "Workout ID is required" };
    }

    // Use RPC function to delete workout and reorder remaining workouts
    const { error: deleteError } = await supabase.rpc(
      "delete_workout_and_reorder",
      {
        p_workout_id: workoutId,
        p_plan_id: planId, // Use plan_id directly from workout
      },
    );

    if (deleteError) {
      console.log("Delete error:", deleteError);
      return { error: "Failed to delete workout. Please try again." };
    }

    revalidatePath(`/workouts/${planSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting workout:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Function to delete a workout plan
export async function deleteWorkoutPlan(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase } = await checkAuthentication();
    const planId = formData.get("planId") as string;

    if (!planId) {
      return { error: "Plan ID is required" };
    }

    // Direct delete - CASCADE will handle the rest
    const { error: deleteError } = await supabase
      .from("workout_plans")
      .delete()
      .eq("id", planId);

    if (deleteError) {
      console.log("Delete error:", deleteError);
      return { error: "Failed to delete workout plan. Please try again." };
    }

    revalidatePath("/workouts");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting workout plan:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
