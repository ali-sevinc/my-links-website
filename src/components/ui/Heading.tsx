import { ReactNode } from "react";

type PropsType = { as?: "h1" | "h2"; children: ReactNode };
export default function Heading({ as = "h1", children }: PropsType) {
  if (as === "h1") {
    return <h1 className="font-roboto text-3xl font-bold">{children}</h1>;
  }
  if (as === "h2") {
    return <h2 className="font-roboto text-xl font-semibold">{children}</h2>;
  }
}
