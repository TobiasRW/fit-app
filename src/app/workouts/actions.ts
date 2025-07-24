"use server";

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function getWorkoutPlan(id: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  const { data: workoutPlan, error } = await supabase
    .from("workout_plans")
    .select("id, name")
    .eq("id", id)
    .eq("user_id", user.data.user.id)
    .single();

  if (error || !workoutPlan) {
    notFound();
  }

  return workoutPlan;
}

export async function createWorkoutPlan(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  if (!name || name.trim() === "") {
    throw new Error("Workout plan name is required");
  }

  const { data, error } = await supabase
    .from("workout_plans")
    .insert({
      user_id: user.data.user.id,
      name: name.trim(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create workout plan: ${error.message}`);
  }

  revalidatePath("/workouts");
  redirect(`/workouts/${data.id}`);
}
