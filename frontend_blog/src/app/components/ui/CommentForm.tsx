'use client';

import LoginPrompt from "@/app/components/ui/loginPrompt";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react';
import CommentItem from './CommentItem';

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
};

type Props = {
  postId: number;
};

interface DecodedToken {
  id: number;
  name: string;
  email: string;
  exp: number;
}

export default function CommentForm({ postId }: Props) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  // Extract token from cookies
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

  useEffect(() => {
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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/comments/post/${postId}`);
        setComments(res.data);
      } catch (error) {
        console.error("Failed to load comments:", error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = commentText.trim();

    if (!userId) {
      setShowPrompt(true);
      return;
    }

    if (trimmed.length === 0) {
      alert("Bình luận không được để trống.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/comments`,
        {
          postId,
          userId,
          content: trimmed,
        },
        {
          headers: {
            Authorization: `Bearer ${getTokenFromCookie() ?? ""}`,
          },
        }
      );

      setComments((prev) => [...prev, res.data]);
      setCommentText('');
      setIsDisabled(true);
      setTimeout(() => setIsDisabled(false), 3000);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Đã có lỗi xảy ra khi gửi bình luận.");
    }
  };

  return (
    <section>
      <p className="text-xl font-semibold mb-4">
        {comments.length === 0
          ? "Chưa có bình luận nào"
          : `${comments.length} bình luận`}
      </p>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          rows={3}
          maxLength={10000} // Chỉ được 10000 ký tự
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring focus:outline-none"
        ></textarea>

        <div className="text-sm text-right text-gray-500 mt-1">
          {commentText.length}/10000 ký tự
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`mt-2 px-4 py-2 rounded-full transition text-white ${
            isDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isDisabled ? "Vui lòng chờ..." : "Gửi bình luận"}
        </button>
      </form>


      <ul className="space-y-4">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
        {comments.length === 0 && (
          <li className="text-gray-500 text-sm italic">
            Chưa có bình luận nào.
          </li>
        )}
      </ul>

      {showPrompt && <LoginPrompt onClose={() => setShowPrompt(false)} />}
    </section>
  );
}
