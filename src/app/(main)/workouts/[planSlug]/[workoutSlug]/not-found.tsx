import Button from "@/app/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br">
      <div className="mx-auto w-11/12 max-w-lg text-center">
        <div className="relative">
          {/* Large 404 number with subtle styling */}
          <div className="text-muted/10 mb-6 text-8xl font-black select-none md:text-9xl">
            404
          </div>

          {/* Workout dumbbell icon overlay */}
          <div className="absolute inset-0 -top-50 mb-6 flex items-center justify-center">
            <svg
              className="text-muted/30 h-20 w-20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z" />
            </svg>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-3">
            <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
              Workout Not Found
            </h1>
            <p className="text-muted-foreground mx-auto max-w-md text-base leading-relaxed md:text-lg">
              The workout you&#39;re looking for doesn&#39;t exist or you
              don&#39;t have access to it.
            </p>
          </div>

          {/* Action buttons with improved spacing */}
          <div className="flex w-full items-center justify-center gap-2 pt-4">
            <Link href="/workouts">
              <Button text="To workouts" variant="primary" />
            </Link>
            <Link href="/">
              <Button text="Go Home" variant="primary" />
            </Link>
          </div>

          {/* Subtle decorative element */}
          <div className="flex justify-center pt-8">
            <div className="flex space-x-1">
              <div className="bg-muted h-2 w-2 rounded-full"></div>
              <div className="bg-muted/60 h-2 w-2 rounded-full"></div>
              <div className="bg-muted/30 h-2 w-2 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
