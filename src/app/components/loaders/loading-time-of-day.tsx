import Skeleton from "./skeleton";

export default function LoadingTimeOfDay() {
  const labels = [
    { label: "Morning", width: 80 },
    { label: "Afternoon", width: 180 },
    { label: "Evening", width: 220 },
    { label: "Night", width: 70 },
  ];

  return (
    <div className="mt-4 w-10/12 animate-pulse">
      <div className="space-y-3">
        {labels.map((interval, i) => (
          <div key={i} className="h-10">
            <div className="text-foreground/50 flex items-center justify-between text-sm">
              <span className="font-medium">{interval.label}</span>
            </div>

            <Skeleton width={interval.width} height={12} rounded="full" />
          </div>
        ))}
      </div>
    </div>
  );
}
