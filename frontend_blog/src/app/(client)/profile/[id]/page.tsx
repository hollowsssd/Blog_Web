"use client";

import LikeButton from "@/app/components/ui/LikeButton";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCommentDots, FaEdit, FaTrash } from "react-icons/fa";

type Post = {
  id: number;
  title: string;
  description: string;
  content: string;
  tag: string;
  name: string;
  createdAt: string;
  imageUrl: string;
  featured: boolean;
};

interface DecodedToken {
  id: number;
  name: string;
  sub: string;
  createdAt: string;
  exp: number;
}

interface PostCardProps {
  post: Post;
  isEditable?: boolean;
  onDelete?: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, isEditable = false, onDelete }) => {
  return (
    <Link href={`/detail/${post.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer h-[400px] flex flex-col"
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_API_HOST}/post/images/${post.imageUrl}`}
          alt={post.title}
          width={500}
          height={250}
          className="w-full h-48 object-cover"
        />

        <div className="p-3 flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-semibold text-gray-800 line-clamp-1">{post.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
          </div>

          <div>
            <span className="flex gap-3 justify-end text-gray-500 text-sm pt-1">
              <LikeButton postId={post.id} userId={null} />
              <FaCommentDots className="w-4 h-4" />
            </span>
            <div className="flex items-center gap-3">
              <Image
                src="/images/avatar.png"
                alt=""
                width={30}
                height={30}
                className="rounded-full"
              />
              <span className="text-sm text-gray-500">
                {post.name} {post.createdAt}
              </span>
            </div>
            {isEditable && onDelete && (
              <div className="flex gap-4 pt-2 text-sm">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/profile/edit/${post.id}`;
                  }}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <FaEdit /> Sửa
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(post.id);
                  }}
                  className="text-red-600 hover:underline flex items-center gap-1"
                >
                  <FaTrash /> Xoá
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default function UserProfile() {
  const { id: profileId } = useParams();
  const [user, setUser] = useState<{ id: number; name: string; email: string; createdAt: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLike, setPostsLike] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"yourPosts" | "likedPosts">("yourPosts");
  const [token, setToken] = useState<string | null>();
  const [who, setWho] = useState<boolean>(true);

  // lấy user từ token hoặc gọi API user
  useEffect(() => {
    const tokenInCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    setToken(tokenInCookie);

    const fetchUser = async () => {
      if (!tokenInCookie) {
        setError("Không tìm thấy token");
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(tokenInCookie);
        if (decoded.id === Number(profileId)) {
          setUser({
            id: decoded.id,
            name: decoded.name,
            email: decoded.sub,
            createdAt: new Date(decoded.createdAt).toLocaleDateString("vi-VN"),
          });
        } else {
          setWho(false);
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_HOST}/api/user/findUser/${profileId}`
          );
          setUser({
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            createdAt: new Date(res.data.createdAt).toLocaleDateString("vi-VN"),
          });
        }
      } catch (err) {
        setError("Không tìm thấy người dùng này");
        setUser(null);
      }
    };

    fetchUser();
  }, [profileId]);

  // lấy bài viết của user
  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/post/user/${user.id}`);
        setPosts(res.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user]);

  // lấy bài viết đã like
  useEffect(() => {
    if (!user || !token) return;

    const fetchPostsLike = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8080/likes/findPostLiked/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPostsLike(res.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsLike();
  }, [user, token]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn muốn xoá bài viết?")) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_HOST}/post/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="p-4 flex items-center justify-center relative">
        <Link href="/">
          <h1 className="text-2xl font-bold text-blue-600">
            4TL<span className="text-gray-900">BLOG</span>
          </h1>
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-10 space-y-10">
        {/* Info user */}
        {error && !user ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          user && (
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <Image
                src="/images/avatar.png"
                alt="avatar"
                width={100}
                height={100}
                className="mx-auto rounded-full border shadow"
              />
              <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">📅 {user.createdAt}</p>
            </div>
          )
        )}

        {/* Tab */}
        {user && (
          <>
            <div className="flex justify-center">
              <div className="inline-flex p-1 bg-white shadow rounded-full space-x-1">
                <button
                  onClick={() => setActiveTab("yourPosts")}
                  className={`px-5 py-2 rounded-full transition font-medium text-sm ${activeTab === "yourPosts"
                    ? "bg-blue-600 text-white"
                    : "text-blue-600 hover:bg-blue-100"
                    }`}
                >
                  📝 Bài viết của bạn
                </button>
                <button
                  onClick={() => setActiveTab("likedPosts")}
                  className={`px-5 py-2 rounded-full transition font-medium text-sm ${activeTab === "likedPosts"
                    ? "bg-red-500 text-white"
                    : "text-red-500 hover:bg-red-100"
                    }`}
                >
                  ❤️ Đã thích
                </button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {loading ? (
                  <p className="col-span-full text-center text-gray-500">Đang tải...</p>
                ) : error ? (
                  <p className="col-span-full text-center text-red-500">{error}</p>
                ) : (activeTab === "yourPosts" ? posts : postsLike).length === 0 ? (
                  <p className="col-span-full text-center text-gray-500">
                    {activeTab === "yourPosts"
                      ? "Không có bài viết nào."
                      : "Bạn chưa thích bài viết nào."}
                  </p>
                ) : (
                  (activeTab === "yourPosts" ? posts : postsLike).map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isEditable={who && activeTab === "yourPosts"}
                      onDelete={who && activeTab === "yourPosts" ? handleDelete : undefined}
                    />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
