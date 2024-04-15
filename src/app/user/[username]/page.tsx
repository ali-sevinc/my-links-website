"use client";

import Button from "@/components/ui/Button";
import { app } from "@/firebase";
import { equalTo, serverTimestamp } from "firebase/database";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

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
type LinkType = {
  enteredUrl: string;
  enteredText: string;
  id: string;
};
export default function UserPage({ params }: { params: { username: string } }) {
  const [userData, setUserData] = useState<UserDataType | null>(null);

  const [enteredUrl, setEnteredUrl] = useState("");
  const [enteredText, setEnteredText] = useState("");

  const [storedLinks, setStoredLinks] = useState<LinkType[]>([]);

  const { data } = useSession() as SessionType;
  const isAuth = data && data.user.username === params.username;

  //connect database;
  const db = getFirestore(app);

  useEffect(
    function () {
      async function getUserData() {
        const qu = query(
          collection(db, "links"),
          where("username", "==", params.username)
        );
        const queryData = await getDocs(qu);
        const mappedData = queryData.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        })) as UserDataType[];
        setUserData(mappedData?.[0] || null);

        if (!mappedData.length && data) {
          await addDoc(collection(db, "links"), {
            username: data.user.username,
            profileImage: data.user.image,
            userId: data.user.userId,
            timestamp: serverTimestamp(),
          });
        }
      }
      getUserData();
    },
    [db, params.username, data]
  );

  async function handleAddLink(event: FormEvent) {
    event.preventDefault();
    if (!enteredUrl || !data || !userData || !enteredText) return;
    await addDoc(collection(db, "links", userData.docId, "link"), {
      enteredUrl,
      enteredText,
    });
    setEnteredUrl("");
    setEnteredText("");
  }
  useEffect(
    function () {
      if (!userData) return;

      onSnapshot(
        query(collection(db, "links", userData.docId, "link")),
        (snapshot) => {
          setStoredLinks(
            snapshot.docs.map((link) => ({ id: link.id, ...link.data() })) as []
          );
        }
      );
    },
    [db, userData]
  );

  function handleCopyUrl() {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => alert(`${url} coppied`))
      .catch((e) => console.error(e));
  }

  async function handleDeleteLink(id: string) {
    if (!data || !userData) return;
    console.log(id);
    await deleteDoc(doc(db, "links", userData.docId, "link", id));
  }

  // console.log("stored link", storedLinks);
  console.log("UserData", userData);
  return (
    <div>
      {isAuth && (
        <>
          <form
            onSubmit={handleAddLink}
            className="bg-stone-100 flex flex-col gap-2 max-w-lg mx-auto px-4 py-6"
          >
            <p className="flex gap-4 w-full">
              <label htmlFor="link" className="w-24">
                Link URL
              </label>
              <input
                className="flex-1"
                id="link"
                type="text"
                value={enteredUrl}
                onChange={(e) => setEnteredUrl(e.target.value)}
              />
            </p>
            <p className="flex gap-4 w-full">
              <label htmlFor="text" className="w-24">
                Text
              </label>
              <input
                className="flex-1"
                id="text"
                type="text"
                value={enteredText}
                onChange={(e) => setEnteredText(e.target.value)}
              />
            </p>
            <div className="flex gap-4 items-center justify-center">
              <Button type="submit">Add Link</Button>
              <Button onClick={handleCopyUrl}>Copy Your Page</Button>
              <Button onClick={() => signOut()}>log out</Button>
            </div>
          </form>
        </>
      )}

      {userData && (
        <div className="max-w-md mx-auto flex flex-col items-center py-4 justify-center">
          <img
            src={userData?.profileImage}
            alt={userData.username}
            className="rounded-full p-2 w-32 border-4 h-32"
          />
          <p>{userData.username}&apos;s link tree</p>
        </div>
      )}
      {storedLinks.length > 0 && (
        <ul className="max-w-xl flex flex-col mx-auto gap-4 justify-center items-center">
          {storedLinks.map((link) => (
            <li
              key={link.id}
              className="border border-zinc-700 rounded-md w-full flex"
            >
              <a
                target="_blank"
                href={link.enteredUrl}
                className="w-full px-4 py-2 text-center hover:bg-zinc-200 rounded-md duration-200"
              >
                {link.enteredText}
              </a>
              {data && (
                <button onClick={() => handleDeleteLink(link.id)}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {!storedLinks.length && (
        <p className="text-center font-semibold text-xl">
          There is no link to see
        </p>
      )}
    </div>
  );
}
