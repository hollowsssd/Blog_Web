"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaCommentDots, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

// Định nghĩa kiểu dữ liệu
type Post = {
  id: number;
  title: string;
  content: string;
  likes: number;
  comments: number;
  image: string;
};

interface PostCardProps {
  post: Post;
  isEditable?: boolean;
  onDelete?: (id: number) => void;
}

// Thẻ hiển thị từng bài viết
const PostCard: React.FC<PostCardProps> = ({ post, isEditable = false, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden"
  >
    <Image
      src={post.image}
      alt={post.title}
      width={500}
      height={250}
      className="w-full h-48 object-cover"
    />
    <div className="p-4 space-y-2">
      <h3 className="font-semibold text-gray-800 line-clamp-1">{post.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
      <div className="flex items-center justify-between text-gray-500 text-sm pt-1">
        <span className="flex items-center gap-1">
          <FaHeart className="text-red-500" /> {post.likes}
        </span>
        <span className="flex items-center gap-1">
          <FaCommentDots /> {post.comments}
        </span>
      </div>
      {isEditable && onDelete && (
        <div className="flex gap-4 pt-2 text-sm">
          <Link href={`/profile/edit?id=${post.id}`}>
            <button className="text-blue-600 hover:underline flex items-center gap-1">
              <FaEdit /> Sửa
            </button>
          </Link>
          <button
            onClick={() => onDelete(post.id)}
            className="text-red-600 hover:underline flex items-center gap-1"
          >
            <FaTrash /> Xoá
          </button>
        </div>
      )}
    </div>
  </motion.div>
);

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<"yourPosts" | "likedPosts">("yourPosts");

  const posts: Post[] = [
    {
      id: 1,
      title: "Học Next.js căn bản",
      content: "Bài viết hướng dẫn cách bắt đầu với Next.js",
      likes: 12,
      comments: 3,
      image: "/post1.jpg",
    },
    {
      id: 2,
      title: "Tailwind CSS dễ không?",
      content: "Giải thích cách dùng utility CSS nhanh và hiệu quả",
      likes: 8,
      comments: 1,
      image: "/post2.jpg",
    },
  ];

  const likedPosts: Post[] = [
    {
      id: 3,
      title: "React vs Vue?",
      content: "So sánh giữa hai framework phổ biến",
      likes: 34,
      comments: 10,
      image: "/post3.jpg",
    },
  ];

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn muốn xoá bài viết?")) {
      console.log("Xoá:", id);
    }
  };

  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "/images/avatar.png",
    joinedDate: "Tháng 3, 2023",
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
  <header className=" p-4 flex items-center justify-center relative">
   <Link href="/">
            <h1 className="text-2xl font-bold text-blue-600">
              4TL<span className="text-gray-900">BLOG</span>
            </h1>
          </Link>
</header>

      {/* Nội dung chính */}
      <div className="max-w-5xl mx-auto px-4 mt-10 space-y-10">
        {/* Thông tin user */}
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <Image
            src={user.avatar}
            alt="avatar"
            width={100}
            height={100}
            className="mx-auto rounded-full border shadow"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        
          <p className="text-xs text-gray-400 mt-1">📅 {user.joinedDate}</p>
        </div>

        {/* Tab chọn bài viết */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-white shadow rounded-full space-x-1">
            <button
              onClick={() => setActiveTab("yourPosts")}
              className={`px-5 py-2 rounded-full transition font-medium text-sm ${
                activeTab === "yourPosts"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              📝 Bài viết của bạn
            </button>
            <button
              onClick={() => setActiveTab("likedPosts")}
              className={`px-5 py-2 rounded-full transition font-medium text-sm ${
                activeTab === "likedPosts"
                  ? "bg-red-500 text-white"
                  : "text-red-500 hover:bg-red-100"
              }`}
            >
              ❤️ Đã thích
            </button>
          </div>
        </div>

        {/* Danh sách bài viết */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(activeTab === "yourPosts" ? posts : likedPosts).length === 0 ? (
              <p className="col-span-full text-center text-gray-500">Không có bài viết nào.</p>
            ) : (
              (activeTab === "yourPosts" ? posts : likedPosts).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isEditable={activeTab === "yourPosts"}
                  onDelete={handleDelete}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
