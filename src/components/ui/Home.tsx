import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import Container from "./Container";

export default function Home() {
  const router = useRouter();
  return (
    <Container>
      <h1 className="text-3xl font-bold">Welcome to MyLinks</h1>
      <div className="flex gap-4 items-center">
        <Button onClick={() => signIn()}>Sign In</Button>
        <p>or</p>
        <Button onClick={() => router.push("/signup")}>Sign Up</Button>
      </div>
    </Container>
  );
}
