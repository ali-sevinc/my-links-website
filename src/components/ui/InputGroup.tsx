type PropsType = {
  label: string;
  id: string;
  type?: "text" | "url";
  value: string;
  onChange: (val: string) => void;
};
export default function InputGroup({
  id,
  label,
  type = "text",
  value,
  onChange,
}: PropsType) {
  return (
    <p className="flex gap-4 w-full items-center">
      <label htmlFor={id} className="w-24 text-sm md:text-base">
        {label}
      </label>
      <input
        className="flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-2 py-1 text-lg"
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </p>
  );
}
