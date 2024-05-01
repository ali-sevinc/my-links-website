"use client";
import { signOut } from "next-auth/react";
import Button from "./Button";
import { useEffect, useState } from "react";
import { HiCheck } from "react-icons/hi";

import { FaCog, FaLink } from "react-icons/fa";
type PropsType = {
  onShowOptions: () => void;
};
export default function UserHeader({ onShowOptions }: PropsType) {
  const [isCoppied, setIsCoppied] = useState(false);

  function handleCopyUrl() {
    setIsCoppied(true);
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCoppied(true);
      })
      .catch((e) => console.error(e));
  }

  useEffect(
    function () {
      if (!isCoppied) return;
      const timer = setTimeout(() => {
        setIsCoppied(false);
      }, 3000);

      return () => clearTimeout(timer);
    },
    [isCoppied]
  );

  return (
    <>
      <header className="flex gap-4 justify-end px-4 relative">
        <Button model="small" onClick={handleCopyUrl}>
          {isCoppied ? (
            <p className="flex items-center gap-1 w-24 justify-center ">
              <HiCheck /> <span>Coppied</span>
            </p>
          ) : (
            <p className="flex items-center gap-1 w-24 justify-center ">
              <FaLink />
              <span>Share URL</span>
            </p>
          )}
        </Button>
        <Button model="small" onClick={onShowOptions}>
          <FaCog />
        </Button>
        <Button model="small" onClick={() => signOut()}>
          Logout
        </Button>
      </header>
    </>
  );
}
