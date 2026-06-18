import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { verifySessionToken } from "@/lib/jwt";

const publicPaths = ["/login", "/api/auth/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.some((path) => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const isProtectedPage = pathname.startsWith("/notes");
  const isProtectedApi =
    pathname.startsWith("/api/notes") ||
    pathname.startsWith("/api/auth/me") ||
    pathname.startsWith("/api/auth/logout");

  if (!isProtectedPage && !isProtectedApi && pathname !== "/") {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/notes/:path*", "/api/:path*"],
};
