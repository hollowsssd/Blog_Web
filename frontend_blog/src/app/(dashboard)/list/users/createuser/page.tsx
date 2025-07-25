'use client';

import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AddUserPage() {
  const router = useRouter(); // ✅ cần khởi tạo router
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "User",
  });

  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setMessage("Email không hợp lệ.");
      setShowSuccess(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      setShowSuccess(false);
      return;
    }

    // ✅ Xử lý thành công
    setMessage("Người dùng đã được thêm thành công!");
    setShowSuccess(true);
    console.log("Dữ liệu gửi đi:", formData);

    // ✅ Sau 1.2s chuyển hướng
    setTimeout(() => {
      router.push("/list/users");
    }, 800);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#eaf4f9] to-[#f5f8fc] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6 animate-fade-in"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Thêm Người Dùng</h2>

        {message && (
          <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-300
            ${showSuccess ? "bg-green-50 text-green-700 border border-green-200" : "text-red-500 bg-red-50 border border-red-200"}`}>
            {showSuccess && <FaCheckCircle className="text-green-500 animate-pulse" />}
            {message}
          </div>
        )}

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

        {/* Name */}
        <div className="relative">
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full px-4 pt-6 pb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="name"
            className="absolute left-4 top-2 text-gray-500 text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all"
          >
            Họ và tên
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

        {/* Role */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Vai trò</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
        >
          Thêm người dùng
        </button>
      </form>
    </main>
  );
}
