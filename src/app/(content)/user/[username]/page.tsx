"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { app } from "@/firebase";
import { SessionType } from "@/helpers/types";
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
import { AnimatePresence } from "framer-motion";

import LinkForm from "@/components/LinkForm";
import Button from "@/components/ui/Button";
import LinkItem from "@/components/ui/LinkItem";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Message from "@/components/ui/Message";
import Modal from "@/components/ui/Modal";
import Options from "@/components/ui/Options";
import ProfileCard from "@/components/ui/ProfileCard";
import UserHeader from "@/components/ui/UserHeader";

type UserDataType = {
  profileImage: string;
  userId: string;
  username: string;
  docId: string;
  displayName: string;
  backgroundColor: string;
  textColor: string;
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

  const [selectedLink, setSelectedLink] = useState<null | LinkType>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [storedLinks, setStoredLinks] = useState<LinkType[]>([]);

  const [showOptions, setShowOptions] = useState(false);

  const { data } = useSession() as SessionType;

  const isAuth = data && data.user.username === params.username;

  const router = useRouter();

  const db = getFirestore(app);

  const displayName = userData?.displayName;

  useEffect(
    function () {
      async function getUserData() {
        setIsLoading(true);
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
        setIsLoading(false);
      }
      getUserData();
    },
    [db, params.username, data, displayName]
  );

  useEffect(
    function () {
      if (!userData) return;

      onSnapshot(
        query(
          collection(db, "links", userData.docId, "link"),
          orderBy("timestamp", "desc")
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

  async function handleDeleteLink(id: string) {
    if (!data || !userData) return;

    await deleteDoc(doc(db, "links", userData.docId, "link", id));
  }

  function handleShowChangeForm(link: LinkType) {
    setSelectedLink(link);
  }
  function handleHideChangeForm() {
    setSelectedLink(null);
  }

  function handleShowForm() {
    setShowAddForm(true);
  }
  function handleHideForm() {
    setShowAddForm(false);
  }

  //options modal control.
  function handleShowOptions() {
    setShowOptions(true);
  }
  function handleHideOptions() {
    setShowOptions(false);
  }

  // console.log("stored link", storedLinks);
  // console.log("UserData", userData);
  // console.log(btnColor.split("#")[1]);
  return (
    <>
      <div
        style={{
          backgroundColor: userData?.backgroundColor || "#fff",
          color: userData?.textColor || "#111",
        }}
        className="min-h-screen pt-4 pb-28"
      >
        {isLoading && <LoadingSpinner />}
        {!userData && !isLoading && (
          <Message buttonText="Signup" onClick={() => router.push("/signup")}>
            {params.username} not found.
          </Message>
        )}
        {isAuth && userData && <UserHeader onShowOptions={handleShowOptions} />}
        {userData && !isLoading && (
          <ProfileCard
            username={userData?.displayName || userData.username}
            image={userData.profileImage}
          />
        )}
        {storedLinks.length > 0 && (
          <ul className="max-w-xl flex flex-col mx-auto gap-4 px-1 justify-center items-center">
            {storedLinks.map((link) => (
              <LinkItem
                onDelete={() => handleDeleteLink(link.id)}
                onChange={() => handleShowChangeForm(link)}
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

        {!storedLinks.length && userData && !isLoading && (
          <p className="text-center font-semibold text-xl">
            There is no link to see
          </p>
        )}
        {isAuth && userData && (
          <>
            <AnimatePresence mode="wait">
              {showAddForm && (
                <Modal open={showAddForm} onClose={handleHideForm}>
                  <LinkForm userData={userData} onCloseForm={handleHideForm} />
                </Modal>
              )}
            </AnimatePresence>
            <p className="max-w-xl mx-auto px-2 m-4">
              <Button onClick={handleShowForm}>Add New Link</Button>
            </p>
          </>
        )}
        {isAuth && userData && (
          <AnimatePresence mode="wait">
            {selectedLink !== null && (
              <Modal
                open={selectedLink !== null}
                onClose={handleHideChangeForm}
              >
                <LinkForm
                  userData={userData}
                  onCloseForm={handleHideChangeForm}
                  bgColor={selectedLink?.btnColor}
                  link={selectedLink?.enteredUrl}
                  text={selectedLink?.enteredText}
                  txtColor={selectedLink?.textColor}
                  linkId={selectedLink.id}
                />
              </Modal>
            )}
          </AnimatePresence>
        )}
      </div>
      <AnimatePresence>
        {showOptions && (
          <Modal open={showOptions} onClose={handleHideOptions}>
            <Options
              name={userData?.displayName || data?.user.username}
              bgColor={userData?.backgroundColor}
              txtColor={userData?.textColor}
            />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
