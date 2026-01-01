type Props = {
  width?: number | "full";
  height?: number | "full";
  rounded?: number | "full";
  children?: React.ReactNode;
  pulse?: boolean;
  transparent?: boolean;
  offsetTop?: number;
  offsetBottom?: number;
  centered?: boolean;
};

export default function Skeleton({
  width = "full",
  height = "full",
  rounded = 8,
  pulse = true,
  transparent = false,
  offsetBottom = 0,
  offsetTop = 0,
  centered = false,
  children,
}: Props) {
  return (
    <div
      className={` ${pulse ? "animate-pulse" : ""} ${transparent ? "" : "bg-gray dark:bg-dark-gray"} ${centered ? "flex items-center justify-center" : ""}`}
      style={{
        width: width === "full" ? "100%" : width,
        height: height === "full" ? "100%" : height,
        borderRadius: rounded === "full" ? "9999px" : rounded,
        marginTop: offsetTop,
        marginBottom: offsetBottom,
      }}
    >
      {children ? children : null}
    </div>
  );
}
