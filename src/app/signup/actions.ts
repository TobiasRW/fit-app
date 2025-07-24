"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";

type initialState = {
  error?: string;
  success?: string;
};

export async function signup(
  prevState: initialState,
  formData: FormData
): Promise<initialState> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Validate password confirmation on server-side
  if (data.password !== data.confirmPassword) {
    return { error: "Passwords do not match" };
  }

  // Optional: Add password strength validation
  if (data.password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) {
    console.error("Signup error:", error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return {
    success: "Signup successful! Please check your email for confirmation.",
  };
}
