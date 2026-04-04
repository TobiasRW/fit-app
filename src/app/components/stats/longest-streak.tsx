import { getLongestStreak } from "@/app/(main)/stats/actions";
import ErrorCard from "../cards/error-card";
import StatSquare from "../ui/stat-square";

export async function LongestStreak({ userId }: { userId: string }) {
  const streak = await getLongestStreak(userId);

  if ("error" in streak) {
    return (
      <div className="h-20 w-full">
        <ErrorCard
          errorText={streak.error ?? "An unknown error occurred."}
          variant="secondary"
        />
      </div>
    );
  }

  return (
    <StatSquare
      headline="Longest Streak"
      size="medium"
      orientation="horizontal"
      stat={streak.streak}
      icon={streak?.streak && streak.streak > 0 ? "🏆" : "😴"}
    />
  );
}
