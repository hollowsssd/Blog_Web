"use client";

import Image from "next/image";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import Header from "@/app/components/ui/header";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/app/components/ui/footer";
import LikeWrapper from "@/app/components/ui/LikeWrapper";
import axios from "axios";

const heroImages = [
  "/images/hero1.jpg",
  "/images/hero2.webp",
  "/images/hero3.png",
  "/images/hero4.png",
];

const sortOptions = [
  { label: "Top Picks", value: "top" },
  { label: "Mới nhất", value: "latest" },
];

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [tags, setTags] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("top");
  const [showDropdown, setShowDropdown] = useState(false);

  const handlePrev = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleNext = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentHeroIndex]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/tags");
        console.log("Loaded tags:", res.data); // Add this
        setTags(res.data);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };
    fetchTags();
  }, []);

  const searchParams = useSearchParams();
  const incomingTag = searchParams.get("tag");

  useEffect(() => {
    if (incomingTag && !selectedTags.includes(incomingTag)) {
      setSelectedTags([incomingTag]);
      setShowSearch(true); // optional
      setTagSearch("");    // optional
    }
  }, [incomingTag]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/post?sort=${sortBy}`);
        const formatted = res.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          description: post.description,
          content: post.content,
          tags: (post.tags || []).slice(0, 10).map((tag: any) => tag.name),
          userId: post.user?.id,
          author: post.user?.name || "Anonymous",
          date: post.createdAt?.split("T")[0] || "N/A",
          image: `http://localhost:8080/post/images/${post.imageUrl}`,
          avatar: `http://localhost:8080/post/images/${post.user?.avatarUrl}`,
          featured: post.isPublished,
        }));
        setPosts(formatted);
        } catch (err) {
          console.error("Failed to fetch posts", err);
        }
      };

      fetchPosts();
  }, [sortBy]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => post.tags.includes(tag));

    return matchesSearch && matchesTags;
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
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white text-2xl p-2 bg-black/40 hover:bg-black/70 rounded-full transition"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={handleNext}
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
              className="w-full py-3 px-12 rounded-full shadow-lg border-none focus:ring-black focus:outline-none transition-all bg-white/90 text-gray-900 placeholder-gray-600"
            />
            <FaSearch className="absolute top-3.5 left-5 text-gray-500" />
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-5 text-center">
        <h3 className="text-2xl font-bold mb-3 text-gray-800 tracking-wide">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Chủ đề phổ biến
          </span>
        </h3>

        <div className="flex flex-col items-center gap-6 mt-6">

          {/* Tag Buttons with Fade Animation */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* "All" Button */}
            <button
              onClick={() => setSelectedTags([])}
              className={`px-4 py-1 text-sm rounded-full transition-all duration-300 transform ${
                selectedTags.length === 0
                  ? "bg-indigo-600 text-white shadow-md scale-105"
                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:scale-105"
              }`}
            >
              All
            </button>

            {/* Dynamic Tag Buttons */}
            {tags
              .filter((t: any) =>
                t.name.toLowerCase().includes(tagSearch.toLowerCase())
              )
              .slice(0, tagSearch ? tags.length : 10)
              .map((tag: any, index: number) => {
                const isSelected = selectedTags.includes(tag.name);
                const isDisabled = selectedTags.length >= 3 && !isSelected;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTags((prev) => prev.filter((t) => t !== tag.name));
                      } else if (!isDisabled) {
                        setSelectedTags((prev) => [...prev, tag.name]);
                      }
                      setTimeout(() => setTagSearch(""), 100);
                    }}
                    disabled={isDisabled}
                    className={`px-4 py-1 text-sm rounded-full transition-all duration-300 transform ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md scale-105"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:scale-105"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {tag.name}
                  </button>
                );
              })}
          </motion.div>

          {/* Toggle Button + Animated Search */}
          <div className="flex flex-col items-center relative">
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="text-sm text-indigo-600 mb-2"
            >
              Tìm thêm chủ đề
            </button>

            {/* Reserved space with animation */}
            <div style={{ minHeight: 40 }} className="w-full flex justify-center">
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-xl bg-white rounded-full px-5 py-2 pl-12 flex items-center gap-2 shadow-sm border border-gray-200"
                  >
                    {/* Search Icon */}
                    <FaSearch className="absolute top-2.5 left-5 text-gray-500" />

                    {/* Tag List + Input */}
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      {selectedTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full flex items-center gap-1 text-sm"
                        >
                          {tag}
                          <button
                            onClick={() =>
                              setSelectedTags((prev) => prev.filter((t) => t !== tag))
                            }
                            className="text-indigo-500 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {/* Input */}
                      <input
                        type="text"
                        placeholder="Tìm chủ đề..."
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        className="flex-1 min-w-[120px] border-none focus:outline-none bg-transparent text-sm bg-white/90 text-gray-900 placeholder-gray-600"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts and Sorts */}
      <section className="px-6 md:px-12 lg:px-24 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Các bài viết</h2>

          {/* Dropdown wrapper */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm transition hover:bg-yellow-200"
            >
              {sortOptions.find((o) => o.value === sortBy)?.label}
              <FaChevronDown className="text-[10px] mt-0.5" />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                >
                  {sortOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        onClick={() => {
                          setSortBy(option.value);
                          setShowDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 ${
                          sortBy === option.value ? "font-semibold text-yellow-700" : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
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
                    <div className="flex justify-between items-start mb-2">
                      {/* Left: Tags */}
                      <div className="flex flex-wrap gap-2 max-w-[80%]">
                        {post.tags.map((tag: string, idx: number) => (
                          <Link
                            key={idx}
                            href={`/article?tag=${encodeURIComponent(tag)}`}
                            className="bg-indigo-100 px-2 py-0.5 rounded-full hover:bg-indigo-200 transition text-sm text-indigo-600 font-medium"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>

                      {/* Right: Like Button */}
                      <div className="flex-shrink-0 ml-4">
                        <LikeWrapper postId={post.id} />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Link href={`/profile/${post.userId}`} className="flex items-center gap-2 hover:underline">
                          <Image
                            src={post.avatar}
                            alt={post.author}
                            width={30}
                            height={30}
                            className="rounded-full"
                          />
                          <span className="text-sm text-gray-500">{post.author}</span>
                        </Link>
                        <span className="text-sm text-gray-400">• {post.date}</span>
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
