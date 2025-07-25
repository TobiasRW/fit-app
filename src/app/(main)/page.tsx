import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User:", user);
  return (
    <main className="mx-auto mt-10 w-11/12">
      <h1 className="text-4xl font-bold">
        Hey,{" "}
        <span className="text-green">
          {user?.user_metadata?.display_name || "user"}
        </span>
      </h1>
    </main>
  );
}
