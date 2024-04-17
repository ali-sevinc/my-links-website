"use client";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { app } from "@/firebase";
import { serverTimestamp } from "firebase/database";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
type UserDataType = {
  profileImage: string;
  userId: string;
  username: string;
  docId: string;
};

export default function SignUpPage() {
  const { data } = useSession() as SessionType;
  const db = getFirestore(app);
  const router = useRouter();

  const [createError, setCreateError] = useState(false);

  async function createAcc() {
    if (!data) return;
    setCreateError(false);

    const qu = query(
      collection(db, "links"),
      where("username", "==", data.user.username)
    );
    const queryData = await getDocs(qu);
    const mappedData = queryData.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as UserDataType[];

    if (mappedData?.[0]) {
      setCreateError(true);
      return;
    }

    await addDoc(collection(db, "links"), {
      username: data.user.username,
      profileImage: data.user.image,
      userId: data.user.userId,
      timestamp: serverTimestamp(),
    }).then(() => router.push(`/user/${data.user.username}`));
  }

  return (
    <Container>
      {!data && (
        <>
          <h2 className="font-semibold text-lg">
            Click to the button to create your account with gmail.
          </h2>
          <Button onClick={() => signIn()}>Sign Up</Button>
        </>
      )}
      {data && !createError && (
        <Button onClick={createAcc}>Activate {data.user.username}</Button>
      )}
      {createError && data && (
        <div>
          <h2 className="text-xl font-semibold">
            {data?.user.username} already created
          </h2>
          <Link
            href={`/user/${data.user.username}`}
            className="text-blue-500 text-lg uppercase hover:underline"
          >
            Go to {data.user.username}
          </Link>
        </div>
      )}
    </Container>
  );
}
