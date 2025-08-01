"use client";

import React from "react";
import Link from "next/link";

interface LoginPromptProps {
  onClose: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center animate-popupIn">
        <h2 className="text-2xl font-semibold mb-4">Bạn cần đăng nhập</h2>
        <p className="text-gray-600 mb-6">
          Hãy tham gia cộng đồng của chúng tôi
        </p>

        {/* Added bottom margin to logo */}
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          4TL<span className="text-gray-900">BLOG</span>
        </h1>

        {/* Increased padding and added top margin */}
        <div className="flex justify-center gap-2 mb-2">
          <Link
            href="/login"
            className="px-5 py-3 bg-blue-600 text-1xl text-white rounded hover:bg-blue-700"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="px-5 py-3 border border-blue-600 text-1xl text-blue-600 rounded hover:bg-blue-100"
          >
            Đăng ký
          </Link>
        </div>

        <button
          className="text-sm text-gray-500 hover:underline mb-0"
          onClick={onClose}
        >
          Đóng
        </button>

        <p className="mt-6 text-xs text-gray-600">
          Bằng việc tiếp tục với tài khoản có vị trí tại Việt Nam, bạn đồng ý với Điều khoản dịch vụ, đồng thời xác nhận rằng bạn đã đọc Chính sách quyền riêng tư của chúng tôi.
        </p>
      </div>
    </div>

  );
};

export default LoginPrompt;
