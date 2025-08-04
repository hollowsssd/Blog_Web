import { getProfile } from '@/app/utils/utils';
import { NextResponse } from 'next/server';

export const middleware = async (request) => {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;
  // console.log(token);

  // Kiểm tra nếu không có token và người dùng không đang ở trang login
  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/list"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Nếu có token, xác thực token
  if (pathname.startsWith("/admin") || pathname.startsWith("/list")) {
    if (token) {
      const admin= await getProfile(token);
      if (!admin) {
        return NextResponse.redirect(new URL("/", request.url));
      }

    }
  }

  // Tiếp tục với request nếu không có vấn đề gì
  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};