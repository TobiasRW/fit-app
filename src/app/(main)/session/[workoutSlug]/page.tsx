import CurrentExerciseCard from "@/app/components/current-exercise-card";
import { getCurrentWorkout } from "./actions";
import CompleteWorkoutModal from "@/app/components/complete-workout-modal";

export default async function Page({
  params,
}: {
  params: Promise<{ workoutSlug: string }>;
}) {
  const { workoutSlug } = await params;
  const workout = await getCurrentWorkout(workoutSlug);

  if ("error" in workout) {
    return (
      <main className="mx-auto mt-10 w-11/12">
        <h1 className="text-4xl font-bold">Error: {workout.error}</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto mt-10 w-11/12 pb-20">
      <h1 className="text-green text-4xl font-bold">{workout.name}</h1>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="mb-2 text-2xl font-semibold">Exercises</h2>
          <CompleteWorkoutModal workout={workout} />
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
    </main>
  );
}
