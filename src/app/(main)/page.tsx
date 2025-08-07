import { createClient } from "@/utils/supabase/server";
import { getNextWorkout } from "./actions";
import WorkoutCard from "../components/workout-card";
import ErrorCard from "../components/error-card";
import { getISOWeek } from "date-fns";
import { Suspense } from "react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentWeekNumber = getISOWeek(new Date());

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
        <div className="space-y-2">
          <h2 className="text-2xl font-medium">Next Workout</h2>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>
        <Suspense fallback={<WorkoutSkeleton />}>
          <WorkoutSection />
        </Suspense>
      </section>

      <section className="relative mt-10 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium">Weekly Stats</h2>
            <p>{`Week ${currentWeekNumber}`}</p>
          </div>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>
      </section>
    </main>
  );
}

// Component to fetch and display the next workout
async function WorkoutSection() {
  const nextWorkout = await getNextWorkout();
  console.log("Next Workout:", nextWorkout);

  if (!nextWorkout) {
    return (
      <p className="text-foreground/50 mt-4">
        No upcoming workouts found. Please create a workout plan.
      </p>
    );
  }

  if ("error" in nextWorkout) {
    return <ErrorCard errorText={nextWorkout.error} />;
  }

  return (
    <>
      <WorkoutCard
        name={nextWorkout.workoutName}
        secondName={nextWorkout.planName}
        workoutId={nextWorkout.id}
        planSlug={nextWorkout.planSlug}
        workoutSlug={nextWorkout.workoutSlug}
        progress={nextWorkout.progress}
        completed={nextWorkout.completed}
        variant="upcoming"
      />
    </>
  );
}

// Loading component for the workout section
function WorkoutSkeleton() {
  return (
    <div className="bg-gray relative flex h-28 animate-pulse flex-col justify-end overflow-hidden rounded-lg p-2 drop-shadow-md">
      <div className="bg-muted/20 absolute inset-0 rounded-lg"></div>

      <div className="absolute inset-0 z-20 flex flex-col justify-center px-4">
        <div className="bg-background/40 mb-1 h-6 w-3/4 rounded-lg"></div>
      </div>

      <div className="relative z-20 pl-2">
        <div className="bg-background/40 h-4 w-1/2 rounded-lg"></div>
      </div>
    </div>
  );
}
