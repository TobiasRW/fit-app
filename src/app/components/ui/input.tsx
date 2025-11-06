type InputProps = {
  label?: string;
  variant?: "outlined" | "filled" | "borderless" | "table";
  placeholder?: string;
  type?: string;
  id?: string;
  name?: string;
  min?: string | number;
  max?: string | number;
  disabled?: boolean;
  required?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  value?: string | number;
  step?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  className?: string;
  labelRow?: boolean;
};

export default function Input({
  label,
  variant = "outlined",
  placeholder,
  type = "text",
  id,
  name,
  min,
  max,
  required = false,
  ref,
  disabled,
  defaultValue,
  step,
  value,
  onChange,
  onFocus,
  className,
  labelRow = false,
}: InputProps) {
  const variants = {
    outlined: "border border-gray-300 rounded-md p-2 ",
    filled: "bg-background rounded-md p-2",
    borderless: "bg-transparent p-2 text-center focus:outline-none text-lg",
    table: "bg-transparent text-center focus:outline-none w-full",
  };
  return (
    <div
      className={`flex ${labelRow ? "items-center gap-2" : "flex-col space-y-1"} `}
    >
      {label && <label className="font-medium">{label}</label>}
      <input
        step={step}
        className={`${variants[variant]} ${className}`}
        placeholder={placeholder}
        type={type}
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onFocus={onFocus}
      />
    </div>
  );
}
