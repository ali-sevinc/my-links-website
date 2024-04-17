"use client";

import Home from "@/components/ui/Home";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data } = useSession();
  const router = useRouter();

  useEffect(
    function () {
      if (data) {
        const username = data.user?.email?.split("@")[0];
        router.push(`/user/${username}`);
      }
    },
    [data, router]
  );

  return <Home />;
}
