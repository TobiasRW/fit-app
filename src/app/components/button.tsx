type ButtonProps = {
  variant?: "primary" | "secondary";
  text: string;
  disabled?: boolean;
};

export default function Button({
  variant = "primary",
  text,
  disabled,
}: ButtonProps) {
  const variants = {
    primary: disabled
      ? "bg-faded-green text-background p-2 rounded-full"
      : "bg-green text-background p-2 rounded-full",
    secondary: "bg-gray text-foreground p-2 rounded-full",
  };
  return (
    <button className={`${variants[variant]} `} disabled={disabled}>
      {text}
    </button>
  );
}
