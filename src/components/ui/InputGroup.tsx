type PropsType = {
  label: string;
  id: string;
  type?: "text" | "url";
  value: string;
  name: string;
  onChange: (val: string, name: string) => void;
  error: string;
};
export default function InputGroup({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  name,
}: PropsType) {
  return (
    <div className="flex flex-col w-full">
      <p className="flex gap-4 w-full items-center">
        <label htmlFor={id} className="w-24 text-sm md:text-base">
          {label}
        </label>
        <input
          className={`flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-2 py-1 text-lg ${
            error ? "bg-red-300 focus:ring-red-500" : ""
          }`}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value, name)}
        />
      </p>
      {error && <p className="text-end text-sm mt-1 text-red-500">{error}</p>}
    </div>
  );
}
