import { ReactNode } from "react";

type PropsType = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  model?: "small" | "medium" | "large";
  disabled?: boolean;
};

const commonClasses =
  "bg-blue-500 text-zinc-50 hover:bg-blue-700 duration-200 disabled:cursor-not-allowed disabled:bg-zinc-300";
const buttonModel = {
  small: " text-sm px-2 py-1 rounded-sm",
  medium: " px-4 py-2 rounded",
  large: "text-lg px-6 py-3 rounded-lg",
};

export default function Button({
  children,
  onClick,
  type = "button",
  model = "medium",
  disabled,
}: PropsType) {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick ? onClick : () => {}}
      className={`${commonClasses} ${buttonModel[model]}`}
    >
      {children}
    </button>
  );
}
