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
    </main>
  );
}
