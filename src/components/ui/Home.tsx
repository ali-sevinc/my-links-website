import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import Button from "./Button";
import Container from "./Container";
import Image from "next/image";
import Heading from "./Heading";

export default function Home() {
  const router = useRouter();
  return (
    <Container>
      <Image
        src="/landing.jpg"
        alt="landing-image"
        className="w-44 p-1 border-4 border-blue-500 rounded-full"
        width={176}
        height={176}
      />
      <Heading>Welcome to MyLinks</Heading>
      <p className="text-center">
        Ready to simplify your link sharing experience? Sign up for MyLinks
        today and join the thousands of users who are already enjoying a
        clutter-free browsing experience.
      </p>
      <Heading as="h2">Get Started Now</Heading>
      <div className="flex gap-4 items-center">
        <Button onClick={() => signIn()}>Sign In</Button>
        <p>or</p>
        <Button onClick={() => router.push("/signup")}>Sign Up</Button>
      </div>
      <p className="text-sm">
        <b>With Google.</b>
      </p>
    </Container>
  );
}
