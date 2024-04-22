import { ReactNode } from "react";
import Button from "./Button";

type PropsType = {
  children: ReactNode;
  buttonText: string;
  onClick: () => void;
};
export default function Message({ children, buttonText, onClick }: PropsType) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center pt-12">
      <p className="text-2xl">{children}</p>
      <Button onClick={onClick}>{buttonText}</Button>
    </div>
  );
}
