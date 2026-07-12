import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname === "/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/notes", req.url));
    }
    return NextResponse.next();
  }

  const isProtected =
    pathname === "/" ||
    pathname.startsWith("/notes") ||
    pathname.startsWith("/api/notes") ||
    pathname === "/api/auth/me";

  if (isProtected && !isLoggedIn) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/notes", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/login", "/notes/:path*", "/api/:path*"],
};
