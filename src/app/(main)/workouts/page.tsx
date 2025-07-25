import CreateWorkoutModal from "@/app/components/create-workout-modal";
import WorkoutCard from "../../components/workout-card";
import { getUserWorkoutPlans } from "./actions";

export default async function Page() {
  const workoutPlans = await getUserWorkoutPlans();

  return (
    <main className="mx-auto mt-10 w-11/12">
      <h1 className="text-4xl font-bold">Your Workouts</h1>
      <p className="text-foreground/50 mt-2">
        {workoutPlans.length}/4 workout plans created
      </p>

      {workoutPlans.length > 0 ? (
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-4">
            {workoutPlans.map((plan) => (
              <WorkoutCard key={plan.id} id={plan.id} name={plan.name} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 py-12 text-center">
          <p className="text-foreground/50 text-lg">
            No workout plans created yet. Click the button below to create your
            first workout plan <span className="text-foreground">💪</span>
          </p>
        </div>
      )}
      {workoutPlans.length <= 4 && <CreateWorkoutModal />}
    </main>
  );
}
