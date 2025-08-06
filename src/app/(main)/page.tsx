import { createClient } from "@/utils/supabase/server";
import { getNextWorkout } from "./actions";
import WorkoutCard from "../components/workout-card";
import ErrorCard from "../components/error-card";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nextWorkout = await getNextWorkout();

  return (
    <main className="mx-auto mt-10 w-11/12">
      <section className="">
        <h1 className="text-4xl font-bold">
          Hey,{" "}
          <span className="text-green">
            {user?.user_metadata?.display_name || "user"}
          </span>
        </h1>
      </section>

      <section className="relative mt-10 space-y-4">
        <h2 className="text-2xl font-medium">Next Workout</h2>
        {/* <hr className="bg-foreground/30 absolute right-[50%] left-[50%] mx-[-50vw] h-[1px] w-screen border-none" /> */}
        {nextWorkout && !("error" in nextWorkout) ? (
          <WorkoutCard
            name={nextWorkout.workoutName}
            secondName={nextWorkout.planName}
            workoutId={nextWorkout.id}
            planSlug={nextWorkout.planSlug}
            workoutSlug={nextWorkout.workoutSlug}
            progress={nextWorkout.progress}
            variant="upcoming"
          />
        ) : nextWorkout && "error" in nextWorkout ? (
          <ErrorCard errorText={nextWorkout.error} />
        ) : (
          <p className="text-foreground/50 mt-4">
            No upcoming workouts found. Please create a workout plan.
          </p>
        )}
      </section>
    </main>
  );
}
