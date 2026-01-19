import ErrorCard from "../cards/error-card";
import StatSquare from "../ui/stat-square";

export async function PRSquare({
  name,
  fetch,
}: {
  name: string;
  fetch: () => Promise<number | { error: string } | null>;
}) {
  const pr = await fetch();

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
