  "use client";

  import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

  import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

  export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      admin: false,
      avatar: "defaultAvatar.png", // avatar mặc định
      banned: false, // dùng boolean thay vì chuỗi
      name: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const register = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/register`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Đăng ký thành công!", { position: "top-right" });

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const message =
          error.response?.data?.message ||
          "Đăng ký thất bại. Vui lòng kiểm tra lại!";
        toast.error(message, { position: "top-right" });
      }
    };

    return (
      <>
        <main className="min-h-screen bg-[#eaf6fb] flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Left section */}
            <div className="hidden lg:flex flex-col justify-center items-center text-center px-10 py-16 bg-white">
              <h2 className="text-3xl font-bold text-blue-600 mb-4">
                Tham gia <span className="text-blue-900">cộng đồng blog</span> cùng
                chúng tôi!
              </h2>
              <img
                src="https://illustrations.popsy.co/white/customer-support.svg"
                alt="Register illustration"
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
                      <h1 className="text-2xl font-bold text-blue-600">
                        4TL<span className="text-gray-900">BLOG</span>
                      </h1>
                    </Link>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-gray-800">
                    Tạo tài khoản
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Nhanh chóng, miễn phí và an toàn
                  </p>
                </div>

                <form onSubmit={register} className="space-y-5">
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
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Tên "
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
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
                      required
                      minLength={6} // bắt buộc ít nhất 6 ký tự
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition"
                  >
                    Đăng ký
                  </button>
                </form>

               

                <p className="text-sm text-center text-gray-500 mt-6">
                  Đã có tài khoản?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>

        <ToastContainer />
      </>
    );
  }
