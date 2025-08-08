type TextareaProps = {
  name?: string;
  placeholder?: string;
  label?: string;
  maxLength?: number;
  rows?: number;
  defaultValue?: string;
  value?: string;
};

export default function Textarea({
  name,
  placeholder,
  label,
  maxLength,
  rows,
  defaultValue,
  value,
}: TextareaProps) {
  return (
    <div className="relative">
      {label && (
        <label className="text-foreground bg-background absolute -top-3 left-3 px-2 font-medium dark:bg-[#3d3d3d]">
          {label}
        </label>
      )}
      <textarea
        name={name}
        className="border-foreground w-full rounded-md border px-2 pt-4 pb-2 focus:outline-none"
        placeholder={placeholder || "Type your notes here..."}
        maxLength={maxLength}
        rows={rows}
        defaultValue={defaultValue}
        value={value}
      />
    </div>
  );
}
