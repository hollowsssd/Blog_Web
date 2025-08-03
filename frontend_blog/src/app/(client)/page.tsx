"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/app/components/ui/button";
import Footer from "@/app/components/ui/footer";
import Header from "@/app/components/ui/header";
import { motion } from "framer-motion";
import LoginPrompt from "@/app/components/ui/loginPrompt";

type DecodedToken = {
  id: number;
  name: string;
  email: string;
  exp: number;
};

export default function Home() {
  const [userId, setUserId] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const getTokenFromCookie = () => {
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

    const token = getTokenFromCookie();
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setUserId(decoded.id);
        } else {
          document.cookie = "token=; Max-Age=0; path=/;";
        }
      } catch (err) {
        console.error("Invalid token");
        document.cookie = "token=; Max-Age=0; path=/;";
      }
    }
  }, []);

  const getTagFromTitle = (title: string) => {
    if (title === "Học Tập & Phát Triển") return "Học tập";
    if (title === "Công Nghệ Mới") return "Công nghệ";
    if (title === "Cảm Hứng Cuộc Sống") return "Cuộc sống";
    return "";
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 md:px-16 lg:px-32 pb-20">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl mb-24">
        <Image
          src="https://blogassets.leverageedu.com/blog/wp-content/uploads/2019/11/23173342/BSC-Computer-Science-vs-BCA-768x480.png"
          alt="Hero background"
          fill
          className="object-cover object-center brightness-75"
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 md:p-16 text-center max-w-3xl text-white"
        >
          <h1 className="text-4xl md:text-4xl font-semibold mb-4 leading-tight">
            Chia Sẻ <span className="text-purple-300">Câu Chuyện</span> Của Bạn
          </h1>
          <p className="text-sm md:text-base font-semibold text-gray-200 mb-6">
            Viết ra những điều đáng nhớ, lan tỏa giá trị đến cộng đồng.
          </p>

          {userId ? (
            <Link href="/createpost">
              <Button className="font-semibold bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full cursor-pointer">
                Bắt đầu viết
              </Button>
            </Link>
          ) : (
            <Button
              className="font-semibold bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full cursor-pointer"
              onClick={() => setShowPrompt(true)}
            >
              Bắt đầu viết
            </Button>
          )}
        </motion.div>
        {showPrompt && <LoginPrompt onClose={() => setShowPrompt(false)} />}
      </section>

      {/* Chủ đề nổi bật */}
      <section className="my-24">
        <h3 className="text-center text-3xl font-semibold text-blue-600 mb-12">
          Khám Phá Các Chủ Đề Nổi Bật
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Học Tập & Phát Triển",
              desc: "Nâng cao kiến thức và kỹ năng cá nhân.",
              img: "https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849822_1280.jpg",
            },
            {
              title: "Công Nghệ Mới",
              desc: "Khám phá xu hướng công nghệ hiện đại.",
              img: "https://cdn.pixabay.com/photo/2016/03/26/13/09/workspace-1280538_1280.jpg",
            },
            {
              title: "Cảm Hứng Cuộc Sống",
              desc: "Chia sẻ câu chuyện truyền cảm hứng mỗi ngày.",
              img: "https://www.datarails.com/wp-content/uploads/2023/08/shutterstock_2278853861-1536x841.jpg",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden shadow-lg bg-white flex flex-col justify-between"
            >
              <Image
                src={item.img}
                alt={item.title}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col justify-between h-full">
                <div>
                  <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                <div className="text-right mt-4">
                  <Link
                    href={`/article?tag=${encodeURIComponent(getTagFromTitle(item.title))}`}
                    className="text-xs font-semibold text-blue-600 hover:underline"
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
