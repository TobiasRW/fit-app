import ErrorCard from "../cards/error-card";
import StatSquare from "../ui/stat-square";

export async function PRSquare({
  name,
  fetch,
  userId,
}: {
  name: string;
  fetch: (userId: string) => Promise<number | { error: string } | null>;
  userId: string;
}) {
  const pr = await fetch(userId);

  if (typeof pr === "object" && pr !== null && "error" in pr) {
    return (
      <div className="h-26 w-full">
        <ErrorCard errorText={"Failed to Load PR"} variant="secondary" />
      </div>
    );
  }

  return (
    <StatSquare
      headline={name}
      size="small"
      stat={pr?.toString() || "No PR Yet"}
      color="gray"
    />
  );
}
