import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto mt-24 items-center">
      {children}
    </div>
  );
}
