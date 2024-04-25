"use client";
import { signOut } from "next-auth/react";
import Button from "./Button";
import { useEffect, useState } from "react";
import { HiCheck, HiClipboardCopy } from "react-icons/hi";

import { FaCog } from "react-icons/fa";

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
        <Button model="medium" onClick={handleCopyUrl}>
          {isCoppied ? <HiCheck /> : <HiClipboardCopy />}
        </Button>
        <Button onClick={onShowOptions}>
          <FaCog />
        </Button>
        <Button model="small" onClick={() => signOut()}>
          Logout
        </Button>
      </header>
    </>
  );
}
