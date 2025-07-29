type InputProps = {
  label?: string;
  variant?: "outlined" | "filled";
  placeholder?: string;
  type?: string;
  id?: string;
  name?: string;
  min?: string;
  max?: string;
  required?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  value?: string;
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
  value,
  onChange,
  onFocus,
}: InputProps) {
  const variants = {
    outlined: "border border-gray-300 rounded-md p-2 ",
    filled: "bg-background rounded-md p-2",
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
