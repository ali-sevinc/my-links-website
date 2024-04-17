"use client";

import { ReactNode, useEffect, useRef } from "react";

type PropsType = { open: boolean; onClose: () => void; children: ReactNode };
export default function Modal({ open, onClose, children }: PropsType) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(
    function () {
      if (open) {
        ref.current?.showModal();
      } else {
        ref.current?.close();
      }
    },
    [open]
  );
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="rounded-xl w-full max-w-xl backdrop:bg-zinc-900/70 relative"
    >
      {children}
      <button
        className="absolute top-2 right-4 hover:text-red-700 duration-200"
        onClick={onClose}
      >
        X
      </button>
    </dialog>
  );
}
