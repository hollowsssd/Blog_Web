"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#eaf6fb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Left section */}
        <div className="hidden lg:flex flex-col justify-center items-center text-center px-10 py-16 bg-white">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
           Blog nhỏ{" "}
            <span className="text-blue-900"> Ý tưởng lớn.</span>
          </h2>
          <img
            src="https://illustrations.popsy.co/white/customer-support.svg"
            alt="Support illustration"
            className="w-4/5 max-w-md"
            draggable={false}
          />
        </div>

        {/* Right section: Form */}
        <div className="bg-blue-500 p-10 sm:p-14 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10">
            <div className="flex flex-col items-center mb-6">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
                <Link href="/">
                  {" "}
                  <h1 className="text-2xl font-bold text-blue-600">
                    4TL<span className="text-gray-900">BLOG</span>
                  </h1>
                </Link>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-gray-800">
              Đăng nhập tài khoản
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Nhanh chóng, miễn phí và an toàn
              </p>
            </div>

            <form className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Nhớ đăng nhập
                </label>
                <Link href="#" className="text-blue-500 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>

              <div className="flex justify-center mt-6">
                <Link
                  href="/login"
                  className="w-1/2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2.5 rounded-lg text-center transition"
                >
                  Đăng nhập
                </Link>
              </div>
              <p className="text-sm text-center text-gray-500 mt-6">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
