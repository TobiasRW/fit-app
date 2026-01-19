import { getCurrentStreak } from "@/app/(main)/stats/actions";
import ErrorCard from "../cards/error-card";
import StatSquare from "../ui/stat-square";

export async function Streak() {
  const streak = await getCurrentStreak();

  if ("error" in streak) {
    return (
      <div className="h-40 w-full">
        <ErrorCard
          errorText={streak.error ?? "An unknown error occurred."}
          variant="secondary"
        />
      </div>
    );
  }

  return (
    <StatSquare
      headline="Current Streak"
      size="large"
      stat={streak.streak}
      icon={streak?.streak && streak.streak > 0 ? "🔥" : "😴"}
    />
  );
}
