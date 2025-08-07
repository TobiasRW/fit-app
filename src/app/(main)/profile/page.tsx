import Avatar from "@/app/components/avatar";
import { createClient } from "@/utils/supabase/server";
import { getUserGoal, signOut } from "./actions";
import EditGoalModal from "@/app/components/modals/edit-goal-modal";
import Button from "@/app/components/ui/button";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <main className="mx-auto mt-10 w-11/12">
        <h1 className="text-4xl font-bold">Your Profile</h1>
        <section className="mt-20 flex flex-col items-center justify-center">
          <Avatar user={user!} />
        </section>
        <section className="mt-10 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium">Your Goal</h2>
            <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
          </div>
          <div>
            <GoalSection />
          </div>
        </section>
        <div className="fixed bottom-30 left-1/2 mt-10 flex w-full -translate-x-1/2 items-center justify-center">
          <Button text="Sign Out" onClick={signOut} variant="secondary" />
        </div>
      </main>
    </>
  );
}

export async function GoalSection() {
  const goal = await getUserGoal();

  if ("error" in goal) {
    return (
      <p className="text-center text-red-500">
        {goal.error}, please try again later.
      </p>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center">
        <p className="text-6xl">{goal.goal}</p>
        <p className="text-foreground font-light">Workouts per week</p>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <div className="mt-4 flex items-center justify-center">
          <EditGoalModal goal={goal.goal} />
        </div>
      </div>
    </div>
  );
}
