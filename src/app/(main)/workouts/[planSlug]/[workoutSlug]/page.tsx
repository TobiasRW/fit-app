import AddExerciseModal from "@/app/components/add-exercise-modal";
import { getWorkoutFromPlan, getExercisesFromWorkout } from "../../actions";

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
          <div key={exercise.id} className="mt-2">
            <h3 className="text-xl font-semibold">
              {exercise.exercises?.name || "Exercise name not found"}
            </h3>
            <div className="mt-1">
              {exercise.sets.length > 0 ? (
                exercise.sets.map((set) => (
                  <div key={set.id} className="flex justify-between">
                    <span>Set {set.set_number}</span>
                    <span>{set.target_reps} reps</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  No sets configured for this exercise
                </p>
              )}
            </div>
          </div>
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
