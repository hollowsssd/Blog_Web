"use client";

import Image from "next/image";
import Footer from "@/app/components/ui/footer"
import Header from "@/app/components/ui/header"; 

export default function AboutPage() {
  return (    <main className="min-h-screen bg-white text-gray-900 px-6 md:px-16 lg:px-32 pb-20">
  <Header/>


      {/* Ảnh minh họa + sứ mệnh */}
      <section className="flex flex-col-reverse lg:flex-row items-center gap-12 mb-24">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Sứ mệnh của chúng tôi</h2>
          <p className="text-gray-600">
            4TL Blog được tạo ra với mục tiêu xây dựng cộng đồng viết mở, nơi mọi người có thể học hỏi, chia sẻ và truyền cảm hứng cho nhau.
            Chúng tôi không chỉ là một blog, mà là một hành trình.
          </p>
        </div>
        <div className="lg:w-1/2">
          <Image
            src="https://vtiacademy.edu.vn/upload/images/nganh-it.jpg"
            alt="Teamwork"
            width={600}
            height={400}
            className="rounded-xl shadow-lg object-cover"
          />
        </div>
      </section>

      {/* Timeline phát triển */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-12">
          Hành Trình Phát Triển
        </h2>
        <div className="space-y-8 border-l-4 border-blue-200 pl-6">
          <div>
            <h4 className="font-semibold text-blue-500">2023</h4>
            <p className="text-sm text-gray-600">
              4TL Blog được thành lập với mong muốn tạo ra một sân chơi viết bài cho các bạn sinh viên và người đi làm.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-500">2024</h4>
            <p className="text-sm text-gray-600">
              Giao diện được nâng cấp, tích hợp tính năng người dùng và bài viết tương tác cao hơn.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-500">2025</h4>
            <p className="text-sm text-gray-600">
              Ra mắt phiên bản cộng đồng mở và mobile app đầu tiên của 4TL Blog.
            </p>
          </div>
        </div>
      </section>

      {/* Cam kết giá trị */}
    <Footer/>
    

    </main>
  );
}
