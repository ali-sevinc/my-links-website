import { ReactNode } from "react";

type PropsType = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};
export default function Button({
  children,
  onClick,
  type = "button",
}: PropsType) {
  return (
    <button
      type={type}
      onClick={onClick ? onClick : () => {}}
      className="text-lg text-zinc-50 border px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 duration-200"
    >
      {children}
    </button>
  );
}
