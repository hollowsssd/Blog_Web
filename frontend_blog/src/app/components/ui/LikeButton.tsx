'use client';

import LoginPrompt from "@/app/components/ui/loginPrompt";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa";

type Props = {
  postId: number;
  userId?: number | null;
};

export default function LikeButton({ postId, userId }: Props) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  const getTokenFromCookie = () => {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");
    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(name)) return c.substring(name.length);
    }
    return null;
  };

  useEffect(() => {
    // Lấy số lượt thích
    axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/likes/count/${postId}`)
      .then(res => setLikes(res.data))
      .catch(err => console.error("Failed to fetch like count", err));

    // Check user đã like chưa
    if (userId && userId !== -1) {
      const token = getTokenFromCookie();
      axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/likes/check`, {
        params: { postId },
        headers: { Authorization: `Bearer ${token ?? ""}` },
      })
        .then(res => setLiked(res.data === true))
        .catch(() => setLiked(false));
    } else {
      setLiked(false);
    }
  }, [postId, userId]);

  const handleLike = async () => {
    // userId = null => popup login
    if (!userId) {
      setShowPrompt(true);
      return;
    }

    // userId = -1 thì không cho bấm
    if (userId === -1) return;

    setLoading(true);
    try {
      const token = getTokenFromCookie();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/likes/toggle`,
        {},
        {
          params: { postId },
          headers: { Authorization: `Bearer ${token ?? ""}` },
        }
      );

      setLiked(prev => !prev);
      setLikes(prev => (liked ? prev - 1 : prev + 1));
    } catch (error: any) {
      if (error.response?.status === 401) {
        setShowPrompt(true);
      } else {
        console.error("Error toggling like:", error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="mb-4 flex items-center gap-3">
      {userId === -1 ? (
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <FaHeart className="text-red-500" />
          <span>{likes}</span>
        </div>
      ) : (
        <button
          onClick={handleLike}
          disabled={loading}
          className="flex items-center gap-2 text-red-500 hover:scale-105 transition"
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          <span className="text-sm">
            {liked ? "Đã yêu thích" : "Yêu thích"}
          </span>
          <span className="text-sm">{likes}</span>
        </button>
      )}
      {showPrompt && <LoginPrompt onClose={() => setShowPrompt(false)} />}
    </div>
  );
}
