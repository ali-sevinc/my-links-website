import { Suspense } from "react";
import type { Metadata } from "next";

import { Inter } from "next/font/google";
import SessionWrapper from "@/components/auth/SessionWrapper";

import Nav from "@/components/ui/Nav";

import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <html lang="en">
        <body className={`${inter.className} min-h-screen`}>
          <Nav />
          <Suspense>
            <main className=" pt-4 pb-28">{children}</main>
          </Suspense>
        </body>
      </html>
    </SessionWrapper>
  );
}
