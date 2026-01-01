import AddWorkoutModal from "@/app/components/modals/add-workout-modal";
import { getWorkoutPlan, updateWorkoutPlan } from "../actions";
import WorkoutCard from "@/app/components/cards/workout-card";
import EditNameModal from "@/app/components/modals/edit-name-modal";
import Link from "next/link";
import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";
import ErrorCard from "@/app/components/cards/error-card";
import LoadingWorkouts from "@/app/components/loaders/loading-workouts";

export default async function Page({
  params,
}: {
  params: Promise<{ planSlug: string }>;
}) {
  const { planSlug } = await params;

  return (
    <main className="mx-auto mt-10 w-11/12 pb-20">
      <Link href="/workouts" className="my-2 flex items-center">
        <CaretLeftIcon size={20} className="text-green" /> Back
      </Link>

      <Suspense fallback={<LoadingWorkouts />}>
        <WorkoutPlanContent planSlug={planSlug} />
      </Suspense>
    </main>
  );
}

// Single component that loads all workout plan data
async function WorkoutPlanContent({ planSlug }: { planSlug: string }) {
  const workoutPlan = await getWorkoutPlan(planSlug);

  if ("error" in workoutPlan) {
    return (
      <>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Plan not found</h1>
        </div>
        <div className="mt-8">
          <ErrorCard errorText={workoutPlan.error} variant="primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">{workoutPlan.name}</h1>
        <EditNameModal
          action={updateWorkoutPlan}
          title="New Plan Name"
          currentName={workoutPlan.name}
          planId={workoutPlan.id}
        />
      </div>

      <div className="">
        {workoutPlan.workouts.length > 0 ? (
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-4">
              {workoutPlan.workouts.map((workout) => (
                <WorkoutCard
                  href={`/workouts/${workoutPlan.slug}/${workout.slug}`}
                  key={workout.slug}
                  name={workout.name}
                  planSlug={workoutPlan.slug}
                  variant="workout"
                  planId={workoutPlan.id}
                  workoutId={workout.id}
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
    </>
  );
}
