import { createClient } from "@/utils/supabase/server";

// generate slug
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Authentication check
export async function checkAuthentication() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return { supabase, user: { id: userId } };
}
