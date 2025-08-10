import CreateWorkoutModal from "@/app/components/modals/create-workout-modal";
import WorkoutCard from "../../components/workout-card";
import { getUserWorkoutPlans } from "./actions";
import { Suspense } from "react";
import ErrorCard from "@/app/components/error-card";

export default async function Page() {
  return (
    <main className="mx-auto mt-10 w-11/12">
      <h1 className="text-4xl font-bold">Your Workouts</h1>
      <p className="text-foreground/50 mt-2">
        You can have a maximum of 4 plans
      </p>

      <Suspense fallback={<WorkoutPlansLoading />}>
        <WorkoutPlansList />
      </Suspense>
    </main>
  );
}

async function WorkoutPlansList() {
  const workoutPlans = await getUserWorkoutPlans();

  if ("error" in workoutPlans) {
    return (
      <div className="mt-8">
        <ErrorCard errorText={workoutPlans.error} variant="primary" />
      </div>
    );
  }

  if (workoutPlans.length > 0) {
    return (
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-4">
          {workoutPlans.map((plan) => (
            <WorkoutCard
              href={`/workouts/${plan.slug}`}
              key={plan.slug}
              name={plan.name}
              planSlug={plan.slug}
              variant="plan"
              planId={plan.id}
              isActive={plan.is_active}
            />
          ))}
        </div>
        {workoutPlans.length <= 4 && <CreateWorkoutModal />}
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 py-12 text-center">
        <p className="text-foreground/50 text-lg">
          No workout plans created yet. Click the button below to create your
          first workout plan <span className="text-foreground">💪</span>
        </p>
      </div>
      <CreateWorkoutModal />
    </>
  );
}

function WorkoutPlansLoading() {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray dark:bg-dark-gray h-26 animate-pulse rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
