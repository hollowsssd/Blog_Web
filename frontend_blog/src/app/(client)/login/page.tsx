"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DecodedToken {
  email: string;
  role: string;
  banned: boolean;
  exp: number;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  //  Kiểm tra nếu đã đăng nhập + token còn hạn
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const now = Date.now();

        if (decoded.exp * 1000 < now) {
          localStorage.removeItem("token");
          return;
        }

        if (decoded.banned) {
          localStorage.removeItem("token");
          return;
        }

        if (decoded.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const token = res.data.Token;
      const user = res.data.user;
      if (!user) {
        throw new Error("Tài khoản chưa được đăng kí");
      }

      const decoded = jwtDecode<DecodedToken>(token);

      if (user.banned) {
        toast.error("Tài khoản của bạn đã bị khóa.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // ✅ Lưu token
      localStorage.setItem("token", token);

      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 1000,
      });

      setTimeout(() => {
        decoded.role === "ADMIN" ? router.push("/admin") : router.push("/");
      }, 1000);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";

      setErrorMsg(message);

      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });

      if (status === 403) {
        localStorage.removeItem("token");
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#eaf6fb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Left section */}
        <div className="hidden lg:flex flex-col justify-center items-center text-center px-10 py-16 bg-white">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            Blog nhỏ <span className="text-blue-900">Ý tưởng lớn.</span>
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
              <Link href="/">
                <h1 className="text-2xl font-bold text-blue-600">
                  4TL<span className="text-gray-900">BLOG</span>
                </h1>
              </Link>
              <h3 className="mt-4 text-2xl font-semibold text-gray-800">
                Đăng nhập tài khoản
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Nhanh chóng, miễn phí và an toàn
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>

              {errorMsg && (
                <div className="text-red-500 text-sm font-medium">{errorMsg}</div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Nhớ đăng nhập
                </label>
                <Link href="#" className="text-blue-500 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium py-2.5 rounded-lg transition"
              >
                Đăng nhập
              </button>

              <p className="text-sm text-center text-gray-500 mt-6">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </main>
  );
}
