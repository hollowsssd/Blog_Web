"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";

const Select = dynamic(() => import("react-select"), { ssr: false });

type Post = {
  id: number;
  user: { id: number };
  title: string;
  description: string;
  content: string;
  tags: { id: number; name: string }[];
  imageUrl: string;
};

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [tagOptions, setTagOptions] = useState<{ value: number; label: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<{ value: number; label: string }[]>([]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    content: "",
    tags: "",
  });

  // Lấy tags
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/api/tags`)
      .then(res => {
        setTagOptions(res.data.map((tag: any) => ({
          value: tag.id,
          label: tag.name
        })));
      })
      .catch(console.error);
  }, []);

  // Lấy dữ liệu bài viết để edit
  useEffect(() => {
    if (!id) return;
    axios.get<Post>(`${process.env.NEXT_PUBLIC_API_HOST}/post/${id}`)
      .then(res => {
        const post = res.data;
        setPost(post);
        setTitle(post.title);
        setDescription(post.description);
        setContent(post.content);
        setPreview(`${process.env.NEXT_PUBLIC_API_HOST}/post/images/${post.imageUrl}`);
        setSelectedTags(post.tags.map(tag => ({ value: tag.id, label: tag.name })));
      })
      .catch(console.error);
  }, [id]);

  const validate = () => {
    const newErrors = {
      title: title.trim() ? "" : "⚠️ Tiêu đề không được để trống.",
      description: description.trim() ? "" : "⚠️ Mô tả không được để trống.",
      content: content.trim() ? "" : "⚠️ Nội dung không được để trống.",
      tags: selectedTags.length > 0 ? "" : "⚠️ Vui lòng chọn ít nhất một thẻ.",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleSubmit = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
      
    if (!validate() || !post) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("userId", String(post.user.id));
    formData.append("description", description);
    formData.append("content", content);
    formData.append("isPublished", "true");
    formData.append("tags", selectedTags.map((tag) => tag.value).join(","));
    if (cover) {
      formData.append("file", cover);
    }

    console.log("Data:", Array.from(formData.entries()));
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_HOST}/post/update/${id}`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data" ,
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Bài viết đã được cập nhật!");
      router.push(`/detail/${id}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      alert("Đã xảy ra lỗi khi cập nhật bài viết.");
    }
  };

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <Link href="/">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
            📝 Chỉnh Sửa Bài Viết
          </h1>
        </Link>

        {/* Ảnh bìa */}
        <div
          className="mb-4 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition duration-300 border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
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

        {/* Form */}
        <div className="grid gap-6">
          <Input
            placeholder="✏️ Tiêu đề bài viết"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg px-6 py-4 rounded-2xl shadow-sm w-full"
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}

          <Textarea
            placeholder="📌 Mô tả ngắn về bài viết..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-6 py-4 rounded-2xl shadow-sm w-full"
          />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}

          <div>
            <p className="mb-2 font-medium text-gray-700">🏷️ Chọn chủ đề:</p>
            <Select
              isMulti
              options={tagOptions}
              value={selectedTags}
              onChange={(selected) => setSelectedTags(selected as any)}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="🔍 Tìm và chọn chủ đề..."
            />
            {errors.tags && <p className="text-sm text-red-600 mt-1">{errors.tags}</p>}
          </div>

          <Textarea
            placeholder="🧾 Nội dung bài viết của bạn..."
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="px-6 py-4 rounded-2xl shadow-sm w-full"
          />
          {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content}</p>}

          <Button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white text-lg font-bold rounded-2xl shadow-md transition"
          >
            💾 Lưu thay đổi
          </Button>
        </div>
      </div>
    </main>
  );
}
