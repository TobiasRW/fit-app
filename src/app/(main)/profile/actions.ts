"use server";
import { InitialState } from "@/app/types";
import { checkAuthentication } from "@/utils/helpers/helpers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Function to get the users goal
export async function getUserGoal() {
  try {
    const { supabase, user } = await checkAuthentication();

    const { data, error } = await supabase
      .from("user_settings")
      .select("workout_goal_per_week")
      .eq("id", user.id)
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
