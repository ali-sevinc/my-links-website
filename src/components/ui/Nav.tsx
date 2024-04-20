import Link from "next/link";

export default function Nav() {
  return (
    <nav className="border-b h-20 fixed flex justify-center items-center bg-gradient-to-b from-transparent to-zinc-800/50 bottom-0 left-0 w-full text-center  px-4">
      <Link
        href="/"
        className="text-lg text-zinc-900 px-4 py-2 hover:underline duration-200"
      >
        Go to Main Page
      </Link>
    </nav>
  );
}
