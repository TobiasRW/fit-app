type ButtonProps = {
  variant?: "primary" | "secondary" | "destructive" | "basic";
  size?: "extrasmall" | "small" | "medium" | "large";
  text: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  variant = "primary",
  size = "medium",
  type,
  text,
  disabled,
  onClick,
}: ButtonProps) {
  const variants = {
    primary: disabled
      ? "bg-faded-green text-background rounded-full"
      : "bg-green text-background rounded-full",
    secondary: "bg-gray text-foreground rounded-full dark:bg-dark-gray",
    destructive: "bg-red text-background rounded-full",
    basic: "bg-background text-foreground rounded-full",
  };

  const sizes = {
    extrasmall: "text-xs px-1 py-0.5 min-w-[60px]",
    small: "text-sm px-2 py-1 min-w-[80px]",
    medium: "text-base px-4 py-2 min-w-[100px]",
    large: "text-lg px-6 py-3 min-w-[120px]",
  };
  return (
    <button
      type={type}
      className={`${variants[variant]} ${sizes[size]} ${
        disabled ? "opacity-80" : ""
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
