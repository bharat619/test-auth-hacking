import { signOut } from "@/auth";
import { getAuth0LogoutUrl } from "@/lib/auth0-config";

export async function GET(request: Request) {
  const returnTo = new URL("/login", request.url).toString();
  const auth0LogoutUrl = getAuth0LogoutUrl(returnTo);

  if (auth0LogoutUrl) {
    return signOut({ redirectTo: auth0LogoutUrl });
  }

  return signOut({ redirectTo: "/login" });
}
