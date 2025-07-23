type ButtonProps = {
  variant?: "primary" | "secondary";
  text: string;
};

export default function Button({ variant = "primary", text }: ButtonProps) {
  const variants = {
    primary: "bg-green text-background p-2 rounded-full",
    secondary: "bg-gray text-foreground p-2 rounded-full",
  };
  return <button className={`${variants[variant]} `}>{text}</button>;
}
