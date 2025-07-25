"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaHeart, FaCommentDots, FaEdit, FaTrash } from "react-icons/fa";

const UserProfile = () => {
  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    joinedDate: "Tháng 3, 2023",
    avatar: "/images/avatar.png",
    bio: "💬 Yêu thích viết blog, chia sẻ kiến thức và kết nối cộng đồng.",
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Lập trình là gì?",
      content: "Lập trình là quá trình viết mã để máy tính hiểu và thực thi.",
      likes: 32,
      comments: 4,
      image: "/post1.jpg",
    },
    {
      id: 2,
      title: "Học Tailwind CSS như thế nào?",
      content: "Tailwind giúp bạn xây dựng giao diện nhanh chóng và đẹp mắt.",
      likes: 18,
      comments: 2,
      image: "/post2.jpg",
    },
  ]);

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc muốn xoá bài viết này?")) {
      setPosts((prev) => prev.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Logo */}
        <div className="mb-10 text-center">
          <Link href="/">
            <span className="text-3xl font-extrabold text-blue-600 tracking-wide">
              4TL<span className="text-gray-900">BLOG</span>
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center text-center mb-12">
          <Image
            src={user.avatar}
            alt="Avatar"
            width={110}
            height={110}
            className="rounded-full border-4 border-white shadow-md hover:scale-105 transition-transform duration-300"
          />
          <h1 className="mt-4 text-3xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">📅 Tham gia: {user.joinedDate}</p>
          <p className="mt-3 text-gray-700 max-w-xl italic">{user.bio}</p>
        </div>

        {/* Posts */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
            📝 Bài viết của bạn
          </h2>

          {posts.length === 0 ? (
            <p className="text-gray-600">Bạn chưa có bài viết nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 overflow-hidden"
                >
                  <Image
                    src={post.image}
                    alt="Post"
                    width={500}
                    height={250}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <FaHeart className="text-red-500" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCommentDots /> {post.comments}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-4 text-sm">
                      <Link href={`/profile/edit?id=${post.id}`}>
                        <button className="flex items-center gap-1 text-blue-600 hover:underline">
                          <FaEdit /> Sửa
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="flex items-center gap-1 text-red-600 hover:underline"
                      >
                        <FaTrash /> Xoá
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
