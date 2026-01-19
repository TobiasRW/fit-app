import { getUserGoal } from "@/app/(main)/profile/actions";
import { getTotalCompletedWorkoutsThisYear } from "@/app/(main)/stats/actions";
import ErrorCard from "../cards/error-card";

export async function YearlyWorkoutCompletion() {
  const totalWorkoutsThisYear = await getTotalCompletedWorkoutsThisYear();
  const goal = await getUserGoal();

  if (
    typeof totalWorkoutsThisYear === "object" &&
    "error" in totalWorkoutsThisYear
  ) {
    return (
      <div className="mt-10 h-24 w-full">
        <ErrorCard
          errorText={"Failed to load your total workouts completed"}
          variant="secondary"
        />
      </div>
    );
  }
  if ("error" in goal) {
    return (
      <div className="mt-10 h-24 w-full">
        <ErrorCard errorText={"Failed to load your goal"} variant="secondary" />
      </div>
    );
  }

  const totalYearGoal = goal.workout_goal_per_week * 52;

  return (
    <div className="mt-4">
      <p className="mb-2 font-light italic">
        {totalWorkoutsThisYear} / {totalYearGoal} workouts completed
      </p>
      <div className="bg-faded-green relative h-3 w-full rounded-sm">
        <div
          className="bg-green absolute inset-0 rounded-sm"
          style={{ width: `${(totalWorkoutsThisYear / totalYearGoal) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
