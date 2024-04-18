"use client";

import LinkForm from "@/components/LinkForm";
import Button from "@/components/ui/Button";
import LinkItem from "@/components/ui/LinkItem";
import Modal from "@/components/ui/Modal";
import ProfileCard from "@/components/ui/ProfileCard";
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
        <ProfileCard
          username={userData.username}
          image={userData.profileImage}
        />
      )}
      {storedLinks.length > 0 && (
        <ul className="max-w-xl flex flex-col mx-auto gap-4 px-1 justify-center items-center">
          {storedLinks.map((link) => (
            <LinkItem
              onDelete={() => handleDeleteLink(link.id)}
              isAuth={data !== null}
              text={link.enteredText}
              btnColor={link.btnColor}
              color={link.textColor}
              url={link.enteredUrl}
              key={link.id}
              id={link.id}
            />
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
          {showAddForm && (
            <Modal open={showAddForm} onClose={handleHideForm}>
              <LinkForm userData={userData} onCloseForm={handleHideForm} />
            </Modal>
          )}
          <p className="text-center mt-4">
            <Button onClick={handleShowForm}>Add New Link</Button>
          </p>
        </>
      )}
    </div>
  );
}
