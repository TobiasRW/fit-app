import LoadingPlans from "@/app/components/loaders/loading-plans";

export default function Loading() {
  return (
    <main className="mx-auto mt-10 w-11/12">
      <h1 className="text-4xl font-bold">Your Workouts</h1>
      <p className="text-foreground/50 mt-2">
        You can have a maximum of 4 plans
      </p>
      <LoadingPlans />
    </main>
  );
}
