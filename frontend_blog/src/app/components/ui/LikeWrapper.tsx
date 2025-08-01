"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import LikeButton from "@/app/components/ui/LikeButton";

type JwtPayload = {
  id: number;
  name: string;
  email: string;
  exp: number;
};

export default function LikeWrapper({ postId }: { postId: number }) {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setUserId(decoded.id);
        } else {
          localStorage.removeItem("token");
          setUserId(null);
        }
      } catch (e) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        setUserId(null);
      }
    } else {
      setUserId(null); // Explicitly null if no token
    }
  }, []);

  return <LikeButton postId={postId} userId={userId} />;
}
