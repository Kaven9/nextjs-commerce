import "lib/auth/types";
import { middlewareAuth } from "lib/auth/middleware-auth";
import { NextResponse } from "next/server";

export default middlewareAuth((req) => {
  const { pathname } = req.nextUrl;

  // 保护 /account 开头的路由
  if (pathname.startsWith("/account")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*"],
};
