import AddWorkoutModal from "@/app/components/add-workout-modal";
import { getWorkoutPlan } from "../actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workoutPlan = await getWorkoutPlan(id);

  return (
    <main className="mx-auto mt-10 w-11/12">
      <h1 className="text-4xl font-bold">{workoutPlan.name}</h1>

      <div className="">
        {workoutPlan.workouts.length > 0 ? (
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-4">
              {workoutPlan.workouts.map((workout) => (
                <div key={workout.id} className="rounded-lg border p-4">
                  <h2 className="text-xl font-semibold">{workout.name}</h2>
                  <p>Order: {workout.order_index}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 py-12 text-center">
            <p className="text-foreground/50 text-lg">
              No workouts in this plan yet. Click the button below to create
              your first workout <span className="text-foreground">💪</span>
            </p>
          </div>
        )}

        {workoutPlan.workouts.length <= 7 && <AddWorkoutModal planId={id} />}
      </div>
    </main>
  );
}
