'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa";

type Props = {
  postId: number;
  userId: number;
};

export default function LikeButton({ postId, userId }: Props) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8080/likes/count/${postId}`)
      .then(res => res.json())
      .then(data => setLikes(data));

    fetch(`http://localhost:8080/likes/check?userId=${userId}&postId=${postId}`)
      .then(res => res.json())
      .then(data => setLiked(data));
  }, [postId, userId]);

  const handleLike = async () => {
    setLoading(true);

    const res = await fetch(
      `http://localhost:8080/likes/toggle?userId=${userId}&postId=${postId}`,
      { method: 'POST' }
    );

    if (res.ok) {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikes((prev) => newLiked ? prev + 1 : prev - 1); // 👈 based on newLiked
    }

    setLoading(false);
  };

  return (
    <div className="mb-10">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-2 text-red-500 hover:scale-105 transition`}
      >
        {liked ? <FaHeart /> : <FaRegHeart />}
        <span className="text-sm">
          {liked ? "Đã yêu thích" : "Yêu thích"}
        </span>
      </button>
      <span className="text-sm text-gray-600">{likes} lượt yêu thích</span>
    </div>
  );
}
