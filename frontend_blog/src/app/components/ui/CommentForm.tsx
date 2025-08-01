'use client';

import { useState, useEffect } from 'react';
import LoginPrompt from "@/app/components/ui/loginPrompt";
import { jwtDecode } from "jwt-decode";

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
  userId?: number | null;
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          setUserId(decoded.id);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`http://localhost:8080/comments/post/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setShowPrompt(true);
      return;
    }

    const res = await fetch('http://localhost:8080/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        postId,
        userId,
        content: commentText,
      }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
      setIsDisabled(true);
      setTimeout(() => setIsDisabled(false), 3000); // 5 seconds
    } else {
      alert("Đã có lỗi xảy ra khi gửi bình luận.");
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Bình luận</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring focus:outline-none"
        ></textarea>
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
          <li
            key={c.id}
            className="border border-gray-200 bg-gray-50 p-4 rounded-lg shadow-sm"
          >
            <div className="text-sm text-gray-700">{c.content}</div>
            <div className="text-xs text-gray-500 mt-1">
              {c.user.name} • {new Date(c.createdAt).toLocaleString()}
            </div>
          </li>
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
