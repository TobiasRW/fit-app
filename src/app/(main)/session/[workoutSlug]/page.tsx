import CurrentExerciseCard from "@/app/components/current-exercise-card";
import { getCurrentWorkout } from "./actions";
import CompleteWorkoutModal from "@/app/components/modals/complete-workout-modal";
import ErrorCard from "@/app/components/error-card";
import { Suspense } from "react";
import SkipWorkoutModal from "@/app/components/modals/skip-workout-modal";

export default async function Page({
  params,
}: {
  params: Promise<{ workoutSlug: string }>;
}) {
  const { workoutSlug } = await params;

  return (
    <main className="mx-auto mt-10 w-11/12 pb-20">
      <Suspense fallback={<LoadingCurrentWorkout />}>
        <CurrentWorkoutContent workoutSlug={workoutSlug} />
      </Suspense>
    </main>
  );
}

async function CurrentWorkoutContent({ workoutSlug }: { workoutSlug: string }) {
  const workout = await getCurrentWorkout(workoutSlug);

  if ("error" in workout) {
    return (
      <div className="mt-10 h-26">
        <ErrorCard errorText={workout.error} variant="secondary" />
      </div>
    );
  }

  const hasLoggedSets = workout.exercises.some(
    (exercise) =>
      exercise.currentSessionData &&
      exercise.currentSessionData.sets &&
      exercise.currentSessionData.sets.length > 0,
  );

  return (
    <>
      <h1 className="text-green text-4xl font-bold">{workout.name}</h1>
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="mb-2 text-2xl font-semibold">Exercises</h2>
          <div className="flex items-center justify-center gap-2">
            {!workout.completed && !hasLoggedSets && (
              <SkipWorkoutModal workout={workout} />
            )}

            <CompleteWorkoutModal workout={workout} />
          </div>
        </div>
        <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
      </section>

      <section className="mt-4">
        {workout.exercises.map((exercise) => (
          <CurrentExerciseCard
            key={exercise.workoutExerciseId}
            exercise={exercise}
            workoutCompleted={workout.completed}
          />
        ))}
      </section>
    </>
  );
}

function LoadingCurrentWorkout() {
  return (
    <>
      <h1 className="text-gray dark:text-dark-gray text-4xl font-bold">
        Workout
      </h1>
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="mb-2 text-2xl font-semibold">Exercises</h2>
          <div className="bg-gray dark:bg-dark-gray h-5 w-18 animate-pulse rounded-full" />
        </div>
        <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
      </section>

      <section className="mt-4">
        <div className="animate-pulse">
          <div className="bg-gray dark:bg-dark-gray mb-4 h-14 w-full rounded-lg" />
          <div className="bg-gray dark:bg-dark-gray mb-4 h-14 w-full rounded-lg" />
          <div className="bg-gray dark:bg-dark-gray mb-4 h-14 w-full rounded-lg" />
        </div>
      </section>
    </>
  );
}
