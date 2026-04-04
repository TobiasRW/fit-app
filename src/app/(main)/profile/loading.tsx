import Skeleton from "@/app/components/loaders/skeleton";
import LoadingGoal from "@/app/components/loaders/loading-goal";

export default function Loading() {
  return (
    <main className="mx-auto mt-10 w-11/12">
      <h1 className="text-4xl font-bold">Your Profile</h1>
      <section className="mt-10 flex flex-col items-center justify-center">
        <Skeleton width={128} height={128} rounded="full" />
        <Skeleton width={128} height={28} rounded={8} offsetTop={16} />
        <Skeleton width={208} height={20} rounded={8} offsetTop={4} />
        <Skeleton width={160} height={32} rounded="full" offsetTop={8} />
      </section>
      <section className="mt-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-medium">Your Goal</h2>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>
        <div>
          <LoadingGoal />
        </div>
      </section>
      <div className="mt-10 flex w-full items-center justify-center">
        <Skeleton width={96} height={36} rounded="full" />
      </div>
    </main>
  );
}
