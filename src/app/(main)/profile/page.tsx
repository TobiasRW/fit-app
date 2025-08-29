import Avatar from "@/app/components/avatar";
import { createClient } from "@/utils/supabase/server";
import { getUserGoal, signOut } from "./actions";
import EditGoalModal from "@/app/components/modals/edit-goal-modal";
import Button from "@/app/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import ErrorCard from "@/app/components/error-card";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <main className="mx-auto mt-10 w-11/12">
        <h1 className="text-4xl font-bold">Your Profile</h1>
        <section className="mt-10 flex flex-col items-center justify-center">
          <Avatar user={user!} />
          <Link href="/profile/history" className="mt-2">
            <Button
              text="View Workout History"
              variant="primary"
              size="small"
            />
          </Link>
        </section>
        <section className="mt-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium">Your Goal</h2>
            <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
          </div>
          <div>
            <Suspense fallback={<LoadingGoal />}>
              <GoalSection />
            </Suspense>
          </div>
        </section>
        <div className="mt-10 flex w-full items-center justify-center">
          <Button text="Sign Out" onClick={signOut} variant="secondary" />
        </div>
      </main>
    </>
  );
}

async function GoalSection() {
  const goal = await getUserGoal();

  if ("error" in goal) {
    return (
      <div className="h-20">
        <ErrorCard errorText={goal.error} variant="secondary" tag="goal" />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center">
        <p className="text-6xl">{goal.workout_goal_per_week}</p>
        <p className="text-foreground font-light">Workouts per week</p>
      </div>

      <div className="mt-2 flex items-center justify-center">
        <EditGoalModal goal={goal.workout_goal_per_week} />
      </div>
    </div>
  );
}

function LoadingGoal() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="bg-gray dark:bg-dark-gray h-14 w-14 animate-pulse rounded-lg"></div>
      <div className="bg-gray dark:bg-dark-gray h-4 w-32 animate-pulse rounded-lg"></div>
    </div>
  );
}
