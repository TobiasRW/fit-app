type Props = {
  width?: number | "full";
  height?: number | "full";
  rounded?: number | "full";
  children?: React.ReactNode;
  pulse?: boolean;
  transparent?: boolean;
};

export default function Skeleton({
  width = "full",
  height = "full",
  rounded = 8,
  pulse = true,
  transparent = false,
  children,
}: Props) {
  return (
    <div
      className={`flex items-center justify-center ${pulse ? "animate-pulse" : ""} ${transparent ? "" : "bg-gray dark:bg-dark-gray"} `}
      style={{
        width: width === "full" ? "100%" : width,
        height: height === "full" ? "100%" : height,
        borderRadius: rounded === "full" ? "9999px" : rounded,
      }}
    >
      {children ? children : null}
    </div>
  );
}
