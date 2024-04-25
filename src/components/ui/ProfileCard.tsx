type PropsType = { username: string; image: string };
export default function ProfileCard({ username, image }: PropsType) {
  return (
    <div className="max-w-md mx-auto flex flex-col items-center gap-2 py-4 justify-center">
      <img
        src={image}
        alt={username}
        className="rounded-full p-2 w-32 border-4 h-32"
      />
      <p className="text-lg font-semibold">{username}&apos;s link tree</p>
    </div>
  );
}
