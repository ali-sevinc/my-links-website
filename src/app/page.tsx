"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data } = useSession();
  const router = useRouter();

  console.log(data);

  useEffect(
    function () {
      if (data) {
        const username = data.user?.email?.split("@")[0];
        router.push(`/user/${username}`);
      }
    },
    [data, router]
  );

  return (
    <div>
      <h1>Welcome to MyLinks</h1>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
