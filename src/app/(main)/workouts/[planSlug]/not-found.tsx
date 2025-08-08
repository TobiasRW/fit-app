import Button from "@/app/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto mt-10 w-11/12 text-center">
      <div className="py-12">
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          Workout Plan Not Found
        </h1>
        <p className="text-foreground mb-8 text-lg">
          The workout plan you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access to it.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/workouts" className="">
            <Button text="Go to Workouts" />
          </Link>
          <Link href="/workouts/create" className="">
            <Button text="Create New Plan" />
          </Link>
        </div>
      </div>
    </main>
  );
}
