"use client";

import { FaStar, FaUsers, FaGlobe } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-32 bg-gray-100 text-black py-16 px-6 md:px-16 lg:px-32 rounded-3xl">
      <section className="grid md:grid-cols-3 gap-10 text-center mb-12">
        <div>
          <FaUsers className="text-3xl mx-auto text-blue-500 mb-3" />
          <h4 className="font-semibold text-lg">Cộng Đồng</h4>
          <p className="text-sm text-gray-600">
            Mỗi người đều có tiếng nói và được tôn trọng.
          </p>
        </div>
        <div>
          <FaStar className="text-3xl mx-auto text-yellow-500 mb-3" />
          <h4 className="font-semibold text-lg">Chất Lượng</h4>
          <p className="text-sm text-gray-600">
            Nội dung chất lượng cao, có giá trị cho người đọc.
          </p>
        </div>
        <div>
          <FaGlobe className="text-3xl mx-auto text-green-500 mb-3" />
          <h4 className="font-semibold text-lg">Kết Nối Toàn Cầu</h4>
          <p className="text-sm text-gray-600">
            Lan tỏa văn hóa và tri thức đến thế giới.
          </p>
        </div>
      </section>
      <div className="text-center font-semibold text-gray-500 text-xs">
        © 2025 4TL Blog. All rights reserved.
      </div>
    </footer>
  );
}
