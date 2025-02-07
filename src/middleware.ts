import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/auth/signin", "/auth/signup"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname);

  if (!session && !isPublicRoute) {
    // Redirect to signin if accessing protected route without session
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (session && isPublicRoute) {
    // Redirect to dashboard if accessing public route with session
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
