import { Suspense } from "react";
import type { Metadata } from "next";

import SessionWrapper from "@/components/auth/SessionWrapper";

import { nunito, roboto } from "@/helpers/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "MyLinks",
  description: "Share your linktree",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en" className={`${nunito.variable} ${roboto.variable}`}>
        <body className="min-h-screen bg-repeat-round bg-gradient-to-tr from-blue-950 via-blue-700 to-blue-600 text-zinc-100  ">
          <Suspense>
            <main className=" pt-4 pb-28">{children}</main>
          </Suspense>
        </body>
      </html>
    </SessionWrapper>
  );
}
