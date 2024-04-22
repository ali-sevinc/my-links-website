"use client";
import { HiOutlineTrash } from "react-icons/hi";

type PropsType = {
  id: string;
  url: string;
  btnColor: string;
  color: string;
  text: string;
  isAuth: boolean;
  onDelete: () => void;
};
export default function LinkItem({
  id,
  url,
  btnColor,
  color,
  text,
  isAuth,
  onDelete,
}: PropsType) {
  return (
    <li className={` gap-2 rounded-md w-full flex `}>
      <a
        target="_blank"
        href={url}
        style={{
          backgroundColor: btnColor,
          color: color,
        }}
        className="w-full border hover:opacity-95 border-zinc-700 hover:translate-x-2 duration-200  px-4 py-2 text-center text-lg rounded-md font-semibold"
      >
        {text}
      </a>
      {isAuth && (
        <button
          onClick={onDelete}
          className="px-4 bg-red-700 rounded-md text-zinc-50 hover:bg-red-900 duration-200"
        >
          <HiOutlineTrash />
        </button>
      )}
    </li>
  );
}
