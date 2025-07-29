import { getWorkoutFromPlan } from "../../actions";

export default async function Page({
  params,
}: {
  params: Promise<{ planSlug: string; workoutSlug: string }>;
}) {
  const { planSlug, workoutSlug } = await params;
  const workout = await getWorkoutFromPlan(planSlug, workoutSlug);

  return (
    <main className="mx-auto mt-10 w-11/12">
      <h1 className="text-4xl font-bold">{workout.name}</h1>

      <div className="mt-8">
        <p>Plan: {planSlug}</p>
        <p>Workout: {workoutSlug}</p>
        <p>Order: {workout.order_index}</p>
      </div>
    </main>
  );
}
