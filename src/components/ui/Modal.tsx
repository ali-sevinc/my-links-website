"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

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
  return createPortal(
    <motion.dialog
      initial={{ y: 100, opacity: 0 }}
      exit={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
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
    </motion.dialog>,
    document.body
  );
}
