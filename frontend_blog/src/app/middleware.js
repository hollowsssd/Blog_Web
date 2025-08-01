import { NextResponse } from 'next/server';
import { getProfile } from './utils/utils';

export const middleware = async (request) => {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  if (pathname.startsWith("/admin") || pathname.startsWith("/list")) {
    // Không có token → chặn
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const isAdmin = await getProfile(token);
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
