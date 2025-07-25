"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Hàm kiểm tra xem link có phải đang active không
  const isActive = (path: string) => pathname === path;

  return (
    <header className="w-full py-4 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
        {/* Logo */}
        <Link href="/">
        <h1 className="text-2xl font-bold text-blue-600">
          4TL<span className="text-gray-900">BLOG</span>
        </h1>
</Link>
        {/* Nav Menu */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-gray-900">
          <Link
            href="/"
            className={`transition ${
              isActive("/") ? "text-blue-600 underline" : "hover:text-blue-600"
            }`}
          >
            Trang chủ
          </Link>
          <Link
            href="/article"
            className={`transition ${
              isActive("/article") ? "text-blue-600 underline" : "hover:text-blue-600"
            }`}
          >
            Bài viết
          </Link>
          <Link
            href="/about"
            className={`transition ${
              isActive("/about") ? "text-blue-600 underline" : "hover:text-blue-600"
            }`}
          >
            Giới thiệu
          </Link>
          <Link
            href="/profile"
            className={`transition ${
              isActive("/contact") ? "text-blue-600 underline" : "hover:text-blue-600"
            }`}
          >
            Hồ sơ
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/register">
            <div className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition cursor-pointer">
              Đăng ký
            </div>
          </Link>
          <Link href="/login">
            <div className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-100 transition cursor-pointer">
              Đăng nhập
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
