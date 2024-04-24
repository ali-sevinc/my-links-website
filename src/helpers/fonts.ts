import { Roboto, Nunito } from "next/font/google";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
