import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b h-20 mb-4 flex items-center justify-between px-4">
      <h1 className="text-2xl">Welcome to MyLink</h1>
      <Link
        href="/"
        className="text-lg text-zinc-50 border px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 duration-200"
      >
        Home
      </Link>
    </header>
  );
}
