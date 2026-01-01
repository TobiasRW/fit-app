import { getAllPlans } from "../actions";
import Link from "next/link";
import ErrorCard from "@/app/components/cards/error-card";
import { Suspense } from "react";
import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr";
import WorkoutCard from "@/app/components/cards/workout-card";

export default function Page() {
  return (
    <main className="mx-auto mt-10 w-11/12 pb-20">
      <section className="">
        <Link href="/profile" className="my-2 flex items-center">
          <CaretLeftIcon size={20} className="text-green" /> Back
        </Link>
        <h1 className="text-4xl font-bold">Your Workout History</h1>
      </section>

      <section className="relative mt-6 space-y-4">
        <Suspense fallback={<LoadingPlans />}>
          <WorkoutPlans />
        </Suspense>
      </section>
    </main>
  );
}

async function WorkoutPlans() {
  const workoutPlans = await getAllPlans();

  if ("error" in workoutPlans) {
    return (
      <div className="mt-8 h-26">
        <ErrorCard errorText={workoutPlans.error} variant="secondary" />
      </div>
    );
  }

  if (workoutPlans.length === 0) {
    return (
      <div className="mt-8 py-12 text-center">
        <p className="text-foreground/50 text-lg">
          No workout plans found. Create a plan to start tracking your workouts.
        </p>
      </div>
    );
  }

  const activePlans = workoutPlans.filter((plan) => plan.deleted_at === null);
  const deletedPlans = workoutPlans.filter((plan) => plan.deleted_at !== null);

  return (
    <div className="space-y-8">
      <div>
        <div className="mt-6 mb-4">
          <h2 className="mb-2">Current Plans</h2>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>
        {activePlans.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {activePlans.map((plan) => (
              <WorkoutCard
                href={`/profile/history/${plan.slug}`}
                key={plan.slug}
                name={plan.name}
                planSlug={plan.slug}
                planId={plan.id}
                variant="history"
              />
            ))}
          </div>
        ) : (
          <p className="text-foreground/50 py-8 text-center">
            No active plans found.
          </p>
        )}
      </div>
      <div>
        <div className="mt-6 mb-4">
          <h2 className="mb-2">Archived Plans</h2>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>

        {deletedPlans.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {deletedPlans.map((plan) => (
              <WorkoutCard
                href={`/profile/history/${plan.slug}`}
                key={plan.slug}
                name={plan.name}
                planSlug={plan.slug}
                planId={plan.id}
                variant="history"
              />
            ))}
          </div>
        ) : (
          <p className="text-foreground/50 py-8 text-center">
            No archived plans found.
          </p>
        )}
      </div>
    </div>
  );
}

function LoadingPlans() {
  return (
    <div className="space-y-8">
      {/* Loading for Current Plans */}
      <div>
        <div className="mt-6 mb-4">
          <h2 className="mb-2">Current Plans</h2>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>
        <div className="space-y-4">
          <div className="bg-gray dark:bg-dark-gray flex h-26 animate-pulse flex-col justify-center overflow-hidden rounded-lg p-4"></div>
          <div className="bg-gray dark:bg-dark-gray flex h-26 animate-pulse flex-col justify-center overflow-hidden rounded-lg p-4"></div>
        </div>
      </div>

      {/* Loading for Archived Plans */}
      <div>
        <div className="mt-6 mb-4">
          <h2 className="mb-2">Archived Plans</h2>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>
        <div className="space-y-4">
          <div className="bg-gray dark:bg-dark-gray flex h-26 animate-pulse flex-col justify-center overflow-hidden rounded-lg p-4"></div>
        </div>
      </div>
    </div>
  );
}
