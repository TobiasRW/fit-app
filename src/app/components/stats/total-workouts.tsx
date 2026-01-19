import { getTotalCompletedWorkouts } from "@/app/(main)/stats/actions";
import ErrorCard from "../cards/error-card";
import StatSquare from "../ui/stat-square";

export async function TotalWorkouts() {
  const totalWorkouts = await getTotalCompletedWorkouts();

  if (
    typeof totalWorkouts === "object" &&
    totalWorkouts !== null &&
    "error" in totalWorkouts
  ) {
    return (
      <div className="h-40 w-full">
        <ErrorCard
          errorText={totalWorkouts.error ?? "An unknown error occurred."}
          variant="secondary"
        />
      </div>
    );
  }
  return (
    <StatSquare
      headline="Total Workouts"
      stat={totalWorkouts}
      icon="💪"
      size="large"
      color="green"
    />
  );
}
