import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import {
  applyAuth0EnvAliases,
  getAuth0ConfigStatus,
  isAllowedAuth0LogoutUrl,
} from "@/lib/auth0-config";

applyAuth0EnvAliases();

function resolveUsername(profile: Record<string, unknown>): string {
  if (typeof profile.nickname === "string" && profile.nickname) {
    return profile.nickname;
  }
  if (typeof profile.preferred_username === "string" && profile.preferred_username) {
    return profile.preferred_username;
  }
  if (typeof profile.email === "string" && profile.email) {
    return profile.email.split("@")[0] ?? profile.email;
  }
  if (typeof profile.sub === "string" && profile.sub) {
    return profile.sub;
  }
  return "user";
}

const auth0Config = getAuth0ConfigStatus();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: auth0Config.ok
    ? [
        Auth0({
          clientId: process.env.AUTH0_CLIENT_ID,
          clientSecret: process.env.AUTH0_CLIENT_SECRET,
          issuer: auth0Config.issuer,
        }),
      ]
    : [],
  callbacks: {
    redirect({ url, baseUrl }) {
      if (isAllowedAuth0LogoutUrl(url)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    jwt({ token, profile }) {
      if (profile) {
        token.username = resolveUsername(profile as Record<string, unknown>);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
});

export function getAuthSetupError(): string | null {
  return auth0Config.ok ? null : auth0Config.message;
}
