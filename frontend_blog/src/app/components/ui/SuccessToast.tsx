// components/SuccessToast.tsx
"use client";

import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

export default function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="fixed top-6 right-6 z-50 bg-white border border-green-300 shadow-xl rounded-xl px-6 py-4 flex items-center gap-3 text-green-700"
    >
      <FaCheckCircle className="text-2xl text-green-600" />
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-sm text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>
    </motion.div>
  );
}
