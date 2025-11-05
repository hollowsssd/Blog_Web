"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";

import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

import { Button } from "@/app/components/ui/button";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Select from "react-select";

type JwtPayload = {
  id: number;
 exp: number;
};


export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [tagOptions, setTagOptions] = useState<{ value: number; label: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<{ value: number; label: string }[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  const getTokenFromCookie = (): string | null => {
      const name = "token=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookies = decodedCookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.startsWith(name)) {
          return c.substring(name.length);
        }
      }
      return null;
    };

  useEffect(() => {
      const token = getTokenFromCookie();

      if (token) {
        try {
          const decoded: JwtPayload = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp > currentTime) {
            setUserId(decoded.id);
          } else {
            document.cookie = "token=; Max-Age=0; path=/;";
            setUserId(null);
          }
        } catch (e) {
          console.error("Invalid token");
          document.cookie = "token=; Max-Age=0; path=/;";
          setUserId(null);
        }
      } else {
        setUserId(null);
      }
    }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    content: "",
    cover: "",
    tags: "",
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
      content: content.trim() ? "" : "⚠️ Nội dung không được để trống.",
      cover: cover ? "" : "⚠️ Vui lòng chọn ảnh bìa.",
      tags: selectedTags.length > 0 ? "" : "⚠️ Vui lòng chọn ít nhất một thẻ.",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  //Tìm các chủ đề
  interface Tag {
    id: number;
    name: string;
  }

  // Fetch tags from backend on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get<Tag[]>(`${process.env.NEXT_PUBLIC_API_HOST}/api/tags`);
        const options = res.data.map((tag) => ({
          value: tag.id,
          label: tag.name,
        }));
        setTagOptions(options);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);


  //Đăng bài viết
  const handleSubmit = async () => {
    if (!validate()) return;
    if (!userId) {
      alert("❌ Bạn cần đăng nhập để đăng bài.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("userId", userId.toString());
    formData.append("isPublished", "true");
    formData.append("tags", selectedTags.map((tag) => tag.value).join(","));
    if (cover) formData.append("file", cover);

    try {
      const token = getTokenFromCookie();

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/post/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdPost = response.data;

      alert("✅ Bài viết đã được gửi thành công!");
      router.push(`/detail/${createdPost.id}`);

    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Xóa token nếu có
        document.cookie = "token=; Max-Age=0; path=/;";
        alert("❌ Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
        router.push("/"); // Quay về trang chủ
      } else {
        console.error("❌ Lỗi khi gửi bài viết:", error);
        alert("❌ Đã xảy ra lỗi khi gửi bài viết.");
      }
    }
  };

//   if (userId === null && isMounted) {
//     return <div>Page not found</div>;
//   }

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
          className={`mb-4 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition duration-300 ${errors.cover
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

          {/* Select Tags */}
          <div>
            <p className="mb-2 font-medium text-gray-700">🏷️ Chọn chủ đề:</p>
            {isMounted && (
              <div suppressHydrationWarning>
                <Select
                  key="tag-select"
                  isMulti
                  options={tagOptions}
                  value={selectedTags}
                  onChange={(selected) => {
                    const selectedArray = selected as { value: number; label: string }[];
                    if (selectedArray.length <= 10) {
                      setSelectedTags(selectedArray);
                      setErrors((prev) => ({ ...prev, tags: "" }));
                    } else {
                      // Optional: show error or ignore the extra tag
                      alert("Bạn chỉ được chọn tối đa 10 chủ đề.");

                    }
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="🔍 Tìm và chọn chủ đề..."
                />
              </div>
            )}
            {errors.tags && <p className="text-sm text-red-600 mt-1">{errors.tags}</p>}
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