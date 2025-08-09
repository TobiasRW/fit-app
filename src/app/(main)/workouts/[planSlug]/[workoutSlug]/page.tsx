import AddExerciseModal from "@/app/components/modals/add-exercise-modal";
import {
  getWorkoutFromPlan,
  getExercisesFromWorkout,
  updateWorkoutName,
} from "../../actions";
import ExerciseCard from "@/app/components/exercise-card";
import EditNameModal from "@/app/components/modals/edit-name-modal";
import Link from "next/link";
import { CaretLeftIcon, PencilIcon } from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";
import ErrorCard from "@/app/components/error-card";

export default async function Page({
  params,
}: {
  params: Promise<{ planSlug: string; workoutSlug: string }>;
}) {
  const { planSlug, workoutSlug } = await params;

  return (
    <main className="mx-auto mt-10 w-11/12">
      <Link href={`/workouts/${planSlug}`} className="my-2 flex items-center">
        <CaretLeftIcon size={20} className="text-green" /> Back
      </Link>

      {/* Single Suspense boundary for all content */}
      <Suspense fallback={<WorkoutContentLoading />}>
        <WorkoutContent planSlug={planSlug} workoutSlug={workoutSlug} />
      </Suspense>
    </main>
  );
}

function WorkoutContentLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="bg-gray dark:bg-dark-gray h-10 w-48 animate-pulse rounded" />
        <PencilIcon size={20} className="text-green" />
      </div>

      {/* Exercises skeleton */}
      <div className="mt-4">
        <h2 className="text-2xl font-semibold">Exercises</h2>
        <div className="mt-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray dark:bg-dark-gray h-18 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    </>
  );
}

// Single component that loads all workout and exercise data
async function WorkoutContent({
  planSlug,
  workoutSlug,
}: {
  planSlug: string;
  workoutSlug: string;
}) {
  const workout = await getWorkoutFromPlan(planSlug, workoutSlug);

  if ("error" in workout) {
    return (
      <>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Workout not found</h1>
        </div>
        <div className="mt-8">
          <ErrorCard errorText={workout.error} variant="primary" />
        </div>
      </>
    );
  }

  const exercises = await getExercisesFromWorkout(workout.id);

  if ("error" in exercises) {
    return (
      <div className="mt-8">
        <ErrorCard errorText={exercises.error} variant="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">{workout.name}</h1>
        <EditNameModal
          action={updateWorkoutName}
          title="New Workout Name"
          currentName={workout.name}
          workoutId={workout.id}
          planSlug={planSlug}
        />
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold">Exercises</h2>
        {exercises.length > 0 ? (
          <div className="mt-4 space-y-4">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                planSlug={planSlug}
                workoutSlug={workoutSlug}
                workoutId={workout.id}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 py-12 text-center">
            <p className="text-foreground/50 text-lg">
              No exercises in this workout yet. Click the button below to add
              your first exercise <span className="text-foreground">💪</span>
            </p>
          </div>
        )}
      </div>

      {exercises.length <= 12 && (
        <AddExerciseModal
          planSlug={planSlug}
          workoutSlug={workoutSlug}
          workoutId={workout.id}
        />
      )}
    </>
  );
}
