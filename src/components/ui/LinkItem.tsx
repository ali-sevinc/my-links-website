"use client";
import { HiOutlineTrash, HiOutlineDotsHorizontal } from "react-icons/hi";
import { motion } from "framer-motion";

type PropsType = {
  id: string;
  url: string;
  btnColor: string;
  color: string;
  text: string;
  isAuth: boolean;
  onDelete: () => void;
  onChange: () => void;
};
export default function LinkItem({
  id,
  url,
  btnColor,
  color,
  text,
  isAuth,
  onDelete,
  onChange,
}: PropsType) {
  return (
    <li className={` gap-2 rounded-md w-full flex `}>
      <motion.a
        whileHover={{ x: 3, y: -3 }}
        target="_blank"
        href={url}
        style={{
          backgroundColor: btnColor,
          color: color,
        }}
        className="w-full border hover:opacity-95 border-zinc-700 px-4 py-2 text-center text-lg rounded-md font-semibold"
      >
        {text}
      </motion.a>
      {isAuth && (
        <>
          <motion.button
            whileHover={{ backgroundColor: "#7f1d1d" }}
            onClick={onDelete}
            className="px-4 bg-red-700 rounded-md text-zinc-50"
          >
            <HiOutlineTrash />
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "#172554" }}
            className="px-4 bg-blue-800 rounded-md text-zinc-50"
            onClick={onChange}
          >
            <HiOutlineDotsHorizontal />
          </motion.button>
        </>
      )}
    </li>
  );
}
