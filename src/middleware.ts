import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/my-tests", "/my-tests/:path*", "/test", "/test/:path*", "/results", "/results/:path*", "/api/:path*"],
};
