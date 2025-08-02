import AddExerciseModal from "@/app/components/add-exercise-modal";
import { getWorkoutFromPlan, getExercisesFromWorkout } from "../../actions";
import ExerciseCard from "@/app/components/exercise-card";

export default async function Page({
  params,
}: {
  params: Promise<{ planSlug: string; workoutSlug: string }>;
}) {
  const { planSlug, workoutSlug } = await params;
  const workout = await getWorkoutFromPlan(planSlug, workoutSlug);
  const exercises = await getExercisesFromWorkout(workout.id);

  return (
    <main className="mx-auto mt-10 w-11/12">
      <h1 className="text-4xl font-bold">{workout.name}</h1>
      <div className="mt-4">
        <h2 className="text-2xl font-semibold">Exercises</h2>
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>

      {exercises.length <= 12 && (
        <AddExerciseModal
          planSlug={planSlug}
          workoutSlug={workoutSlug}
          workoutId={workout.id}
        />
      )}
    </main>
  );
}
