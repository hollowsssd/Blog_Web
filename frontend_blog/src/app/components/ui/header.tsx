"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  name: string;
  email: string;
  exp: number;
}

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          setUser({ name: decoded.name, email: decoded.email });
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.error("Token decode error:", error);
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
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
              isActive("/article")
                ? "text-blue-600 underline"
                : "hover:text-blue-600"
            }`}
          >
            Bài viết
          </Link>
          <Link
            href="/about"
            className={`transition ${
              isActive("/about")
                ? "text-blue-600 underline"
                : "hover:text-blue-600"
            }`}
          >
            Giới thiệu
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="User Avatar" src="/images/avatar.png" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <div>
                    <img src="/images/profile.jpg" width={19} height={19} />
                    <a className="justify-between" href={"/profile"}>
                      Hồ sơ
                    </a>
                  </div>
                </li>
                <li>
                  <div>
                    <img src="/images/logout.png" width={19} height={19} />
                    <a onClick={handleLogout}>Logout</a>
                  </div>
                </li>
              </ul>
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
