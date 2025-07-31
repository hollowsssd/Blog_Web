"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";

interface Category {
  id: number;
  name: string;
}

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [token, setToken] = useState<string | null>(null);

  // Lấy token sau khi component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Gọi API lấy danh sách chủ đề khi có token
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_HOST}/api/tags`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Kiểm tra dữ liệu trả về có hợp lệ không
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error("API trả về không phải mảng");
        }
      })
      .catch((err) => console.error("Lỗi khi tải chủ đề:", err));
  }, [token]);

  // Xử lý thêm chủ đề
  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.some((cat) => cat.name === trimmed)) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/tags/add`,
          { name: trimmed },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data && res.data.id && res.data.name) {
            setCategories([...categories, res.data]);
            setNewCategory("");
          } else {
            console.error("Phản hồi từ server không hợp lệ:", res.data);
          }
        })
        .catch((err) => console.error("Lỗi khi thêm chủ đề:", err));
    }
  };

  // Xử lý xoá chủ đề
  const handleDeleteCategory = (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá chủ đề này?");
    if (confirmDelete) {
      axios
        .delete(`${process.env.NEXT_PUBLIC_API_HOST}/api/tags/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setCategories(categories.filter((cat) => cat.id !== id));
        })
        .catch((err) => console.error("Lỗi khi xoá chủ đề:", err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          🎯 Quản lý Chủ đề
        </h1>

        {/* Form thêm chủ đề */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Nhập tên chủ đề..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700"
          >
            <FaPlus /> Thêm
          </button>
        </div>

        {/* Danh sách chủ đề */}
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li
              key={cat.id ?? `${cat.name}-${Math.random()}`} // fallback nếu id không có
              className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-xl shadow-sm"
            >
              <span className="font-medium text-gray-700">{cat.name}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-red-500 hover:underline text-sm flex items-center gap-1"
                >
                  <FaTrash /> Xoá
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
