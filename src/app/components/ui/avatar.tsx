import { User } from "@supabase/supabase-js";

export default function Avatar({ user }: { user: User }) {
  return (
    <>
      <div className="bg-green flex h-32 w-32 items-center justify-center rounded-full">
        <h3 className="text-5xl font-medium text-white">
          {user?.user_metadata?.display_name.charAt(0).toUpperCase()}
        </h3>
      </div>
      <p className="mt-4 text-xl">{user?.user_metadata?.display_name}</p>
      <p className="font-light italic">{user?.email}</p>
    </>
  );
}
