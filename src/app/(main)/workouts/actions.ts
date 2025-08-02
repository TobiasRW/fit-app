"use server";

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

// Define the initial state type
type initialState = {
  error?: string;
  success?: boolean;
};

// Define the type for the workout exercise query result
type WorkoutExerciseQueryResult = {
  id: string;
  order_index: number;
  exercises: {
    id: string;
    name: string;
  };
  sets: {
    id: string;
    set_number: number;
    target_reps: number;
  }[];
};

//_____________________ READ FUNCTIONS (GET) _____________________

// Function to get all the user's workout plans
export async function getUserWorkoutPlans() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  const { data: workoutPlans, error } = await supabase
    .from("workout_plans")
    .select("id, name, slug")
    .eq("user_id", user.data.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch workout plans");
  }

  return workoutPlans || [];
}

// Function to get a specific workout plan by slug
export async function getWorkoutPlan(slug: string) {
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
    .eq("user_id", user.data.user.id)
    .order("order_index", { referencedTable: "workouts", ascending: true })
    .single();

  if (error || !workoutPlan) {
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
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

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
    .eq("workout_plans.user_id", user.data.user.id)
    .single();

  if (error || !workout) {
    notFound();
  }

  return workout;
}

// Function to get exercises from a workout
export async function getExercisesFromWorkout(workoutId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

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
    .overrideTypes<WorkoutExerciseQueryResult[]>();

  if (error) {
    throw new Error("Failed to fetch exercises from workout");
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

//_____________________ CREATE FUNCTIONS (POST) _____________________

// Function to create a new workout plan for the user
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

    // Generate a slug from the name
    const slug = generateSlug(name);

    // Insert the new workout plan into the database
    const { error } = await supabase
      .from("workout_plans")
      .insert({
        user_id: user.data.user.id,
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
    const planSlug = formData.get("planSlug") as string;
    const workoutName = formData.get("workoutName") as string;

    if (!workoutName) {
      return { error: "Workout name is required" };
    }

    const slug = generateSlug(workoutName);

    // Get current workout count for order_index
    const { count } = await supabase
      .from("workouts")
      .select("*", { count: "exact", head: true })
      .eq("plan_id", planId);

    // Insert new workout
    const { error } = await supabase.from("workouts").insert({
      plan_id: planId,
      name: workoutName,
      slug: slug,
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

    revalidatePath(`/workouts/${planSlug}`);
    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// Function to add a exercise to a workout
export async function addExerciseToWorkout(
  prevState: initialState,
  formData: FormData,
): Promise<initialState> {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { error: "User not authenticated" };
    }

    // get data from form
    const workoutId = formData.get("workoutId") as string;
    const planSlug = formData.get("planSlug") as string;
    const workoutSlug = formData.get("workoutSlug") as string;
    const exerciseId = formData.get("exerciseId") as string;

    // Get all the setReps values as an array
    const setReps = formData
      .getAll("setReps")
      .map((rep) => parseInt(rep as string));

    // Get current exercise count for order_index
    const { count } = await supabase
      .from("workout_exercises")
      .select("*", { count: "exact", head: true })
      .eq("workout_id", workoutId);

    // Use RPC function
    const { error } = await supabase.rpc("add_exercise_with_sets", {
      p_workout_id: workoutId,
      p_exercise_id: exerciseId,
      p_order_index: (count || 0) + 1,
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

//____________________ HELPER FUNCTIONS ____________________

// generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
