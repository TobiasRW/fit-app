import AddWorkoutModal from "@/app/components/add-workout-modal";
import { getWorkoutPlan } from "../actions";
import Link from "next/link";
import WorkoutCard from "@/app/components/workout-card";

export default async function Page({
  params,
}: {
  params: Promise<{ planSlug: string }>;
}) {
  const { planSlug } = await params;
  const workoutPlan = await getWorkoutPlan(planSlug);

  return (
    <main className="mx-auto mt-10 w-11/12">
      <h1 className="text-4xl font-bold">{workoutPlan.name}</h1>

      <div className="">
        {workoutPlan.workouts.length > 0 ? (
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-4">
              {workoutPlan.workouts.map((workout) => (
                <WorkoutCard
                  key={workout.slug}
                  name={workout.name}
                  planSlug={workoutPlan.slug}
                  workoutSlug={workout.slug}
                  variant="workout"
                />
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

        {workoutPlan.workouts.length <= 7 && (
          <AddWorkoutModal planId={workoutPlan.id} />
        )}
      </div>
    </main>
  );
}
