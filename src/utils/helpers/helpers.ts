import { createClient } from "@/utils/supabase/server";

// generate slug
export async function generateSlug(name: string): Promise<string> {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Authentication check
export async function checkAuthentication() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  return { supabase, user: user.data.user };
}
