"use client";

import Footer from "@/app/components/ui/footer";
import Header from "@/app/components/ui/header";
import Image from "next/image";

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
            <h4 className="font-semibold text-blue-500">Nguyễn Công Minh</h4>
            <p className="text-sm text-gray-600">
             Thiết kế giao diện và xây dựng chức năng
            </p>
          </div>
           <div>
            <h4 className="font-semibold text-blue-500">Phạm Đông Duy</h4>
            <p className="text-sm text-gray-600">
             Thiết kế giao diện và xây dựng chức năng
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-500">Trần Nhật Hoàng</h4>
            <p className="text-sm text-gray-600">
            Xây dựng chức năng và cơ sở dữ liệu
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-500">Phạm Nguyễn Đình Văn</h4>
            <p className="text-sm text-gray-600">
                     Xây dựng chức năng và cơ sở dữ liệu

            </p>
          </div>
         
        </div>
      </section>

      {/* Cam kết giá trị */}
    <Footer/>
    

    </main>
  );
}
