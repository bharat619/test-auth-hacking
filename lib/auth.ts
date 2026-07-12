import { auth } from "@/auth";

export interface Session {
  username: string;
}

export async function getSession(): Promise<Session | null> {
  const session = await auth();
  const username = session?.user?.username;
  if (!username) return null;
  return { username };
}

export { signIn, signOut } from "@/auth";
