type InputProps = {
  label?: string;
  variant?: "outlined" | "filled" | "borderless";
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
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
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
  value,
  onChange,
  onFocus,
}: InputProps) {
  const variants = {
    outlined: "border border-gray-300 rounded-md p-2 ",
    filled: "bg-background rounded-md p-2",
    borderless: "bg-transparent p-2 text-center focus:outline-none text-lg",
  };
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="font-medium">{label}</label>}
      <input
        className={`${variants[variant]}`}
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
        onChange={onChange}
        onFocus={onFocus}
      />
    </div>
  );
}
