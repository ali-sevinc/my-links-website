"use client";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { revalidatePath } from "next/cache";

import {
  collection,
  getFirestore,
  where,
  query,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { app } from "@/firebase";

import { SessionType } from "@/helpers/types";
import InputGroup from "./InputGroup";
import Button from "./Button";
import { useRouter } from "next/navigation";

export default function Options() {
  const { data } = useSession() as SessionType;
  const db = getFirestore(app);

  const [displayName, setDisplayName] = useState(data?.user.username || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const router = useRouter();

  async function handleChangeDisplayName(event: FormEvent) {
    event.preventDefault();
    setIsError(null);
    setIsLoading(false);
    if (!data) return;

    setIsLoading(true);
    const qu = query(
      collection(db, "links"),
      where("userId", "==", data.user.userId)
    );
    const userDocs = await getDocs(qu);
    if (userDocs.empty) return;

    const userDoc = userDocs.docs[0];
    try {
      await updateDoc(doc(db, "links", userDoc.id), {
        displayName,
      });
      console.log("Display Name successfully changed");
      setDisplayName("");
      router.refresh();
      // revalidatePath("/user", "layout");
    } catch (error) {
      console.error("Error", error);
      setIsError("Updating display name failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="px-4 py-3 bg-zinc-100">
      <h2 className="text-center text-xl font-semibold mb-4">Change Name</h2>
      <form
        onSubmit={handleChangeDisplayName}
        className="flex gap-4 items-center"
      >
        <InputGroup
          id="displayName"
          label="Name"
          onChange={setDisplayName}
          value={displayName}
        />
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Changing..." : "Change"}
        </Button>
      </form>
    </div>
  );
}
