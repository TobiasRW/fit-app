import Skeleton from "./skeleton";

export default function LoadingPlans() {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} width="full" height={104} />
        ))}
      </div>
    </div>
  );
}
