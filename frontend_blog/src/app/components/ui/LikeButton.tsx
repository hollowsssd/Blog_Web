'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import LoginPrompt from "@/app/components/ui/loginPrompt";

type Props = {
  postId: number;
  userId?: number; // Make optional
};

export default function LikeButton({ postId, userId }: Props) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/likes/count/${postId}`)
      .then(res => res.json())
      .then(data => setLikes(data));

    if (userId) {
      fetch(`http://localhost:8080/likes/check?postId=${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then(data => setLiked(data))
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

      const res = await fetch(
        `http://localhost:8080/likes/toggle?postId=${postId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikes((prev) => (newLiked ? prev + 1 : prev - 1));
      } else if (res.status === 401) {
        setShowPrompt(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }

    setLoading(false);
  };

  return (
    <div className="mb-10">
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
    </div>
  );
}
