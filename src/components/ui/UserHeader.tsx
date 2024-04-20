"use client";
import { signOut } from "next-auth/react";
import Button from "./Button";
import { useEffect, useState } from "react";
import { HiCheck, HiClipboardCopy } from "react-icons/hi";
import { HiBolt } from "react-icons/hi2";
import { FaCog } from "react-icons/fa";
import Modal from "./Modal";
import Options from "./Options";

export default function UserHeader() {
  const [isCoppied, setIsCoppied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

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

  function handleShowOptions() {
    setShowOptions(true);
  }
  function handleHideOptions() {
    setShowOptions(false);
  }

  return (
    <>
      <header className="flex gap-4 justify-end px-4 relative">
        <Button model="medium" onClick={handleCopyUrl}>
          {isCoppied ? <HiCheck /> : <HiClipboardCopy />}
        </Button>
        <Button onClick={handleShowOptions}>
          <FaCog />
        </Button>
        <Button model="small" onClick={() => signOut()}>
          Logout
        </Button>
      </header>
      {showOptions && (
        <Modal open={showOptions} onClose={handleHideOptions}>
          <Options />
        </Modal>
      )}
    </>
  );
}
