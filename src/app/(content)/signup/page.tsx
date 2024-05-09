"use client";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { app } from "@/firebase";
import { SessionType } from "@/helpers/types";
import { serverTimestamp } from "firebase/database";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";

type UserDataType = {
  profileImage: string;
  userId: string;
  username: string;
  docId: string;
};

export default function SignUpPage() {
  const { data, status } = useSession() as SessionType;
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
  function handleGoBack() {
    signOut();
  }

  return (
    <Container>
      {status === "loading" && (
        <p className="text-lg animate-pulse">Loading...</p>
      )}
      {!data && status === "unauthenticated" && (
        <>
          <div className="flex gap-4 items-center">
            <Link href={"/"} className="hover:underline flex items-center">
              <HiArrowLeft /> Go Back
            </Link>
            <b>or</b>
            <Button onClick={() => signIn()}>Sign Up</Button>
          </div>
        </>
      )}
      {data && !createError && (
        <div className="flex gap-4">
          <Button onClick={handleGoBack}>Cancel</Button>
          <Button onClick={createAcc}>Activate {data.user.username}</Button>
        </div>
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
