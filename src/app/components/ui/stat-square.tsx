type Props = {
  headline: string;
  stat: number | undefined | string;
  icon?: string;
  color?: "green" | "gray";
  size?: "small" | "medium" | "large";
  borderRadius?: number;
  orientation?: "vertical" | "horizontal";
};

export default function StatSquare({
  headline,
  stat,
  icon,
  color = "gray",
  size = "medium",
  orientation = "vertical",
}: Props) {
  const isHorizontal = orientation === "horizontal";

  const sizeConfig = {
    small: {
      headline: "text-sm",
      stat: "text-xl",
      height: isHorizontal ? "h-12" : "h-26",
    },
    medium: {
      headline: "text-base",
      stat: "text-3xl",
      height: isHorizontal ? "h-14" : "h-32",
    },
    large: {
      headline: "text-lg",
      stat: "text-6xl",
      height: isHorizontal ? "h-16" : "h-40",
    },
  };

  const colorStyles = {
    green: "bg-green",
    gray: "bg-gray dark:bg-dark-gray",
  };

  const { headline: headlineSize, stat: statSize, height } = sizeConfig[size];

  const orientationClass = isHorizontal
    ? "flex-row items-center justify-between py-2 px-4"
    : `flex-col items-center ${icon ? "justify-between" : "justify-center gap-4"} p-2`;

  return (
    <div
      className={`flex w-full rounded-lg text-white shadow-lg ${height} ${orientationClass} ${colorStyles[color]}`}
    >
      <p className={headlineSize}>{headline}</p>
      <p className={statSize}>
        {stat?.toString() || "0"}
        {icon && isHorizontal && <span className="ml-2">{icon}</span>}
      </p>
      {icon && !isHorizontal && <p className="text-3xl">{icon}</p>}
    </div>
  );
}
