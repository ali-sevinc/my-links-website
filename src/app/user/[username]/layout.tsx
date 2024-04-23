import { ReactNode } from "react";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  return {
    title: `${params.username}'s linktree`,
  };
}

export default function LinksLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
