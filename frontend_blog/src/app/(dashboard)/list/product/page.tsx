"use client";

import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<string[]>(["Lập trình", "Thiết kế", "Khởi nghiệp"]);
  const [newCategory, setNewCategory] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (index: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá chủ đề này?");
    if (confirmDelete) {
      const updated = [...categories];
      updated.splice(index, 1);
      setCategories(updated);
    }
  };



  const handleUpdateCategory = () => {
    if (editingIndex !== null && newCategory.trim()) {
      const updated = [...categories];
      updated[editingIndex] = newCategory.trim();
      setCategories(updated);
      setEditingIndex(null);
      setNewCategory("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">🎯 Quản lý Chủ đề</h1>

        {/* Form thêm hoặc chỉnh sửa */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Nhập tên chủ đề..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          {editingIndex === null ? (
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700"
            >
              <FaPlus /> Thêm
            </button>
          ) : (
            <button
              onClick={handleUpdateCategory}
              className="px-4 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700"
            >
              <FaEdit /> Cập nhật
            </button>
          )}
        </div>

        {/* Danh sách chủ đề */}
        <ul className="space-y-3">
          {categories.map((cat, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-xl shadow-sm"
            >
              <span className="font-medium text-gray-700">{cat}</span>
              <div className="flex gap-3">
              
                <button
                  onClick={() => handleDeleteCategory(index)}
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
