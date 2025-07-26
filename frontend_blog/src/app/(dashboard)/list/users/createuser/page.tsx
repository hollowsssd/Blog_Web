'use client';

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  email: string;
  password: string;
  admin: boolean;
  avatar: string;
  banned: string;
}

export default function AddUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    admin: false,
    avatar: "null",
    banned: "false",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Email không hợp lệ", { position: "top-right" });
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự", { position: "top-right" });
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/user/add", formData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Thêm người dùng thành công!", { position: "top-right" });

      setTimeout(() => {
        router.push("/users");
      }, 1500);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage = error.response?.data?.message;

      if (errorMessage?.includes("Email already exists")) {
        toast.error("Email đã tồn tại!", { position: "top-right" });
      } 
        
      else {
        toast.error(errorMessage || "Lỗi không xác định!", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-[#eaf4f9] to-[#f5f8fc] flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6 animate-fade-in"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">Thêm Người Dùng</h2>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-4 pt-6 pb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-gray-500 text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-4 pt-6 pb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-gray-500 text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all"
            >
              Mật khẩu
            </label>
          </div>

          {/* Admin Checkbox */}
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="admin"
              checked={formData.admin}
              onChange={handleChange}
            />
            Là Admin
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            Thêm người dùng
          </button>
        </form>
      </main>

      <ToastContainer />
    </>
  );
}
