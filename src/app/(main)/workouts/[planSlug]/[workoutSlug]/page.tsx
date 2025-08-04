import AddExerciseModal from "@/app/components/add-exercise-modal";
import {
  getWorkoutFromPlan,
  getExercisesFromWorkout,
  updateWorkoutName,
} from "../../actions";
import ExerciseCard from "@/app/components/exercise-card";
import EditNameModal from "@/app/components/edit-name-modal";

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
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            planSlug={planSlug}
            workoutSlug={workoutSlug}
          />
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
