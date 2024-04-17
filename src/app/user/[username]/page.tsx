"use client";

import LinkForm from "@/components/LinkForm";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { app } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";

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
  btnColor: string;
  textColor: string;
};
export default function UserPage({ params }: { params: { username: string } }) {
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
      }
      getUserData();
    },
    [db, params.username, data]
  );

  useEffect(
    function () {
      if (!userData) return;

      onSnapshot(
        query(
          collection(db, "links", userData.docId, "link"),
          orderBy("timestamp", "asc")
        ),
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

    await deleteDoc(doc(db, "links", userData.docId, "link", id));
  }

  function handleShowForm() {
    setShowAddForm(true);
  }
  function handleHideForm() {
    setShowAddForm(false);
  }

  // console.log("stored link", storedLinks);
  // console.log("UserData", userData);
  // console.log(btnColor.split("#")[1]);
  return (
    <div>
      {isAuth && (
        <div className="flex gap-4 justify-end px-4">
          <Button model="small" onClick={handleCopyUrl}>
            Copy Your Page
          </Button>
          <Button model="small" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      )}
      {userData && (
        <div className="max-w-md mx-auto flex flex-col items-center py-4 justify-center">
          <img
            src={userData.profileImage}
            alt={userData.username}
            className="rounded-full p-2 w-32 border-4 h-32"
          />
          <p>{userData.username}&apos;s link tree</p>
        </div>
      )}
      {storedLinks.length > 0 && (
        <ul className="max-w-xl flex flex-col mx-auto gap-4 justify-center items-center">
          {storedLinks.map((link) => (
            <li key={link.id} className={` gap-2 rounded-md w-full flex `}>
              <a
                target="_blank"
                href={link.enteredUrl}
                style={{
                  backgroundColor: link.btnColor,
                  color: link.textColor,
                }}
                className={`w-full border border-zinc-700 hover:translate-x-2 duration-200  px-4 py-2 text-center text-lg rounded-md font-semibold `}
              >
                {link.enteredText}
              </a>
              {data && (
                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="px-4 bg-red-700 rounded-md text-zinc-50 hover:bg-red-900 duration-200"
                >
                  <HiOutlineTrash />
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
      {isAuth && userData && (
        <>
          <Modal open={showAddForm} onClose={handleHideForm}>
            <LinkForm userData={userData} onCloseForm={handleHideForm} />
          </Modal>
          <p className="text-center mt-4">
            <Button onClick={handleShowForm}>Add New Link</Button>
          </p>
        </>
      )}
    </div>
  );
}
