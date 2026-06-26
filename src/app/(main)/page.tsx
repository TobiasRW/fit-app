import { createClient } from "@/utils/supabase/server";
import { getNextWorkout, getWeeklyCompletedWorkouts } from "./actions";
import WorkoutCard from "../components/cards/workout-card";
import ErrorCard from "../components/cards/error-card";
import { getISOWeek } from "date-fns";
import { Suspense } from "react";
import { CompletedWorkout, Streak } from "../types";
import CompletedExerciseCard from "../components/cards/complete-exercise-card";
import Link from "next/link";
import { getCurrentStreak } from "./stats/actions";
import { getUserGoal } from "./profile/actions";
import Skeleton from "../components/loaders/skeleton";
import LoadingStatsSection from "../components/loaders/loading-stats-section";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    redirect("/login");
  }

  const userId = claims.sub;
  const displayName = claims.user_metadata?.display_name as string | undefined;

  const currentWeekNumber = getISOWeek(new Date());

  return (
    <main className="mx-auto mt-10 w-11/12 pb-20">
      <section className="">
        <h1 className="text-4xl font-bold">
          Hey,{" "}
          <span className="text-green">{displayName || "user"}</span>
        </h1>
      </section>

      <section className="relative mt-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-medium">Next Workout</h2>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>
        <Suspense fallback={<Skeleton height={104} />}>
          <WorkoutSection userId={userId} />
        </Suspense>
      </section>

      <section className="relative mt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium">Weekly Stats</h2>
            <p>{`Week ${currentWeekNumber}`}</p>
          </div>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>

        <Suspense fallback={<LoadingStatsSection />}>
          <StatsSection userId={userId} />
        </Suspense>
      </section>
    </main>
  );
}

// Component to fetch and display the next workout
async function WorkoutSection({ userId }: { userId: string }) {
  const nextWorkout = await getNextWorkout(userId);

  if (!nextWorkout) {
    return (
      <div className="bg-gray dark:bg-dark-gray flex h-28 flex-col justify-center overflow-hidden rounded-lg p-2 drop-shadow-md">
        <p className="text-foreground text-center">
          Please create or activate a workout plan.
        </p>
        <Link
          href="/workouts"
          className="bg-background dark:bg-green text-foreground mx-auto mt-2 inline-block w-2/4 rounded-full px-2 py-1 text-center"
        >
          Go to Workouts
        </Link>
      </div>
    );
  }

  if ("error" in nextWorkout) {
    return <ErrorCard errorText={nextWorkout.error} variant="primary" />;
  }

  return (
    <>
      <WorkoutCard
        href={`/session/${nextWorkout.workoutSlug}`}
        name={nextWorkout.workoutName}
        secondName={nextWorkout.planName}
        workoutId={nextWorkout.id}
        planSlug={nextWorkout.planSlug}
        progress={nextWorkout.progress}
        completed={nextWorkout.completed}
        variant="upcoming"
      />
    </>
  );
}

// Stats Section
async function StatsSection({ userId }: { userId: string }) {
  const [thisWeeksWorkouts, streak, goal] = await Promise.all([
    getWeeklyCompletedWorkouts(userId),
    getCurrentStreak(userId),
    getUserGoal(userId),
  ]);

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

  if ("error" in goal) {
    return (
      <div className="h-40 w-full">
        <ErrorCard
          errorText={goal.error ?? "An unknown error occurred."}
          variant="secondary"
        />
      </div>
    );
  }

  return (
    <div className="">
      <div className="mx-auto flex w-11/12 items-center justify-between pt-4">
        <WorkoutStats
          workouts={thisWeeksWorkouts}
          goal={goal.workout_goal_per_week.toString()}
        />
        <WeekStreak streak={streak} />
      </div>
      <div className="mt-6">
        <h3 className="mb-4 text-xl">This weeks completed workouts:</h3>
        {thisWeeksWorkouts.length > 0 ? (
          <div className="space-y-4">
            {thisWeeksWorkouts.map((workout) => (
              <CompletedExerciseCard key={workout.id} exercise={workout} />
            ))}
          </div>
        ) : (
          <div className="bg-gray dark:bg-dark-gray flex h-14 flex-col justify-center overflow-hidden rounded-lg p-2 drop-shadow-md">
            <p className="text-foreground text-center">
              No workouts completed this week.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

async function WorkoutStats({
  workouts,
  goal,
}: {
  workouts?: CompletedWorkout[];
  goal?: string;
}) {
  return (
    <div className="">
      <p className="text-foreground text-center text-6xl font-medium">
        {workouts?.length}/{goal}
      </p>
      <p className="text-foreground text-sm font-light">Workouts this week</p>
    </div>
  );
}

async function WeekStreak({ streak }: { streak?: Streak }) {
  return (
    <div className="">
      <p className="text-foreground text-center text-6xl font-medium">
        {streak?.streak && streak.streak > 0 ? "🔥" : "😴"}
      </p>
      <p className="text-foreground text-sm font-light">
        <span className="text-base font-bold">{streak?.streak} </span>Week
        Streak
      </p>
    </div>
  );
}
