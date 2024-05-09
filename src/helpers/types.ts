export type SessionType = {
  data: {
    user: {
      userId: string;
      email: string;
      image: string;
      name: string;
      username: string;
    };
  } | null;
  status: "authenticated" | "loading" | "unauthenticated";
};
