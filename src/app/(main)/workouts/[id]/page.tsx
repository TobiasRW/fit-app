import { getWorkoutPlan } from "../actions";

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const workoutPlan = await getWorkoutPlan(id);

  return (
    <main className="mx-auto mt-10 w-11/12">
      <h1 className="text-4xl font-bold">{workoutPlan.name}</h1>
    </main>
  );
}
