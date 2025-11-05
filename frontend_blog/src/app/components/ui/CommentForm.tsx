'use client';

import useAuth from "@/app/components/Hooks/useAuth";
import LoginPrompt from "@/app/components/ui/loginPrompt";
<<<<<<< HEAD
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
=======
import axios from 'axios';
import { useEffect, useState } from 'react';
import CommentItem from './CommentItem';
>>>>>>> 1504cef63635960bf5b4d4814eb832e48e04c30e

type Comment = {
  id: number;
  content: string;
  createdAt: string;
<<<<<<< HEAD
  user: { id: number; name: string };
=======
  user: {
    id: number;
    name: string;
    avatarUrl: string;
  };
>>>>>>> 1504cef63635960bf5b4d4814eb832e48e04c30e
};

type Props = { postId: number };

<<<<<<< HEAD
interface DecodedToken {
  id: number; name: string; email: string; exp: number;
}

=======
>>>>>>> 1504cef63635960bf5b4d4814eb832e48e04c30e
export default function CommentForm({ postId }: Props) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
<<<<<<< HEAD
  const [userId, setUserId] = useState<number | null>(null);

  const [errorText, setErrorText] = useState<string>("");
  const [successText, setSuccessText] = useState<string>("");
  const [showPrompt, setShowPrompt] = useState(false);

  const MAX = 60;

  // Lấy token từ cookie
  const getTokenFromCookie = () => {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const c = cookies[i].trim();
      if (c.startsWith(name)) return c.substring(name.length);
    }
    return null;
  };

  // Lấy userId từ token nếu hợp lệ
  useEffect(() => {
    const token = getTokenFromCookie();
    if (!token) return;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp > now) setUserId(decoded.id);
      else document.cookie = "token=; Max-Age=0; path=/;";
    } catch {
      document.cookie = "token=; Max-Age=0; path=/;";
    }
  }, []);
=======
  const [showPrompt, setShowPrompt] = useState(false);

  // Sử dụng custom hook thay vì duplicate logic
  const { userId, token } = useAuth();
>>>>>>> 1504cef63635960bf5b4d4814eb832e48e04c30e

  // Tải danh sách bình luận của bài viết
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOST}/comments/post/${postId}`
        );
        setComments(res.data);
      } catch (error) {
        console.error("Failed to load comments:", error);
      }
    })();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    const trimmed = commentText.trim();
    const token = getTokenFromCookie();

    // Chưa đăng nhập
    if (!token) {
      setErrorText("Bạn chưa đăng nhập.");
      setShowPrompt(true);
      return;
    }

    // Token hết hạn / không hợp lệ
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp <= now) {
        setErrorText("Bạn chưa đăng nhập.");
        document.cookie = "token=; Max-Age=0; path=/;";
        setShowPrompt(true);
        return;
      }
    } catch {
      setErrorText("Bạn chưa đăng nhập.");
      document.cookie = "token=; Max-Age=0; path=/;";
      setShowPrompt(true);
      return;
    }

    // Rỗng
    if (trimmed.length === 0) {
      setErrorText("Nội dung bình luận không được để trống.");
      return;
    }

    // Quá giới hạn
    if (trimmed.length > MAX) {
      setErrorText(`Nội dung bình luận vượt quá ${MAX} ký tự.`);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/comments`,
<<<<<<< HEAD
        { postId, userId, content: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
=======
        {
          postId,
          userId,
          content: trimmed,
        },
        {
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        }
>>>>>>> 1504cef63635960bf5b4d4814eb832e48e04c30e
      );

      setComments((prev) => [...prev, res.data]);
      setCommentText("");
      setSuccessText("Bình luận đã được gửi thành công.");
      setIsDisabled(true);

      // Tự ẩn thông báo, mở lại nút sau 3s
      setTimeout(() => {
        setIsDisabled(false);
        setSuccessText("");
      }, 3000);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorText("Bạn chưa đăng nhập.");
        setShowPrompt(true);
      } else {
        setErrorText("Đã có lỗi xảy ra khi gửi bình luận.");
      }
    }
  };

  return (
    <section>
      <p className="text-xl font-semibold mb-4">
        {comments.length === 0 ? "Chưa có bình luận nào" : `${comments.length} bình luận`}
      </p>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={commentText}
          onChange={(e) => {
            const val = e.target.value;
            setCommentText(val);
            // Hiển thị lỗi ngay khi vượt quá MAX
            if (val.trim().length > MAX) {
              setErrorText(`Nội dung bình luận vượt quá ${MAX} ký tự.`);
              setSuccessText("");
            } else {
              setErrorText("");
            }
          }}
          placeholder="Viết bình luận của bạn..."
          rows={3}
<<<<<<< HEAD
          className={`w-full p-3 border rounded-lg resize-none focus:ring focus:outline-none
            ${errorText ? "border-red-500" : "border-gray-300"}`}
        />
=======
          maxLength={10000}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring focus:outline-none"
        ></textarea>
>>>>>>> 1504cef63635960bf5b4d4814eb832e48e04c30e

        {/* Lỗi */}
        {errorText && <p className="text-red-500 text-sm mt-1">{errorText}</p>}

        {/* Thành công */}
        {successText && <p className="text-green-600 text-sm mt-1">{successText}</p>}

        {/* Bộ đếm ký tự */}
        <div
          className={`text-sm text-right mt-1 ${
            commentText.length > MAX ? "text-red-500" : "text-gray-500"
          }`}
        >
          {commentText.length}/{MAX} ký tự
        </div>

        <button
          type="submit"
          disabled={isDisabled}
<<<<<<< HEAD
          className={`mt-2 px-4 py-2 rounded-full transition text-white ${
            isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
=======
          className={`mt-2 px-4 py-2 rounded-full transition text-white ${isDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
>>>>>>> 1504cef63635960bf5b4d4814eb832e48e04c30e
        >
          {isDisabled ? "Vui lòng chờ..." : "Gửi bình luận"}
        </button>
      </form>

<<<<<<< HEAD
      {/* Gợi ý đăng nhập */}
      {showPrompt && <LoginPrompt onClose={() => setShowPrompt(false)} />}

=======
>>>>>>> 1504cef63635960bf5b4d4814eb832e48e04c30e
      <ul className="space-y-4">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
        {comments.length === 0 && (
          <li className="text-gray-500 text-sm italic">Chưa có bình luận nào.</li>
        )}
      </ul>
    </section>
  );
}
