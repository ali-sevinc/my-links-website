"use client";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { app } from "@/firebase";
import { serverTimestamp } from "firebase/database";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type SessionType = {
  data: {
    user: {
      userId: string;
      email: string;
      image: string;
      name: string;
      username: string;
    };
  } | null;
};

export default function SignUpPage() {
  const { data } = useSession() as SessionType;
  const db = getFirestore(app);
  const router = useRouter();

  async function createAcc() {
    if (!data) return;
    await addDoc(collection(db, "links"), {
      username: data.user.username,
      profileImage: data.user.image,
      userId: data.user.userId,
      timestamp: serverTimestamp(),
    }).then(() => router.push(`/user/${data.user.username}`));
  }

  return (
    <Container>
      <h2>Click to the button to create your account with google..</h2>
      {!data && <Button onClick={() => signIn()}>Sign Up</Button>}
      {data && (
        <Button onClick={createAcc}>Activate {data.user.username}</Button>
      )}
    </Container>
  );
}
