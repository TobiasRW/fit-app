import CompletedExerciseCard from "@/app/components/cards/complete-exercise-card";
import { getWorkoutHistory } from "../../actions";
import ErrorCard from "@/app/components/cards/error-card";
import { Suspense } from "react";
import Link from "next/link";
import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr";
import LoadingWorkoutHistory from "@/app/components/loaders/loading-workout-history";

export default async function Page({
  params,
}: {
  params: Promise<{ planSlug: string }>;
}) {
  const { planSlug } = await params;

  return (
    <main className="mx-auto mt-10 w-11/12 pb-20">
      <section className="">
        <Link href="/profile/history" className="my-2 flex items-center">
          <CaretLeftIcon size={20} className="text-green" /> Back
        </Link>
        <h1 className="text-4xl font-bold">Workout History</h1>
      </section>

      <Suspense fallback={<LoadingWorkoutHistory />}>
        <CompletedExercises planSlug={planSlug} />
      </Suspense>
    </main>
  );
}

async function CompletedExercises({ planSlug }: { planSlug: string }) {
  const workoutHistory = await getWorkoutHistory(planSlug);

  if ("error" in workoutHistory) {
    return (
      <div className="mt-8 h-26">
        <ErrorCard errorText={workoutHistory.error} variant="secondary" />
      </div>
    );
  }

  if (workoutHistory.length === 0) {
    return (
      <p className="text-foreground/50 mt-8 text-center">
        No workout history found.
      </p>
    );
  }

  return (
    <section>
      <div className="">
        {workoutHistory.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4">
            {workoutHistory.map((workout) => (
              <CompletedExerciseCard
                key={workout.id}
                exercise={workout}
                showFullDate
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
