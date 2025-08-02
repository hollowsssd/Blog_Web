"use client";

import Image from "next/image";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import Header from "@/app/components/ui/header";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Footer from "@/app/components/ui/footer";
import LikeWrapper from "@/app/components/ui/LikeWrapper";
import axios from "axios";

const heroImages = [
  "/images/hero1.jpg",
  "/images/hero2.webp",
  "/images/hero3.png",
  "/images/hero4.png",
];

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [tags, setTags] = useState([]);


  const toggleLike = (index: number) => {
    setLikedPosts((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTopTags = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/tags/top");
        setTags(res.data); // no need to call .json()
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };

    fetchTopTags();
  }, []);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/post");
        const formatted = res.data.map((post: any, index: number) => ({
          id: post.id,
          title: post.title,
          description: post.description,
          content: post.content,
          category: post.tags?.[0]?.name || "Uncategorized",
          author: post.user?.name || "Anonymous",
          date: post.createdAt?.split("T")[0] || "N/A",
          image: `http://localhost:8080/post/images/${post.imageUrl}`,
          avatar: "/images/default-avatar.jpg",
          featured: post.isPublished,
        }));
        setPosts(formatted);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };

    fetchPosts();
  }, []);


    const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 md:px-16 lg:px-32 pb-20">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl mb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroImages[currentHeroIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentHeroIndex]}
              alt={`Hero ${currentHeroIndex}`}
              fill
              className="object-cover object-center"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() =>
            setCurrentHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white text-2xl p-2 bg-black/40 hover:bg-black/70 rounded-full transition"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() =>
            setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white text-2xl p-2 bg-black/40 hover:bg-black/70 rounded-full transition"
        >
          <FaChevronRight />
        </button>

        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 flex flex-col items-center justify-center px-4 text-center z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl font-bold text-white"
          >
            Khám phá bài viết mỗi ngày
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-full max-w-lg mt-6"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full py-3 px-12 rounded-full shadow-lg border-none focus:ring-2 focus:ring-black focus:outline-none transition-all bg-white/90 text-gray-900 placeholder-gray-600"
            />
            <FaSearch className="absolute top-3.5 left-5 text-gray-500" />
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-5 text-center">
        <h3 className="text-2xl font-semibold mb-3 text-gray-700">Chủ đề phổ biến</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {["All", ...tags.map((t: any) => t.name)].map((tagName, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(tagName)}
              className={`px-4 py-1 text-sm rounded-full transition ${
                activeCategory === tagName
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              {tagName}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Posts */}
      <section className="px-6 md:px-12 lg:px-24 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Bài viết nổi bật</h2>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
            Top Picks
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <p className="text-gray-500 text-center">Không tìm thấy bài viết nào.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPosts
              .filter((p) => p.featured)
              .map((post, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={500}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <div className="text-sm font-medium text-indigo-600 mb-2 flex items-center justify-between">
                      <span>{post.category}</span>
                      <LikeWrapper postId={post.id} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={post.avatar}
                          alt={post.author}
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                        <span className="text-sm text-gray-500">
                          {post.author} • {post.date}
                        </span>
                      </div>
                      <Link href={`/detail/${post.id}`}>
                        <button className="text-blue-500 hover:underline">Đọc thêm</button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
