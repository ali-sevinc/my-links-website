"use client";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

import {
  collection,
  getFirestore,
  where,
  query,
  doc,
  updateDoc,
  getDocs,
  Firestore,
} from "firebase/firestore";
import { app } from "@/firebase";

import { SessionType } from "@/helpers/types";
import InputGroup from "./InputGroup";
import Button from "./Button";
import { useRouter } from "next/navigation";
import Heading from "./Heading";

function checkHex(color: string) {
  const hexRegex = /^#[0-9A-F]{3}$|^#[0-9A-F]{6}$/i;
  return hexRegex.test(color);
}

type PropsType = {
  name: string | undefined;
  bgColor: string | undefined;
  txtColor: string | undefined;
};
export default function Options({ name, bgColor, txtColor }: PropsType) {
  const { data } = useSession() as SessionType;
  const db = getFirestore(app);

  const [displayName, setDisplayName] = useState(name || "");
  const [nameError, setNameError] = useState("");

  const [background, setBackground] = useState(bgColor || "#ffffff");
  const [text, setText] = useState(txtColor || "#111111");

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const router = useRouter();

  async function handleChangeDisplayName(event: FormEvent) {
    event.preventDefault();
    setIsError(null);
    setIsLoading(false);
    if (!displayName.trim().length) {
      setNameError("Invalid name. This line cannot be empty.");
    }
    if (!data || !displayName.trim().length) return;

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
    } catch (error) {
      console.error("Error", error);
      setIsError("Updating display name failed.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleChangeTextAndBackgroundColor(event: FormEvent) {
    event.preventDefault();
    setIsError(null);
    setIsLoading(false);
    if (!data || !checkHex(background) || !checkHex(text)) return;

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
        backgroundColor: background,
        textColor: text,
      });
    } catch (error) {
      console.error("Error", error);
      setIsError("Updating display name failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="px-4 py-3 bg-zinc-100">
      <div className="text-center mb-4">
        <Heading as="h2">Change Name</Heading>
      </div>
      <form
        onSubmit={handleChangeDisplayName}
        className="flex gap-2 sm:gap-5 items-start sm:items-center flex-col sm:flex-row"
      >
        <InputGroup
          id="displayName"
          label="Name"
          name="displayName"
          onChange={(val: string) => {
            setDisplayName(val);
            setNameError("");
          }}
          value={displayName}
          error={nameError}
        />
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
      <form
        onSubmit={handleChangeTextAndBackgroundColor}
        className="flex justify-between gap-2 items-start sm:gap-5 sm:flex-row sm:items-center py-4 flex-col"
      >
        <div className="flex gap-5">
          <div className="flex items-center gap-2">
            <label>Background</label>
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label>Text</label>
            <input
              type="color"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>
        <div
          style={{ backgroundColor: background, color: text }}
          className="w-32 h-14 border-2 flex items-center justify-center flex-col"
        >
          <p className="text-lg font-semibold">TEST</p>
        </div>
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
      <Button onClick={() => location.reload()}>Apply Changes</Button>
    </div>
  );
}
