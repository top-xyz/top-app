import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Create a matcher for public routes
const publicRoutes = ["/", "/blog", "/pricing"];

const middleware = authMiddleware({
  publicRoutes,
  afterAuth(auth, req) {
    // If it's a public route, allow access
    if (publicRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.next();
    }

    // If the user is not signed in and the route is private, redirect to sign-in
    if (!auth.userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }
});

export default middleware;

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
