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

const categories = ["All", "Fantasy", "NFT", "Abstract", "Anime", "Games", "Technology"];

const posts = [
  {
    title: "An Extraordinary WebGL Has Been Released By Great China Scientists",
    description: "Gucci brought video games to its app with a new section called Gucci Arcade...",
    category: "Technology",
    author: "Mohammad Reza",
    date: "Jun 27, 2021",
    image: "/images/post1.jpg",
    avatar: "/images/author1.jpg",
    featured: true,
  },
  {
    title: "Simon Liozotte Take A Big Advance In The Last Tournament",
    description: "Gucci brought video games to its app with a new section called Gucci Arcade...",
    category: "Games",
    author: "Albert Olsen",
    date: "Jul 21, 2021",
    image: "/images/post2.jpg",
    avatar: "/images/author2.jpg",
  },
  {
    title: "Nvidia Releases New Way Of Producing NFTs",
    description: "Gucci brought video games to its app with a new section called Gucci Arcade...",
    category: "NFT",
    author: "Angelita Johnson",
    date: "Jul 18, 2021",
    image: "/images/post3.jpg",
    avatar: "/images/author3.jpg",
  },
  {
    title: "Score of DDPT Gran Prix 2022 Has Been Already Shared",
    description: "Gucci brought video games to its app with a new section called Gucci Arcade...",
    category: "Fantasy",
    author: "Amanda Bjanson",
    date: "Apr 15, 2021",
    image: "/images/post4.jpg",
    avatar: "/images/author4.jpg",
  },
  {
    title: "New AI Breakthrough Revolutionizes Web Development",
    description: "A groundbreaking AI tool has been unveiled, transforming the way we build websites...",
    category: "Technology",
    author: "John Doe",
    date: "Jul 10, 2025",
    image: "/images/post5.jpg",
    avatar: "/images/author5.jpg",
    featured: true,
  },
];

const heroImages = [
  "/images/hero1.jpg",
  "/images/hero2.webp",
  "/images/hero3.png",
  "/images/hero4.png",
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

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

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex justify-center flex-wrap gap-3 px-6">
        {categories.map((cat) => (
          <button
            key={cat}
            className="bg-white text-sm px-4 py-2 rounded-full border border-gray-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all shadow-sm"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Posts */}
      <section className="px-6 md:px-12 lg:px-24 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Bài viết nổi bật</h2>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
            Top Picks
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {filteredPosts.filter((p) => p.featured).map((post, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all"
            >
              <Image
                src="https://th.bing.com/th/id/OIP.HqKYj8JdYNZk0LdeYV1RrgHaFj?w=247&h=185&c=7&r=0&o=5&dpr=1.9&pid=1.7"
                alt={post.title}
                width={800}
                height={500}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <p className="text-sm font-medium text-indigo-600 mb-2 flex items-center justify-between">
                  {post.category}
                  <button onClick={() => toggleLike(i)} className="text-red-500 ml-2">
                    {likedPosts.includes(i) ? <FaHeart className="text-base" /> : <FaRegHeart className="text-base" />}
                  </button>
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="https://www.drivenow.com.au/blog/wp-content/uploads/2018/07/hot-air.jpg"
                      alt={post.author}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <span className="text-sm text-gray-500">
                      {post.author} • {post.date}
                    </span>
                  </div>
                  <Link
                    href={`/article/${post.title.replace(/\s+/g, '-').toLowerCase()}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Đọc thêm
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}