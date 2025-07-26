"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react"; 
export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    // Kiểm tra xem có user trong localStorage không
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/"; // hoặc dùng router.push nếu đang dùng `next/router`
  };

  return (
      <header className="w-full py-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
          {/* Logo */}
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-600">
              4TL<span className="text-gray-900">BLOG</span>
            </h1>
          </Link>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-gray-900">
            <Link href="/" className={`transition ${isActive("/") ? "text-blue-600 underline" : "hover:text-blue-600"}`}>
              Trang chủ
            </Link>
            <Link href="/article" className={`transition ${isActive("/article") ? "text-blue-600 underline" : "hover:text-blue-600"}`}>
              Bài viết
            </Link>
            <Link href="/about" className={`transition ${isActive("/about") ? "text-blue-600 underline" : "hover:text-blue-600"}`}>
              Giới thiệu
            </Link>
            <Link href="/profile" className={`transition ${isActive("/contact") ? "text-blue-600 underline" : "hover:text-blue-600"}`}>
              Hồ sơ
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-700">
                  👤 {user.name} <br />
                  📧 {user.email}
                </div>
               <button
        onClick={handleLogout}
        className="p-2 rounded-full hover:bg-gray-100 transition relative group"
        title="Đăng xuất"
      >
        <LogOut className="w-6 h-6 text-gray-700 group-hover:text-red-500" />
        {/* Hoặc thêm tooltip custom dưới đây */}
        {/* <span className="absolute left-full ml-2 text-sm bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
          Đăng xuất
        </span> */}
      </button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

        </div>
      </header>
  );
}