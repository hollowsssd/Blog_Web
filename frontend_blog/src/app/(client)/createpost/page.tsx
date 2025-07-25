"use client";

import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import Image from "next/image";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    content: "",
    cover: "",
  });

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setCover(file);
      setPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, cover: "" }));
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setCover(file);
        setPreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, cover: "" }));
      }
    };
    input.click();
  };

  const validate = () => {
    const newErrors = {
      title: title.trim() ? "" : "⚠️ Tiêu đề không được để trống.",
      description: description.trim() ? "" : "⚠️ Mô tả không được để trống.",
      category: category ? "" : "⚠️ Vui lòng chọn chủ đề.",
      content: content.trim() ? "" : "⚠️ Nội dung không được để trống.",
      cover: cover ? "" : "⚠️ Vui lòng chọn ảnh bìa.",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleSubmit = () => {
    if (!validate()) return;
    alert("✅ Bài viết đã được gửi!");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <Link href="/">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
            📝 Viết Bài Mới
          </h1>
        </Link>

        {/* Ảnh bìa */}
        <div
          className={`mb-4 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition duration-300 ${
            errors.cover
              ? "border-red-400 bg-red-50"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
          }`}
          onDrop={handleImageDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handleUploadClick}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Ảnh bìa"
              width={600}
              height={300}
              className="w-full h-64 object-cover rounded-xl shadow-md hover:opacity-90 transition"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <FaUpload className="text-4xl" />
              <p className="text-lg font-medium">Kéo & thả hoặc bấm để tải ảnh bìa</p>
            </div>
          )}
        </div>
        {errors.cover && <p className="text-sm text-red-600 mb-4">{errors.cover}</p>}

        {/* Form */}
        <div className="grid gap-6">
          <div>
            <Input
              placeholder="✏️ Tiêu đề bài viết"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, title: "" }));
                }
              }}
              className="text-lg px-6 py-4 rounded-2xl shadow-sm w-full"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div>
            <Textarea
              placeholder="📌 Mô tả ngắn về bài viết..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              className="px-6 py-4 rounded-2xl shadow-sm w-full"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Select chủ đề */}
          <div>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value) {
                  setErrors((prev) => ({ ...prev, category: "" }));
                }
              }}
              className="px-6 py-4 text-gray-700 rounded-2xl shadow-sm w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">📂 -- Chọn chủ đề --</option>
              <option value="Công Nghệ">💻 Công Nghệ</option>
              <option value="Du Lịch">🌍 Du Lịch</option>
              <option value="Giáo Dục">📚 Giáo Dục</option>
              <option value="Sức Khỏe">❤️ Sức Khỏe</option>
              <option value="Kinh Tế">💼 Kinh Tế</option>
            </select>
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="🧾 Nội dung bài viết của bạn..."
              rows={12}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, content: "" }));
                }
              }}
              className="px-6 py-4 rounded-2xl shadow-sm w-full"
            />
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content}</p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white text-lg font-bold rounded-2xl shadow-md transition"
          >
            🚀 Đăng bài
          </Button>
        </div>
      </div>
    </main>
  );
}
