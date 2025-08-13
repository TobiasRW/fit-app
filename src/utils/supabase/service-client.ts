import { createServerClient } from "@supabase/ssr";

export async function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key instead of anon key
    {
      cookies: {
        // No-op cookie handlers since service role doesn't need session management
        getAll() {
          return [];
        },
        setAll() {
          // Do nothing
        },
      },
    },
  );
}
