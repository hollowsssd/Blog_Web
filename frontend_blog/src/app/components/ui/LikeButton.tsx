'use client';

import LoginPrompt from "@/app/components/ui/loginPrompt";
import axios from "axios";
import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa";

type Props = {
  postId: number;
  userId?: number | null; // Make optional
};

export default function LikeButton({ postId, userId }: Props) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Lấy số lượng like
    axios
      .get<number>(`http://localhost:8080/likes/count/${postId}`)
      .then((res) => setLikes(res.data))
      .catch(() => setLikes(0));


    if (userId) {
      axios
        .get<boolean>(`http://localhost:8080/likes/check?postId=${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        })
        .then((res) => setLiked(res.data))
        .catch(() => setLiked(false));
    }
  }, [postId, userId]);

  const handleLike = async () => {
    if (userId === null) {
      setShowPrompt(true);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:8080/likes/toggle?postId=${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikes((prev) => (newLiked ? prev + 1 : prev - 1));
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setShowPrompt(true);
      }
      console.error("Error toggling like:", error);
    }

    setLoading(false);
  };

  return (
    <div className="mb-10">
      {userId ? (
        <>
          <button
            onClick={handleLike}
            disabled={loading}
            className="flex items-center gap-2 text-red-500 hover:scale-105 transition"
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span className="text-sm">
              {liked ? "Đã yêu thích" : "Yêu thích"}
            </span>
          </button>
          <span className="text-sm text-gray-600">{likes} lượt yêu thích</span>
          {showPrompt && <LoginPrompt onClose={() => setShowPrompt(false)} />}
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 flex-row-reverse">
            <span>{likes}</span>
            <FaHeart className="text-red-500" />
          </div>

        </>
      )}
    </div>
  );
}
