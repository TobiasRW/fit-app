import Skeleton from "./skeleton";

export default function LoadingBarChart() {
  const days = [
    { label: "Mon", height: 53 },
    { label: "Tue", height: 70 },
    { label: "Wed", height: 70 },
    { label: "Thu", height: 79 },
    { label: "Fri", height: 27 },
    { label: "Sat", height: 80 },
    { label: "Sun", height: 79 },
  ];

  return (
    <div className="mt-10 flex h-40 flex-col justify-between">
      <h2 className="text-lg font-semibold">Most active days</h2>
      <div className="relative flex max-h-32 items-end justify-between">
        {days.map((day) => (
          <div
            key={day.label}
            className="flex h-full flex-col items-center justify-end"
          >
            <Skeleton width={32} height={day.height} rounded={4} />
            <span className="text-foreground/70 mt-2 text-xs">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
