import { createClient } from "@/utils/supabase/server";
import {
  getNextWorkout,
  getUserWeekStreak,
  getWeeklyCompletedWorkouts,
} from "./actions";
import WorkoutCard from "../components/workout-card";
import ErrorCard from "../components/error-card";
import { getISOWeek } from "date-fns";
import { Suspense } from "react";
import { CompletedWorkout, Streak } from "../types";
import CompletedExerciseCard from "../components/complete-exercise-card";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentWeekNumber = getISOWeek(new Date());

  return (
    <main className="mx-auto mt-10 w-11/12 pb-20">
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

        <StatsSection />
      </section>
    </main>
  );
}

// Component to fetch and display the next workout
async function WorkoutSection() {
  const nextWorkout = await getNextWorkout();

  if (!nextWorkout) {
    return (
      <p className="text-foreground/50 mt-4">
        No upcoming workouts found. Please create a workout plan.
      </p>
    );
  }

  if ("error" in nextWorkout) {
    return <ErrorCard errorText={nextWorkout.error} variant="primary" />;
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

// Stats Section
async function StatsSection() {
  const thisWeeksWorkouts = await getWeeklyCompletedWorkouts();
  const streak = await getUserWeekStreak();

  console.log(thisWeeksWorkouts);

  if ("error" in thisWeeksWorkouts) {
    return (
      <div className="h-40 w-full">
        <ErrorCard errorText={thisWeeksWorkouts.error} variant="secondary" />
      </div>
    );
  }

  if ("error" in streak) {
    return (
      <div className="h-40 w-full">
        <ErrorCard
          errorText={streak.error ?? "An unknown error occurred."}
          variant="secondary"
        />
      </div>
    );
  }

  return (
    <div className="">
      <div className="mx-auto flex w-11/12 items-center justify-between pt-4">
        <WorkoutStats workouts={thisWeeksWorkouts} streak={streak} />
        <WeekStreak streak={streak} />
      </div>
      <div className="mt-10">
        <h3 className="mb-4 text-xl">This weeks completed workouts:</h3>
        {thisWeeksWorkouts.length > 0 ? (
          <div className="space-y-4">
            {thisWeeksWorkouts.map((workout) => (
              <CompletedExerciseCard key={workout.id} exercise={workout} />
            ))}
          </div>
        ) : (
          <p>No workouts completed this week.</p>
        )}
      </div>
    </div>
  );
}

async function WorkoutStats({
  workouts,
  streak,
}: {
  workouts?: CompletedWorkout[];
  streak?: Streak;
}) {
  return (
    <div className="">
      <p className="text-foreground text-center text-7xl font-medium">
        {workouts?.length}/{streak?.goal}
      </p>
      <p className="text-foreground text-sm font-light">Workouts this week</p>
    </div>
  );
}

async function WeekStreak({ streak }: { streak?: Streak }) {
  return (
    <div className="">
      <p className="text-foreground text-center text-7xl font-medium">
        {streak?.streak && streak.streak > 0 ? "🔥" : "❄️"}
      </p>
      <p className="text-foreground text-sm font-light">
        <span className="text-base font-bold">{streak?.streak} </span>Week
        Streak
      </p>
    </div>
  );
}
